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

	noDat: function () {
		outDoe.innerHTML = "<div class='midOut memo mfs'>无法获取设备详情</div>";
		btnDoe.className = "Lc_nosee";
	},

	getDat: function () {
		var o = mn.qryWs("divicefindbydbmandsn", "{\"dbm\":\"" + dat.rid +"\"}");
// mn.log(o.error + "...");
		if (o.ok && o.DEVICE.length) {
			dat.flush(o.DEVICE[0]);
		} else {
			dat.noDat();
		}
	},

	flush: function (o) {
		dat.crtDom(msgDoe, "名称", ":", o.sbname);
		if (o.serialNumber) {
			dat.crtDom(msgDoe, "S/N", ":", o.serialNumber);
		}
		dat.crtDom(msgDoe, "型号", ":", o.ggxhname);
		dat.crtDom(msgDoe, "品牌", ":", o.brandname);
		dat.crtDom(msgDoe, "分类", ":", o.zyidname);
		dat.crtDom(msgDoe, "序号", ":", dat.rid.substring(14, 26));

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
		dat.crtDom(msgDoe, "状态", ":", o.statename);

		// 成色
		if (o.saveStatename) {
			dat.crtDom(msgDoe, "成色", ":", o.saveStatename);
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

	log: function () {
		if (dat.rid) {
			window.location.href = ("log.html?rid=" + dat.rid);
		}
	},

	back: function () {
		window.history.back();
	}
};
