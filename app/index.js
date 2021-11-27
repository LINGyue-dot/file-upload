/*
 * @Author: qianlong github:https://github.com/LINGyue-dot
 * @Date: 2021-11-27 20:56:43
 * @LastEditors: qianlong github:https://github.com/LINGyue-dot
 * @LastEditTime: 2021-11-27 21:56:08
 * @Description:
 */
const Koa = require("koa");
const cors = require("koa-cors");
const Router = require("koa-router");
var bodyParser = require("koa-bodyparser");
// const parameter = require("koa-parameter"); //
const error = require("koa-json-error");
const app = new Koa();
app.use(error());
app.use(cors());
// app.use(parameter(app)); // 验证参数使得 ctx 存在 vertifaction method
app.use(bodyParser());

const router = new Router();
const customer = require("../app/controller/slice");

router.post("/verify", customer.alreadyUpload);
router.post("/merge", customer.handleMerge);
router.post("/upload", customer.handleFormData);

app
	.use(router.routes())
	.use(router.allowedMethods())
	.listen(5200, () => console.log("listen on 5200"));
