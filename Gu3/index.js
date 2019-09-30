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
		conf: (r.getO3dbUrl() || "mongodb://localhost:27017/lzr"),	// 数据库连接字
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

// console.log(tools.utTim.getDayTimestamp());

// 聚合排序的分页查询测试 （此排序方法在处理海量数据时会有性能的降低）
r.get("/qry_info/", function (req, res, next) {
	var o = LZR.fillPro(req, "qpobj.tmpo.qry");
	o.mt = "mpag";
	o.k = tools.utJson.toJson({rpTim:1, id:1});
	o.size = 33;
	o.cond = tools.utJson.toJson({typ: "info"});
	next();
});

// 处理集合竞价
r.get("/hdBid/", function (req, res, next) {
	tools.utGu.bidc.state = 5;
	tools.utGu.db.mdb.qry("getBidCache");
	res.send("OK!");
});
/*
// 集合竞价概览（测试）
r.get("/bidOv/", function (req, res, next) {
	tools.utGu.db.setPro (req, "getBid", true);
	tools.utGu.db.mdb.qry("getBid", req, res, next, [
		{tim : tools.utTim.getDayTimestamp()}, {"_id" : 0, tim: 0, length: 0}
	]);
});
r.get("/bidOv/", function (req, res, next) {
	var s, r = [], a = req.qpobj.comDbSrvReturn;
	if (a.length) {
		a = a[0];
		for (s in a) {
			if (a[s].t && !a[s].p) {
				// 修正不完整的数据
				a[s].p = a[s].t.p;
				a[s].v = a[s].t.v;
				LZR.del(a[s], "t");
				// r.push(a[s]);
			}
			LZR.del(a[s], "dat");
			LZR.del(a[s], "f20");
			LZR.del(a[s], "b");
			LZR.del(a[s], "s");
			a[s].hf = a[s].hf.toFixed(2);
			a[s].lf = a[s].lf.toFixed(2);
			a[s].of = a[s].of.toFixed(2);
			if (a[s].sp === undefined) {
				a[s].sp = 0;
				a[s].bp = 0;
			} else {
				a[s].sp = a[s].sp.toFixed(0);
				a[s].bp = a[s].bp.toFixed(0);
			}

			r.push(a[s]);
		}
	}

	req.qpobj.bids = r;
	next();
});
*/
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

r.get("/qry_mgOp/", function (req, res, next) {
	var o = LZR.fillPro(req, "qpobj.tmpo.qry");
	o.k = "ord";
	o.size = 20;
	o.cond = tools.utJson.toJson({typ: "op"});
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
