// RFID模拟器 接口实现
rfdo = {
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

	sound: function () {},

/******************* 数据库 ********************/
	save2: function () {},

	save: function (dat) {
		var db = parent.window.dat.db.total;
		var a = dat.split(",");
		// tim,num,cnt01,cnt02,cnt03
		parent.window.dat.db.total.push([
			a[0] - 0,
			a[1],
			a[2] - 0,
			a[3] - 0,
			a[4] - 0,
		]);
	},

	saveDetails: function (t, dat) {
		var db = parent.window.dat.db.dt;
		var i, a = dat.split("\n");
		for (i = 0; i < a.length; i ++) {
			// tim,typ,sn,ct,num
			db.push(a[i].split(","));
		}
	},

	findNum: function () {
		return "[10555411,11546625]";
	},

	qry: function (num, min, max) {
		var i, d, r = [], db = parent.window.dat.db.total;
		for (i = 0; i < db.length; i ++) {
			d = db[i];
			if (d[0] <= max && d[0] >= min && (!num || (num && num === d[1]))) {
				r.push(d);
			}
		}
		return JSON.stringify(r);
	},

/******************* 通用 ********************/
	stop: function () {
		parent.window.dat.stop();
	},

	catchScanning: function () {
		return parent.window.dat.catchScanning();
	},

	exit: function () {
		parent.window.dat.close();
	}
};
