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
		init: function (r, tr, qr) {
			this.ro = r;
			this.tmpRo = tr;
			this.qryRo = qr;

			this.initAjax();

			this.ro.hdPost("*");
			this.ro.post("/add/", LZR.bind(this, this.addInit));
			this.ro.post("/add/", LZR.bind(this, this.add));
			this.ro.post("/add/", LZR.bind(this, this.addR));
			this.ro.post("/qry_mgInfo/update/:id/:init?/", LZR.bind(this, this.updateGetInfo));	// 获取基础数据
			this.ro.post("/qry_mgInfo/update/:id/:init?/", LZR.bind(this, this.updateGetNum));	// 查询股本
			this.ro.post("/qry_mgInfo/update/:id/:init?/", LZR.bind(this, this.updateEnd));	// 结束更新
		},

		// 数据整理
		arrange: function (d) {
			var i, s, o, ni, nmt, r = [];
			ni = d.num.length - 1;	// 股本指针
			nmt = d.num[ni].tim;	// 最小股本记录日
			for (s in d.report) {
				// 此循环默认报告期是从小到大遍历的
				if (s > d.info.rpTim) {
					o = d.report[s];
					o.typ = "report";
					o.id = d.id;
					o.tim = s - 0;
					o.nam = d.info.nam;

					// 判断股本
					if (o.tim < nmt) {
						if (o.profit && o.profit.np.parent && o.profit.eps) {
							o.num = Math.floor(o.profit.np.parent / o.profit.eps.base);
						}
					} else {
						while (ni && o.tim >= d.num[ni - 1].tim) {
							ni --;
						}
						o.num = d.num[ni].t;
					}

					// 年、季
					i = this.utTim.getDate(this.utTim.parseDayTimestamp(o.tim));
					o.year = i.getFullYear();
					o.quarter = Math.floor( i.getMonth() / 3 ) + 1;

					// 补充资产负债率
					if (o.balance) {
						if (!o.balance.liability) {
							o.balance.liability = {
								t: 0
							};
						}
						o.balance.dar = o.balance.liability.t / o.balance.assets.t * 100;
					}

					// 补充毛利率
					if (o.profit && o.profit.inc && o.profit.cost) {
						o.profit.gpm = (o.profit.inc.ot - o.profit.cost.ot) / o.profit.inc.ot * 100;
					}

					// 补充年化扣非每股收益
					if (!o.num && r.length) {
						// 股本推算
						o.num = r[r.length - 1].num;
					}
					if (o.num) {
						if (o.quarter === 4 && o.profit && o.profit.np.nt) {
							o.pe = {p: o.profit.np.nt.t / o.num};
							d.info.eps = o.pe.p;
							r.push(o);
						} else if (d.info.eps) {
							o.pe = {p: d.info.eps};
							r.push(o);
						}
					}
				} else {
					LZR.del(d.report, s);
				}
			}

			// 补充基本信息-最新报告期
			if (o && d.info.rpTim < o.tim) {
				d.info.rpTim = o.tim;
			}

			return r;
		},

		// 市盈率分析
		calcEps: function (o, d) {
			var i, j, k, t, p, a1, a2;
			t = this.utTim.getDayTimestamp();	// 当日时间戳
			p = [];
			i = 0;
			j = 0;

			var getP = function (pi) {
				if (pi < o.length) {
					if (!p[pi] && (o[pi].tim + 150 <= t)) {
						p[pi] = {
							s: o[pi].tim,
							e: o[pi].tim + 150,
							d: []
						};
					}
					return p[pi];
				}
				return null;
			};

			while (i < d.length) {
				a1 = getP(j);
				if (a1) {
					k = d[i].tim;
					if (k < a1.e) {
						if (k >= a1.s) {
							a1.d.push(d[i]);
							a2 = getP(j + 1);
							if (a2 && k >= a2.s) {
								a2.d.push(d[i]);
							}
						}
						i ++;
					} else {
						if (!a1.d.length) {
							p[j] = null;
						}
						j ++;
					}
				} else {
					break;
				}
			}

			for (i = 0; i < p.length; i ++) {
				if (p[i]) {
					k = p[i].d;
					t = o[i].pe;
					if (t.p > 0.003) {
						t.o = k[0].o / t.p;
						t.h = k[0].h;
						t.l = k[0].l;
						t.v = k[0].v;
						t.m = k[0].t;
						for (j = 1; j < k.length; j ++) {
							t.v += k[j].v;
							t.m += k[j].t;
							if (k[j].h > t.h) {
								t.h = k[j].h;
							}
							if (k[j].l < t.l) {
								t.l = k[j].l;
							}
						}
						t.c = k[j - 1].c / t.p;
						t.h /= t.p;
						t.l /= t.p;
						t.m = t.m / t.v / t.p;
						t.f = (t.c - t.o) / t.o * 100;
						t.vf = t.v / k.length / o[i].num * 100;
						t.r = (t.m + t.l) / 2;
						t.rf = (t.h - t.l) / t.r * 100;

						// 计算同比 ry
						k = 1;
						while (k <= i) {
							a1 = o[i].year - o[i - k].year;
							if (a1 > 1) {
								break;
							} else if ((a1 === 1) && (o[i].quarter === o[i - k].quarter) && (o[i - k].pe.r)){
								t.ry = (t.r - o[i - k].pe.r) / o[i - k].pe.r * 100;
								break;
							}
							k ++;
						}
					}
				}
			}
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

			// 新浪历史数据接口
			this.ajax.evt.sinaH.add (LZR.bind(this, function (r, req, res, next) {
				var i, j, d, p, e, o = LZR.fillPro(req, "qpobj.gu.dat");
				// r = this.utJson.toObj(r);
				r = eval(r);
				if (r && r.length) {
					o.k = [];
					j = 1;
					p = r[0].open;
					e = o.sid[2][0].pe.p;
					for (i = 0; i < r.length; i ++) {
						d = {
							id: o.id,
							tim: this.getVal(r[i].day, 4),
							c: this.getVal(r[i].close, 1),
							o: this.getVal(r[i].open, 1),
							h: this.getVal(r[i].high, 1),
							l: this.getVal(r[i].low, 1),
							v: this.getVal(r[i].volume, 1),
							p: 0
						};
						d.f = (d.c - p) / p * 100;	// 涨幅
						d.cc = d.c;	// 假设均价等于收盘价
						d.t = d.v * d.cc;	// 推算成交额
						p = d.c;

						// 计算扣非市盈率
						if (d.tim >= o.sid[2][0].tim) {
							if (j && d.tim >= o.sid[2][j].tim) {
								j ++;
								if (j < o.sid[2].length) {
									e = o.sid[2][j].pe.p;
								} else {
									j = 0;
								}
							}
							if (e > 0.003) {
								d.p = d.cc / e;
							}
						}

						o.k.push(d);
					}

					o.info.days = o.k[0].tim;
					o.info.daye = d.tim;
				}

				// 市盈率分析
				console.log (o.info.nam + " : A. 已获取K线数据");
				this.calcEps (o.sid.pop(), o.k);
				console.log (o.info.nam + " : B. 市盈率分析完毕");

				next();
			}));

			// 东方财富——股本结构
			this.ajax.evt.eastNum.add (LZR.bind(this, function (r, req, res, next) {
				var o = LZR.fillPro(req, "qpobj.gu.dat");
				var d = this.utJson.toObj(r);
				var i, j, k, n;
				if (d.ShareChangeList) {
					o.num = [];
					d = d.ShareChangeList;
					o = o.num;
					n = d[0].changeList.length - 1;
					for (i = 0; i <= n; i ++) {
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
						if ((i === 0) || (i === n) || (k.msg !== "定期报告")) {
							o.push (k);
						}
					}
					if (o.length > 1 && o[0].msg === "定期报告" && o[0].a === o[1].a && o[0].t === o[1].t) {
						o.shift();
					}

					o = req.qpobj.gu.dat;
					console.log (o.info.nam + " : 2. 已获取股本");
					this.ajax.qry("eastDvd", req, res, next, o.sid);
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

				o = req.qpobj.gu.dat;
				console.log (o.info.nam + " : 3. 已获取分红");
				o.sid.push("0");
				this.ajax.qry("eastMain", req, res, next, o.sid);
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

				console.log (o.info.nam + " : 4. 已获取主要指标");
				o.sid[1] = "&a=";
				this.ajax.qry("eastBlc", req, res, next, o.sid);
			}));

			// 东方财富——资产负债表
			this.ajax.evt.eastBlc.add (LZR.bind(this, function (r, req, res, next) {
				if (this.qryRun(r, req, res, next, "balance", "eastBlc", "资产负债表")) {
					// res.json(req.qpobj.gu);
					req.qpobj.gu.dat.sid[1] = "&a=";
					this.ajax.qry("eastPf", req, res, next, req.qpobj.gu.dat.sid);
				} else {
					console.log (req.qpobj.gu.dat.info.nam + " : 5. 资产负债表 - " + req.qpobj.gu.dat.sid[1]);
				}
			}));

			// 东方财富——利润表
			this.ajax.evt.eastPf.add (LZR.bind(this, function (r, req, res, next) {
				if (this.qryRun(r, req, res, next, "profit", "eastPf", "利润表")) {
					// res.json(req.qpobj.gu);
					req.qpobj.gu.dat.sid[1] = "&a=";
					this.ajax.qry("eastCash", req, res, next, req.qpobj.gu.dat.sid);
				} else {
					console.log (req.qpobj.gu.dat.info.nam + " : 6. 利润表 - " + req.qpobj.gu.dat.sid[1]);
				}
			}));

			// 东方财富——现金流量表
			this.ajax.evt.eastCash.add (LZR.bind(this, function (r, req, res, next) {
				if (this.qryRun(r, req, res, next, "cash", "eastCash", "现金流量表")) {
					// res.json(req.qpobj.gu);
					req.qpobj.gu.dat.sid[1] = "";
					this.ajax.qry("eastCop", req, res, next, req.qpobj.gu.dat.sid);
				} else {
					console.log (req.qpobj.gu.dat.info.nam + " : 7. 现金流量表 - " + req.qpobj.gu.dat.sid[1]);
				}
			}));

			// 东方财富——收入构成
			this.ajax.evt.eastCop.add (LZR.bind(this, function (r, req, res, next) {
				var i, j, d, t, o = LZR.fillPro(req, "qpobj.gu.dat");
				r = this.utJson.toObj(r);
				if (r && r.zygcfx) {
					r = r.zygcfx;
					for (i = 0; i < r.length; i ++) {
						t = this.getVal(r[i].rq, 2);
						d = o.report[t];
						if (d && d.profit) {
							d.profit.cop = {};
							d = d.profit.cop;
							if (r[i].cp) {
								d.goods = [];
								this.setCop(d.goods, r[i].cp);
							}
							if (r[i].qy) {
								d.area = [];
								this.setCop(d.area, r[i].qy);
							}
							if (r[i].hy) {
								d.industry = [];
								this.setCop(d.industry, r[i].hy);
							}
						}
					}

					console.log (o.info.nam + " : 8. 已获取收入构成");
					t = this.arrange (o);	// 数据整理
					console.log (o.info.nam + " : 9. 数据整理完毕");

					if (req.params.init) {
						o.sid[0] = o.sid[0].toLocaleLowerCase();
						o.sid[1] = 4799;
						o.sid.push(t);
						this.ajax.qry("sinaH", req, res, next, o.sid);
					} else {
						next();
					}
				} else {
					req.qpobj.gu.ok = false;
					req.qpobj.gu.msg = "收入构成 : ";
					if (r && r.message) {
						req.qpobj.gu.msg += r.message;
					} else {
						req.qpobj.gu.msg += "数据格式错误！";
					}
					next();
				}
			}));

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

			// console.log(this.getVal("-106,202.43万", 3));
		},

		// 收入构成赋值
		setCop: function (o, d) {
			for (var i = 0; i < d.length; i ++) {
				o.push({
					item: d[i].zygc,
					inc: this.getVal(d[i].zysr, 3),
					cost: this.getVal(d[i].zycb, 3),
					scl: this.getVal(d[i].lrbl, 1),
					incScl: this.getVal(d[i].srbl, 1),
					costScl: this.getVal(d[i].cbbl, 1),
					gpm: this.getVal(d[i].mll, 1)
				});
			}
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
				getTmp: {	// 获取模板
					tnam: "gub",
					funs: {
						find: [{typ:"tmp", id:"eastmoney"}, {_id:0, id:0, typ:0}],
						toArray: []
					}
				},
				addGu: {	// 添加股票基本信息
					tnam: "gub",
					funs: {
						insertMany: ["<0>"]
					}
				},
				setGu: {	// 修改信息
					tnam: "gub",
					funs: {
						update: ["<0>", "<1>"]
					}
				},
				addK: {	// 添加日线数据
					tnam: "guk",
					funs: {
						insertMany: ["<0>"]
					}
				},
				delK: {		// 删除日线数据
					tnam: "guk",
					funs: {
						deleteMany: ["<0>"]
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
					r = s.search(/[^\d\.-]/);
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

		// 保存更新
		updateSav: function (o) {
			var i, j, k, t, addo = [];
			t = this.utTim.getDayTimestamp();	// 当日时间戳

			// 记录错误信息
			k = [];
			for (i in o.err) {
				for (j in o.err[i]) {
					k.push(j + "." + j);
				}
			}
			if (k.length) {
				addo.push({
					typ: "error",
					id: o.id,
					tim: t,
					msg: k
				});
			}

			// 股本
			for (i = o.num.length - 1; i >= 0; i --) {
				if (o.num[i].tim > o.info.numTim) {
					addo.push(o.num[i]);
				}
			}
			k = o.num[0];
			if (o.info.numTim < k.tim) {
				o.info.numTim = k.tim;
				o.info.num = k.t;
				o.info.numA = k.a;
			}

			// 分红
			for (i = o.dvd.length - 1; i >= 0; i --) {
				if (o.dvd[i].tim > o.info.dvdTim) {
					addo.push(o.dvd[i]);
				}
			}
			k = o.dvd[0];
			if ((k.tim > o.info.dvdTim) && (k.regTim === 0 || k.regTim > t)) {
				o.info.dvdTim = k.tim;
				o.info.dvd = {
					cn: k.cn
				};
				if (k.gift) {
					o.info.dvd.gift = k.gift;
				}
				if (k.transfer) {
					o.info.dvd.transfer = k.transfer;
				}
				if (k.dividend) {
					o.info.dvd.dividend = k.dividend;
				}
				if (k.dt) {
					o.info.dvd.dt = k.dt;
				}
			} else {
				o.info.dvd = null;
				o.info.dvdTim = 0;
			}

			// 年报
			if (o.report) {
				for (i in o.report) {
					addo.push(o.report[i]);
				}
			}

			if (addo.length) {
				this.db.mdb.qry("addGu", null, null, null, [addo]);
				this.db.mdb.qry("setGu", null, null, null, [{typ:"info", id:o.id}, {"$set": o.info}]);
			}

			// 日线
			if (o.k) {
				this.db.mdb.qry("addK", null, null, null, [o.k]);
			}
		},

		// 结束更新
		updateEnd: function (req, res, next) {
			var o = LZR.fillPro(req, "qpobj.gu");
			if (o.ok) {
				// res.json(o);
				// return;
				this.updateSav(o.dat);
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

		// 获取所属交易所
		getEc: function (id) {
			return id[0] === "6" ? "sh" : "sz";
		},

		// 更新获取基础数据
		updateGetInfo: function (req, res, next) {
			LZR.fillPro(req, "qpobj").gu = this.clsR.get({
				id: req.params.id,
				sid: [this.getEc(req.params.id) + req.params.id]
			});
			if (this.tmp) {
				if (req.params.init) {
					this.ajax.qry("sinaK", req, res, next, req.qpobj.gu.dat.sid);
				} else {
					this.db.get(req, res, next,
						{typ: "info", id: req.params.id},
						{_id:0, nam:1, eps:1, num:1, numA:1, numTim:1, dvdTim:1, rpTim:1, days:1, daye:1},
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
					o.dat.info.ec = o.dat.sid[0].substr(0, 2);
					o = o.dat.info;
					o.eps = 0;
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

				o = req.qpobj.gu.dat;
				console.log (o.info.nam + " : 1. 已获取基础数据");
				o.sid[0] = o.sid[0].toLocaleUpperCase();
				this.ajax.qry("eastNum", req, res, next, o.sid);
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
tools.utGu.init(r, tools.tmpRo, tools.qryRo);

/**************** 模板 **********************/

r.get("/qry_mgInfo/", function (req, res, next) {
	var o = LZR.fillPro(req, "qpobj.tmpo.qry");
	o.k = "id";
	o.cond = "{\"typ\":\"info\"}";
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
tools.utGu.initDb(tools.qryRo.db);

tools.tmpRo.initTmp("/", "tmp", tools.tmpTools);

/********************************/

r.use("*", function (req, res, next) {
	console.log(req.originalUrl);
	res.send("---");
});

module.exports = r;
