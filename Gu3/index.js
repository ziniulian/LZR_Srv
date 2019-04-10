// 东方财富股服务

// 文件位置
var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Router",
	"LZR.Base.Json",
	"LZR.Base.Time",
	"LZR.Node.Router.ComTmp",
	"LZR.Node.Router.QryTmp",
	"LZR.Node.Srv.GuSrv"
]);

// 创建路由
var r = new LZR.Node.Router ({
	path: curPath
});

// 需要用到的工具
var tools = {
	utTim: LZR.getSingleton(LZR.Base.Time),
	utJson: LZR.getSingleton(LZR.Base.Json),
	qryRo: new LZR.Node.Router.QryTmp({
		ro: r,
		conf: (process.env.OPENSHIFT_MONGODB_DB_URL || "mongodb://localhost:27017/lzr"),	// 数据库连接字
		defTnam: "gub",	// 表名
		pvs: {
			_id: 2,	// id
			id: 0,	// 文字
			tim: 1,	// 数值型
			daye:1,	// 数值型
			rpTim:1	// 数值型
		}
	}),
	tmpRo: new LZR.Node.Router.ComTmp({		// 常用模板
		ro: r
	}),
	utGu: new LZR.Node.Srv.GuSrv ()
};

// 模板工具
tools.tmpTools = {
	utJson: tools.utJson,
	utTim: tools.utTim
};

// 股服务创建
tools.utGu.qryRo = tools.qryRo;
tools.utGu.tmpRo = tools.tmpRo;
tools.utGu.init();

/**************** 测试区-S **********************/

// 聚合排序的分页查询测试 （此排序方法在处理海量数据时会有性能的降低）
r.get("/qry_info/", function (req, res, next) {
	var o = LZR.fillPro(req, "qpobj.tmpo.qry");
	o.mt = "mpag";
	o.k = tools.utJson.toJson({rpTim:1, id:1});
	o.size = 33;
	o.cond = tools.utJson.toJson({typ: "info"});
	next();
});

/**************** 测试区-E **********************/

/**************** 模板 **********************/

r.get("/qry_mgInfo/", function (req, res, next) {
	var o = LZR.fillPro(req, "qpobj.tmpo.qry");
	o.k = "id";
	o.size = 20;
	o.cond = tools.utJson.toJson({typ: "info"});
	next();
});

// 当删除股票信息时，同时删除相关的所有日线数据
r.post("/qry_mgInfo/", function (req, res, next) {
	if (req.body.mt === "clear") {
		tools.utGu.db.mdb.qry("delK", null, null, null, [tools.utJson.toObj(req.body.cont)]);
	}
	next();
});

tools.qryRo.init("/");
tools.utGu.initDb();

tools.tmpRo.initTmp("/", "tmp", tools.tmpTools);

/********************************/

r.use("*", function (req, res, next) {
	console.log(req.originalUrl);
	res.send("---");
});

module.exports = r;
