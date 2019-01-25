// 访问服务

// 文件位置
var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Util",
	"LZR.Node.Router",
	"LZR.Base.Json",
	"LZR.Base.Time",
	"LZR.Node.Router.ComTmp",
	"LZR.Node.Router.QryTmp"
]);

// 创建路由
var r = new LZR.Node.Router ({
	path: curPath
});

// 需要用到的工具
var tools = {
	utTim: LZR.getSingleton(LZR.Base.Time),
	utNode: LZR.getSingleton(LZR.Node.Util),
	qryRo: new LZR.Node.Router.QryTmp({
		ro: r,
		conf: (process.env.OPENSHIFT_MONGODB_DB_URL || "mongodb://localhost:27017/lzr"),	// 数据库连接字
		defTnam: "vs",	// 表名
		pvs: {
			"tim": 1,	// 数值型
			"_id": 2	// id
		},
		addC: {		// 此处设置的属性保证唯一值
			tim: null
		}
	}),
	tmpRo: new LZR.Node.Router.ComTmp({		// 常用模板
		ro: r
	}),

	// 保存访问记录
	savVs: function (req, res, next) {
// console.log(req.originalUrl);
		if (tools.qryRo.db) {
			tools.qryRo.db.add( req, res, next, null, {
				ip: tools.utNode.getClientIp(req),
				url: req.originalUrl,
				tim: tools.utTim.getTim()
			}, true );
		} else {
			next();
		}
	}
};

// 用于给主路由使用自己的工具类
r.getTls = function () {
	return tools;
}

/**************** 模板 **********************/
r.get("/", function (req, res, next) {
	res.redirect(req.baseUrl + "/qry_vs/");
});

r.get("/qry_vs/", function (req, res, next) {
	var o = LZR.fillPro(req, "qpobj.tmpo.qry");
	o.k = "tim";
	o.sort = -1;
	o.cond = "{\"dbLog\":{\"$exists\":false}}";
	next();
});

r.get("/qry_dbvs/", function (req, res, next) {
	var o = LZR.fillPro(req, "qpobj.tmpo.qry");
	o.k = "tim";
	o.sort = -1;
	o.cond = "{\"dbLog\":{\"$exists\":true}}";
	next();
});

tools.qryRo.init("/");

tools.tmpRo.initTmp("/", "tmp", {
	utJson: LZR.getSingleton(LZR.Base.Json),
	utTim: tools.utTim
});

// 记录指纹跟踪
r.hdPost("/srvTrace/");
r.post("/srvTrace/", function (req, res, next) {
	req.body.tim = tools.utTim.getTim();
	tools.qryRo.db.add( req, res, next, null, req.body );
});

module.exports = r;
