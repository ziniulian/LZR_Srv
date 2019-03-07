// RFID模拟器 接口实现
rfdo = {
/******************* 数据库 ********************/
	// 获取配置信息
	getConfig: function () {
		return JSON.stringify(parent.window.dat.db.kv);
	},

	// 保存配置信息
	savConfig: function (tL, tH, to, tb) {
		parent.window.dat.db.kv.tempL = tL;
		parent.window.dat.db.kv.tempH = tH;
		parent.window.dat.db.kv.timout = to;
		parent.window.dat.db.kv.tb = JSON.parse(tb);
		return true;
	},

/******************* RFID ********************/
	rfidScan: function () {
		parent.window.dat.scan();
	},

	rfidStop: function () {
		parent.window.dat.stop();
	},

	rfidCatchScanning: function () {
		return parent.window.dat.catchScanning();
	},

	// 功率设置
	setRate: function (rat) {},

	// rfidWrt: function (bankNam, dat, tid) {},

	setBank: function (b) {},

	isRunAble: function () {return true;},

/******************* 其它功能 ********************/

	// 警告指示灯
	alarmLed: function (b) {},

	// 电源指示灯
	powerLed: function (d) {},

	// 切换天线
	cAnt: function () {},

/******************* 通用 ********************/
	// 输出
	log: function (msg) {
		console.log(msg);
	},

	// 退出
	exit: function () {
		parent.window.dat.close();
	}
};
