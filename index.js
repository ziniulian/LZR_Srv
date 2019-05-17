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

// 公共工具
srv.ro.get("/tools.js", function (req, res) {
	res.sendFile("tools.js", {
		root: "./common/"
	});
});

// LZR库文件访问服务
srv.ro.setStaticDir("/myLib/", LZR.curPath);

// 其它JS库
srv.ro.setStaticDir("/comLib/", "./common/Lib/");

// 记录访问信息
srv.ro.all(/^\/((Show)|(Vs))?(\/)?$/i, tools.vs.getTls().savVs);

// 临时图床
srv.use("/Pic/", require("./Pic"));

// 作品展示
srv.use("/Show/", require("./Show"));

// 股服务
srv.use("/Gu/", require("./Gu3"));

// 日记服务
srv.use("/Riji/", require("./Riji"));

// 数据库管理服务
srv.use("/Dbc/", require("./Dbc"));

// 访问服务
srv.use("/Vs/", tools.vs);

// 静态主页设置
srv.ro.setStaticDir("/", "./web");

// 收尾处理
srv.use("*", function (req, res) {
	res.redirect("https://www.ziniulian.tk/home.html");
});

// 服务启动
srv.start();
console.log("LZRsrv start " + srv.ip + ":" + srv.port);
