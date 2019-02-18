// RFID模拟器

/*
	改模拟器步骤：
		1. 将 img 文件夹移到 临时图库里
		2. 所有原 html 文件中载入 rfidSimulatorInf.js
		3. 添加 index.html 、 rfidSimulatorEnd.html 、 js/rfidSimulator.js 、 js/rfidSimulatorInf.js 、 css/rfidSimulator.css 文件
		4. 检查所有 html 和 js 文件 ， 将 ontouch事件 改为 onclick事件 + :hover样式
*/

function init () {}

var dat = {
	testData: {		// 测试数据
		T: {"cod":"TC50   400000211A12C","pro":{"src":"T","nam":"路用货车"},"typ":{"src":"C","nam":"敞车"},"mod":"50","num":"4000002","lng":"11","fac":{"src":"A","nam":"中国北车集团齐齐哈尔铁路车辆","snam":"齐厂"},"tim":{"src":"12C","nam":"2012年12月"}},
		Q: {"cod":"!C64K  Q06505812A94C","pro":{"src":"Q","nam":"企业自备车"},"typ":{"src":"C","nam":"敞车"},"mod":"64K","num":"Q065058","lng":"12","fac":{"src":"A","nam":"中国北车集团齐齐哈尔铁路车辆","snam":"齐厂"},"tim":{"src":"94C","nam":"1994年12月"}},
		K: {"cod":"KYW25T 677083E073 066","pro":{"src":"K","nam":"客车"},"typ":{"src":"YW","nam":"硬卧车"},"mod":"25T","num":"677083","fac":{"src":"E","nam":"长春轨道客车股份有限公司","snam":"长客厂"},"tim":{"src":"073","nam":"2007年03月"},"pot":" ","cap":"66"},
		J: {"cod":"J10489001401AH  TK88188 ","pro":{"src":"J","nam":"机车"},"mod":{"src":"104","nam":"DF4"},"num":"8900","ju":{"src":"14","nam":"乌鲁木齐局"},"suo":{"src":"01","nam":"哈密"},"sta":"A","kh":"H","tnoLet":"TK","tnoNum":"88188","pot":" "},
		D: {"cod":"D3010000002101   G12345B","pro":{"src":"D","nam":"动车"},"mod":{"src":"301","nam":"CRH1A"},"num":"000000","ju":{"src":"21","nam":"哈尔滨局"},"suo":{"src":"01","nam":"三棵树车辆段"},"tnoLet":"G","tnoNum":"12345","pot":"B"},
		X: {"cod":"XXX","pro":{"src":"?", "nam":"标签类型不符"}}
	},

	open: function () {
		scanBtnDom.disabled = "";
		closeBtnDom.disabled = "";
		backBtnDom.disabled = "";
		openBtnDom.disabled = "disabled";
		frmDom.src="transition.html";
	},
	close: function () {
		dat.stop();
		scanBtnDom.disabled = "disabled";
		closeBtnDom.disabled = "disabled";
		backBtnDom.disabled = "disabled";
		openBtnDom.disabled = "";
		frmDom.src="rfidSimulatorEnd.html";
	},
	scan: function () {
		switch (frmo.window.document.title) {
			case "Read":
				scanBtnDom.disabled = "disabled";
				stopBtnDom.disabled = "";
				sendBtnDom.disabled = "";
				tagSecDom.disabled = "";
				frmo.window.dat.reading();
				break;
			case "Info":
				frmDom.src="read.html?read=1";
				break;
		}
	},
	stop: function () {
		scanBtnDom.disabled = "";
		stopBtnDom.disabled = "disabled";
		sendBtnDom.disabled = "disabled";
		tagSecDom.disabled = "disabled";

		if (frmo.window.document.title === "Read") {
			frmo.window.dat.readNull();
		}
	},
	back: function () {
		frmo.window.dat.back();
	},
	send: function () {
		var o = dat.testData[tagSecDom.value];
		console.log(o);
		frmo.window.rfid.hdRead(o);
		dat.stop();
	},

/************** 数据库 ****************/
	db: [],
	dbc: 0,

/************** 特殊功能 ****************/
	fl: false	// 手电筒
};
