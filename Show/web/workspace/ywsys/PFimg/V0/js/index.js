function init () {
	LZR.load([
		"LZR.Util",
		"LZR.HTML.Base.Doe",
		"LZR.HTML.Base.Ajax",

		"LZR.HTML.Base.Ctrl.Thumbnails",
		"LZR.HTML.Base.Ctrl.SglScd",
		"LZR.HTML.Base.Ctrl.NumBase.StripNum",
		"LZR.Base.Val.Tim"
	]);
	var hw = {
		root: LZR,

		Scd: LZR.HTML.Base.Ctrl.SglScd,
		Tub: LZR.HTML.Base.Ctrl.Thumbnails,
		Spn: LZR.HTML.Base.Ctrl.NumBase.StripNum,
		Mouse: LZR.HTML.Base.Ctrl.Mouse,
		Rnm: LZR.Base.Val.RangeNum,
		Doe: LZR.HTML.Base.Doe,
		Tim: LZR.Base.Val.Tim,
		bind: LZR.getSingleton(LZR.Util).bind,
		// ajx: new LZR.HTML.Base.Ajax(),
		utJson: LZR.getSingleton(LZR.Base.Json)
	};

	var hwo = new Test({
		tools: hw
	});

	// 接口实现
	hwo.infDrawTub = function (doeo, img, imgDoeo) {
		if (img === "noimg") {
			imgDoeo.addCss("hid");	// firm
			imgDoeo.getById("img").setStyle("background-image", "url()");	// firm
			imgDoeo.getById("memo").doe.innerHTML = "";
		} else {
			imgDoeo.delCss("hid");
			imgDoeo.getById("img").setStyle("background-image", "url(" + img.URL + ")");
			imgDoeo.getById("memo").doe.innerHTML = img.picTime;
		}
	};
	hwo.infDrawBigImg = hw.bind (hwo, function (doeo, img) {
		if (img) {
			this.bigImg.subView.img.setStyle("background-image", "url(" + img.URL + ")");
		} else {
			this.bigImg.subView.img.setStyle("background-image", "url()");
		}
	});

	// 创建查询条件
	hwo.crtCdt("condition", "scd");

	// 隐藏相关元素
	var d = hwo.getCdt();	// 查询条件
	hwo.setModVisibleByArea(d, "nosee");	// firm
	hwo.setFomVisibleByTtypMod(d, "nosee");	// firm

	// 创建大图
	hwo.crtImg("bigImg");

	// 创建缩略图
	hwo.crtTub("tub", "7rem", "noimg", "scd");

	// 创建滚动条
	hwo.crtScrll("scrll");

	// 获取图片路径
	hwo.getDat();
}

function Test (obj) {
	this.tools = obj.tools;

	/*---------------- 属性 ---------------*/
	// 不执行查询
	this.nodo = false;

	//服务器地址
	this.wsServer = "ws://192.168.1.130:8901";

	//服务器地址
	this.httpServer = "http://192.168.1.130:8001/picService?type=0&path=";

	/*---------------- 方法 ---------------*/
	// 创建大图
	this.crtImg = function (imgID) {
		var r = {};
		this.bigImg = r;

		// 元素
		r.view = new this.tools.Doe ({
			hd_doe: document.getElementById(imgID)
		});

		// 子元素
		r.subView = {
			img: r.view.getById("img"),	// firm
			imgOut: r.view.getById("imgOut"),	// firm
			scall: r.view.getById("scall"),	// firm
			play: r.view.getById("play"),	// firm
			speed: r.view.getById("speed")	// firm
		};
		r.subView.img.calcPosition();
		r.subView.play.dat = {
			to: false
		};

		// 数据处理
		r.dat = new this.tools.Rnm ({
			min: 0.25,
			max: 2,
			num: 1,
			step: 0.25
		});

		// 控制器
		r.ctrl = {
			mouse: new this.tools.Mouse ({
				enableWheel: true
			})
		};

		// 缩放方法
		r.zoom = function (doeo, v, x, y, r) {
			var olds = r.dat.get();
			r.dat.add(v);
			olds -= r.dat.get();
			if (r.dat.get() > 1 && olds !== 0) {
				doeo.doe.scrollLeft -= x * olds;
				doeo.doe.scrollTop -= y * olds;
			}
		};

		// 添加事件
/*
		r.view.addEvt ("resize", function(e) {
			var d = r.subView.img;
			d.setStyle("width", "100%");
			d.setStyle("height", "100%");
			d.calcPosition();
			r.subView.imgOut.calcPosition();
			r.dat.set(1);
		});
*/
		r.dat.vcNum.evt.change.add(function (v) {
			var d = r.subView.img;
			d.setStyle("width", v * d.position.width);
			d.setStyle("height", v * d.position.height);
			if (v<1) {
				d.setStyle("margin", ((1-v) * d.position.height / 2) + "px auto");
			} else {
				d.setStyle("margin", "0 auto");
			}
			r.subView.scall.doe.innerHTML = Math.floor(v *100) + "%";
		});
		r.ctrl.mouse.evt.mid.wheel.add(function (doeo, v, x, y) {
			r.zoom(doeo, v, x, y, r);
		});
		r.ctrl.mouse.evt.lk.drop.add(function(doeo) {
			var d = doeo.dat.hct_mof;
			doeo.doe.scrollLeft += (d.lk.sx - d.lk.ex);
			doeo.doe.scrollTop += (d.lk.sy - d.lk.ey);
			d.lk.sx = d.lk.ex;
			d.lk.sy = d.lk.ey;
		});
		r.view.getById("prv").addEvt("click", this.tools.bind(this, function (e) {
			var d = this.tub.dat;
			if (d.area.get() === 0) {
				d.area.set(d.count - 1);
			} else {
				d.area.add(-1);
			}
		}));
		r.view.getById("next").addEvt("click", this.tools.bind(this, function (e) {
			var d = this.tub.dat;
			if (d.area.get() === (d.count - 1)) {
				d.area.set(0);
			} else {
				d.area.add(1);
			}
		}));
		r.view.getById("big").addEvt("click", function (e) {
			var d = r.subView.imgOut;
			r.zoom(d, 1, d.position.width/2, d.position.height/2, r);
		});
		r.view.getById("small").addEvt("click", function (e) {
			var d = r.subView.imgOut;
			r.zoom(d, -1, d.position.width/2, d.position.height/2, r);
		});
		r.view.getById("fit").addEvt("click", function (e) {
			r.dat.set(1);
		});
		r.view.getById("play").addEvt("click", this.tools.bind(this, function (e) {
			var d = r.subView.play;
			if (d.dat.to) {
				// 暂停
				d.delCss("stop");	// firm
				clearTimeout(d.dat.to);
				d.dat.to = false;
			} else {
				// 播放
				d.addCss("stop");	// firm
				this.player();
			}
		}));

		// 添加元素
		r.ctrl.mouse.add(r.subView.imgOut, {
			enableStat: 1
		});

		return r;
	};

	// 创建缩略图
	this.crtTub = function (tubID, fsize, noimg, scdCss) {
		var r = {};
		this.tub = r;

		// 元素
		r.view = new this.tools.Doe ({
			hd_doe: document.getElementById(tubID)
		});

		// 控制器
		r.ctrl = new this.tools.Tub ();

		// 添加事件
		r.ctrl.evt.draw.add(this.infDrawTub);
		r.ctrl.evt.scd.add(this.infDrawBigImg);

		// 添加元素
		r.ctrl.add (r.view, {
			vertical: true,
			fixedSize: fsize,
			count: 0,
			noimg: noimg,
			scdCss: scdCss,
			imgs: []
		});

		// 数据
		r.dat = r.view.dat["hct_tub"];

		// 防止选择越界（考虑将此限制加入控制器中）
		r.dat.area.vcNum.evt.before.add(function (v) {
			if (v >= r.dat.count) {
				return false;
			}
		});

		return r;
	};

	// 创建滚动条
	this.crtScrll = function (scrllID) {
		var r = {};
		this.scrll = r;

		// 元素
		r.view = new this.tools.Doe ({
			hd_doe: document.getElementById(scrllID)
		});

		// 添加事件
		r.view.addEvt("resize", this.tools.bind(this, this.resize));

		// 控制器
		r.ctrl = new this.tools.Spn ({
			vertical: true,
			enableDropBase: false
		});

		// 数据处理
		r.dat = new this.tools.Rnm ({
			min: 0,
			max: 0,
			isNorm: false,
			vcNum: this.tub.dat.area.vcMin
		});

		// 添加元素
		r.ctrl.add (r.view, null, r.dat);

		return r;
	};

	// 创建查询条件
	this.crtCdt = function (conditionID, scdCss) {
		var s, d;
		var r={};
		this.condition = r;

		// 元素
		r.view = new this.tools.Doe ({
			hd_doe: document.getElementById(conditionID)
		});

		// 子元素
		r.subView = {
			date: r.view.getById("date"),
			time: r.view.getById("time"),
			ttyp: r.view.getById("ttyp"),
			area: r.view.getById("area"),
			mod: r.view.getById("mod"),
			fom: r.view.getById("fom")
		};

		// 控制器
		r.ctrl = {
			ttyp: new this.tools.Scd({css: scdCss}),
			area: new this.tools.Scd({css: scdCss}),
			mod: new this.tools.Scd({css: scdCss}),
			fom: new this.tools.Scd({css: scdCss})
		};

		// 添加元素
		for (s in r.ctrl) {
			d = r.subView[s].first;
			while(d) {
				r.ctrl[s].add(d);
				d = d.next;
			}
		}

		// 初始化选中状态
		d = new this.tools.Tim();
		d.add(-24 * 3600 *1000);
		r.subView.date.doe.value = d.format("yyyy-MM-dd");
		this.scd("ttyp", "day");
		this.scd("area", "d02");
		this.scd("mod", "NAQPMS");
		this.scd("fom", "pm25");

		// 添加事件
		r.subView.date.addEvt("change", this.tools.bind(this, this.chgDate));
		r.subView.time.addEvt("change", this.tools.bind(this, this.chgTime));
		r.ctrl.ttyp.vcCur.evt.change.add(this.tools.bind(this, this.chgTtyp));
		r.ctrl.area.vcCur.evt.change.add(this.tools.bind(this, this.chgArea));
		r.ctrl.mod.vcCur.evt.change.add(this.tools.bind(this, this.chgMod));
		r.ctrl.fom.vcCur.evt.change.add(this.tools.bind(this, this.chgFom));

		return r;
	};

	// 处理日期变化
	this.chgDate = function () {
		if (!this.nodo) {
			this.getDat();
		}
	};

	// 处理时次变化
	this.chgTime = function () {
		if (!this.nodo) {
			this.getDat();
		}
	};

	// 处理日期类型变化
	this.chgTtyp = function () {
		var d = this.getCdt();	// 查询条件
		this.setFomVisibleByTtypMod(d, "nosee");	// firm
		if (!this.nodo) {
			this.getDat();
		}
	};

	// 处理区域变化
	this.chgArea = function () {
		var d = this.getCdt();	// 查询条件
		this.setModVisibleByArea(d, "nosee");	// firm
		if (!this.nodo) {
			this.getDat();
		}
	};

	// 处理模式变化
	this.chgMod = function () {
		var d = this.getCdt();	// 查询条件
		this.setFomVisibleByTtypMod(d, "nosee");	// firm
		if (!this.nodo) {
			this.getDat();
		}
	};

	// 处理污染物变化
	this.chgFom = function () {
		if (!this.nodo) {
			this.getDat();
		}
	};

	// 选中
	this.scd = function (ctrlNam, optionNam) {
		this.condition.subView[ctrlNam].getById(optionNam).dat.hct_scd.set(true);
	};

	// 动画播放
	this.player = this.tools.bind (this, function () {
		var d = this.tub.dat;
		if (d.area.get() === (d.count - 1)) {
			d.area.set(0);
		} else {
			d.area.add(1);
		}
		d = this.bigImg.subView;
		d.play.dat.to = setTimeout(this.player, d.speed.doe.value);	// firm
	});

	// 变更数据
	this.chgDat = function (dat, count, start) {
		if (!dat) {
			dat = [];
		}
		if (!count) {
			count = dat.length;
		}
		if (!start) {
			start = 0;
		}

		this.scrll.dat.vcMin.set(start, false);
		this.scrll.dat.vcMax.set(count - this.tub.dat.showNum, false);
		this.tub.dat.count = count;
		this.tub.dat.imgsi = start;
		this.tub.dat.imgs = dat;
		this.tub.ctrl.resize(this.tub.view);

		var i = this.tub.dat.area.get();
		this.infDrawBigImg (null, dat[i]);
	};

	// 获取图片路径
	this.getDat = function () {
		this.getDatByWebSocket();
		// this.getDatSg();	// 单机测试
	};

	// 获取图片路径（web socket）
	this.getDatByWebSocket = function () {
		var d = this.getCdt();	// 查询条件
		var sql = this.crtSQL(d);
		var r={
			count: 0,
			dat: []
		};

		//创建WebSocket对象
		var websocket = new WebSocket(this.wsServer);

		websocket.onopen = function (evt) {
			//已经建立连接
			// console.log("onopen : ");
			websocket.send(sql);
		};

		websocket.onclose = function (evt) {
			//已经关闭连接
			// console.log("onclose : ");
		};

		websocket.onerror = this.tools.bind (this, function (evt) {
			//产生异常
			// console.log("onerror : ");
			// this.chgDat();	// 清空数据
		});

		websocket.onmessage = this.tools.bind (this, function (evt) {
			//收到服务器消息，使用evt.data提取
			// console.log(evt.data);
			var data = this.tools.utJson.toObj(evt.data);
			switch (data.state) {
				case "0":
					data.URL = this.httpServer + data.URL;
					r.dat.push(data);
					if (r.dat.length === r.count) {
						this.chgDat(r.dat);
						if (r.count < this.tub.dat.area.get()) {
							this.tub.dat.area.set(0);
						}
						this.tub.dat.area.vcMin.set(this.tub.dat.calcMin());
					}
					break;
				case "5":
					r.count = data.count;
					break;
				default:
					// console.log("state : " + data.state);
					this.chgDat();	// 清空数据
					break;
			}
		});
	};

	// 获取查询条件
	this.getCdt = function () {
		var d = this.condition.subView;
		var c = this.condition.ctrl;
		return {
			date: d.date.doe.value,
			time: d.time.doe.value,
			ttyp: c.ttyp.vcCur.get().id.get(),
			area: c.area.vcCur.get().id.get(),
			mod: c.mod.vcCur.get().id.get(),
			fom: c.fom.vcCur.get().id.get()
		};
	};

	// 根据模式和区域确定查询天数
	this.getDayNumByAreaMod = function (cdt) {
		var d = {
			d01: {
				NAQPMS: 7,
				CMAQ: 7,
				CAMx: 7,
				WRF: 7
			},
			d02: {
				NAQPMS: 4,
				CMAQ: 4,
				CAMx: 4,
				WRF: 4
			},
			d03: {
				NAQPMS: 4,
				CMAQ: 4,
				CAMx: 4,
				WRF: 4
			}
		};
		return d[cdt.area][cdt.mod];
	};

	// 根据时间类型和污染物确定查询编号
	this.getIdByTtypFom = function (cdt) {
		var d = {
			hour: {
				// aqi: "",
				pm25: "35",
				pm10: "32",
				o3: "34",
				// o38: "",
				co: "33",
				so2: "30",
				no2: "31",
				dult: "53",
				seasalt: "54"
			},
			day: {
				aqi: "3E",
				pm25: "3A",
				pm10: "38",
				// o3: "",
				o38: "3D",
				co: "39",
				so2: "36",
				no2: "37",
				dult: "55",
				seasalt: "56"
			}
		};
		return d[cdt.ttyp][cdt.fom];
	};

	// 根据区域调整模式的可见性
	this.setModVisibleByArea = function (cdt, visibleCss) {
		// 区域内可显示的模式
		var d = {
			d01: {
				NAQPMS: true,
				CMAQ: true,
				WRF: true
			},
			d02: {
				NAQPMS: true,
				CMAQ: true,
				CAMx: true,
				WRF: true
			},
			d03: {
				NAQPMS: true,
				CMAQ: true,
				CAMx: true,
				WRF: true
			}
		};

		var m = this.condition.subView.mod;
		var s;
		for (s in m.subs) {
			if (d[cdt.area][s]) {
				m.subs[s].delCss(visibleCss);
			} else {
				m.subs[s].addCss(visibleCss);
				if (s === cdt.mod) {
					// 切换模式
					this.nodo = true;
					this.scd("mod", "CMAQ");
					this.nodo = false;
				}
			}
		}
	};

	// 根据日期类型模式调整污染物的可见性
	this.setFomVisibleByTtypMod = function (cdt, visibleCss) {
		// 时间类型下可显示的污染物
		var d1 = {
			hour: {
				// aqi: "",
				pm25: "35",
				pm10: "32",
				o3: "34",
				// o38: "",
				co: "33",
				so2: "30",
				no2: "31",
				dult: "53",
				seasalt: "54"
			},
			day: {
				aqi: "3E",
				pm25: "3A",
				pm10: "38",
				// o3: "",
				o38: "3D",
				co: "39",
				so2: "36",
				no2: "37",
				dult: "55",
				seasalt: "56"
			}
		};

		// 模式下可显示的污染物
		var d2 = {
			NAQPMS: {
				aqi: true,
				pm25: true,
				pm10: true,
				o3: true,
				o38: true,
				co: true,
				so2: true,
				no2: true,
				dult: true,
				seasalt: true
			},
			CMAQ: {
				aqi: true,
				pm25: true,
				pm10: true,
				o3: true,
				o38: true,
				co: true,
				so2: true,
				no2: true
			},
			CAMx: {
				aqi: true,
				pm25: true,
				pm10: true,
				o3: true,
				o38: true,
				co: true,
				so2: true,
				no2: true
			},
			WRF: {
				aqi: true,
				pm25: true,
				pm10: true,
				o3: true,
				o38: true,
				co: true,
				so2: true,
				no2: true
			}
		};

		// 对应条件下 默认显示的污染物
		var d3 = {
			hour: {
				NAQPMS: "pm25",
				CMAQ: "pm25",
				CAMx: "pm25",
				WRF: "pm25"
			},
			day: {
				NAQPMS: "aqi",
				CMAQ: "aqi",
				CAMx: "aqi",
				WRF: "aqi"
			}
		};

		var f = this.condition.subView.fom;
		var s;
		for (s in f.subs) {
			if (d1[cdt.ttyp][s] && d2[cdt.mod][s]) {
				f.subs[s].delCss(visibleCss);
			} else {
				f.subs[s].addCss(visibleCss);
				if (s === cdt.fom) {
					// 切换污染物
					this.nodo = true;
					this.scd("fom", d3[cdt.ttyp][cdt.mod]);
					this.nodo = false;
				}
			}
		}
	};

	// 生成查询字串
	this.crtSQL = function (cdt) {
		// {"type":"picURL","sort":0,"picType":["3E"],"3E":{"modelType":["NAQPMS"],"domain":["d01"],"times":"2016081620","periodStart":4,"periodEnd":172}}
		var r = "{\"type\":\"picURL\",\"sort\":0,\"picType\":[\"";
		var id = this.getIdByTtypFom(cdt);
		var num = this.getDayNumByAreaMod(cdt);
		r += id;
		r += "\"],\"";
		r += id;
		r += "\":{\"modelType\":[\"";
		r += cdt.mod;
		r += "\"],\"domain\":[\"";
		r += cdt.area;
		r += "\"],\"times\":\"";
		r += cdt.date.replace(/-/g, "");
		r += cdt.time.substr(0, 2);
		r += "\",\"periodStart\":4,\"periodEnd\":";
		r += (num * 24 + 4);
		r += "}}";
		return r;
	};

	// 重置
	this.resize = function (cdt) {
		// 大图
		var d = this.bigImg.subView.img;
		d.setStyle("width", "100%");
		d.setStyle("height", "100%");
		d.calcPosition();
		this.bigImg.subView.imgOut.calcPosition();
		this.bigImg.dat.set(1);

		// 缩略图
		this.tub.ctrl.resize(this.tub.view);

		// 滚动条
		this.scrll.dat.vcMax.set (this.tub.dat.count - this.tub.dat.showNum, false);
		this.scrll.view.calcPosition();
	};

	// 获取图片路径（单机测试）
	this.getDatSg = function () {
		// 变更数据（单机测试）
		this.chgDat([
			{URL: "http://img10.360buyimg.com/n1/s200x200_g8/M02/11/1A/rBEHaFDhesUIAAAAAAeEAFRiTn4AADfCQGggXQAB4QY931.jpg"},
			{URL: "http://img14.360buyimg.com/n1/s200x200_jfs/t715/146/1238646968/198901/fd69887e/5525cc5aNc226c0a3.jpg"},
			{URL: "http://img10.360buyimg.com/n1/s200x200_12872/2c6769ed-beac-4292-9783-0746afdfe15c.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_jfs/t1150/55/60531290/82594/e8fe4175/54f6bc66Neb72401a.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_jfs/t946/4/514948873/282274/2aac9534/552b1e08N842dc1ba.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_jfs/t2410/362/2697287605/206318/2d9c3b8b/56e65c86N4faf9989.jpg"},
			{URL: "http://img13.360buyimg.com/n1/s200x200_g6/M00/02/00/rBEGF1CZ3hQIAAAAAABA6i2rCLUAAAZEAOKV6IAAEEC587.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_18865/9ef225da-a41a-4bcc-a323-71b6922e3b27.jpg"},
			{URL: "http://img13.360buyimg.com/n1/s200x200_16603/bfe7a46a-ec9b-4168-a449-e4914fe137a5.jpg"},
			{URL: "http://img13.360buyimg.com/n1/s200x200_15162/b1b91281-6637-4586-86bf-ebd616f36a32.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_jfs/t2458/218/879747415/43452/5e9feada/5632fe35Necf52adf.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_jfs/t319/285/974074424/207046/e1439446/542a1d61Ned52d4a7.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_jfs/t199/226/757537066/271181/acecc3ea/5398fc93Na9cec32e.jpg"},
			{URL: "http://img10.360buyimg.com/n1/s200x200_10123/fd1c9d33-780b-4512-99d9-65f8b67577c8.jpg"},
			{URL: "http://img14.360buyimg.com/n1/s200x200_g14/M0A/03/0E/rBEhVVKWCDoIAAAAAAB8f-soT5IAAGKbQA7btwAAHyX037.jpg"},
			{URL: "http://img14.360buyimg.com/n1/s200x200_jfs/t892/69/1369820507/226733/9f88e5ab/559b8c16Na168f456.jpg"},
			{URL: "http://img10.360buyimg.com/n1/s200x200_jfs/t439/196/493068263/265465/4da89c15/542007d4N8c699fe0.jpg"},
			{URL: "http://img10.360buyimg.com/n1/s200x200_g7/M01/0E/0F/rBEHZlClpz8IAAAAAADeuaNtLWQAAC1CgJl8bQAAN7R916.jpg"},
			{URL: "http://img14.360buyimg.com/n1/s200x200_jfs/t2308/17/1283753987/374339/508ce42/564ebde8N6127c2f8.jpg"},
			{URL: "http://img12.360buyimg.com/n1/s200x200_19707/f2a81fd0-95d8-42ec-8c94-2e8b9641bc73.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_g5/M00/01/1F/rBEIC0_NZIQIAAAAAAC__xvIFKAAAAYzQDYLcIAAMAX120.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_jfs/t2356/12/1219561495/122805/635d719a/5644b910N9b5a36cd.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_jfs/t2200/305/2246504492/86211/a5472cf1/56fe3618N5a97fa0d.jpg"},
			{URL: "http://img13.360buyimg.com/n1/s200x200_12399/a3c8e518-fe59-49ce-ab5a-246e6f85e960.jpg"},
			{URL: "http://img12.360buyimg.com/n1/s200x200_15352/fb6fd627-3941-43e5-8ce7-e5bae4d8cc52.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_g15/M0A/01/0D/rBEhWlHyHn8IAAAAAATDsm_ivtcAABacwK61hEABMPK251.jpg"},
			{URL: "http://img12.360buyimg.com/n1/s200x200_g5/M00/01/1F/rBEIDE_NbqMIAAAAAABIeoXCo4QAAAY5QF5fisAAEiS099.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_jfs/t2521/102/698481107/218877/3eb70bec/56601bc2N138550f7.jpg"},
			{URL: "http://img14.360buyimg.com/n1/s200x200_jfs/t172/296/785263428/515310/2646b92/5398fcbdN688d96ba.jpg"},
			{URL: "http://img10.360buyimg.com/n1/s200x200_jfs/t646/63/99839254/116110/8a58694d/544ef4e3N3d624f6c.jpg"},
			{URL: "http://img10.360buyimg.com/n1/s200x200_jfs/t2572/190/701635386/201774/87deb8e/56601bc2N46658ed7.jpg"},
			{URL: "http://img10.360buyimg.com/n1/s200x200_jfs/t2263/328/2656301784/43631/f1a08a76/56e2a511Nb2f8e44b.jpg"},
			{URL: "http://img14.360buyimg.com/n1/s200x200_jfs/t2680/150/1420300884/102952/aa5dc5ce/573e81e1N3cba0c5d.jpg"},
			{URL: "http://img12.360buyimg.com/n1/s200x200_jfs/t958/265/743410361/33998/5c1613a9/5541befdN0bf88524.jpg"},
			{URL: "http://img10.360buyimg.com/n1/s200x200_jfs/t2338/67/2024777470/200877/a7c6b9/56eb6d51N1483d17d.jpg"},
			{URL: "http://img14.360buyimg.com/n1/s200x200_jfs/t2212/303/3009068597/20763/266248ce/56f8ac23N9014a030.jpg"},
			{URL: "http://img12.360buyimg.com/n1/s200x200_jfs/t1891/15/1041448923/181081/cf84fd3e/564150d6N9a0e22b3.jpg"},
			{URL: "http://img14.360buyimg.com/n1/s200x200_jfs/t2056/98/2681997838/137654/d72ac606/57165cc2Ne6768010.jpg"},
			{URL: "http://img12.360buyimg.com/n1/s200x200_jfs/t169/6/2217702176/20437/dee753e5/53c89bedNc5d6600a.jpg"},
			{URL: "http://img12.360buyimg.com/n1/s200x200_jfs/t2320/350/2637490787/9685/18e91b26/56ed5eddN4a982cb1.jpg"},
			{URL: "http://img12.360buyimg.com/n1/s200x200_15291/c621be80-8f62-4af8-9c61-266593aec160.jpg"},
			{URL: "http://img12.360buyimg.com/n1/s200x200_g13/M09/00/06/rBEhVFMyhWEIAAAAAAKcjm_zOXYAAKwEAHhUEYAApym198.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_16320/47013af1-e9a2-4344-aded-79df52e13d85.jpg"},
			{URL: "http://img13.360buyimg.com/n1/s200x200_g8/M02/11/1A/rBEHaFDhesUIAAAAAAevViYBVzUAADfCQGW7DIAB69u111.jpg"},
			{URL: "http://img13.360buyimg.com/n1/s200x200_jfs/t2341/230/2423170739/18000/4348f921/57043b33N22d574e9.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_19620/6671b264-2953-49d2-8528-ddaf0b00627b.jpg"},
			{URL: "http://img13.360buyimg.com/n1/s200x200_jfs/t2146/209/2414439823/33533/97fcfc79/5703f172N3222a7a7.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_jfs/t2461/159/2106804353/65610/36080ce9/56ac1735Ndb2e79fa.jpg"},
			{URL: "http://img10.360buyimg.com/n1/s200x200_g14/M00/19/00/rBEhVVJyi0cIAAAAAABvb_fe0hsAAE43QAENwEAAG-H539.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_g13/M05/15/1C/rBEhVFJ8cCUIAAAAAABEnB6B4_MAAFK1wK4rF8AAES0531.jpg"},
			{URL: "http://img13.360buyimg.com/n1/s200x200_jfs/t1927/312/2234456011/30908/e462d143/56ac14a4N3bcd5be5.jpg"},
			{URL: "http://img13.360buyimg.com/n1/s200x200_jfs/t2602/225/867477936/56601/219e85f/5729bdabNc28d438b.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_g6/M00/01/0E/rBEGDFCQ0csIAAAAAADKdmaK2lMAAASKwIfsgMAAMqO742.jpg"},
			{URL: "http://img13.360buyimg.com/n1/s200x200_jfs/t178/12/2233524030/36854/489a495d/53c89bf7Nf016ec38.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_jfs/t2653/153/1511156329/62192/adc7242f/5741971cNa7ba0cf7.jpg"},
			{URL: "http://img12.360buyimg.com/n1/s200x200_jfs/t214/100/1299126146/10336/e90044cc/53f91763N563743b2.jpg"},
			{URL: "http://img10.360buyimg.com/n1/s200x200_g15/M06/14/1A/rBEhWFJ9IKsIAAAAAABfgAWJKmEAAFM0QDTtYYAAF-Y359.jpg"},
			{URL: "http://img10.360buyimg.com/n1/s200x200_jfs/t610/206/282279078/21074/d00359e6/545b2718Nc5a71602.jpg"},
			{URL: "http://img10.360buyimg.com/n1/s200x200_g13/M04/12/18/rBEhUlJpX3kIAAAAAAB4xWT1T1IAAEjtAJ4X-MAAHjd894.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s200x200_jfs/t181/57/1078765423/33010/635e93a0/53a1b0eeN061072bd.jpg"},
			{URL: "http://img10.360buyimg.com/n3/jfs/t2983/17/901791703/32694/13520bed/576b8b17N44051185.jpg"},
			{URL: "http://img11.360buyimg.com/n3/jfs/t2662/293/1646689014/274732/9e21f011/57441787N080ff70a.jpg"},
			{URL: "http://img11.360buyimg.com/n3/jfs/t1894/44/2598490993/80127/a5f95214/56e8f790Nf3628538.jpg"},
			{URL: "http://img11.360buyimg.com/n3/jfs/t2635/302/3611432244/508026/d5be3969/5791cd4dN1f1e3e61.jpg"},
			{URL: "http://img13.360buyimg.com/n3/jfs/t2299/66/1067879516/137498/ea3bedb3/566a4af8N745b18d2.jpg"},
			{URL: "http://img13.360buyimg.com/n3/jfs/t2698/353/2954854023/171676/a5097913/5779c54cN521cad18.jpg"},
			{URL: "http://img10.360buyimg.com/n3/g14/M0A/1D/1D/rBEhV1M-HdsIAAAAAAFUizrYE8cAALVUQKAAI0AAVSj547.jpg"},
			{URL: "http://img12.360buyimg.com/n1/s70x70_jfs/t151/304/1828204199/116532/7801c860/53ba80f9Nfa2ee9cd.jpg"},
			{URL: "http://img11.360buyimg.com/n1/s70x70_jfs/t2209/79/1577493778/179484/3cbe8c4b/56655f41N4f6852c3.jpg"},
			{URL: "http://img10.360buyimg.com/n1/s70x70_jfs/t2545/267/131895983/367674/cce4fea4/5638a518N79517485.jpg"},
		]);
		this.tub.dat.area.set(0);
	};

	/*---------------- 接口 ---------------*/
	// 缩略图的图块绘制
	this.infDrawTub = function (doeo, img, imgDoeo) {};

	// 大图绘制
	this.infDrawBigImg = function (doeo, img) {};
}
