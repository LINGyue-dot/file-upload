/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-27 21:08:05
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-27 22:15:10
 * @Description:
 */
const fse = require("fs-extra");

const extractExt = filename =>
	filename.slice(filename.lastIndexOf("."), filename.length); // 提取后缀名

// 创建写管道流
const pipeStream = (path, writeStream) =>
	new Promise(resolve => {
		const readStream = fse.createReadStream(path);
		readStream.on("end", () => {
			fse.unlinkSync(path);
			resolve();
		});
		readStream.pipe(writeStream);
	});

module.exports = {
	extractExt,
	pipeStream,
};
