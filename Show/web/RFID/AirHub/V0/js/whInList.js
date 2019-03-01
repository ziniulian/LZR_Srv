function init() {
	dat.getDat();
}

dat = {
	method: "getrksqlist_json",
	link: "whIn.html?rid=",
	tbNam: "STORAGES_IN",
	idNam: "infoid",

	getDat: function () {
		var o = mn.qryWs(dat.method, null);
		if (o.ok) {
			dat.flush(o[dat.tbNam]);
		}
	},

	flush: function (d) {
		var a, v, i;
		if (d && d.length) {
			listDom.innerHTML = "";
			for (i = 0; i < d.length; i ++) {
				a = document.createElement("a");
				a.className = "wh_list";
				a.href = dat.link + d[i][dat.idNam] + "&nam=" + d[i].bh;

				v = document.createElement("div");
				v.className = "wh_list_nam mfs";
				v.innerHTML = d[i].bh;
				a.appendChild(v);

				v = document.createElement("div");
				v.className = "wh_list_remark sfs";
				v.innerHTML = d[i].creattime + "<br/>" + d[i].squseridname;
				a.appendChild(v);

				listDom.appendChild(a);
			}
		}
	},

	back: function () {
		window.history.back();
	}
};
