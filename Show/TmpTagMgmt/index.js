// 温度标签测试模块
var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Router",
	"LZR.Base.Json",
	// "LZR.Pro.TmpTagMgmt",
	"LZR.Node.Router.ComTmp"
]);

// 创建路由
var r = new LZR.Node.Router ({
	path: curPath
});

// 需要用到的工具
var tools = {
	utJson: LZR.getSingleton(LZR.Base.Json),
	// infTtm: new LZR.Pro.TmpTagMgmt (),		// 后台接口
	tmpRo: new LZR.Node.Router.ComTmp({		// 常用模板
		ro: r
	}),
	devs: {		// 测试数据
		a01: {
			nam: "大型设备",
			num: "EXP_C_001",
			stat: true,
			tags: {
				t001: {
					nam: "TAG_B1",
					cur: 35.7,
					stat: true
				},
				t002: {
					nam: "TAG_A",
					cur: 68,
					stat: true
				},
				t003: {
					nam: "TAG_B",
					cur: 37.3,
					stat: true
				},
				t004: {
					nam: "TAG_AB",
					cur: 55.7,
					stat: true
				},
				t008: {
					nam: "TAG_C",
					cur: 66.6,
					stat: true
				}
			}
		},
		a02: {
			nam: "中型设备",
			num: "EXP_B_001",
			stat: true,
			tags: {
				t001: {
					nam: "TAG_B1",
					cur: 35.7,
					stat: true
				},
				t002: {
					nam: "TAG_A",
					cur: 68,
					stat: true
				},
				t003: {
					nam: "TAG_B",
					cur: 37.3,
					stat: true
				},
				t004: {
					nam: "TAG_AB",
					cur: 55.7,
					stat: true
				},
				t008: {
					nam: "TAG_C",
					cur: 66.6,
					stat: true
				}
			}
		},
		a03: {
			nam: "小型设备",
			num: "EXP_A_001",
			stat: true,
			tags: {
				t001: {
					nam: "TAG_B1",
					cur: 35.7,
					stat: true
				},
				t002: {
					nam: "TAG_A",
					cur: 68,
					stat: true
				},
				t003: {
					nam: "TAG_B",
					cur: 37.3,
					stat: true
				},
				t004: {
					nam: "TAG_AB",
					cur: 55.7,
					stat: true
				},
				t008: {
					nam: "TAG_C",
					cur: 66.6,
					stat: true
				}
			}
		},
		a04: {
			nam: "大型设备",
			num: "EXP_C_002",
			stat: false,
			tags: {
				t001: {
					nam: "TAG_B1",
					cur: 35.7,
					stat: true
				},
				t002: {
					nam: "TAG_A",
					cur: 83.6,
					stat: false
				},
				t003: {
					nam: "TAG_B",
					cur: 37.3,
					stat: true
				},
				t004: {
					nam: "TAG_AB",
					cur: 55.7,
					stat: true
				},
				t008: {
					nam: "TAG_C",
					cur: 66.6,
					stat: true
				}
			}
		},
		a05: {
			nam: "大型设备",
			num: "EXP_C_003",
			stat: true,
			tags: {
				t001: {
					nam: "TAG_B1",
					cur: 35.7,
					stat: true
				},
				t002: {
					nam: "TAG_A",
					cur: 68,
					stat: true
				},
				t003: {
					nam: "TAG_B",
					cur: 37.3,
					stat: true
				},
				t004: {
					nam: "TAG_AB",
					cur: 55.7,
					stat: true
				},
				t008: {
					nam: "TAG_C",
					cur: 66.6,
					stat: true
				}
			}
		},
		a06: {
			nam: "小设备",
			num: "EXP_AA_001",
			stat: true,
			tags: {
				t001: {
					nam: "TAG_B1",
					cur: 35.7,
					stat: true
				},
				t002: {
					nam: "TAG_A",
					cur: 68,
					stat: true
				},
				t003: {
					nam: "TAG_B",
					cur: 37.3,
					stat: true
				},
				t004: {
					nam: "TAG_AB",
					cur: 55.7,
					stat: true
				},
				t008: {
					nam: "TAG_C",
					cur: 66.6,
					stat: true
				}
			}
		},
		a07: {
			nam: "中型设备",
			num: "EXP_B_007",
			stat: false,
			tags: {
				t001: {
					nam: "TAG_B1",
					cur: 35.7,
					stat: true
				},
				t002: {
					nam: "TAG_A",
					cur: 68,
					stat: true
				},
				t003: {
					nam: "TAG_B",
					cur: 97.3,
					stat: false
				},
				t004: {
					nam: "TAG_AB",
					cur: 85.7,
					stat: false
				},
				t008: {
					nam: "TAG_C",
					cur: 66.6,
					stat: true
				}
			}
		},
		a08: {
			nam: "中型设备",
			num: "EXP_B_003",
			stat: true,
			tags: {
				t001: {
					nam: "TAG_B1",
					cur: 35.7,
					stat: true
				},
				t002: {
					nam: "TAG_A",
					cur: 68,
					stat: true
				},
				t003: {
					nam: "TAG_B",
					cur: 37.3,
					stat: true
				},
				t004: {
					nam: "TAG_AB",
					cur: 55.7,
					stat: true
				},
				t008: {
					nam: "TAG_C",
					cur: 66.6,
					stat: true
				}
			}
		},
		a13: {
			nam: "小型设备",
			num: "EXP_A_011",
			stat: true,
			tags: {
				t001: {
					nam: "TAG_B1",
					cur: 35.7,
					stat: true
				},
				t002: {
					nam: "TAG_A",
					cur: 68,
					stat: true
				},
				t003: {
					nam: "TAG_B",
					cur: 37.3,
					stat: true
				},
				t004: {
					nam: "TAG_AB",
					cur: 55.7,
					stat: true
				},
				t008: {
					nam: "TAG_C",
					cur: 66.6,
					stat: true
				}
			}
		}
	},

	// 设备集合测试数据
	devsTest: function (keyword, isodd) {
		var o = {
			keyword: keyword,
			isodd: isodd,
			devs: {}
		};

		// 条件检索
		for (var s in tools.devs) {
			var b = !isodd || (isodd && !tools.devs[s].stat);
			if (b && keyword) {
				b = (
					(tools.devs[s].nam.indexOf(keyword) !== -1) ||
					(tools.devs[s].num.indexOf(keyword) !== -1)
				);
			}
			if (b) {
				o.devs[s] = tools.devs[s];
			}
		}
		return o;
	},

	// 设备详情测试数据
	devTest: function (id) {
		var o = tools.devs[id];
		if (o && !o.id) {
			o.id = id;
		}
		return o;
	},

	// 标签详情测试数据
	tagTest: function (did, id, hour) {
		var d = tools.devs[did];
		if (!d) {
			return {};
		}
		var t = d.tags[id];
		if (!t) {
			return {};
		}
		var o = {
			nam: t.nam,
			max: 80,
			min: 20,
			epc: "XXXXX-XXX",
			tid: "XXX XXX XXX",
			devId: did,
			devNam: d.nam,
			// cur: 35.7,
			// tim: 1486539000,	// 时间戳 "2017-2-8 15:30:00"
			// stat: true,
			// logs: {}
		};

		// 生成随机温度值
		var et = Math.floor(new Date().valueOf()/1000);
		var t = et - 300 * 12 * hour;
		var lg = {};
		for (; t <= et; t += 300) {
			lg[t] = Math.floor(Math.random() * 900)/10 + 5;
		}
		o.logs = tools.utJson.toJson(lg);
		o.tim = et;
		o.cur = lg[et];
		o.stat = (o.cur >= o.min && o.cur <= o.max);

		return o;
	}

};

// 首页跳转
r.get("/", function (req, res) {
	// res.send("999");
	res.redirect("./devBrowse/");
});

// 浏览设备
r.get("/devBrowse/:odd?/:keyword?", function (req, res, next) {
	req.qpobj = tools.devsTest(req.params.keyword, (req.params.odd === "true"));	// 测试数据
	next();

	// tools.infTtm.getDevs(req.params.keyword, req.params.odd, req, res, next);
});

// 设备详情
r.get("/devInfo/:devId?", function (req, res, next) {
	req.qpobj = tools.devTest(req.params.devId);	// 测试数据
	next();

	// tools.infTtm.getDevInfo(req.params.devId, req, res, next);
});

// 标签详情
r.get("/tagInfo/:devId?/:tagId?/:tim?", function (req, res, next) {
	req.qpobj = tools.tagTest(req.params.devId, req.params.tagId, req.params.tim - 0);	// 测试数据
	next();

	// tools.infTtm.getTag(req.params.tagId, req.params.tim, req, res, next);
});

// 初始化模板
tools.tmpRo.initTmp("/", "tmp");

module.exports = r;
