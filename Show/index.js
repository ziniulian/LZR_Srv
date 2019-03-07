// 作品展示

// 文件位置
var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
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

// RFID项目图片转址
r.get("/RFID/:nam/:v/img/*", function (req, res, next) {
	res.redirect("/Pic/img/web/RFID/" + req.params.nam + "/" + req.params.v + "/" + req.params[0]);
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

// 长征网作品展示
if (process.env.OPENSHIFT_NODEJS_PORT) {
	r.get("/ShowLongMarch/", function (req, res) {
		res.redirect("https://www.ziniulian.tk/LongMarch/");
	});
} else {
	r.use("/ShowLongMarch/", new LZR.Node.Router ({
		path: "L:\\Doc\\Git\\",
		hd_web: "LongMarch"
	}));
}

// 虚拟实验作品展示
if (process.env.OPENSHIFT_NODEJS_PORT) {
	r.get("/ShowVr/", function (req, res) {
		// res.redirect("https://www.ziniulian.tk/ProVr/web/");
		res.send("机密！不公开");
	});
} else {
	r.use("/ShowVr/", new LZR.Node.Router ({
		path: "L:\\Doc\\Git\\ProVr\\",
		hd_web: "web"
	}));
}

module.exports = r;
