function init() {
	tools.memo.bind(memoDom);
	dat.flush();
}

dat = {
	lock: false,	// 锁

	// 刷新页面
	flush: function () {
		ipDom.value = mn.kvGet("urlIp");
		portDom.value = mn.kvGet("urlPort");
		rateDom.value = mn.kvGet("rate");
		var s = mn.kvGet("jid");
		if (s) {
			jidDom.value = s;
		}
	},

	// 保存
	sav: function () {
		var r = false;
		if (!dat.lock) {
			var ip = ipDom.value;
			var port = portDom.value;
			var jid = jidDom.value;
			var rat = rateDom.value;
			if (jid) {
				mn.kvSet("jid", jid);
			}

			if (ip) {
				if (port) {
					if (rat) {
						rat -= 0;
						if (rat >= 1) {
							if (rat <= 30) {
								if (mn.setUrl (ip, port)) {
									rfid.setRate(rat);	// 功率设置
									mn.kvSet("rate", rat);
									tools.memo.show("保存成功！");
									r = true;
								}
							} else {
								rateDom.value = 30;
								tools.memo.show("功率不能大于 30 ！");
							}
						} else {
							rateDom.value = 1;
							tools.memo.show("功率不能小于 1 ！");
						}
					} else {
						tools.memo.show("功率不能为空！");
					}
				} else {
					tools.memo.show("端口不能为空！");
				}
			} else {
				tools.memo.show("IP不能为空！");
			}
		}
		return r;
	},

	// 数据同步准备
	synRdy: function () {
		if (!dat.lock) {
			if (dat.sav()) {
				dat.lock = true;
				tools.memo.show("正在同步数据字典，请稍候 ...", 0);
				setTimeout(dat.syn, 100);
			}
		}
	},

	// 同步数据字典
	syn: function () {
		var on, oc, t, nt, i, o;
		t = mn.kvGet("synTim");
		nt = tools.getTimStr();
		on = mn.qryWs("getdeviceinfolistbycjtime", "{\"cjtime\":\"" + t + "\"}");	// 设备
		if (on.ok) {
			oc = mn.qryWs("getsysspecialtylistbycjtime", "{\"cjtime\":\"" + t + "\"}");	// 专业
			if (oc.ok) {
				// 设备
				o = on.DEVICEINFO;
				for (i = 0; i < o.length; i ++) {
					mn.setNam(o[i].ename, o[i].dname);
				}
				// 专业
				o = oc.SYSSPECIALTY;
				for (i = 0; i < o.length; i ++) {
					mn.setCls(o[i].nosname, o[i].zyname);
				}
				mn.kvSet("synTim", nt);
				tools.memo.show("数据同步完成");
			} else {
				tools.memo.show(oc.error);
			}
		} else {
			tools.memo.show(on.error);
		}
		dat.lock = false;
	},

	back: function () {
		if (!dat.lock) {
			window.history.back();
		}
	}
};
