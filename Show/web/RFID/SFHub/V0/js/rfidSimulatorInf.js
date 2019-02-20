// RFID模拟器 接口实现
rfdo = {
/******************* 数据库 ********************/
	// 获取键值对
	kvGet: function (k) {
		var db = parent.window.dat.db.kv;
		var o = db[k];
		if (o) {
			return o;
		} else {
			return null;
		}
	},

	// 新增或修改键值对
	kvSet: function (k, v) {
		parent.window.dat.db.kv[k] = v;
		return true;
	},

	// 删除键值对
	kvDel: function (k) {
		delete parent.window.dat.db.kv[k];
		return true;
	},

	// 登录
	signIn: function (uid, pw) {
		var r = "";
		if (uid === "adm" && pw === "111") {
			var o = {
				"userId": "adm",	// ID
				"password": "111",	// 密码
				"userName": "犟子",	// 用户名
				"deptCode": "101",	// 部门ID
				"deptName": "犟子工作室",	// 部门名称
				"groupCode": "201",	// 班组ID
				"groupName": "夜班",	// 班组名称
				"postCode": "301",	// 岗位ID
				"postName": "研发",	// 岗位名称
				"tel": "110",	// 电话
				"isEnable": true	// 是否可用
			}
			rfdo.kvSet("userId", o.userId);
			r = JSON.stringify(o);
			rfdo.kvSet("user", r);
		}
		return r;
	},

	// 登出
	signOut: function () {
		rfdo.kvDel("user");
	},

	// IP设置
	setUrl: function (ip, port) {
		rfdo.kvSet("synUrlIp", ip);
		rfdo.kvSet("synUrlPort", port);
		return true;
	},

	// 数据同步
	syn: function () {
		return true;
	},

	// 解析物料标签
	getTagP: function (p, bn) {
		return JSON.stringify(parent.window.dat.testData[p + "_" + bn]);
	},

	// 解析物料标签
	qryLocDtl: function (codL) {
		return JSON.stringify(parent.window.dat.qryLocDtl(codL));
	},

	// 入库保存
	savIn: function (cod, bn, codL, num, tid) {
		var o = parent.window.dat.testData[cod + "_" + bn];
		o.num += num;
		o.codL = codL;
		return true;
	},

	// 出库保存
	savOut: function (cod, bn, num) {
		var o = parent.window.dat.testData[cod + "_" + bn];
		o.num -= num;
		if (o.num <= 0) {
			o.num = 0;
			o.codL = "";
		}
		return true;
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
