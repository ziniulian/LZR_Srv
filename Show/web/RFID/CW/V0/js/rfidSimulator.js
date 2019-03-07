// RFID模拟器

/*
	改模拟器步骤：
		1. 将 img 文件夹移到 临时图库里
		2. 所有原 html 文件中载入 rfidSimulatorInf.js
		3. 添加 index.html 、 js/rfidSimulator.js 、 js/rfidSimulatorInf.js 、 css/rfidSimulator.css 文件
		4. 检查所有 html 和 js 文件 ， 将 ontouch事件 改为 onclick事件 + :hover样式
*/

function init () {}

var dat = {
	open: function () {
		closeBtnDom.disabled = "";
		backBtnDom.disabled = "";
		tagSecDom.className = "";
		openBtnDom.disabled = "disabled";
		frmDom.src="home.html";
	},
	close: function () {
		dat.stop();
		closeBtnDom.disabled = "disabled";
		backBtnDom.disabled = "disabled";
		tagSecDom.className = "Lc_nosee";
		openBtnDom.disabled = "";
		frmDom.src="../../rfidSimulatorEnd.html";
	},
	scan: function () {
		switch (frmo.window.document.title) {
			case "Home":
				frmo.window.rfid.scan();
				break;
		}
	},
	stop: function () {
		if (frmo.window.rfid) {
			frmo.window.rfid.stop();
		}
	},
	back: function () {
		// dat.stop();
		// frmo.window.dat.back();
		switch (frmo.window.document.title) {
			case "Home":
				dat.close();
				break;
			default:
				frmo.window.history.back();
				break;
		}
	},
	send: function (id) {},
	catchScanning: function () {
		var i, r = [];
		var ns = tagSecDom.childNodes;
		for (i = 0; i < ns.length; i ++) {
			if (ns[i].value) {
				r.push ({
					tid: "E281CA002000000000100" + ns[i].id.substring(1, 4),
					tmp: ns[i].value - 0
				})
			}
		}
		return JSON.stringify(r);
	},

/************** 数据库 ****************/
	db: {
		kv: {
			timf:"1000",	// 刷新间隔（毫秒）
			timp:"100",		// 扫描间隔（毫秒）
			timout:"30000",	// 读取超时（毫秒）
			tempL:"40.0",	// 温度下限 40 （包含）	安全温度
			tempH:"70.0",	// 温度上限 70 （不包含）	警告温度
			tb:{
				"E281CA002000000000100001":{nam:"DZ1_U_I"},
				"E281CA002000000000100002":{nam:"DZ1_U_O"},
				"E281CA002000000000100003":{nam:"DZ1_V_I"},
				"E281CA002000000000100004":{nam:"DZ1_V_O"},
				"E281CA002000000000100005":{nam:"DZ1_W_I"},
				"E281CA002000000000100006":{nam:"DZ1_W_O"},
				"E281CA002000000000100007":{nam:"DZ2_U_I"},
				"E281CA002000000000100008":{nam:"DZ2_U_O"},
				"E281CA002000000000100009":{nam:"DZ2_V_I"},
				"E281CA002000000000100010":{nam:"DZ2_V_O"},
				"E281CA002000000000100011":{nam:"DZ2_W_I"},
				"E281CA002000000000100012":{nam:"DZ2_W_O"},
				"E281CA002000000000100013":{nam:"DZ3_U_I"},
				"E281CA002000000000100014":{nam:"DZ3_U_O"},
				"E281CA002000000000100015":{nam:"DZ3_V_I"},
				"E281CA002000000000100016":{nam:"DZ3_V_O"},
				"E281CA002000000000100017":{nam:"DZ3_W_I"},
				"E281CA002000000000100018":{nam:"DZ3_W_O"},
				"E281CA002000000000100019":{nam:"DZ4_U_I"},
				"E281CA002000000000100020":{nam:"DZ4_U_O"},
				"E281CA002000000000100021":{nam:"DZ4_V_I"},
				"E281CA002000000000100022":{nam:"DZ4_V_O"},
				"E281CA002000000000100023":{nam:"DZ4_W_I"},
				"E281CA002000000000100024":{nam:"DZ4_W_O"},
				"E281CA002000000000100025":{nam:"DZ5_U_I"},
				"E281CA002000000000100026":{nam:"DZ5_U_O"},
				"E281CA002000000000100027":{nam:"DZ5_V_I"},
				"E281CA002000000000100028":{nam:"DZ5_V_O"},
				"E281CA002000000000100029":{nam:"DZ5_W_I"},
				"E281CA002000000000100030":{nam:"DZ5_W_O"},
				"E281CA002000000000100031":{nam:"Q1_U_I"},
				"E281CA002000000000100032":{nam:"Q1_U_O"},
				"E281CA002000000000100033":{nam:"Q1_V_I"},
				"E281CA002000000000100034":{nam:"Q1_V_O"},
				"E281CA002000000000100035":{nam:"Q1_W_I"},
				"E281CA002000000000100036":{nam:"Q1_W_O"},
				"E281CA002000000000100037":{nam:"Q2_U_I"},
				"E281CA002000000000100038":{nam:"Q2_U_O"},
				"E281CA002000000000100039":{nam:"Q2_V_I"},
				"E281CA002000000000100040":{nam:"Q2_V_O"},
				"E281CA002000000000100041":{nam:"Q2_W_I"},
				"E281CA002000000000100042":{nam:"Q2_W_O"},
				"E281CA002000000000100043":{nam:"KM1_U_I"},
				"E281CA002000000000100044":{nam:"KM1_U_O"},
				"E281CA002000000000100045":{nam:"KM1_V_I"},
				"E281CA002000000000100046":{nam:"KM1_V_O"},
				"E281CA002000000000100047":{nam:"KM1_W_I"},
				"E281CA002000000000100048":{nam:"KM1_W_O"},
				"E281CA002000000000100049":{nam:"KM2_U_I"},
				"E281CA002000000000100050":{nam:"KM2_U_O"},
				"E281CA002000000000100051":{nam:"KM2_V_I"},
				"E281CA002000000000100052":{nam:"KM2_V_O"},
				"E281CA002000000000100053":{nam:"KM2_W_I"},
				"E281CA002000000000100054":{nam:"KM2_W_O"}
			}
		}
	}

};
