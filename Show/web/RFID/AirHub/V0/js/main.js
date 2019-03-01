mn = {
/****************** 登录 ******************/
	signIn: function (uid, pw) {
		var r = false;
		var u = mn.qryWs("login_json", "{\"usercode\":\""
			+ uid + "\",\"userpwd\":\""
			+ pw + "\"}");
		if (u.ok) {
			u = u.SYSUSER[0];
			rfdo.kvSet("userId", u.syscode);
			rfdo.kvSet("user",
				"{\"id\":\"" + u.syscode +
				"\",\"nam\":\"" + u.sysname +
				"\",\"rid\":\"" + u.sysuerid + "\"}"
			);
			r = true;
		}
		return r;
	},
	signOut: function () {
		rfdo.kvDel("user");
	},
	getUser: function () {
		var u = rfdo.kvGet("user");
		if (u) {
			return JSON.parse(u);
		} else {
			return null;
		}
	},

/****************** 数据库 ******************/
	parseNam: function (nam) {
		return rfdo.parseNam(nam) || nam;
	},
	parseCls: function (zy, szy, xt, sxt) {
		var r = zy + szy + xt + sxt;
		return rfdo.parseCls(r) || r;
	},
	setNam: function (k, v) {
		rfdo.setNam(k, v);
	},
	setCls: function (k, v) {
		rfdo.setCls(k, v);
	},

/****************** 业务 ******************/
	parseEpc: function (epc) {
		return rfdo.parseEpc(epc);
	},
	parseEpcObj: function (epc) {
		var o = null;
		if (epc.length === 26) {
			var t = epc.substring(0, 1);
			if (t === "S") {
				o = {	// 设备
					dbm: epc,
					typ: "设备",	// 类型
					typCod: "S",
					namCod: epc.substring(1, 4),	// 名称号
					zyCod: epc.substring(4, 6),		// 专业
					szyCod: epc.substring(6, 9),	// 子专业
					xtCod: epc.substring(9, 11),	// 系统
					sxtCod: epc.substring(11, 14),	// 子系统
					date: epc.substring(14, 22),	// 日期
					num: epc.substring(22, 26),		// 序号
				};
				o.nam = mn.parseNam(o.namCod);	// 名称
				o.cls = mn.parseCls(o.zyCod, o.szyCod, o.xtCod, o.sxtCod);	// 分类
			} else if (t === "X") {
				o = {	// 包装箱
					dbm: epc,
					typ: "包装箱",	// 类型
					typCod: "X",
					namCod: epc.substring(1, 4),	// 名称号
					count: epc.substring(6, 8) - 0,	// 装箱数量
					cod: epc.substring(8, 11),		// 箱号
					totle: epc.substring(11, 14) - 0,	// 共几箱
					date: epc.substring(14, 22),	// 日期
					num: epc.substring(22, 26),		// 序号
				};
				o.nam = mn.parseNam(o.namCod);	// 名称
			}
		}
		return o;
	},

/****************** 基础方法 ******************/
	getVersion: function () {
		return rfdo.getVersion();
	},
	setUrl: function (ip, port) {
		return rfdo.setUrl(ip, port);
	},

	kvGet: function (k) {
		return rfdo.kvGet(k);
	},
	kvSet: function (k, v) {
		return rfdo.kvSet(k, v);
	},
	kvDel: function (k) {
		return rfdo.kvDel(k);
	},
	qryWs: function (m, p) {
		return rfdo.qryWs(m, p);
	},

	music: function (typ) {
		rfdo.music(typ);
	},

	log: function (msg) {
		rfdo.log(msg);
	}
};
