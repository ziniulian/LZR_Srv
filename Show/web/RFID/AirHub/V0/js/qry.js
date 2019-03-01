function init() {
	var s = mn.kvGet("qryIds");
	if (s) {
		var a, o, i;
		a = JSON.parse(s);
		for (i = 0; i < a.length; i ++) {
			o = mn.parseEpcObj(a[i]);
			if (o) {
				dat.crtTag(o, 0);
			}
		}
	}
}

rfid.hdScan = function (arr) {
	var o, e, m = 0;
	for (var i = 0; i < arr.length; i ++) {
		e = mn.parseEpc(arr[i].epc);
		o = dat.ts[e];
		if (o) {
			o.whTim += arr[i].tim;
			o.whTimDoe.innerHTML = o.whTim;
			m = 2;
			dat.lastOne = o;
		} else {
			o = mn.parseEpcObj(e);
			if (o) {
				dat.crtTag(o, arr[i].tim);
				m = 2;
				dat.lastOne = o;
			}
		}
	}
	if (m) {
		mn.music(m);
	}
	if (dat.lastOne && rfid.tid === 0) {
		tools.topDoe(outDoe, dat.lastOne.whDoe);
		dat.lastOne = null;
	}
};

dat = {
	lastOne: null,
	link: "log.html?rid=",
	ts: {},		// 设备明细
	ids: [],	// 设备编号集合

	// 生成标签
	crtTag: function (o, tim) {
		var b, r, d;
		o.whTim = tim;

		r = document.createElement("tr");
		b = document.createElement("table");
		b.className = "wh_tb sfs";

		d = document.createElement("tbody");
		dat.crtDom(d, "类型", ":", o.typ);
		dat.crtDom(d, "名称", ":", o.nam);
		if (o.typCod === "S") {
			dat.crtDom(d, "分类", ":", o.cls);
		} else {
			dat.crtDom(d, "数量", ":", o.count);
			dat.crtDom(d, "箱号", ":", o.cod + " , 共 " + o.totle + " 箱");
		}
		dat.crtDom(d, "序号", ":", o.dbm.substring(14, 26));

		// 次数统计
		o.whTimDoe = document.createElement("div");
		o.whTimDoe.className = "wh_tb_t sfs";
		if (o.whTim) {
			o.whTimDoe.innerHTML = o.whTim;
		}
		d.appendChild(o.whTimDoe);
		b.appendChild(d);

		d = document.createElement("td");
		d.appendChild(b);

		r.rid = o.dbm;
		// r.ontouchstart = dat.tuS;
		// r.ontouchend = dat.tuE;
		r.className = "qry_scd";
		r.onclick = dat.tuDo;
		r.appendChild(d);

		o.whDoe = r;
		listDom.appendChild(r);

		dat.ts[o.dbm] = o;
		dat.ids.push(o.dbm);
	},

	crtDom: function (b, k, g, v) {
		var r = document.createElement("tr");
		var d = document.createElement("td");
		d.className = "wh_tb_k";
		d.innerHTML = k;
		r.appendChild(d);

		d = document.createElement("td");
		d.className = "wh_tb_g";
		d.innerHTML = g;
		r.appendChild(d);

		d = document.createElement("td");
		d.innerHTML = v;
		r.appendChild(d);
		b.appendChild(r);
	},

	clear: function () {
		for (s in dat.ts) {
			delete dat.ts[s];
		}
		dat.ids = [];
		listDom.innerHTML = "";
	},

	tuS: function () {
		this.className = "qry_scd";
	},

	tuE: function () {
		this.className = "";
	},

	tuDo: function () {
		rfid.scanStop();
		mn.kvSet("qryIds", JSON.stringify(dat.ids));
		window.location.href = (dat.link + this.rid);
	},

	back: function () {
		mn.kvSet("qryIds", "");
		window.history.back();
	}
};
