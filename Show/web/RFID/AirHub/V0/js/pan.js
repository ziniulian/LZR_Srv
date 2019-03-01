function init() {
	var o = mn.qryWs ("inventorylist",	// TODO: 该接口无需传参，需修改
		"{\"qsday\":\"" + "2011-11-11" +
		"\",\"jsday\":\"" + "2111-11-11" +
	"\"}");
	if (o.ok) {
		o = o.INVENTORY;	// TODO: 接口返回值无需判断 tage ， 需修改
		for (var i = 0; i < o.length; i ++) {
			if (o[i].tage === "002") {
				tools.memo.bind(memoDom);
				dat.user = mn.getUser();
				dat.rid = o[i].pdid;
				document.title = "Pan";
				break;
			}
		}
	}
	if (!dat.rid) {
		isDom.innerHTML = "暂无盘点计划";
	}
}

rfid.hdScan = function (arr) {
	var o, e, m = 0;
	for (var i = 0; i < arr.length; i ++) {
		e = mn.parseEpc(arr[i].epc);
		o = dat.ts[e];
		if (o) {
			if (m === 0) {
				m = 2;
			}
			dat.lastOne = o;
			o.whTim += arr[i].tim;
			o.whTimDoe.innerHTML = o.whTim;
		} else {
			o = dat.getDat(e);
			if (o) {
				o.whTim += arr[i].tim;
				o.whTimDoe.innerHTML = o.whTim;
				if (o.whStat === 1) {
					mn.music(1);
					dat.oknum ++;
					okNumDom.innerHTML = dat.oknum;
				} else if (o.whStat === 0) {
					mn.music(0);
				}
				m = 1;
				dat.lastOne = o;
			}
		}
	}
	if (m === 2) {
		mn.music(2);
	}
	if (dat.lastOne && rfid.tid === 0) {
		tools.topDoe(outDoe, dat.lastOne.whDoe);
		dat.lastOne = null;
	}
};

dat = {
	lastOne: null,
	rid: null,	// 入库单号
	user: null,	// 用户id
	oknum: 0,	// 已入库数
	ts: {},		// 设备明细
	bdoe: null,

	getDat: function (e) {
		var s, o = mn.parseEpcObj(e);
		if (o && o.typCod === "S") {
			s = mn.qryWs("inventorysmsave",
				"{\"pdid\":\"" + dat.rid +
				"\",\"dbm\":\"" + e +
			"\"}");
			if (s.ok) {
				o.whStat = 1;
				s = mn.qryWs("divicefindbydbmandsn", "{\"dbm\":\"" + e + "\"}");
				if (s.ok && s["DEVICE"]) {	// TODO: 接口信息需要包含设备详情，而不该重复查询，需修改。
					s = s["DEVICE"][0];
					if (s) {
						if (s.sbname) {
							o.nam = s.sbname;
						}
						if (s.zyidname) {
							o.cls = s.zyidname;
						}
						if (s.ggxhname) {
							o.gg = s.ggxhname;
						}
						if (s.serialNumber) {
							o.sn = s.serialNumber;
						}
						if (s.brandname) {
							o.pp = s.brandname;
						}
					}
				}
			} else {
				o.whStat = 0;
			}
		} else {
			return null;
		}
		dat.crtTag(o);
		return o;
	},

	crtTag: function (o) {
		var b, r, d;
		dat.ts[o.dbm] = o;
		o.whTim = 0;

		// 生成 DOM
		r = document.createElement("tr");
		o.whDoe = r;

		b = document.createElement("table");
		b.className = "wh_tb sfs";
		d = document.createElement("tbody");

		// 数据内容
		o.whImgDoe = dat.crtDom(d, o.whStat, "", o.nam);
		if (o.sn) {
			dat.crtDom(d, "S/N", ":", o.sn);
		}
		if (o.gg) {
			dat.crtDom(d, "型号", ":", o.gg);
		}
		if (o.pp) {
			dat.crtDom(d, "品牌", ":", o.pp);
		}
		dat.crtDom(d, "分类", ":", o.cls);
		dat.crtDom(d, "序号", ":", o.dbm.substring(14, 26));

		// 次数统计
		o.whTimDoe = document.createElement("div");
		o.whTimDoe.className = "wh_tb_t sfs";

		b.appendChild(d);
		d = document.createElement("td");
		d.appendChild(b);
		d.appendChild(o.whTimDoe);
		r.appendChild(d);

		if (dat.bdoe) {
			okListDom.insertBefore(r, dat.bdoe);
		} else {
			okListDom.appendChild(r);
		}
		dat.bdoe = r;
	},

	crtDom: function (b, k, g, v) {
		var r = document.createElement("tr");
		var d = document.createElement("td");
		var rr = d;
		switch (k) {
			case 0:
				d.className = "wh_out_tb_img wh_out_tb_img_err";
				break;
			case 1:
				d.className = "wh_out_tb_img wh_out_tb_img_ok";
				break;
			default:
				d.className = "wh_tb_k";
				d.innerHTML = k;
				break;
		}
		r.appendChild(d);

		d = document.createElement("td");
		d.className = "wh_tb_g";
		d.innerHTML = g;
		r.appendChild(d);

		d = document.createElement("td");
		d.innerHTML = v;
		r.appendChild(d);
		b.appendChild(r);

		return rr;
	},

	back: function () {
		window.history.back();
	}
};
