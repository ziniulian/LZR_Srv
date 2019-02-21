// RFID模拟器 接口实现
rfdo = {
	dtoDom: null,
	dtDom: null,
	dtMin: false,
	dtShow: false,

	// 显示时间选择器
	showDatePicker: function (y, m, d, min) {
		if (!rfdo.dtShow) {
			rfdo.dtMin = min;
			rfdo.crtDatePicker();

			m ++;
			var s = y + "-";
			if (m < 10) {
				s += "0";
			}
			s += m;
			s += "-";
			if (d < 10) {
				s += "0";
			}
			s += d;

			rfdo.dtDom.value = s;
			rfdo.dtShow = true;
			document.body.appendChild(rfdo.dtoDom);
		}
	},

	// 隐藏时间选择器
	hidDatePicker: function (y, m, d, min) {
		document.body.removeChild(rfdo.dtoDom);
		rfdo.dtShow = false;
	},

	// 创建时间选择器
	crtDatePicker: function () {
		if (!rfdo.dtDom) {
			rfdo.dtoDom = document.createElement("div");
			rfdo.dtoDom.className = "dtpo";
			rfdo.dtDom = document.createElement("input");
			rfdo.dtDom.className = "dtpTxt";
			rfdo.dtDom.type = "date";
			rfdo.dtoDom.appendChild(rfdo.dtDom);

			var d = document.createElement("br");
			rfdo.dtoDom.appendChild(d);

			d = document.createElement("div");
			d.className = "dtpBtn";
			d.innerHTML = "确定";
			d.onclick = function () {
				rfdo.hidDatePicker();
				dat.chgDate(rfdo.dtMin, rfdo.dtDom.value);
			};
			rfdo.dtoDom.appendChild(d);

			d = document.createElement("br");
			rfdo.dtoDom.appendChild(d);

			d = document.createElement("div");
			d.className = "dtpBtn";
			d.innerHTML = "取消";
			d.onclick = function () {
				rfdo.hidDatePicker();
			};
			rfdo.dtoDom.appendChild(d);
		}
	},

	sound: function () {},

/******************* 数据库 ********************/
	save2: function () {},

	// 保存总数
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

	// 保存明细
	saveDetails: function (t, dat) {
		var db = parent.window.dat.db.dt;
		var i, b, a = dat.split("\n");
		for (i = 0; i < a.length; i ++) {
			// tim,typ,sn,ct,num
			if (a[i]) {
				db.push(a[i].split(","));
			}
		}
	},

	// 查询所有车号
	findNum: function () {
		return "[10555411,11546625]";
	},

	// 总数查询
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

	// 查询明细
	findDetails: function (id, typ, file) {
		var i, d, r = [], db = parent.window.dat.db.dt;
		for (i = 0; i < db.length; i ++) {
			d = db[i];
			if (d[0] === id && d[1] === typ) {
				r.push([d[2], d[3], d[4]]);
			}
		}
		return JSON.stringify(r);
	},

/******************* 通用 ********************/
	scan: function () {
		parent.window.dat.scan();
	},

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
