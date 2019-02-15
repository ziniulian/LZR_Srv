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
		scanBtnDom.disabled = "disabled";
		stopBtnDom.disabled = "";
		sendBtnDom.disabled = "";
	},
	stop: function () {
		scanBtnDom.disabled = "";
		stopBtnDom.disabled = "disabled";
		sendBtnDom.disabled = "disabled";
	},
	back: function () {
		frmo.window.dat.back();
	},
	send: function () {
		//
	},

/************** 数据库 ****************/

/************** 特殊功能 ****************/
	fl: false	// 手电筒
};
