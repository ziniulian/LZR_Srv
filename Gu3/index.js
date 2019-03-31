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
				eastDvd: "http://f10.eastmoney.com/BonusFinancing/BonusFinancingAjax?code=<0>",	// 东方财富——分红融资
				eastMain: "http://f10.eastmoney.com/NewFinanceAnalysis/MainTargetAjax?type=<1>&code=<0>",	// 东方财富——主要指标
				eastBlc: "http://f10.eastmoney.com/NewFinanceAnalysis/zcfzbAjax?companyType=4&reportDateType=0&reportType=1&endDate=<1>&code=<0>",	// 东方财富——资产负债表
				eastPf: "http://f10.eastmoney.com/NewFinanceAnalysis/lrbAjax?companyType=4&reportDateType=0&reportType=1&endDate=<1>&code=<0>",	// 东方财富——利润表
				eastCash: "http://f10.eastmoney.com/NewFinanceAnalysis/xjllbAjax?companyType=4&reportDateType=0&reportType=1&endDate=<1>&code=<0>",	// 东方财富——现金流量表
				eastCop: "http://f10.eastmoney.com/BusinessAnalysis/BusinessAnalysisAjax?code=<0>"	// 东方财富——收入构成
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
					// todo : 用于收盘
					res.send("ajax_sinaK : " + r);
				}
			}));

			// 东方财富——股本结构
			this.ajax.evt.eastNum.add (LZR.bind(this, function (r, req, res, next) {
				var o = LZR.fillPro(req, "qpobj.gu.dat");
				var d = this.utJson.toObj(r);
				var i, j, k;
				if (d.ShareChangeList) {
					o.num = [];
					d = d.ShareChangeList;
					o = o.num;
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
									k.a = Math.floor(this.getVal(d[j].changeList[i], 1) * 10000);
									break;
								case "变动原因":
									k.msg = d[j].changeList[i];
									break;
								default:
									k.o[d[j].des] = Math.floor(this.getVal(d[j].changeList[i], 1) * 10000);
									break;
							}
						}
						if (!i || k.msg !== "定期报告") {
							o.push (k);
						}
					}
					if (o.length > 1 && o[0].msg === "定期报告" && o[0].a === o[1].a && o[0].t === o[1].t) {
						o.shift();
					}

					// res.json(req.qpobj.gu);
					this.ajax.qry("eastDvd", req, res, next, req.qpobj.gu.dat.sid);
				} else {
					req.qpobj.gu.ok = false;
					req.qpobj.gu.msg = "股本结构 : " + (d.message || "数据格式错误！");
					next();
				}
			}));

			// 东方财富——分红融资
			this.ajax.evt.eastDvd.add (LZR.bind(this, function (r, req, res, next) {
				var o = LZR.fillPro(req, "qpobj.gu.dat");
				var d = this.utJson.toObj(r);
				var i, j, k, a;
				o.dvd = [];

				// 分红
				for (i = 0; i < d.fhyx.length; i ++) {
					a = d.fhyx[i].fhfa;
					if (a[0] !== "不") {
						k = {
							typ: "dvd",
							id: o.id,
							tim: this.getVal(d.fhyx[i].ggrq, 4),
							regTim: this.getVal(d.fhyx[i].gqdjr, 4) || 0,
							exdTim: this.getVal(d.fhyx[i].cqcxr, 4) || 0,
							cn: this.getVal(a, 1)
						};
						a = a.match(/[送转派后][\d\.]+/g);
						for (j = 0; j < a.length; j ++) {
							switch (a[j][0]) {
								case "送":
									k.gift = this.getVal(a[j].substr(1), 1);
									break;
								case "转":
									k.transfer = this.getVal(a[j].substr(1), 1);
									break;
								case "派":
									k.dividend = this.getVal(a[j].substr(1), 1);
									break;
								case "后":
									k.dt = this.getVal(a[j].substr(1), 1);
									break;
							}
						}
						o.dvd.push(k);
					}
				}

				// 配股
				for (i = 0; i < d.pgmx.length; i ++) {
					o.dvd.push({
						typ: "dvd",
						id: o.id,
						tim: this.getVal(d.pgmx[i].pgggr, 5),
						regTim: this.getVal(d.pgmx[i].gqdjr, 5),
						exdTim: this.getVal(d.pgmx[i].cqjzr, 5),
						allotment: {
							p: this.getVal(d.pgmx[i].pgjg, 1),
							n: this.getVal(d.pgmx[i].pgfa, 1),
							num: Math.floor( this.getVal(d.pgmx[i].sjpgsl, 1) * 10000 )
						}
					});
				}

				// 增发
				for (i = 0; i < d.zfmx.length; i ++) {
					o.dvd.push({
						typ: "dvd",
						id: o.id,
						tim: this.getVal(d.zfmx[i].zfsj, 5),
						regTim: this.getVal(d.zfmx[i].gqdjr, 5),
						exdTim: this.getVal(d.zfmx[i].zfssr, 5),
						addIss: {
							p: this.getVal(d.zfmx[i].zfjg, 1),
							num: Math.floor( this.getVal(d.zfmx[i].sjzfsl, 1) * 10000 ),
							net: Math.floor( this.getVal(d.zfmx[i].sjmjje, 1) * 10000 ),
							msg: d.zfmx[i].fxfs
						}
					});
				}

				// res.json(req.qpobj.gu);
				req.qpobj.gu.dat.sid.push("0");
				this.ajax.qry("eastMain", req, res, next, req.qpobj.gu.dat.sid);
			}));

			// 东方财富——主要指标
			this.ajax.evt.eastMain.add (LZR.bind(this, function (r, req, res, next) {
				var m, o = LZR.fillPro(req, "qpobj.gu.dat");
				LZR.fillPro(req, "qpobj.gu.dat.err.main");
				LZR.fillPro(req, "qpobj.gu.dat.report");
				m = this.crtByTmp (this.utJson.toObj(r), this.tmp.main, o.report, o.err.main);

				if (req.params.init) {
					if (o.sid[1] === "0") {
						o.sid[1] = "1";
						this.ajax.qry("eastMain", req, res, next, o.sid);
						return;
					}
				} else {
					if (m[1] <= o.info.rpTim) {
						LZR.del(o, "report");
						next();
						return;
					}
				}

				// res.json(req.qpobj.gu);
				o.sid[1] = "&a=";
				this.ajax.qry("eastBlc", req, res, next, o.sid);
			}));

			// 东方财富——资产负债表
			this.ajax.evt.eastBlc.add (LZR.bind(this, function (r, req, res, next) {
				if (this.qryRun(r, req, res, next, "balance", "eastBlc", "资产负债表")) {
					// res.json(req.qpobj.gu);
					req.qpobj.gu.dat.sid[1] = "&a=";
					this.ajax.qry("eastPf", req, res, next, req.qpobj.gu.dat.sid);
				}
			}));

			// 东方财富——利润表
			this.ajax.evt.eastPf.add (LZR.bind(this, function (r, req, res, next) {
				if (this.qryRun(r, req, res, next, "profit", "eastPf", "利润表")) {
					// res.json(req.qpobj.gu);
					req.qpobj.gu.dat.sid[1] = "&a=";
					this.ajax.qry("eastCash", req, res, next, req.qpobj.gu.dat.sid);
				}
			}));

			// 东方财富——现金流量表
			this.ajax.evt.eastCash.add (LZR.bind(this, function (r, req, res, next) {
				if (this.qryRun(r, req, res, next, "cash", "eastCash", "现金流量表")) {
					res.json(req.qpobj.gu);
					// ...
					// this.ajax.qry("eastCop", req, res, next, req.qpobj.gu.dat.sid);
				}
			}));

			// 东方财富——收入构成
			this.ajax.evt.eastCop.add (LZR.bind(this, function (r, req, res, next) {
			}));

// console.log(this.getVal("106,202.43万", 3));

			// 错误处理
			var exeHdErr = LZR.bind(this, this.hdErr);
			this.ajax.err.sohu.add(exeHdErr);
			this.ajax.err.sinaK.add(exeHdErr);
			this.ajax.err.sinaH.add(exeHdErr);
			this.ajax.err.eastNum.add(exeHdErr);
			this.ajax.err.eastDvd.add(exeHdErr);
			this.ajax.err.eastMain.add(exeHdErr);
			this.ajax.err.eastBlc.add(exeHdErr);
			this.ajax.err.eastPf.add(exeHdErr);
			this.ajax.err.eastCash.add(exeHdErr);
			this.ajax.err.eastCop.add(exeHdErr);
		},

		// 循环查询
		qryRun: function (r, req, res, next, tmp, anam, msg) {
			var m, o = LZR.fillPro(req, "qpobj.gu.dat");
			r = this.utJson.toObj(r);
			if (typeof(r) === "string") {
				if (r !== "null") {
					LZR.fillPro(req, "qpobj.gu.dat.err." + tmp);
					m = this.crtByTmp (this.utJson.toObj(r), this.tmp[tmp], o.report, o.err[tmp]);
					if (m[0] > o.info.rpTim) {
						o.sid[1] = this.utTim.formatUTC(m[0], 1, "yyyy%2FMM%2Fdd+0%3A00%3A00");
						this.ajax.qry(anam, req, res, next, o.sid);
						return false;
					}
				}
			} else {
				req.qpobj.gu.ok = false;
				req.qpobj.gu.msg = msg + " : " + (r.message || "数据格式错误！");
				next();
				return false;
			}
			return true;
		},

		// 依模板解析
		crtByTmp: function (d, t, r, e) {
			var i, s, o, v, m = [0, 0];	// 最小时间, 最大时间
			for (i = 0; i < d.length; i ++) {
				o = {};
				for (s in d[i]) {
					if (t[s]) {
						if (t[s][1]) {
							v = this.getVal(d[i][s], t[s][1]);
							if (v) {
								this.setVal (o, t[s][0], v);
							}
						}
					} else {
						e[s] = 1;	// 错误记录
					}
				}

				// 记录最大最小时间
				if (o.tim > m[1]) {
					m[1] = o.tim;
				}
				if (!m[0] || o.tim < m[0]) {
					m[0] = o.tim;
				}

				// 数据存储
				if (!r[o.tim]) {
					r[o.tim] = {};
				}
				for (s in o) {
					if (s !== "tim") {
						r[o.tim][s] = o[s];
					}
				}
			}
			return m;
		},

		// 设置值
		setVal: function (o, p, v) {
			var a = p.split(".");
			var n = a.length - 1;
			var i, r = o;
			for (i = 0; i < n; i ++) {
				if (!r[a[i]]) {
					r[a[i]] = {};
				}
				r = r[a[i]];
			}
			r[a[n]] = v;
		},

		// 错误处理
		hdErr: function (e, req, res, next) {
			var o = LZR.fillPro(req, "qpobj.gu");
			o.ok = false;
			o.msg = "连接错误 : " + e;
			next();
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
					s = s.replace(/,/g, "");
					r = s.search(/[^\d\.]/);
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
						r = Math.floor(r);
					}
					break;
				case 4:	// 转换为日时间戳，需添加 0:0 后缀
					r = this.utTim.getDayTimestamp(s + " 0:0");
					break;
				case 5:	// 转换为日时间戳，需补齐四位年数，添加 0:0 后缀
					r = parseFloat(s);
					if (r < 90) {
						s = "20" + s;
					} else if (r < 100) {
						s = "19" + s;
					}
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
			if (o.ok) {
				// todo : 保存数据
			}
			if (req.body.mt) {
				if (o.ok) {
					LZR.fillPro(req, "qpobj.tmpo").msg = "完成";
				} else {
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
						{_id:0, nam:1, num:1, numA:1, numTim:1, dvdTim:1, rpTim:1, days:1, daye:1},
					true);
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
				req.qpobj.gu.dat.sid = [s + req.params.id];
				this.ajax.qry("eastNum", req, res, next, req.qpobj.gu.dat.sid);
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
