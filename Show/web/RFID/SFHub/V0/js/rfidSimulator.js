// RFID模拟器

function init () {}

var dat = {
	testData: {		// 测试数据
		"979000050201_0001": {
			qr:"M,979000050201,0001",
			typ: "M",
			cod: "979000050201",	// 物料编码
			nam: "螺丝",	// 物料名称
			PartSort: "⌀6.2*12",	// 规格型号
			codF: "M6",	// 主机厂编码
			bn: "0001",	// 批次号
			num: 0,	// 数量
			codL: ""	// 库位
		},
		"9999_001": {
			qr:"M,9999,001",
			typ: "M",
			cod: "9999",	// 物料编码
			nam: "垫片",	// 物料名称
			PartSort: "⌀8",	// 规格型号
			codF: "P8",	// 主机厂编码
			bn: "001",	// 批次号
			num: 3,	// 数量
			codL: "B01-1-1-1"	// 库位
		},
		"9999_002": {
			qr:"M,9999,002",
			typ: "M",
			cod: "9999",	// 物料编码
			nam: "垫片",	// 物料名称
			PartSort: "⌀8",	// 规格型号
			codF: "P8",	// 主机厂编码
			bn: "002",	// 批次号
			num: 2,	// 数量
			codL: "B01-1-1-2"	// 库位
		},
		"08170617_101": {
			qr:"M,08170617,101",
			typ: "M",
			cod: "08170617",	// 物料编码
			nam: "螺母",	// 物料名称
			PartSort: "⌀12",	// 规格型号
			codF: "Q12",	// 主机厂编码
			bn: "101",	// 批次号
			num: 0,	// 数量
			codL: ""	// 库位
		},
		"9596_222": {
			qr:"M,9596,222",
			typ: "M",
			cod: "9596",	// 物料编码
			nam: "套管",	// 物料名称
			PartSort: "中型",	// 规格型号
			codF: "T03",	// 主机厂编码
			bn: "222",	// 批次号
			num: 0,	// 数量
			codL: ""	// 库位
		},
		"334_123": {
			qr:"M,334,123",
			typ: "M",
			cod: "334",	// 物料编码
			nam: "大螺丝",	// 物料名称
			PartSort: "⌀15*20",	// 规格型号
			codF: "M15",	// 主机厂编码
			bn: "123",	// 批次号
			num: 0,	// 数量
			codL: ""	// 库位
		},
		"B01-1-1-1": {qr:"L,B01-1-1-1"},
		"B01-1-1-2": {qr:"L,B01-1-1-2"},
		"B01-1-1-3": {qr:"L,B01-1-1-3"}
	},

	open: function () {
		scanBtnDom.disabled = "";
		closeBtnDom.disabled = "";
		backBtnDom.disabled = "";
		openBtnDom.disabled = "disabled";
		frmDom.src="s01/signIn.html";
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
			case "WhIn":
			case "WhOut":
			case "WhQry":
			case "WhQryRd":
			case "WhInRd":
			case "WhOutRd":
			case "WhPan":
				scanBtnDom.disabled = "disabled";
				stopBtnDom.disabled = "";
				sendBtnDom.disabled = "";
				tagSecDom.disabled = "";
				break;
		}
	},
	stop: function () {
		scanBtnDom.disabled = "";
		stopBtnDom.disabled = "disabled";
		sendBtnDom.disabled = "disabled";
		tagSecDom.disabled = "disabled";
	},
	back: function () {
		dat.stop();
		frmo.window.dat.back();
	},
	send: function () {
		var o = dat.testData[tagSecDom.value];
		frmo.window.qr.hdScan(o.qr);
		dat.stop();
	},

/************** 数据库 ****************/
	db: {	// 数据
		kv: {}	// 键值对
	},

	qryLocDtl: function (codL) {
		var o, s, r = [];
		for (s in dat.testData) {
			o = dat.testData[s];
			if (o.codL === codL) {
				r.push(o);
			}
		}
		return r;
	}

/************** 特殊功能 ****************/

};
