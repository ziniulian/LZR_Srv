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

	getTim: function (ng) {
		var t, d = new Date();
		var s = d.getFullYear();
		if (!ng) s += "-";
		t = d.getMonth() + 1;
		if (t < 10) s += "0";
		s += t;
		if (!ng) s += "-";
		t = d.getDate();
		if (t < 10) s += "0";
		s += t;
		if (!ng) s += " ";
		t = d.getHours();
		if (t < 10) s += "0";
		s += t;
		if (!ng) s += ":";
		t = d.getMinutes();
		if (t < 10) s += "0";
		s += t;
		if (ng) {
			t = d.getSeconds();
			if (t < 10) s += "0";
			s += t;
		};
		return s;
	},

	callTim: function () {
		alert("校时完成！");
	},

	// 显示软件名
	getAppNam: function () {
		return "XC2002型便携式铁路标签读出器";
	},

	// 获取手电筒状态
	getFlashlight: function () {
		return parent.window.dat.fl;
	},

	flashlight: function () {
		parent.window.dat.fl = !parent.window.dat.fl;
		dat.flashlight(parent.window.dat.fl);
	},

/******************* 数据库 ********************/
	dbSav: function (cod, xiu) {
		var db = parent.window.dat.db;
		var s = cod[0];
		if (s === "!") {
			s = "Q";
		}
		db.push({
			id: parent.window.dat.dbc ++,
			tim: rfdo.getTim(1),
			xiu: xiu,
			tag: parent.window.dat.testData[s],
			enb: 0,
		});
	},

	dbClear: function () {
		parent.window.dat.db = [];
		parent.window.dat.dbc = 0;
	},

	dbDel: function (ids) {
		var db = parent.window.dat.db;
		ids = ",," + ids + ",";
		for (var i = (db.length - 1); i >= 0; i --) {
			if (ids.indexOf("," + db[i].id + ",") > 0) {
				db.splice(i, 1);
			}
		}
	},

	dbSet: function (id, xiu) {
		var db = parent.window.dat.db;
		for (var i = 0; i < db.length; i ++) {
			if (db[i].id === id) {
				db[i].xiu = xiu;
				return;
			}
		}
	},

	dbGet: function (s, l) {
		var o, r = [];
		for (var i = 0; i < l; i ++) {
			o = parent.window.dat.db[s + i];
			if (o) {
				r.push(o);
			} else {
				break;
			}
		}
		return JSON.stringify(r);
	},

	dbCount: function () {
		return parent.window.dat.db.length;
	},

/******************* 通用 ********************/
	read: function () {
		parent.window.dat.scan();
	},

	stop: function () {
		parent.window.dat.stop();
	},

	exit: function () {
		parent.window.dat.close();
	}
};
