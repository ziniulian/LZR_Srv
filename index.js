// LZR 模块加载
require("lzr");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Srv"
]);

// 服务的实例化
var srv = new LZR.Node.Srv ({
	ip: process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0",
	port: process.env.OPENSHIFT_NODEJS_PORT || 80
});

// 需要用到的工具
var tools = {
	vs: require("./Vs")		// 访问记录数据库管理模块
};

// LOGO图片
srv.ro.get("/favicon.ico", function (req, res) {
	res.sendFile("Logo.png", {
		root: "./common/"
	});
});

// 公共样式
srv.ro.get("/base.css", function (req, res) {
	res.sendFile("base.css", {
		root: "./common/"
	});
});

// LZR库文件访问服务
srv.ro.setStaticDir("/myLib/", LZR.curPath);

// 记录访问信息
srv.ro.all(/^\/((Vs)|(myLib))?(\/)?$/i, function (req, res, next) {
	var t = tools.vs.getTls();
	if (t.qryRo.db) {
		t.qryRo.db.add( req, res, next, null, {
			ip: t.utNode.getClientIp(req),
			url: req.originalUrl,
			tim: t.utTim.getTim()
		}, true );
	} else {
		next();
	}
});

// 数据库管理服务
srv.use("/Vs/", tools.vs);

// 静态主页设置
srv.ro.setStaticDir("/", "./web");

// 收尾处理
srv.use("*", function (req, res) {
	res.status(404).send("404!");
	// res.redirect("https://www.ziniulian.tk/home.html");
});

// 服务启动
srv.start();
console.log("LZRsrv start " + srv.ip + ":" + srv.port);
