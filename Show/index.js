// 作品展示

// 文件位置
var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Srv.Result",
	"LZR.NodeJs.ProSrv.WindSrv"
]);

// 需要用到的工具函数
var tools = {
	// 风场服务
	winds: new LZR.NodeJs.ProSrv.WindSrv ({
		url: ""
	})
};

// 创建路由
var r = new LZR.Node.Router ({
	path: curPath,
	hd_web: "web"
});

// 风场服务
r.get("/windSrv/", function (req, res, next) {
	if (!tools.winds.url) {
		tools.winds.url = "http://" + req.hostname + "/Pic/json/wind/";
	}
	tools.winds.qry(req.query, res);
});

// 测温演示
r.use("/TmpMg/", require("./TmpTagMgmt"));

module.exports = r;
