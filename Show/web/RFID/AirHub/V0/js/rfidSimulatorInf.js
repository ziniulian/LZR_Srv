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

	parseNam: function (nam) {
		return parent.window.dat.db.namKv[nam];
	},

	parseCls: function (cls) {
		return parent.window.dat.db.clsKv[cls];
	},

	setNam: function (k, v) {
		parent.window.dat.db.namKv[k] = v;
	},

	setCls: function (k, v) {
		parent.window.dat.db.clsKv[k] = v;
	},

	// webservice查询
	qryWs: function (method, param) {
		var r = {ok: false, error: ""};
		param = JSON.parse(param);
// console.log("----- qry Ws S ------");
// console.log(method);
// console.log(param);
// console.log("----- qry Ws E ------");
		switch (method) {
			case "login_json":
				r = parent.window.dat.login(param.usercode, param.userpwd);
				break;
			case "divicefindbydbmandsn":
				r = parent.window.dat.getDev(param.dbm);
				break;
			case "inventorylist":
				r.ok = true;
				r.INVENTORY = [{"pdid": "pan001", "tage": "002"}];
				break;
			case "inventorysmsave":
				if (parent.window.dat.testData[param.dbm].state === "002") {
					r.ok = true;
				}
				break;
			case "getrksqlist_json":
				r.ok = true;
				r.STORAGES_IN = parent.window.dat.getRkList();
				break;
			case "getdevice_rkjson":
				r.ok = true;
				r.STORAGE_DEVICE_INFO = parent.window.dat.getRkInfo(param.infoid);
				break;
			case "rkdevicesave_json":
				if (parent.window.dat.savRk(param.dbm)) {
					r.ok = true;
				}
				break;
			case "getcksqlist_json":
				r.ok = true;
				r.OUT_OF_THE_TREASURY_WE = parent.window.dat.getRkList(true);
				break;
			case "ckspwedivice_json":
				r.ok = true;
				r.STORAGE_DEVICE_OUT = parent.window.dat.getCkInfo(param.outWeInfoid);
				r.STORAGE_DEVICE_OUT_ISCK = parent.window.dat.getIsCkInfo(param.outWeInfoid);
				break;
			case "ckspwedivicecksmsave":
				r.error = parent.window.dat.savCk(param.outWeInfoid, param.dbm);
				if (!r.error) {
					r.ok = true;
				}
				break;
		}
		return r;
	},

	// 编码转换 （模拟器无须编码转换）
	parseEpc: function (epc) {
		return epc;
	},

	// 服务器 URL 设置
	setUrl: function (ip, port) {
		rfdo.kvSet("urlIp", ip);
		rfdo.kvSet("urlPort", port);
		return 1;
	},

/******************* 其它功能 ********************/

	// 播放声音
	music: function (typ) {},

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

/******************* 通用 ********************/
	// 输出
	log: function (msg) {
		console.log(msg);
	},

	// 版本号
	getVersion: function () {
		return "1.0.11";
	},

	// 退出
	exit: function () {
		parent.window.dat.close();
	}
};
