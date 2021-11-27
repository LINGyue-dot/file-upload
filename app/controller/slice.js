/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-27 21:06:28
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-27 22:19:49
 * @Description:
 */

const Multiparty = require("multiparty");
const path = require("path");
const fse = require("fs-extra");
const { CHUNK_DIR, UPLOAD_DIR } = require("../utils/config");
const { pipeStream, extractExt } = require("../utils");
const { parserFormdata } = require("../utils/parser");

// 合并切片
const mergeFileChunk = async (filePath, fileHash, size) => {
	// 当前切片的目录路径
	const chunkDir = path.resolve(CHUNK_DIR, fileHash);
	// 切片的文件流列表
	const chunkPaths = await fse.readdir(chunkDir);
	// 根据切片下标进行排序
	// 否则直接读取目录的获得的顺序可能会错乱
	chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]);
	await Promise.all(
		chunkPaths.map((chunkName, index) =>
			pipeStream(
				path.resolve(chunkDir, chunkName),
				// 在指定位置创建可写流
				fse.createWriteStream(filePath, {
					start: index * size,
					end: (index + 1) * size,
				})
			)
		)
	);
	fse.rmdirSync(chunkDir); // 合并后删除保存切片的目录
};

module.exports = {
	// 合并切片
	async handleMerge(ctx, next) {
		const data = ctx.request.body;

		const { fileHash, filename, size } = data;
		const ext = extractExt(filename);
		const filePath = path.resolve(UPLOAD_DIR, `${fileHash}${ext}`);
		console.log("after merge filePath :", filePath);
		if (!fse.existsSync(UPLOAD_DIR)) {
			fse.mkdirs(UPLOAD_DIR);
		}
		await mergeFileChunk(filePath, fileHash, size);
		ctx.body = {
			code: 200,
			message: "file merged success",
		};
	},

	// 处理切片
	async handleFormData(ctx, next) {
		// ctx.body = {
		// 	code: 200,
		// 	msg: "hello",
		// };
		const multipart = new Multiparty.Form();
		const data = await parserFormdata(ctx.req);
		ctx.body = data;
	},
	// 验证该文件是否已经上传
	async alreadyUpload(ctx, next) {
		const { filename, fileHash } = ctx.request.body;
		// 文件路径
		const filePath = path.resolve(
			UPLOAD_DIR,
			`${fileHash}${extractExt(filename)}`
		);
		// 文件存在直接返回
		if (fse.existsSync(filePath)) {
			ctx.body = {
				code: 204,
				msg: "file exist",
			};
		} else {
			ctx.body = {
				code: 200,
				msg: "need upload",
			};
		}
	},
};
