/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-27 22:08:30
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-27 22:13:56
 * @Description:
 */

const Multiparty = require("multiparty");
const path = require("path");
const fse = require("fs-extra");
const { CHUNK_DIR, UPLOAD_DIR } = require("../utils/config");
const { pipeStream, extractExt } = require("../utils");
function parserFormdata(req) {
	return new Promise((resolve, reject) => {
		const multipart = new Multiparty.Form();
		multipart.parse(req, async (err, fields, files) => {
			if (err) {
				console.error(err);
				reject(err);
				return;
			}
			try {
				// 获取数组的第一个元素
				const [chunk] = files.chunk;
				const [hash] = fields.hash; // 切片 hash 名
				const [fileHash] = fields.fileHash;
				const [filename] = fields.filename;

				// 最终合并的文件的路径
				const filePath = path.resolve(
					UPLOAD_DIR,
					`${fileHash}${extractExt(filename)}`
				);
				// 切片文件夹路径
				const chunkPath = path.resolve(CHUNK_DIR, `${fileHash}`);
				// 切片目录不存在，创建切片目录
				if (!fse.existsSync(chunkPath)) {
					await fse.mkdirs(chunkPath);
				}

				console.log("filePath", filePath);
				console.log("chunkPath", chunkPath);
				// 会将收到数据暂时存储再缓冲区中，将其移动到 chunk 目录
				if (!fse.existsSync(path.resolve(chunkPath, hash))) {
					await fse.move(chunk.path, path.resolve(chunkPath, hash));
				}
			} catch (e) {
				reject(e);
			}
			resolve({
				code: 200,
				msg: "success",
			});
		});
	});
}

module.exports = { parserFormdata };
