function init() {
	var o = tools.getUrlReq();
	if (o.rid) {
		dat.rid = o.rid;
		dat.getDat();
	} else {
		dat.noDat();
	}
}

dat = {
	rid: null,	// 设备编号

	getDat: function () {
		var o = mn.qryWs("divicefindbydbmandsn", "{\"dbm\":\"" + dat.rid +"\"}");
		if (o.ok && o.DEVICE.length) {
			dat.flushInfo(o.DEVICE[0]);
			for (var i = 0; i < o.DEVICE.length; i ++) {
				dat.flush(o.DEVICE[i]);
			}
		} else {
			dat.noDat();
		}
	},

	noDat: function () {
		outDoe.innerHTML = "<div class='midOut memo mfs'>无法获取设备详情</div>";
	},

	flushInfo: function (o) {
		dat.crtDom(infoDoe, "名称", ":", o.sbname);
		if (o.serialNumber) {
			dat.crtDom(infoDoe, "S/N", ":", o.serialNumber);
		}
		dat.crtDom(infoDoe, "型号", ":", o.ggxhname);
		dat.crtDom(infoDoe, "品牌", ":", o.brandname);
		dat.crtDom(infoDoe, "分类", ":", o.zyidname);
		dat.crtDom(infoDoe, "序号", ":", dat.rid.substring(14, 26));

		// 状态
		if (!o.statename) {
			switch (o.state) {
				case "002":
					o.statename = "已入库";
					break;
				case "003":
					o.statename = "已出库";
					break;
				default:
					o.statename = "未入库";
			}
		}
		dat.crtDom(infoDoe, "状态", ":", o.statename);

		// 成色
		if (o.saveStatename) {
			dat.crtDom(infoDoe, "成色", ":", o.saveStatename);
		}
	},

	flush: function (o) {
		var s, user, tim, r, b, d;

		// 状态
		switch (o.state) {
			case "002":
				s = "入库";
				// user = "rkuserid";
				user = "lyrname";
				tim = "rktime";
				break;
			case "003":
				s = "领用";
				user = "lyrname";
				tim = "lytime";
				break;
		}

		if (s) {
			r = document.createElement("tr");
			b = document.createElement("table");
			b.className = "wh_tb sfs";
			d = document.createElement("tbody");

			dat.crtDom(d, s + "人", ":", o[user]);
			dat.crtDom(d, s + "时间", ":", o[tim]);

			b.appendChild(d);
			d = document.createElement("td");
			d.appendChild(b);
			r.appendChild(d);
			listDoe.appendChild(r);
		}
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

	back: function () {
		window.history.back();
	}
};
