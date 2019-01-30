function init () {
	LZR.load([
		"LZR.Util",
		"LZR.HTML.Base.Doe",
		"LZR.HTML.Base.Ajax",

		"LZR.HTML.Base.Ctrl.Thumbnails",
		"LZR.HTML.Base.Ctrl.SglScd",
		"LZR.HTML.Base.Ctrl.NumBase.StripNum",
		"LZR.Base.Val.Tim",
		"LZR.Base.Str"
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
		utJson: LZR.getSingleton(LZR.Base.Json),
		utStr: LZR.getSingleton(LZR.Base.Str)
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

	// 时间筛选
	this.timFilt = "08";

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

		// 添加重置事件
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
			area: r.view.getById("area"),
			tim: r.view.getById("tim"),
			fom: r.view.getById("fom")
		};

		// 控制器
		r.ctrl = {
			area: new this.tools.Scd({css: scdCss}),
			tim: new this.tools.Scd({css: scdCss}),
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
		this.scd("area", "d01");
		this.scd("tim", "08");
		this.scd("fom", "00");

		// 添加事件
		r.subView.date.addEvt("change", this.tools.bind(this, this.chgDate));
		r.subView.time.addEvt("change", this.tools.bind(this, this.chgTime));
		r.ctrl.area.vcCur.evt.change.add(this.tools.bind(this, this.chgArea));
		r.ctrl.tim.vcCur.evt.change.add(this.tools.bind(this, this.chgTim));
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

	// 处理区域变化
	this.chgArea = function () {
		if (!this.nodo) {
			this.getDat();
		}
	};

	// 处理时间筛选变化
	this.chgTim = function (d) {
		this.timFilt = d.id.get();
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
	};

	// 获取图片路径（web socket）
	this.getDatByWebSocket = function () {
		var d = this.getCdt();	// 查询条件
		var sql = this.crtSQL(d);
		var r={
			ic: 0,
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
					r.ic ++;
					if (this.timFilt === "all" || (data.picTime.length>8 && this.tools.utStr.endWith(data.picTime, this.timFilt))) {
						data.picTime = this.normalizeTim(data.picTime);
						data.URL = this.httpServer + data.URL;
						r.dat.push(data);
					}
					if (r.ic === r.count) {
						this.chgDat(r.dat);
						if (r.dat.length < this.tub.dat.area.get()) {
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

	// 时间圆整
	this.normalizeTim = function (t) {
		var r = "";
		var i = 0;
		var d = t[i];
		while (d) {
			switch (i) {
				case 3:
				case 5:
					r += d;
					r += "-";
					break;
				case 8:
					r += " ";
					r += d;
					break;
				case 9:
					r += d;
					r += "时";
					break;
				default:
					r += d;
					break;
			}
			i++;
			d = t[i];
		}
		return r;
	};

	// 获取查询条件
	this.getCdt = function () {
		var d = this.condition.subView;
		var c = this.condition.ctrl;
		return {
			date: d.date.doe.value,
			time: d.time.doe.value,
			ttyp: "hour",
			area: c.area.vcCur.get().id.get(),
			mod: c.fom.vcCur.get().getAtt("mod"),
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

	// 生成查询字串
	this.crtSQL = function (cdt) {
		// {"type":"picURL","sort":0,"picType":["3E"],"3E":{"modelType":["NAQPMS"],"domain":["d01"],"times":"2016081620","periodStart":4,"periodEnd":172}}
		var r = "{\"type\":\"picURL\",\"sort\":0,\"picType\":[\"";
		// var id = this.getIdByTtypFom(cdt);
		var id = cdt.fom;
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

	/*---------------- 接口 ---------------*/
	// 缩略图的图块绘制
	this.infDrawTub = function (doeo, img, imgDoeo) {};

	// 大图绘制
	this.infDrawBigImg = function (doeo, img) {};
}
