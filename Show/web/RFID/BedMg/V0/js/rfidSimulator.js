// RFID模拟器

/*
	改模拟器步骤：
		1. 将 img 文件夹移到 临时图库里
		2. 所有原 html 文件中载入 rfidSimulatorInf.js
		3. 添加 index.html 、 js/rfidSimulator.js 、 js/rfidSimulatorInf.js 、 css/rfidSimulator.css 文件
		4. 检查所有 html 和 js 文件 ， 将 ontouch事件 改为 onclick事件 + :hover样式
*/

function init () {
	var s, d;
	for (s in dat.testData) {
		d = document.createElement("div");
		d.innerHTML = dat.testData[s].html;
		d.className = "scdBtn";
		d.setAttribute("tid", s);
		d.onclick = function() {
			dat.send(this.getAttribute("tid"));
		};
		tagSecDom.appendChild(d);
	}
}

var dat = {
	testData: {		// 测试数据
		"01C01001": {html: "单1", use: "A1101301"},
		"02C01006": {html: "被1", use: "A1101301"},
		"03C01011": {html: "枕1", use: "A1101301"},
		"01C01002": {html: "单2", use: "A1101301"},
		"02C01007": {html: "被2", use: "A1101301"},
		"03C01012": {html: "枕2", use: "A1101333"},
		"01C01003": {html: "单3", use: "A1101301"},
		"02C01008": {html: "被3", use: "A1101321"},
		"03C01013": {html: "枕3", use: "A1101301"},
		"01C01004": {html: "单4", use: "A1101305"},
		"02C01009": {html: "被4", use: "A1101301"},
		"03C01014": {html: "枕4", use: "A1101301"},
		"01C01005": {html: "单5", use: "A1101303"},
		"02C01010": {html: "被5", use: "A1101301"},
		"03C01015": {html: "枕5", use: "A1101301"},
		"01C01016": {html: "单a", use: "B0300101"},
		"02C01019": {html: "被a", use: "B0300101"},
		"03C01022": {html: "枕a", use: "B0300101"},
		"01C01017": {html: "单b", use: "B0300101"},
		"02C01020": {html: "被b", use: "B0300101"},
		"03C01023": {html: "枕b", use: "B0300101"},
		"01C01018": {html: "单c", use: "B0300101"},
		"02C01021": {html: "被c", use: "B0300101"},
		"03C01024": {html: "枕c", use: "B0300101"}
	},

	tmp: {},	// RFID 缓存

	open: function () {
		scanBtnDom.disabled = "";
		closeBtnDom.disabled = "";
		backBtnDom.disabled = "";
		openBtnDom.disabled = "disabled";
		frmDom.src="home.html";
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
			case "Ascan":
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

		frmo.window.rfid.stop();
	},
	back: function () {
		frmo.window.dat.back();
	},
	send: function (id) {
		if (!dat.tmp[id]) {
			dat.tmp[id] = dat.testData[id];
			dat.tmp[id].tim = 1;
		} else {
			dat.tmp[id].tim ++;
		}
	},
	catchScanning: function () {
		var r = JSON.stringify(dat.tmp);
		dat.tmp = {};
		return r;
	},

/************** 数据库 ****************/
	db: {
		total: [],	// 总计
		dt: []		// 明细
	}

};
