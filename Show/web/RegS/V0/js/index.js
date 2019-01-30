
function Test () {
	// 配置信息
	this.config = {
		ttyp: [
			{
				"title": "小时值",
				"pic": "icon-clock",
				"value": 1
			},
			{
				"title": "日均值",
				"pic": "icon-calendar",
				"value": 0,
				"checked": true
			}
		],

		fom: [
			{
				"title": "PM<sub>2.5</sub>",
				"value": ["3A", "35"],
				"legend": [
					["d/PM2.5_d.png", "d/PM2.5_daqi.png"],
					["h/PM2.5_h.png", "h/PM2.5_haqi.png"]
				],
				"checked": true
			},
			{
				"title": "CO",
				"legend": [
					["d/CO_d.png", "d/CO_daqi.png"],
					["h/CO_h.png", "h/CO_haqi.png"]
				],
				"value": ["39", "33"]
			},
			{
				"title": "SO<sub>2</sub>",
				"legend": [
					["d/SO2_d.png", "d/SO2_daqi.png"],
					["h/SO2_h.png", "h/SO2_haqi.png"]
				],
				"value": ["36", "30"]
			},
			{
				"title": "PM<sub>10</sub>",
				"legend": [
					["d/PM10_d.png", "d/PM10_daqi.png"],
					["h/PM10_h.png", "h/PM10_haqi.png"]
				],
				"value": ["38", "32"]
			},
			{
				"title": "NO<sub>2</sub>",
				"legend": [
					["d/NO2_d.png", "d/NO2_daqi.png"],
					["h/NO2_h.png", "h/NO2_haqi.png"]
				],
				"value": ["37", "31"]
			},
			{
				"title": "O<sub>3</sub>",
				"legend": [
					["d/O3_d.png", "d/O3_daqi.png"],
					["h/O3_h.png", "h/O3_haqi.png"]
				],
				"value": ["", "34"]
			}
		],
		fom_day: [0, 1, 2, 3, 4],
		fom_hour: [0, 1, 2, 3, 4, 5],
		dayFom: 0,
		hourFom: 1,

		cloud: [
			{
				"title": "湿度",
				"value": 4,
				"checked": true
			},
			{
				"title": "气压",
				"value": 5,
				"checked": false
			},
			{
				"title": "温度",
				"value": 3,
				"checked": false
			}
		],

		layer: [
			{
				"title": "分布图",
				"pic": "icon-eye-blocked",
				"picDown": "icon-eye",
				"alpha": "icon-onedrive",
				"value": 0,
				"checked": true
			},
			{
				"title": "地图",
				"pic": "icon-eye-blocked",
				"picDown": "icon-eye",
				"alpha": "icon-earth",
				"value": 1,
				"checked": true
			},
			{
				"title": "气象条件",
				"pic": "icon-eye-blocked",
				"picDown": "icon-eye",
				"alpha": "icon-leaf",
				"value": 4,
				"checked": false
			}
		],

		fram: [
			{
				"title": "1帧",
				"pic": "icon-radio-unchecked",
				"picDown": "icon-radio-checked",
				"value": 1,
				"checked": true
			},
			{
				"title": "3帧",
				"pic": "icon-radio-unchecked",
				"picDown": "icon-radio-checked",
				"value": 3
			},
			{
				"title": "6帧",
				"pic": "icon-radio-unchecked",
				"picDown": "icon-radio-checked",
				"value": 6
			}
		],

		area: [
			{
				"title": "中国中部",
				"value": 1,
				"dayNum": 7,
				"area": {
					"latt": 44.4545,
					"latb": 29,
					"lonl": 93,
					"lonr":117
				},
				"checked": true
			},
			{
				"title": "宁夏",
				"value": 2,
				"dayNum": 4,
				"area": {
					"latt": 39.5076,
					"latb": 35,
					"lonl": 102.5,
					"lonr":109.5
				}
			},
			{
				"title": "银川",
				"value": 3,
				"dayNum": 4,
				"area": {
					"latt": 38.8167,
					"latb": 37.4,
					"lonl": 105.3,
					"lonr":107.5
				}
			}
		],

		model: [
			{
				"label": "NAQPMS",
				"value": "NAQPMS",
				"interval": [7, 4, 4, 4]
			},
			{
				"label": "CAMX",
				"value": "CAMx",
				"interval": [4, 4, 4, 4]
			},
			{
				"label": "CMAQ",
				"value": "CMAQ",
				"interval": [4, 4, 4, 4]
			},
			{
				"label": "WRF-CHEM",
				"value": "WRFchem",
				"interval": [4, 3, 3, 3]
			}
		],

		wsInfo: {
			url: "/Pic/img"
		},

		speed: 6,

		imgPath: "/Pic/img/web/RegS/V0/",
		compass: "/Pic/img/web/RegS/V0/compass1.png",
		legend: "/Pic/img/web/RegS/V0/legend.png"
	};

	// 小时日均选择
	this.ttyp = new LZR.HTML5.Util.Selector ({
		data:  this.config.ttyp,
		type: 6,
		checked: 1,
		titleClass: "ttypTitle",
		defaultClass: "ttypDef",
		overClass: "ttypOver",
		downClass: "ttypDown",
		rowNum: 3
	});
	this.ttyp.onDown = LZR.bind (this, function(d, i) {
		this.setTtyp(i, true);
	});

	// 污染物选择
	this.fom = new LZR.HTML5.Util.Selector ({
		data: this.config.fom,
		type: 5,
		checked: 1,
		defaultClass: "fomDef",
		overClass: "conBtnOver",
		downClass: "fomDown",
		rowNum: 0
	});
	this.fom.onDown = LZR.bind (this, function(d, i) {
		this.setFom(i, true);
	});

	// 气象条件选择
	this.cloud = new LZR.HTML5.Util.Selector ({
		data: this.config.cloud,
		type: 5,
		checked: 1,
		defaultClass: "fomDef",
		overClass: "conBtnOver",
		downClass: "fomDown",
		rowNum: 0
	});
	this.cloud.onDown = LZR.bind (this, function(d, i, p) {
		var ii = d[i].value;
		var pre = this.config.layer[2].value;
		if (ii !== pre) {
			this.rs.setLayerVisble (pre, false);
			this.config.layer[2].value = ii;
			this.rs.setLayerAlpha (ii, this.alpha[2].position);
			this.layer.onDown (this.config.layer, 2);
		}
	});

	// 图层选择
	this.layer = new LZR.HTML5.Util.Selector ({
		data: this.config.layer,
		type: 6,
		checked: 2,
		titleClass: "layerTitle",
		defaultClass: "layerDef",
		overClass: "conBtnOver",
		downClass: "layerDown",
		rowNum: 0
	});
	this.layer.onDown = LZR.bind (this, function(d, i) {
		var ii = d[i].value;
		if (d[i].checked) {
			this.layer.strips[i].backgroundColor = "";
			if (i>1) {
				if (!this.rs.tbn.imgs[0].layers[ii].obj) {
					this.rs.loadLayers (ii);
				} else if (this.rs.isBusyInLayersLoader(ii)) {
				} else {
				}
			}
		} else {
			this.layer.strips[i].backgroundColor = "#CCC";
			if (i>1) {
			}
		}

		this.rs.setLayerVisble (ii, d[i].checked);
		if (ii === 0) {
			this.rs.legend.visible = d[i].checked;
		}
	});

	// 图层透明度
	this.alpha = [];
	this.alphaFun = function(i, p) {
		var ii = this.config.layer[i].value;
		this.rs.setLayerAlpha (ii, p);
		if (ii === 0) {
			this.rs.legend.alpha = p;
		}
	};
	this.layer.strips = [];
	for (var i=0; i<this.config.layer.length; i++) {
		var p = new LZR.HTML5.Util.Scroll({
			count: 1,
			position: 1,
			direction: 1,
			padd: 0,
			len: "100%",
			stripClass: "alphaStrip",
			btnClass: "alphaBtn " + this.config.layer[i].alpha
		});
		this.layer.children[i].div.appendChild (p.div);
		p.onchange = LZR.bind (this, this.alphaFun, i);
		this.alpha.push(p);

		// 滚动条颜色
		this.layer.strips.push(p.strip.style);
	}

	// 帧频
	this.fram = new LZR.HTML5.Util.Selector ({
		data: this.config.fram,
		type: 6,
		checked: 1,
		titleClass: "framTitle",
		defaultClass: "framDef noselect",
		overClass: "conBtnOver",
		downClass: "conBtnNoSizeDown",
		rowNum: 0
	});
	this.fram.onDown = LZR.bind (this, function(d, i) {
		this.rs.setFrame (d[i].value);
	});

	// 播放动画
	this.play = new LZR.HTML5.Util.Select ({
		data: {
			title: "播放动画",
			pic: "icon-play2",
			checked: false,
			picDown: "icon-pause"
		},
		type: 0,
		defaultClass: "playDef"
	});
	this.play.onDown = LZR.bind (this, function(d) {
		if ( this.rs.changeAnimation() === 1) {
			this.rs.playSpeed = this.config.speed;
			this.play.setChecked (true);
		} else {
			this.play.setChecked (false);
		}
	});

	// 减慢播放速度
	this.btns = {};
	this.btns.subSpeed = new LZR.HTML5.Util.Select ({
		data: {
			title: "减慢播放速度",
			pic: "icon-backward",
			value: 1
		},
		type: 0,
		defaultClass: "conBtnDef",
		overClass: "conBtnOver",
		downClass: "conBtnNoSizeDown"
	});
	this.btns.subSpeed.onDown = LZR.bind (this, function(d) {
		this.rs.setSpeed (d.value);
	});

	// 加快播放速度
	this.btns.addSpeed = new LZR.HTML5.Util.Select ({
		data: {
			title: "加快播放速度",
			pic: "icon-forward2",
			value: -1
		},
		type: 0,
		defaultClass: "conBtnDef",
		overClass: "conBtnOver",
		downClass: "conBtnNoSizeDown"
	});
	this.btns.addSpeed.onDown = LZR.bind (this, function(d) {
		this.rs.setSpeed (d.value);
	});

	// 前一页
	this.btns.prev = new LZR.HTML5.Util.Select ({
		data: {
			title: "前一页",
			pic: "icon-circle-left"
		},
		type: 0,
		defaultClass: "floatDef floatLeft noselect",
		overClass: "floatOver",
		downClass: "floatDown"
	});
	this.btns.prev.onDown = LZR.bind (this, function(d) {
		this.rs.changePage (-1);
	});

	// 后一页
	this.btns.after = new LZR.HTML5.Util.Select ({
		data: {
			title: "后一页",
			pic: "icon-circle-right"
		},
		type: 0,
		defaultClass: "floatDef floatRight noselect",
		overClass: "floatOver",
		downClass: "floatDown"
	});
	this.btns.after.onDown = LZR.bind (this, function(d) {
		this.rs.changePage (1);
	});

	// 跳至第一帧
	this.btns.top = new LZR.HTML5.Util.Select ({
		data: {
			title: "跳至第一帧",
			pic: "icon-triangle-up"
		},
		type: 0,
		defaultClass: "headTailDef",
		overClass: "headTailOver",
		downClass: "floatDown"
	});
	this.btns.top.onDown = LZR.bind (this, function(d) {
		if ( this.rs.changeHeadTail (false) === 1 ) {
			this.rs.changeAnimation();
			this.play.setChecked(false);
		}
	});

	// 跳至最后一帧
	this.btns.bot = new LZR.HTML5.Util.Select ({
		data: {
			title: "跳至最后一帧",
			pic: "icon-triangle-down"
		},
		type: 0,
		defaultClass: "headTailDef headTailDef2",
		overClass: "headTailOver",
		downClass: "floatDown"
	});
	this.btns.bot.onDown = LZR.bind (this, function(d) {
		if ( this.rs.changeHeadTail (true) === 1 ) {
			this.rs.changeAnimation();
			this.play.setChecked(false);
		}
	});

	// 区域选择
	this.area = new LZR.HTML5.Util.Selector ({
		data: this.config.area,
		type: 5,
		checked: 1,
		defaultClass: "areaDefault",
		overClass: "areaOver",
		downClass: "areaDown",
		rowNum: 0
	});
	this.area.onDown = LZR.bind (this, function(d, i) {
		this.resetCondition();

		if  (this.regsMod.value == "CAMx") {
			if (d[i].value > 2) {
				this.rs.setMod ("CAMx", false);
			} else {
				this.rs.setMod ("CMAQ", false);
			}
		}

		this.rs.setArea (d[i].title, d[i].value, true, d[i].dayNum, d[i].area);
	});

	// 添加功能
	this.addFun = function () {

		// 透明度自适应窗体
		LZR.HTML5.Util.Event.addEvent (window, "resize", LZR.bind(this, function() {
			for (var i=0; i<this.alpha.length; i++) {
				this.alpha[i].init();
			}
		}), false);

		// 日期
		this.regsDate.onblur = LZR.bind (this, function() {
			this.resetCondition();
			this.setTim();
		});

		// 时次
		this.regsTim.onchange = LZR.bind (this, function() {
			this.resetCondition();
			this.setTim();
		});

		// 模式
		this.regsMod.onchange = LZR.bind (this, function() {
			var v = this.regsMod.value;
			this.resetPlay();
			// 修正区域的时间
			for (var i=0; i<this.config.model.length; i++) {
				if (v === this.config.model[i].value) {
					this.handleDayNum(i);
					break;
				}
			}

			if (v == "CAMx" && this.rs.condition.area <= 2) {
				v = "CMAQ";
			}

			this.rs.setMod (v, true, this.config.area[this.area.onlyCheck].dayNum);
		});

		// 全屏按钮功能
		this.fullScrn.btn.onclick = LZR.bind (this, function () {
			this.resetPlay();
			this.fullScrn.className = "fullScrn";
			this.fullScrn.cav.appendChild (this.map);
			this.rs.resize();
			this.rs.hdMapArea();

			if (!this.rs.pen) {
				this.rs.pen = new LZR.HTML5.Canvas.PenLayer({
					name: "pen",
					cav: this.fullScrn.pencav,
					layerMgr: this.rs.map
				});
			}
			this.rs.map.addLayer (this.rs.pen);
			this.rs.pen.ctrlEnable();
			this.rs.pen.init();
		});

		// 退出全屏功能
		this.fullScrn.exit.onclick = LZR.bind (this, function () {
			this.rs.pen.clear();
			this.rs.pen.ctrlDisable();
			this.rs.map.delLayer( this.rs.map.getIndexByName (this.rs.pen.name) );

			this.fullScrn.className = "nosee";
			this.mapDiv.appendChild (this.map);
			this.rs.resize();
			this.rs.hdMapArea();
		});

		// 全屏清空功能
		this.fullScrn.eraser.onclick = LZR.bind (this, function () {
			this.rs.pen.clear();
		});

		// 全屏颜色
		this.fullScrn.colors = {};
		this.fullScrn.colors.subs = {
			red: {
				parent: this.fullScrn.colors,
				id: "red",
				color: [255, 0, 0, 255],
				selected: true
			},
			green: {
				parent: this.fullScrn.colors,
				id: "green",
				color: [0, 255, 0, 255],
				selected: false
			},
			blue: {
				parent: this.fullScrn.colors,
				id: "blue",
				color: [0, 0, 255, 255],
				selected: false
			},
			black: {
				parent: this.fullScrn.colors,
				id: "black",
				color: [0, 0, 0, 255],
				selected: false
			}
		};
		this.fullScrn.colors.click = function (s) {
			if (!s.selected) {
				s.parent.cur.selected = false;
				s.parent.cur.view.className = "colorbtn noselect";
				s.selected = true;
				s.parent.cur = s;
				s.view.className = "colorbtn noselect colorbtnSelect";
				this.rs.pen.color = s.color;
			}
		};
		for (var s in this.fullScrn.colors.subs) {
			s = this.fullScrn.colors.subs[s];
			s.view = document.createElement("div");
			s.view.innerHTML = "&nbsp&nbsp";
			if (s.selected) {
				this.fullScrn.colors.cur = s;
				s.view.className = "colorbtn noselect colorbtnSelect";
			} else {
				s.view.className = "colorbtn noselect";
			}
			s.view.style.backgroundColor = s.id;
			s.view.onclick = LZR.bind (this, this.fullScrn.colors.click, s);
			this.fullScrn.bar.appendChild(s.view);
		}

	};

	// 根据被选中的模式调整区域的显示天数
	this.handleDayNum = function (modelId) {
		var d = this.config.model[modelId].interval;
		for (var i = 0; i<this.config.area.length; i++) {
			this.config.area[i].dayNum = d[i];
		}
	};

	// 条件初始化
	this.initCondition = function() {
		// 日期、时次
		this.setTim (false);

		// 模式
		this.rs.setMod (this.regsMod.value, false);

		// 小时/日均
		this.setTtyp(this.ttyp.onlyCheck, false);

		// 污染物
		var d = this.fom.data[this.fom.onlyCheck];
		this.setFom(this.fom.onlyCheck, false);

		// 区域
		d = this.area.data[this.area.onlyCheck];
		this.rs.setArea (d.title, d.value);
		this.rs.setDayNum (d.dayNum);
		this.rs.setRulerArea (d.area);

		// 帧频
		d = this.fram.data[this.fram.onlyCheck];
		this.rs.setFrame (d.value);

		// 透明度初始化
		for (var i=0; i<this.alpha.length; i++) {
			this.alpha[i].init();
			this.alpha[i].ctrlEnable();
		}

		// 还原条件
		this.resetCondition();
	};

	// 设置产品时间
	this.setTim = function (v) {
		var d, t, tn;
		var b = true;	// 是否刷新查询
		if (v === false) {
			b = false;
		}

		v = this.regsTim.options [this.regsTim.selectedIndex];
		tn = this.regsDate.innerHTML;
		d = LZR.Util.Date.getDate(tn);
		t = (v.value - 0);

		tn = LZR.Util.Date.addHour(t, d);
		d = LZR.Util.Date.toDate(tn);
		t = tn.getHours();
		tn = v.text;

// console.log (v);
// console.log (d);
// console.log (t);
// console.log (tn);
// console.log (b);

		this.rs.setTim (tn, t);
		this.rs.setDate (d, b);
	};

	// 设置小时/日均
	this.setTtyp = function (index, redo) {
		var i, d = this.config.ttyp[index];

		for (i = 0; i<this.fom.children.length; i++) {
			this.fom.children[i].div.style.display = "none";
		}
		// 污染物变换
		if (d.value === 1) {	// 小时
			for (i = 0; i<this.config.fom_hour.length; i++) {
				this.fom.children[this.config.fom_hour[i]].div.style.display = "inline-block";
			}
			i = this.config.hourFom;
		} else {		// 日均
			for (i = 0; i<this.config.fom_day.length; i++) {
				this.fom.children[this.config.fom_day[i]].div.style.display = "inline-block";
			}
			i = this.config.dayFom;
		}

		if (redo) {
			this.resetCondition();
			// this.setFom(i, false);
			this.setFom(0, false);
			this.rs.setTtyp (d.title, d.value);
		}

		this.rs.setTtyp (d.title, d.value, redo);
	};

	// 设置污染物
	this.setFom = function(index, redo) {
		if (redo) {
			this.resetPlay();
		}
/*
		// 更改图例
		if (this.config.fom[index].legend) {
			var leg = this.config.fom[index].legend[this.rs.condition.ttyp];
			if (leg) {
				this.rs.setLegendImg (this.rs.path + leg[0]);
				this.rs.setLegendOverImg (this.rs.path + leg[1]);
			}
		}
*/
		// 设置污染物
		this.rs.setFom (this.config.fom[index].title, this.config.fom[index].value, redo);

		// 同步选择面板
		if (index !== this.fom.onlyCheck) {
			this.fom.children[this.fom.onlyCheck].setChecked(false);
			this.fom.children[index].setChecked(true);
			this.fom.onlyCheck = index;
		}
	};

	// 还原动画播放
	this.resetPlay = function() {
		if (this.rs.playState === 1) {
			this.rs.changeAnimation();
			this.play.setChecked(false);
		}
	};

	// 还原条件
	this.resetCondition = function() {
		this.resetPlay();
		// 还原图层
		var i=0;
		for (i=0; i<2; i++) {
			this.layer.children[i].setChecked(true);
			this.layer.onDown (this.config.layer, i);
		}
		for (i=2; i<this.config.layer.length; i++) {
			this.layer.children[i].setChecked(false);
			this.layer.onDown (this.config.layer, i);
		}
		for (i=0; i<this.alpha.length; i++) {
			this.alpha[i].setPosition(1);
		}
	};

	// 创建主要对象, 并执行
	this.run = function () {
		this.rs = new LZR.HTML5.Bp.AirqMg.RegStat({
			condition: {
				layersInfo: [		// 图层信息获取条件
					{
						typ: ["4Z", "4V"],		// 风场
						mod: "NAQPMS"		// 模式条件
					},
					{
						typ: ["50", "4W"],		// 温度
						mod: "NAQPMS"		// 模式条件
					},
					{
						typ: ["51", "4X"],		// 湿度
						mod: "NAQPMS"		// 模式条件
					},
					{
						typ: ["52", "4Y"],		// 压强
						mod: "NAQPMS"		// 模式条件
					}
				]
			},
			scrollObj: {
				stripClass: "scrollStrip",
				btnClass: "scrollBtn",
				div: this.scroll
			},
			title: this.title,
			map: this.map,
			tbn: this.tbn,
			eys: this.eys
		});

		// this.rs.map.autoMove = false;
		// this.rs.map.autoZoom = false;
		// this.rs.mapArea = "center";
		this.rs.path = this.config.imgPath;
		this.rs.wsInfo = this.config.wsInfo;
/*
		this.rs.wsInfo = LZR.HTML5.Util.clone (this.config.wsInfo);
		this.rs.wsInfo.url = this.appConfig.WebSocketServer.url;
		if (this.rs.wsInfo.fld == "URL") {
			this.rs.wsInfo.pre = this.appConfig.imgServer.url + this.config.wsInfo.pre;
		}
*/

		this.rs.tbn.noBoder = true;
		this.rs.tbn.boderWidth = 2;
		this.rs.eys.showColor = "#6CF";
		this.rs.boderColor = "#CCC";
		this.rs.tbn.ctx.fillStyle = "#777";
		this.rs.tbn.beforeDraw = LZR.bind (this, function (tb, i, x, y, w, h) {
			if (i===tb.index) {
				tb.ctx.strokeStyle = "#6CF";
			} else {
				tb.ctx.strokeStyle = "#DDD";
			}
			tb.ctx.strokeRect( x-2 , y-2, w+4, h+30);
		});

		this.rs.loadCompass (this.config.compass);
		this.rs.loadLegend (this.config.legend);

		this.initCondition();
		this.rs.init();

	};

	// 更改图片加载方式
	this.changeImgLoad = function () {
		LZR.HTML5.Canvas.ImgLoader.prototype.addByWebSocket = function (wsInfo, data) {
			var path, nam, obj, step, i, j;
			nam = data.picType[0];
			obj = data[nam];
			obj.nam = nam;
			if (obj.times === "2015082320" && obj.modelType[0] === "NAQPMS") {
				switch (obj.nam) {
					case "39":
						path = "/fom/Day/co/";
						nam = "CODailySpa_";
						step = 24;
						break;
					case "37":
						path = "/fom/Day/no2/";
						nam = "NO2DailySpa_";
						step = 24;
						break;
					case "3D":
						// path = "/fom/Day/o3/";
						// nam = "O3DailySpa_";
						// step = 24;
						// break;
						return;	// 仅7/2有数
					case "38":
						path = "/fom/Day/pm10/";
						nam = "PM10DailySpa_";
						step = 24;
						break;
					case "3A":
						path = "/fom/Day/pm25/";
						nam = "PM25DailySpa_";
						step = 24;
						break;
					case "36":
						path = "/fom/Day/so2/";
						nam = "SO2DailySpa_";
						step = 24;
						break;
					case "33":
						path = "/fom/Hour/co/";
						nam = "COHourlySpa_";
						step = 1;
						break;
					case "31":
						path = "/fom/Hour/no2/";
						nam = "NO2HourlySpa_";
						step = 1;
						break;
					case "34":
						path = "/fom/Hour/o3/";
						nam = "O3HourlySpa_";
						step = 1;
						break;
					case "32":
						path = "/fom/Hour/pm10/";
						nam = "PM10HourlySpa_";
						step = 1;
						break;
					case "35":
						path = "/fom/Hour/pm25/";
						nam = "PM25HourlySpa_";
						step = 1;
						break;
					case "30":
						path = "/fom/Hour/so2/";
						nam = "SO2HourlySpa_";
						step = 1;
						break;
					case "52":
						path = "/meteor/Day/Pr/";
						nam = "PrDailySpa_";
						step = 24;
						break;
					case "51":
						path = "/meteor/Day/Rh/";
						nam = "RhDailySpa_";
						step = 24;
						break;
					case "50":
						path = "/meteor/Day/Te/";
						nam = "TeDailySpa_";
						step = 24;
						break;
					case "4Y":
						path = "/meteor/Hour/Pr/";
						nam = "PrHourlySpa_";
						step = 1;
						break;
					case "4X":
						path = "/meteor/Hour/Rh/";
						nam = "RhHourlySpa_";
						step = 1;
						break;
					case "4W":
						path = "/meteor/Hour/Te/";
						nam = "TeHourlySpa_";
						step = 1;
						break;
					default:
						return;
				}
				path += obj.times;
				nam += obj.domain[0];
				nam += "_";
				nam += obj.modelType[0];
				nam += "_";
				nam += obj.times;
				nam += "_";
				path += "/";
				path = wsInfo.url + path + nam;

				j = 0;
				for (i = obj.periodStart; i < obj.periodEnd; i += step) {
					nam = path + LZR.HTML5.Util.format (i, 3, "0") + ".png";
					this.add( nam, j );
					j++;
				}

			}
		};
	};

}

function init () {
	// 加载LZR库
	LZR.HTML5.jsPath = "/Pic/js/old/";
	LZR.HTML5.loadJs([
		LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat.js",
		LZR.HTML5.jsPath + "HTML5/util/Selector.js",
		LZR.HTML5.jsPath + "HTML5/Canvas/PenLayer.js"
	]);
	var t = new Test();

	// 更改图片加载方式
	t.changeImgLoad();

	// 生成界面
	document.getElementById("ttyp").appendChild(t.ttyp.div);		// 小时日均选择
	document.getElementById("fom").appendChild(t.fom.div);		// 污染物选择
	document.getElementById("cloud").appendChild(t.cloud.div);		// 气象条件选择
	document.getElementById("layer").appendChild(t.layer.div);		// 图层选择
	document.getElementById("fram").appendChild(t.fram.div);		// 帧频
	document.getElementById("area").appendChild(t.area.div);		// 区域选择
	document.getElementById("top").appendChild(t.btns.top.div);		// 跳至第一帧
	document.getElementById("bot").appendChild(t.btns.bot.div);		// 跳至最后一帧
	var p = document.getElementById("playOut");
	p.appendChild(t.btns.subSpeed.div);	// 减慢播放速度
	p.appendChild(t.play.div);		// 播放动画
	p.appendChild(t.btns.addSpeed.div);	// 加快播放速度
	t.eys = document.getElementById("eys");	// 缩略图
	t.tbn = document.getElementById("tbn");	// 缩略图
	t.scroll = document.getElementById("scroll");	// 滚动条
	t.title = document.getElementById("title");	// 标题
	t.map = document.getElementById("map");	// 地图
	t.mapDiv = document.getElementById("mapDiv");
	t.mapDiv.appendChild(t.btns.prev.div);		// 前一页
	t.mapDiv.appendChild(t.btns.after.div);		// 后一页
	t.regsDate = document.getElementById("regsDate");		// 产品日期
	t.regsTim = document.getElementById("regsTim");		// 产品时次
	t.regsMod = document.getElementById("regsMod");		// 模式
	t.fullScrn = document.getElementById("fullScrn");		// 全屏
	t.fullScrn.btn = document.getElementById("fullScrnBtn");	// 全屏按钮
	t.fullScrn.cav = document.getElementById("cav");		// 全屏容器
	t.fullScrn.pencav = document.getElementById("pencav");	// 全屏画布
	t.fullScrn.bar = document.getElementById("bar");		// 全屏工具栏
	t.fullScrn.exit = document.getElementById("exit");		// 退出全屏
	t.fullScrn.eraser = document.getElementById("eraser");	// 全屏擦除

	// 功能添加
	t.addFun();

	// 执行
	t.run();

}
