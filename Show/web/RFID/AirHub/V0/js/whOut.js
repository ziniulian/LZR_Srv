function init() {
	var o = tools.getUrlReq();
	tools.memo.bind(memoDom);
	if (o.rid) {
		dat.rid = o.rid;
		namDom.innerHTML = o.nam;
		dat.user = mn.getUser();
		dat.getDat();
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
			if (dat.lastOne !== 1) {
				dat.lastOne = o;
			}
			o.whTim += arr[i].tim;
			o.whTimDoe.innerHTML = o.whTim;
		} else if (!dat.rdys[e]) {
			if (dat.oknum < dat.count) {
				o = dat.match(e, {});
				if (o) {
					if (o.match.ok === 4) {
						if (dat.sav(o)) {
							m = 1;
						}
						dat.lastOne = o;
					} else {
						dat.rdy(o);
						m = 1;
						mn.music(0);
						dat.lastOne = 1;
					}
				}
			}
		}
	}
	if (m === 2) {
		mn.music(2);
	}
	if (dat.lastOne && rfid.tid === 0) {
		if (dat.lastOne === 1) {
			tools.topDoe(outDoe);
		} else {
			tools.topDoe(outDoe, dat.lastOne.whDoe);
		}
		dat.lastOne = null;
	}
};

dat = {
	lastOne: null,
	rid: null,	// 入库单号
	count: 0,	// 总数
	oknum: 0,	// 已出库数
	rts: [],	// 预出库设备明细
	ts: {},		// 实际出库设备明细
	rdys: {},	// 临时占用的 EPC
	user: null,	// 用户id

	getDat: function () {
		var o = mn.qryWs("ckspwedivice_json", "{\"outWeInfoid\":\"" + dat.rid + "\"}");
		if (o.ok && o.STORAGE_DEVICE_OUT.length) {
			dat.hdDatR(o.STORAGE_DEVICE_OUT);
			dat.hdDat(o["STORAGE_DEVICE_OUT_ISCK"]);
		}
	},

	hdDatR: function (a) {
		var i, j, o, t, n, b, d;
		for (i = 0; i < a.length; i ++) {
			t = a[i];
			n = t.countno - 0;
			for (j = 0; j < n; j ++) {
				o = {
					nam: t.sbidname,
					namCod: t.ename,
					cls: t.zyidname,
					clsCod: t.zyid,
					gg: t.ggidname,
					pp: t.supplieridname,
					whId: dat.rts.length,
					whTim: 0,
					match: false,	// 匹配信息
					/*
					{
						dbm,clsCod,cls,pp,sn,ok		// ok=4,表示完全匹配； 其它,表示部分匹配
					}
					*/
					whTbDoe: document.createElement("tbody"),
					whDoe: document.createElement("tr")
				};
				b = document.createElement("table");
				b.className = "wh_tb sfs";

				// 数据内容
				o.whImgDoe = dat.crtDom(o.whTbDoe, 0, "", o.nam);
				dat.crtDom(o.whTbDoe, "型号", ":", o.gg);
				o.whPpDoe = dat.crtDom(o.whTbDoe, "品牌", ":", o.pp);
				o.whClsDoe = dat.crtDom(o.whTbDoe, "分类", ":", o.cls);

				// 次数统计
				o.whTimDoe = document.createElement("div");
				o.whTimDoe.className = "wh_tb_t sfs";

				b.appendChild(o.whTbDoe);
				d = document.createElement("td");
				d.appendChild(b);
				d.appendChild(o.whTimDoe);
				o.whDoe.appendChild(d);

				noListDom.appendChild(o.whDoe);
				dat.rts.push(o);
			}
		}
		dat.count = dat.rts.length;
		numDom.innerHTML = dat.rts.length;
	},

	crtDom: function (b, k, g, v) {
		var r = document.createElement("tr");
		var d = document.createElement("td");
		var rr = false;
		switch (k) {
			case 0:
				d.className = "wh_out_tb_img wh_out_tb_img_no";
				rr = d;
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
		if (!rr) {
			rr = d;
		}
		r.appendChild(d);
		b.appendChild(r);

		return rr;
	},

	hdDat: function (a) {
		var i, o;
		for (i = 0; i < a.length; i ++) {
			o = dat.match(a[i].dbm, {
				cls: a[i].zyidname,
				gg: a[i].ggidname,
				sn: a[i].serialnumber,
				pp: a[i].supplieridname
			});
			if (o) {
				dat.flushSav(o);
			} else {
				// mn.log("严重BUG ： 出了一个与出库单完全不一致的东西！！" + a[i].dbm);
			}
		}
	},

	match: function (epc, m) {
		var i, o, t, k, r = null;
		t = mn.parseEpcObj(epc);
		if (t && t.typCod === "S") {
			m.dbm = epc;
			m.ok = 0;	// 1:名称匹配、2:名称+品牌匹配、3:名称+分类匹配、4:完全匹配
			m.clsCod = epc.substring(4, 14);
			for (i = 0; i < dat.rts.length; i ++) {
				o = dat.rts[i];
				if (!o.match && o.namCod === t.namCod) {
					if (!m.gg) {
						k = mn.qryWs("divicefindbydbmandsn", "{\"dbm\":\"" + epc +"\"}");
						if (k.ok) {
							k = k["DEVICE"][0];
							m.gg = k.ggxhname;
							m.sn = k.serialNumber;
							m.pp = k.brandname;
							m.cls = k.zyidname;
						}
					}
					if (m.gg === o.gg) {
						if (m.ok < 1) {
							m.ok = 1;
							r = o;
						}
						if (m.clsCod === o.clsCod) {
							if (m.pp === o.pp) {
								// 完全匹配
								m.ok = 4;
								r = o;
								break;
							} else if (m.ok < 3) {
								m.ok = 3;
								r = o;
							}
						} else if (m.ok < 2 && m.pp === o.pp) {
							m.ok = 2;
							r = o;
						}
					}
				}
			}
			if (m.ok) {
				if (m.sn) {
					m.snDoe = dat.crtDom(r.whTbDoe, "S/N", ":", m.sn);
				}
				m.xhDoe = dat.crtDom(r.whTbDoe, "序号", ":", m.dbm.substring(14, 26));
				r.match = m;
				switch (m.ok) {
					case 2:
						r.whClsDoe.innerHTML += "<br/><span>" + m.cls + "</span>";
						break;
					case 1:
						r.whClsDoe.innerHTML += "<br/><span>" + m.cls + "</span>";
					case 3:
						r.whPpDoe.innerHTML += "<br/><span>" + m.pp + "</span>";
						break;
				}
			}
		}
		return r;
	},

	flushSav: function (o) {
		o.whDoe.parentNode.removeChild(o.whDoe);
		o.whImgDoe.className = "wh_out_tb_img wh_out_tb_img_ok";
		okListDom.appendChild(o.whDoe);

		if (o.match.btnDoe) {
			o.match.btnDoe.parentNode.removeChild(o.match.btnDoe);
			delete o.match.btnDoe;
		}

		dat.ts[o.match.dbm] = o;
		dat.oknum ++;
		okNumDom.innerHTML = dat.oknum;
	},

	sav: function (o) {
		var r = false;
		var s = mn.qryWs("ckspwedivicecksmsave",
			"{\"outWeInfoid\":\"" + dat.rid +
			"\",\"dbm\":\"" + o.match.dbm +
			"\",\"userid\":\"" + dat.user.rid +
		"\"}");
		if (s.ok) {
			// 保存成功
			dat.flushSav(o);
			mn.music(1);
			r = true;
		} else {
			dat.cancle(o);
			tools.memo.show(s.error);
		}
		return r;
	},

	cancle: function (o) {
		if (o.match.snDoe) {
			o.whTbDoe.removeChild(o.match.snDoe.parentNode);
		}
		if (o.match.xhDoe) {
			o.whTbDoe.removeChild(o.match.xhDoe.parentNode);
		}
		o.whClsDoe.innerHTML = o.cls;
		o.whPpDoe.innerHTML = o.pp;
		if (o.whImgDoe.className !== "wh_out_tb_img wh_out_tb_img_no") {
			o.whDoe.parentNode.removeChild(o.whDoe);
			o.whImgDoe.className = "wh_out_tb_img wh_out_tb_img_no";
			if (o.match.btnDoe) {
				o.match.btnDoe.parentNode.removeChild(o.match.btnDoe);
				delete o.match.btnDoe;
			}
			noListDom.appendChild(o.whDoe);
		}
		delete dat.rdys[o.match.dbm];
		o.match = false;
	},

	rdy: function (o) {
		var d;
		dat.rdys[o.match.dbm] = o;
		o.whDoe.parentNode.removeChild(o.whDoe);
		o.match.btnDoe = document.createElement("div");
		o.match.btnDoe.className = "midOut";

		d = document.createElement("div");
		d.className = "whout_btn mfs";
		d.innerHTML = "保存";
		d.onclick = function () {
			dat.sav(o);
		};
		o.match.btnDoe.appendChild(d);

		d = document.createElement("div");
		d.className = "whout_btn mfs";
		d.innerHTML = "取消";
		d.onclick = function () {
			dat.cancle(o);
		};
		o.match.btnDoe.appendChild(d);

		o.whTimDoe.parentNode.appendChild(o.match.btnDoe);
		o.whImgDoe.className = "wh_out_tb_img wh_out_tb_img_rdy";
		rdyListDom.appendChild(o.whDoe);
	},

	back: function () {
		window.history.back();
	}
};
