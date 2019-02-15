// RFID模拟器 接口实现
rfdo = {
	startTim: function () {},

	// 模拟时间线程
	flushTim: function () {
		setInterval (rfdo.showTim, 10000);
		rfdo.showTim();
	},

	// 显示时间
	showTim: function () {
		rfid.tim(rfdo.getTim());
	},

	getTim: function () {
		var d = new Date();
		var s = d.getFullYear();
		s += "-";
		s += d.getMonth() + 1;
		s += "-";
		s += d.getDate();
		s += " ";
		s += d.getHours();
		s += ":";
		s += d.getMinutes();
		return s;
	},

	callTim: function () {},

	// 显示软件名
	getAppNam: function () {
		return "XC2002-RHC型便携式标签读出器";
	},

	// 获取手电筒状态
	getFlashlight: function () {
		return parent.window.dat.fl;
	},

	flashlight: function () {
		parent.window.dat.fl = !parent.window.dat.fl;
		dat.flashlight(parent.window.dat.fl);
	},

	exit: function () {
		parent.window.dat.close();
	}
};
