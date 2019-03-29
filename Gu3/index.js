// 访问服务

// 文件位置
var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
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
	utGu: {
		// 路由
		ro: null,

		// 模板路由
		tmpRo: null,

		// 分页模板
		qryRo: null,

		// 数据库
		db: null,

		// 模板工具
		tools: null,

		// 初始化
		init: function (r, tr, qr, tls) {
			this.ro = r;
			this.tmpRo = tr;
			this.qryRo = qr;
			this.tools = tls;

			this.ro.hdPost("*");
			this.ro.post("/add/", LZR.bind(this, this.addInit));
			this.ro.post("/add/", LZR.bind(this, this.add));
			this.ro.post("/add/", LZR.bind(this, this.addR));
			this.ro.post("/qry_mgInfo/update/:id/:init?/", LZR.bind(this, this.initDat));
		},

		// 解析添加信息
		parseAddIds: function (ids/*as:string*/) {
			var a, b, c, r, i;
			a = ids.replace(/\r?\n/g, ";").replace(/\n/g, ";").split(";");
			r = {};
			for (i = 0; i < a.length; i ++) {
				b = a[i].split(",");
				c = b.shift();
				if (c.search(/^\d{6}$/) === 0) {
					r[c] = {
						typ: "info",
						id: c,
						ec: c[0] === "6" ? "sh" : "sz",
						sim: b
					};
				}
			}
			return r;
		},

		// 添加初始化
		addInit: function (req, res, next) {
			var s, o, t, a = [];
			o = this.parseAddIds(req.body.ids);
			for (s in o) {
				a.push(s);
			}
			if (a.length) {
				// 验证欲添加的ID是否已经存在
				t = LZR.fillPro(req, "qpobj");
				t.ids = o;
				t.idCount = a.length;
				this.db.get(req, res, next,
					{typ: "info", id: {"$in": a}},
					{"_id": 0, "id": 1}, true);
			} else {
				t = LZR.fillPro(req, "qpobj.tmpo");
				t.msg = "数据无效！";
				this.tmpRo.sendTmp(req, res, next, "add");
			}
		},

		// 添加
		add: function (req, res, next) {
			var t = req.qpobj;
			if (t.comDbSrvReturn.length < t.idCount) {
				for (i = 0; i < t.comDbSrvReturn.length; i ++) {
					LZR.del(t.ids, t.comDbSrvReturn[i].id);
				}
				var s, a = [];
				for (s in t.ids) {
					a.push(t.ids[s]);
				}
				this.db.add(req, res, next, null, a, true);
			} else {
				t = LZR.fillPro(req, "qpobj.tmpo");
				t.msg = "欲添加的数据已存在！无需再次添加。";
				this.tmpRo.sendTmp(req, res, next, "add");
			}
		},

		// 添加结果
		addR: function (req, res, next) {
			if (req.qpobj.comDbSrvReturn.result.n) {
				res.redirect(req.baseUrl + "/qry_mgInfo/");
			} else {
				t = LZR.fillPro(req, "qpobj.tmpo");
				t.msg = "添加失败！";
				req.qpobj.cont = req.body.ids;
				next();
			}
		},

		// 数据初始化
		initDat: function (req, res, next) {
			// res.send(req.params.id);
			tools.qryRo.qry(req, res, next);
		},
	}
};

// 模板工具
tools.tmpTools = {
	utJson: tools.utJson,
	utTim: tools.utTim
};

// 股服务创建
tools.utGu.init(r, tools.tmpRo, tools.qryRo, tools.tmpTools);

/**************** 模板 **********************/

r.get("/qry_mgInfo/", function (req, res, next) {
	var o = LZR.fillPro(req, "qpobj.tmpo.qry");
	o.k = "rpTim";
	o.cond = "{\"typ\":\"info\"}";
	next();
});

tools.qryRo.init("/");
tools.utGu.db = tools.qryRo.db;

tools.tmpRo.initTmp("/", "tmp", tools.tmpTools);

/********************************/

r.use("*", function (req, res, next) {
	console.log(req.originalUrl);
	res.send("---");
});

module.exports = r;
