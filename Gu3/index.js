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
	"LZR.Node.Srv.Result",
	"LZR.Node.Db.NodeAjax"
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

		// 分页模板路由
		qryRo: null,

		// 数据库
		db: null,

		// 模板工具
		tools: null,

		// 报表模板
		tmp: null,

		// 结果类
		clsR: (LZR.Node.Srv.Result),

		// JSON工具
		utJson: LZR.getSingleton(LZR.Base.Json),

		// 时间工具
		utTim: LZR.getSingleton(LZR.Base.Time),

		// Ajax
		ajax: new LZR.Node.Db.NodeAjax ({
			hd_sqls: {
				sohu: "gb2312,http://q.stock.sohu.com/cn/<0>/<1>.shtml",	// 搜狐基本面
				sinaK: "gb2312,http://hq.sinajs.cn/list=<0>",	// 新浪实时数据接口
				sinaH: "gb2312,http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=<0>&scale=240&ma=no&datalen=<1>",	// 新浪历史数据接口
				eastNum: "http://f10.eastmoney.com/CapitalStockStructure/CapitalStockStructureAjax?code=<0>",	// 东方财富——股本结构
			}
		}),

		// 初始化
		init: function (r, tr, qr, tls) {
			this.ro = r;
			this.tmpRo = tr;
			this.qryRo = qr;
			this.tools = tls;

			this.initAjax();

			this.ro.hdPost("*");
			this.ro.post("/add/", LZR.bind(this, this.addInit));
			this.ro.post("/add/", LZR.bind(this, this.add));
			this.ro.post("/add/", LZR.bind(this, this.addR));
			this.ro.post("/qry_mgInfo/update/:id/:init?/", LZR.bind(this, this.updateGetInfo));	// 获取基础数据
			this.ro.post("/qry_mgInfo/update/:id/:init?/", LZR.bind(this, this.updateGetNum));	// 查询股本
			// this.ro.post("/qry_mgInfo/update/:id/:init?/", LZR.bind(this, this.updateGetDvd));	// 查询分红
			// this.ro.post("/qry_mgInfo/update/:id/:init?/", LZR.bind(this, this.updateGetMain));	// 查询主要指标
			// this.ro.post("/qry_mgInfo/update/:id/:init?/", LZR.bind(this, this.updateGetBlc));	// 查询资产负债表
			// this.ro.post("/qry_mgInfo/update/:id/:init?/", LZR.bind(this, this.updateGetPf));	// 查询利润表
			// this.ro.post("/qry_mgInfo/update/:id/:init?/", LZR.bind(this, this.updateGetCash));	// 查询现金流量表
			// this.ro.post("/qry_mgInfo/update/:id/:init/", LZR.bind(this, this.updateFillMain));	// 补充主要指标的历史
			// this.ro.post("/qry_mgInfo/update/:id/:init?/", LZR.bind(this, this.updateGetCop));	// 查询收入构成
			// this.ro.post("/qry_mgInfo/update/:id/:init/", LZR.bind(this, this.updateGetK));	// 获取历史日线数据
			// this.ro.post("/qry_mgInfo/update/:id/:init/", LZR.bind(this, this.updateCalc));	// 市盈率分析、换算日线的市盈率
			this.ro.post("/qry_mgInfo/update/:id/:init?/", LZR.bind(this, this.updateEnd));	// 结束更新
		},

		// Ajax初始化
		initAjax: function () {
			// 新浪实时数据接口
			this.ajax.evt.sinaK.add (LZR.bind(this, function (r, req, res, next) {
				if (req.qpobj && req.qpobj.gu) {
					// 更新数据初始化 —— 获取新加代码的名称
					var i, j, a;
					var o = LZR.fillPro(req, "qpobj.gu");
					if (r.indexOf("var hq_str_")) {
						o.ok = false;
						o.msg = "ajax_sinaK : 数据格式错误！";
					} else {
						i = r.indexOf("\"") + 1;
						j = r.indexOf("\"", i);
						if (j > i) {
							o.dat.info = {
								nam: r.substring(i, j).split(",")[0]
							};
						} else {
							o.ok = false;
							o.msg = "没有相关代码的信息";
						}
					}
					next();
				} else {
					res.send("ajax_sinaK : " + r);
				}
			}));

			// 东方财富——股本结构
			this.ajax.evt.eastNum.add (LZR.bind(this, function (r, req, res, next) {
				var o = LZR.fillPro(req, "qpobj.gu");
				var d = this.utJson.toObj(r);
				var i, j, k;
				if (d.ShareChangeList) {
					o.dat.num = [];
					d = d.ShareChangeList;
					o = o.dat.num;
					for (i = 0; i < d[0].changeList.length; i ++) {
						k = {
							typ: "num",
							id: req.params.id,
							tim: this.getVal(d[0].changeList[i], 4),
							t: Math.floor(this.getVal(d[1].changeList[i], 1) * 10000),
							o: {}
						};
						for (j = 2; j < d.length; j ++) {
							switch (d[j].des) {
								case "已上市流通A股":
									k.a = Math.floor(this.getVal(d[1].changeList[i], 1) * 10000);
									break;
								case "变动原因":
									k.msg = d[j].changeList[i];
									break;
								default:
									k.o[d[j].des] = this.getVal(d[j].changeList[i], 1) * 10000;
									break;
							}
						}
						o.push (k);
					}

					// res.json(d);
					res.json(req.qpobj.gu);
				} else {
					o.ok = false;
					o.msg = "股本结构 : " + (d.message || "数据格式错误！");
					next();
				}
			}));

			// 东方财富——股本结构
			// this.ajax.evt.eastNum.add (LZR.bind(this, function (r, req, res, next) {
			// }));

		},

		// 数据库初始化
		initDb: function (db) {
			this.db = db;
			// 获取模板
			db.mdb.crtEvt({
				getTmp: {
					tnam: "gub",
					funs: {
						find: [{typ:"tmp", id:"eastmoney"}, {_id:0, id:0, typ:0}],
						toArray: []
					}
				}
			});
			db.mdb.evt.getTmp.add(LZR.bind(this, function (r) {
				this.tmp = r[0];
			}));
			db.mdb.qry("getTmp");
		},

		// 数值转换
		getVal: function (s, typ) {
			var r = s;
			switch (typ) {
				case 1:	// 转换为数字
					r = parseFloat(s.replace(/,/g, ""));
					if (isNaN(r)) {
						r = 0;
					}
					break;
				case 2:	// 转换为日时间戳
					r = this.utTim.getDayTimestamp(s);
					break;
				case 3:	// 转换为数字，需注意后边的单位（万、亿 等）
					r = s.search(/[^\d]/);
					var b = s.substr(r);
					r = parseFloat(s);
					if (isNaN(r)) {
						r = 0;
					} else {
						switch (b) {
							case "万":
								r *= 10000;
								break;
							case "百万":
								r *= 1000000;
								break;
							case "亿":
								r *= 100000000;
								break;
						}
					}
					break;
				case 4:	// 转换为日时间戳，需添加 0:0 后缀
					r = this.utTim.getDayTimestamp(s + " 0:0");
					break;
			}
			return r;
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

		// 结束更新
		updateEnd: function (req, res, next) {
			var o = LZR.fillPro(req, "qpobj.gu");
			if (req.body.mt) {
				if (!o.ok) {
					LZR.fillPro(req, "qpobj.tmpo").msg = o.msg;
				}
				this.qryRo.qry(req, res, next);
			} else {
				res.json(o);
			}
		},

		// 更新获取基础数据
		updateGetInfo: function (req, res, next) {
			LZR.fillPro(req, "qpobj").gu = this.clsR.get({
				id: req.params.id
			});
			if (this.tmp) {
				if (req.params.init) {
					var s = req.params.id[0] === "6" ? "s_sh" : "s_sz";
					this.ajax.qry("sinaK", req, res, next, [s + req.params.id]);
				} else {
					this.db.get(req, res, next,
						{typ: "info", id: req.params.id},
						{_id:0, nam:1, num:1, numA:1, numTim:1, dvdTim:1, rpTim:1, days:1, daye:1}
					, true);
				}
			} else {
				req.qpobj.gu.ok = false;
				req.qpobj.gu.msg = "缺少模板！";
				next();
			}
		},

		// 查询股本
		updateGetNum: function (req, res, next) {
			var o = LZR.fillPro(req, "qpobj.gu");
			if (o.ok) {
				// 整理好基本信息
				if (req.params.init) {
					o = o.dat.info;
					o.num = 0;
					o.numA = 0;
					o.numTim = 0;
					o.dvdTim = 0;
					o.rpTim = 0;
					o.days = 0;
					o.daye = 0;
				} else {
					if (req.qpobj.comDbSrvReturn.length) {
						o.dat.info = req.qpobj.comDbSrvReturn[0];
					} else {
						o.ok = false;
						o.msg = "代码不存在！";
						next();
						return;
					}
				}

				// res.json(req.qpobj.gu);
				var s = req.params.id[0] === "6" ? "SH" : "SZ";
				this.ajax.qry("eastNum", req, res, next, [s + req.params.id]);
			} else {
				next();
			}
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
tools.utGu.initDb(tools.qryRo.db);

tools.tmpRo.initTmp("/", "tmp", tools.tmpTools);

/********************************/

r.use("*", function (req, res, next) {
	console.log(req.originalUrl);
	res.send("---");
});

module.exports = r;
