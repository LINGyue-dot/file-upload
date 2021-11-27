/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-27 21:08:25
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-27 21:25:20
 * @Description:
 */
const path = require("path");
const UPLOAD_DIR = path.resolve(__dirname, "..", "target"); // 大文件存储目录

const CHUNK_DIR = path.resolve(__dirname, "..", "chunk"); // 切片的存储目录

module.exports = {
	UPLOAD_DIR,
	CHUNK_DIR,
};
