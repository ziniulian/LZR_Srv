// RFID模拟器

function init () {
	var s, d;
	for (s in dat.testData) {
		d = document.createElement("div");
		d.innerHTML = dat.testData[s].html;
		d.className = "scdBtn";
		d.setAttribute("epc", s);
		d.onclick = function() {
			dat.send(this.getAttribute("epc"));
		};
		tagSecDom.appendChild(d);
	}
}

var dat = {
	testData: {		// 测试数据
		"SJSJTX00000000201811260001": {
			html: "计算机1",
			dbm: "SJSJTX00000000201811260001",
			sbname: "计算机",	// 名称
			serialNumber: "651a6s4df19gda",	// 序列号
			brandname: "联想",	// 品牌
			ggxhname: "i5/8G",	// 型号
			zyidname: "通信专业",	// 分类
			saveStatename: "全新",	//	成色
			state: "003",	// 状态：（001：待入库，002：入库，003：出库）
			log: [
				{
					state: "003",	// 出库
					lyrname: "小黑",	// 领用人
					lytime: "2018-12-06 05:15:11",		// 领用时间
				},
				{
					state: "002",	// 入库
					lyrname: "小强",	// 入库人
					rktime: "2018-11-26 05:15:11",		// 入库时间
				}
			]
		},
		"SJSJDH00000000201811270002": {
			html: "计算机2",
			dbm: "SJSJDH00000000201811270002",
			sbname: "计算机",
			serialNumber: "19s1dg8",
			brandname: "Dell/戴尔",
			ggxhname: "i5/8G",
			zyidname: "导航专业",
			saveStatename: "全新",
			state: "001",
			log: []
		},
		"SBJGJS00000000201811280001": {
			html: "亮度计1",
			dbm: "SBJGJS00000000201811280001",
			sbname: "背景光亮度计",
			serialNumber: "a6a6sd18e",
			brandname: "Radiant Zema",
			ggxhname: "PM-I",
			zyidname: "监视专业",
			saveStatename: "全新",
			state: "002",
			log: [
				{
					state: "002",
					lyrname: "小白",
					rktime: "2018-11-28 01:01:00",
				}
			]
		},
		"SBJGJS00000000201811290002": {
			html: "亮度计2",
			dbm: "SBJGJS00000000201811290002",
			sbname: "背景光亮度计",
			serialNumber: "1bghmy112316",
			brandname: "Radiant Zema",
			ggxhname: "PM-I",
			zyidname: "监视专业",
			saveStatename: "完好",
			state: "001",
			log: []
		},
		"SBJGJS00000000201811300003": {
			html: "亮度计3",
			dbm: "SBJGJS00000000201811300003",
			sbname: "背景光亮度计",
			serialNumber: "cvb156131894",
			brandname: "美能达",
			ggxhname: "PM-I",
			zyidname: "监视专业",
			saveStatename: "全新",
			state: "001",
			log: []
		},
		"SYGYQX00000000201812010001": {
			html: "云高仪1",
			dbm: "SYGYQX00000000201812010001",
			sbname: "云高仪接收机",
			serialNumber: "yd119165ze",
			brandname: "Vaisala",
			ggxhname: "CL51",
			zyidname: "气象专业",
			saveStatename: "全新",
			state: "001",
			log: []
		},
		"SYGYQX00000000201812010002": {
			html: "云高仪2",
			dbm: "SYGYQX00000000201812010002",
			sbname: "云高仪接收机",
			serialNumber: "651asfad10015",
			brandname: "Vaisala",
			ggxhname: "CL51",
			zyidname: "气象专业",
			saveStatename: "全新",
			state: "001",
			log: []
		},
		"SYGYQX00000000201812010003": {
			html: "云高仪3",
			dbm: "SYGYQX00000000201812010003",
			sbname: "云高仪接收机",
			serialNumber: "15260000sadf00",
			brandname: "Vaisala",
			ggxhname: "CL31",
			zyidname: "气象专业",
			saveStatename: "全新",
			state: "001",
			log: []
		},
		"SCLYDH00000000201812020001": {
			html: "测量仪1",
			dbm: "SCLYDH00000000201812020001",
			sbname: "测量仪AAB",
			serialNumber: "abb*494561s61d8",
			brandname: "基恩士",
			ggxhname: "IM65198",
			zyidname: "导航专业",
			saveStatename: "全新",
			state: "001",
			log: []
		},
		"SCLYQX00000000201812030002": {
			html: "测量仪2",
			dbm: "SCLYQX00000000201812030002",
			sbname: "测量仪AAB",
			serialNumber: "l619s411ba054197w",
			brandname: "基恩士",
			ggxhname: "IM65198",
			zyidname: "气象专业",
			saveStatename: "全新",
			state: "001",
			log: []
		},
		"XJSJXX01001008201811110001": {
			html: "包装箱1"
		},
		"XYGYXX05002003201812120002": {
			html: "包装箱2"
		}
	},

	tmp: [],	// RFID 缓存

	open: function () {
		scanBtnDom.disabled = "";
		closeBtnDom.disabled = "";
		backBtnDom.disabled = "";
		openBtnDom.disabled = "disabled";
		frmDom.src="s01/transition.html";
	},
	close: function () {
		dat.stop();
		scanBtnDom.disabled = "disabled";
		closeBtnDom.disabled = "disabled";
		backBtnDom.disabled = "disabled";
		openBtnDom.disabled = "";
		frmDom.src="../../rfidSimulatorEnd.html";
	},
	scan: function () {
		switch (frmo.window.document.title) {
			case "Qry":
			case "WhIn":
			case "WhOut":
			case "Pan":
				scanBtnDom.disabled = "disabled";
				stopBtnDom.disabled = "";
				tagSecDom.className = "";

				frmo.window.rfid.scan();
				break;
		}
	},
	stop: function () {
		scanBtnDom.disabled = "";
		stopBtnDom.disabled = "disabled";
		tagSecDom.className = "Lc_nosee";

		if (frmo.window.rfid) {
			frmo.window.rfid.stop();
		}
	},
	back: function () {
		dat.stop();
		frmo.window.dat.back();
	},
	send: function (id) {
		dat.tmp.push({
			epc: id,
			tim: 1
		});
	},
	catchScanning: function () {
		var r = JSON.stringify(dat.tmp);
		dat.tmp = [];
		return r;
	},

/************** 数据库 ****************/
	db: {	// 数据
		kv: {},	// 键值对
		namKv: {	// 设备名称数据字典
			"JSJ": "计算机",
			"YGY": "云高仪接收机",
			"BJG": "背景光亮度计",
			"CLY": "测量仪AAB"
		},
		clsKv: {	// 分类数据字典
			"JS00000000": "监视专业",
			"TX00000000": "通信专业",
			"DH00000000": "导航专业",
			"QX00000000": "气象专业"
		},
		users: [	// 用户集合
			{
				"syscode": "adm",
				"syspwd": "111",
				"sysroid": "sys00000000000000000000000000001",
				"sysuerid": "sysuser0000000000000000000000001",
				"sysname": "超级管理员",
				"state": "001"
			},
			{
				"syscode": "xb",
				"syspwd": "111",
				"sysroid": "sys00000000000000000000000000002",
				"sysuerid": "sysuser0000000000000000000000002",
				"sysname": "小白",
				"state": "001"
			},
			{
				"syscode": "xh",
				"syspwd": "111",
				"sysroid": "sys00000000000000000000000000003",
				"sysuerid": "sysuser0000000000000000000000003",
				"sysname": "小黑",
				"state": "001"
			},
			{
				"syscode": "xq",
				"syspwd": "111",
				"sysroid": "sys00000000000000000000000000004",
				"sysuerid": "sysuser0000000000000000000000004",
				"sysname": "小强",
				"state": "001"
			}
		],
		rk: {	// 入库单
			"in0001": {
				"squseridname": "小强",
				"bh": "入库单_全部",
				"creattime": "2018-12-02 22:58:49",
				info: [
					"SJSJTX00000000201811260001",
					"SJSJDH00000000201811270002",
					"SBJGJS00000000201811280001",
					"SBJGJS00000000201811290002",
					"SBJGJS00000000201811300003",
					"SYGYQX00000000201812010001",
					"SYGYQX00000000201812010002",
					"SYGYQX00000000201812010003",
					"SCLYDH00000000201812020001",
					"SCLYQX00000000201812030002"
				]
			}
		},
		ck: {	// 出库单
			"out0003": {
				"squseridname": "小白",
				"bh": "出库_计算机+云高仪",
				"creattime": "2018-12-05 10:11:19",
				info: {
					"SJSJDH00000000201811270002": 1,
					"SYGYQX00000000201812010001": 1
				},
				isck:[]
			},
			"out0007": {
				"squseridname": "小黑",
				"bh": "出库_亮度计+测量仪",
				"creattime": "2018-12-08 00:00:00",
				info: {
					"SBJGJS00000000201811280001" : 2,
					"SCLYDH00000000201812020001" : 1
				},
				isck:[]
			}
		}
	},

	// 用户登录
	login: function (u, p) {
		var i, o, r = {ok: false, error: ""};
		for (i = 0; i < dat.db.users.length; i ++) {
			o = dat.db.users[i];
			if (o.syscode === u && o.syspwd === p) {
				r.ok = true;
				dat.db.kv.userNam = o.sysname;
				r.SYSUSER = [o];
				break;
			}
		}
		return r;
	},

	// 获取设备信息
	getDev: function (id) {
		var i, o, r = {ok: false, error: ""};
		o = dat.testData[id];
		if (o) {
			r.ok = true;
			r.DEVICE = [{
				dbm: o.dbm,
				sbname: o.sbname,
				serialNumber: o.serialNumber,
				brandname: o.brandname,
				ggxhname: o.ggxhname,
				zyidname: o.zyidname,
				saveStatename: o.saveStatename,
				state: o.state
			}];
			if (o.log.length) {
				for (i = 0; i < o.log.length; i ++) {
					if (i) {
						r.DEVICE[i] = {};
					}
					r.DEVICE[i].state = o.log[i].state;
					r.DEVICE[i].lyrname = o.log[i].lyrname;
					if (o.log[i].lytime) {
						r.DEVICE[i].lytime = o.log[i].lytime;
					} else {
						r.DEVICE[i].rktime = o.log[i].rktime;
					}
				}
			}
		}
		return r;
	},

	// 获取入(/出)库单集合
	getRkList: function (ck) {
		var s, d, o, r = [];
		if (ck) {
			d = dat.db.ck;
		} else {
			d = dat.db.rk;
		}
		for (s in d) {
			o = d[s];
			r.push ({
				infoid: s,	// 入库单ID
				outWeInfoid: s,		// 出库单ID
				squseridname: o.squseridname,
				bh: o.bh,
				creattime: o.creattime,
			});
		}
		return r;
	},

	// 获取入库单明细
	getRkInfo: function (id) {
		var i, o, d, r = [];
		o = dat.db.rk[id];
		if (o) {
			o = o.info;
			for (i = 0; i < o.length; i ++) {
				d = dat.testData[o[i]];
				r.push ({
					dbm: d.dbm,
					sbidname: d.sbname,
					serialNumber: d.serialNumber,
					supplieridname: d.brandname,
					ggidname: d.ggxhname,
					zyidname: d.zyidname,
					isrk: d.state
				});
			}
		}
		return r;
	},

	// 入库保存
	savRk: function (dbm) {
		var d = dat.testData[dbm], r = false;
		if (d.state !== "002") {
			d.state = "002";
			d.log.unshift({
				state: "002",	// 入库
				lyrname: dat.db.kv.userNam,	// 入库人
				rktime: dat.getTim()	// 入库时间
			});
			r = true;

			// 保证模拟器的出入库功能可循环测试
			if (d.ckid) {
				dat.db.ck[d.ckid[0]].isck.splice(d.ckid[1], 1);
				d.ckid = false;
			}
		}
		return r;
	},

	// 获取出库单明细
	getCkInfo: function (id) {
		var s, o, d, r = [];
		o = dat.db.ck[id];
		if (o) {
			o = o.info;
			for (s in o) {
				d = dat.testData[s];
				r.push ({
					sbidname: d.sbname,
					ename: s.substring(1, 4),
					zyidname: d.zyidname,
					zyid: s.substring(4, 14),
					ggidname: d.ggxhname,
					supplieridname: d.brandname,
					countno: o[s]
				});
			}
		}
		return r;
	},

	// 获取已出库明细
	getIsCkInfo: function (id) {
		var i, o, d, r = [];
		o = dat.db.ck[id];
		if (o) {
			o = o.isck;
			for (i = 0; i < o.length; i ++) {
				d = dat.testData[o[i]];
				r.push ({
					dbm: d.dbm,
					sbidname: d.sbname,
					serialNumber: d.serialNumber,
					supplieridname: d.brandname,
					ggidname: d.ggxhname,
					zyidname: d.zyidname
				});
			}
		}
		return r;
	},

	// 出库保存
	savCk: function (id, dbm) {
		var d = dat.testData[dbm], r = false;
		if (d.state === "002") {
			d.state = "003";
			d.log.unshift({
				state: "003",	// 领用
				lyrname: dat.db.kv.userNam,	// 领用人
				lytime: dat.getTim()	// 领用时间
			});
			dat.db.ck[id].isck.push(dbm);

			// 保证模拟器的出入库功能可循环测试
			d.ckid = [id, dat.db.ck[id].isck.length - 1];
		} else if (d.state === "003") {
			r = "该设备已出库！";
		} else {
			r = "该设备尚未入库！";
		}
		return r;
	},

/************** 工具 ****************/
	getTim: function () {
		var t, d = new Date();
		var s = d.getFullYear();
		s += "-";
		t = d.getMonth() + 1;
		if (t < 10) s += "0";
		s += t;
		s += "-";
		t = d.getDate();
		if (t < 10) s += "0";
		s += t;
		s += " ";
		t = d.getHours();
		if (t < 10) s += "0";
		s += t;
		s += ":";
		t = d.getMinutes();
		if (t < 10) s += "0";
		s += t;
		s += ":";
		t = d.getSeconds();
		if (t < 10) s += "0";
		s += t;
		return s;
	}
};
