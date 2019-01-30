
function init() {
	LZR.curPath = "/myLib";
	LZR.load([
		"LZR.HTML.Base.Ctrl.SglScd",
		"LZR.Pro.Green.Airq.App.ReleaseSys.DatMod",
		"LZR.Base.Time",
		"LZR.HTML.Base.Ajax"
	]);
	var s, v, t;
	var hw = {
		root: LZR,
		obj: {},
		Ol: ol,
		Ovy: ol.Overlay,
		Dm: LZR.Pro.Green.Airq.App.ReleaseSys.DatMod,
		Aqi: LZR.Pro.Green.Airq.Fom.Aqi,
		Doe: LZR.HTML.Base.Doe,
		Scd: LZR.HTML.Base.Ctrl.SglScd,
		Eal: LZR.Pro.Green.Airq.Alarm.EmAlarmLevel,
		Efl: LZR.Pro.Green.Airq.Fom.EmFomLevel,
		bind: LZR.getSingleton(LZR.Util).bind,
		ajx: new LZR.HTML.Base.Ajax(),
		utOlproj: ol.proj.fromLonLat,
		utJson: LZR.getSingleton(LZR.Base.Json),
		utTim: LZR.getSingleton(LZR.Base.Time)
	};
	hw.obj.root = hw;
	var hwo = hw.obj;

	// 配置信息
	hwo.dataIp = "http://192.168.1.235/hbServer/api/CityPublishInfo/GetProvinceAndCityPublishData?publishDate=";
	hw.Efl.emnull.imgUrl = "/Pic/img/web/ReleaseS/V0/a_Level0";
	hw.Efl.v1.imgUrl = "/Pic/img/web/ReleaseS/V0/a_Level1";
	hw.Efl.v2.imgUrl = "/Pic/img/web/ReleaseS/V0/a_Level2";
	hw.Efl.v3.imgUrl = "/Pic/img/web/ReleaseS/V0/a_Level3";
	hw.Efl.v4.imgUrl = "/Pic/img/web/ReleaseS/V0/a_Level4";
	hw.Efl.v5.imgUrl = "/Pic/img/web/ReleaseS/V0/a_Level5";
	hw.Efl.v6.imgUrl = "/Pic/img/web/ReleaseS/V0/a_Level6";
	hw.Efl.emnull.mapImgUrl = "/Pic/img/web/ReleaseS/V0/Level0";
	hw.Efl.v1.mapImgUrl = "/Pic/img/web/ReleaseS/V0/Level1";
	hw.Efl.v2.mapImgUrl = "/Pic/img/web/ReleaseS/V0/Level2";
	hw.Efl.v3.mapImgUrl = "/Pic/img/web/ReleaseS/V0/Level3";
	hw.Efl.v4.mapImgUrl = "/Pic/img/web/ReleaseS/V0/Level4";
	hw.Efl.v5.mapImgUrl = "/Pic/img/web/ReleaseS/V0/Level5";
	hw.Efl.v6.mapImgUrl = "/Pic/img/web/ReleaseS/V0/Level6";
	hw.Efl.emnull.numCss = "number-0";
	hw.Efl.v1.numCss = "number-a";
	hw.Efl.v2.numCss = "number-b";
	hw.Efl.v3.numCss = "number-c";
	hw.Efl.v4.numCss = "number-d";
	hw.Efl.v5.numCss = "number-e";
	hw.Efl.v6.numCss = "number-f";
	hw.Efl.v3.name = "轻度";
	hw.Efl.v4.name = "中度";
	hw.Efl.v5.name = "重度";
	hw.Efl.v6.name = "严重";
	hw.Eal.v1.css = "alarm1";
	hw.Eal.v2.css = "alarm2";
	hw.Eal.v3.css = "alarm3";

	// OpenLayers 的 地图
	hwo.zoomBase = 11;
	hwo.zoomOld = 8;
	hwo.zoomChange = function () {
		var s, v;
		var z = this.map.getView().getZoom();
		if (z >= this.zoomBase && this.zoomOld < this.zoomBase) {
			this.zoomOld = z;
			// 大图标
			for (s in this.list.subs) {
				v = this.list.subs[s];
				this.map.removeOverlay(v.mapSmallDoe.view);
				this.map.addOverlay(v.mapBigDoe.view);
			}
		} else if (this.zoomOld >= this.zoomBase && z < this.zoomBase) {
			this.zoomOld = z;
			// 小图标
			for (s in this.list.subs) {
				v = this.list.subs[s];
				this.map.removeOverlay(v.mapBigDoe.view);
				this.map.addOverlay(v.mapSmallDoe.view);
			}
		}
	};

	hwo.mapExtent = hw.utOlproj([114, 36]);	// min
	s = hw.utOlproj([120, 41]);	// max
	hwo.mapExtent.push(s[0]);
	hwo.mapExtent.push(s[1]);
	hwo.map = new hw.Ol.Map({
		layers: [
			new hw.Ol.layer.Tile({
				source: new hw.Ol.source.OSM()
			})
		],
		target: "map",
		view: new hw.Ol.View({
			projection: "EPSG:3857",
			zoom: hwo.zoomOld,
			minZoom: 8,	// 限制缩放级别
			maxZoom: 11,
			extent: hwo.mapExtent,	// 限制中心点范围
			center: hw.utOlproj([116.5, 38.2])
		})
	});
	hwo.map.on("moveend", hw.bind (hwo, hwo.zoomChange));

	// 健康提示
	hwo.tips = new hw.Doe({hd_doe:tips});
	hwo.tipsChange = function (doeo) {
		doeo.view.innerHTML = doeo.dat.memo;
	};
	hwo.tips.dat = {
		t1: {
			memo: "空气污染指数为0－50，空气质量级别为一级，空气质量状况属于优。此时，空气质量令人满意，基本无空气污染，各类人群可正常活动。"
		},
		t2: {
			memo: "空气污染指数为51－100，空气质量级别为二级，空气质量状况属于良。此时空气质量可接受，但某些污染物可能对极少数异常敏感人群健康有较弱影响，建议极少数异常敏感人群应减少户外活动。"
		},
		t3: {
			memo: "空气污染指数为101－150，空气质量级别为三级，空气质量状况属于轻度污染。此时，易感人群症状有轻度加剧，健康人群出现刺激症状。建议儿童、老年人及心脏病、呼吸系统疾病患者应减少长时间、高强度的户外锻炼。"
		},
		t4: {
			memo: "空气污染指数为151－200，空气质量级别为四级，空气质量状况属于中度污染。此时，进一步加剧易感人群症状，可能对健康人群心脏、呼吸系统有影响，建议疾病患者避免长时间、高强度的户外锻练，一般人群适量减少户外运动。"
		},
		t5: {
			memo: "空气污染指数为201－300，空气质量级别为五级，空气质量状况属于重度污染。此时，心脏病和肺病患者症状显著加剧，运动耐受力降低，健康人群普遍出现症状，建议儿童、老年人和心脏病、肺病患者应停留在室内，停止户外运动，一般人群减少户外运动。"
		},
		t6: {
			memo: "空气污染指数大于300，空气质量级别为六级，空气质量状况属于严重污染。此时，健康人群运动耐受力降低，有明显强烈症状，提前出现某些疾病，建议儿童、老年人和病人应当留在室内，避免体力消耗，一般人群应避免户外活动。"
		}
	};
	hwo.tips.view = tipsContent;
	hwo.tips.ctrl = new hw.Scd();
	hwo.tips.ctrl.css = "rignt_c_M";
	hwo.tips.ctrl.vcCur.setEventObj (hwo);
	hwo.tips.ctrl.vcCur.evt.change.add (hwo.tipsChange);
	for (s in hwo.tips.dat) {
		v = hwo.tips.subs[s];
		v.dat = hwo.tips.dat[s];
		v.view = hwo.tips.view;
		hwo.tips.ctrl.add (v);
	}
	hwo.tips.subs.t1.dat.hct_scd.set(true);

	// 时间控制
	hwo.tim = new hw.Doe ({ hd_doe: tim });
	hwo.timChange = function (doeo) {
		this.curTim.dat.tim = this.root.utTim.addHour (doeo.dat.tim, this.baseTim.dat.tim, true);
		this.curTim.doe.innerHTML = this.root.utTim.format (this.curTim.dat.tim, "mdChn") + "环境空气质量预报";
		this.flush();
	};
	hwo.curTim = hwo.tim.getById("curTim");
	hwo.curTim.dat = {};
	hwo.baseTim = hwo.tim.getById("baseTim");
	hwo.baseTim.dat = { tim: hw.utTim.normalize (null, 10) };	// 当前时间
	hwo.baseTim.doe.innerHTML = hw.utTim.format (hwo.baseTim.dat.tim, "hourChn") + "发布";
	hwo.timScd = new hw.Scd ();
	hwo.timScd.css = "main_middle_top_M";
	hwo.timScd.vcCur.setEventObj (hwo);
	hwo.timScd.vcCur.evt.change.add (hwo.timChange);
	hwo.timScd.add (hwo.tim.getById("tim24"));
	hwo.timScd.add (hwo.tim.getById("tim48"));
	hwo.timScd.add (hwo.tim.getById("tim72"));
	hwo.tim.getById("tim24").dat.tim = 24;
	hwo.tim.getById("tim48").dat.tim = 48;
	hwo.tim.getById("tim72").dat.tim = 72;

	// 提示框
	hwo.titl = new hw.Doe ({ hd_doe: middle_div });
	hwo.hidTitl = function () {
		this.root.get().addCss("nosee");
	};
	hwo.showTitl = function (d) {
		var s, v, f, t, r, e, min, max;
		r = d.root.get();
		t = r.titl;

		t.getById ("broadcast").doe.innerHTML = d.broadcast;
		t.getById ("name").doe.innerHTML = d.name;
		for (s in d.aqis) {
			v = t.getById("titl" + s);
			f = d.aqis[s];
			min = f.min.emLevel.get();
			max = f.max.emLevel.get();
			v.getById("levelName").doe.innerHTML = f.memo.fomLevelName;
			if (min === max) {
				e = ".png";
			} else {
				e = "A.png";
			}
			v.getById("levelImg").doe.src = min.imgUrl + e;
			v.getById("minFom_a").doe.innerHTML = f.min.vcAqi.get();
			v.getById("maxFom_c").doe.innerHTML = f.max.vcAqi.get();
			v.getById("minFom_a").chgCss ("number_mid " + min.numCss);
			v.getById("maxFom_c").chgCss ("number_mid " + max.numCss);
			v.getById("mainFom").doe.innerHTML = f.getOneMainFom().get().htm;
		}

		t.view.setPosition ( r.root.utOlproj(d.geoJson) );
		t.delCss("nosee");
	};
	t = hw.utTim.addHour (hwo.tim.getById("tim24").dat.tim, hwo.baseTim.dat.tim, true);
	v = hwo.titl.getById("titl24");
	v.getById("date").doe.innerHTML = hw.utTim.format (t, "mdChn");
	v.getById("week").doe.innerHTML = hw.utTim.format (t, "weekChn");
	t = hw.utTim.addHour (hwo.tim.getById("tim48").dat.tim, hwo.baseTim.dat.tim, true);
	v = hwo.titl.getById("titl48");
	v.getById("date").doe.innerHTML = hw.utTim.format (t, "mdChn");
	v.getById("week").doe.innerHTML = hw.utTim.format (t, "weekChn");
	t = hw.utTim.addHour (hwo.tim.getById("tim72").dat.tim, hwo.baseTim.dat.tim, true);
	v = hwo.titl.getById("titl72");
	v.getById("date").doe.innerHTML = hw.utTim.format (t, "mdChn");
	v.getById("week").doe.innerHTML = hw.utTim.format (t, "weekChn");
	hwo.titl.getById("off").addEvt ("click",  hwo.hidTitl, "gzfbxt_hidTitl");
	hwo.titl.view = new hw.Ovy({
		position: hw.utOlproj([116, 38.5]),
		positioning: "top-left",
		element: hwo.titl.doe,
		stopEvent: true
	});
	hwo.map.addOverlay(hwo.titl.view);

/*
	// 城市数据（网络版）
	hwo.cityOrder = {
		"city_130100": "石家庄市",
		"city_130800": "承德市",
		"city_130700": "张家口市",
		"city_130300": "秦皇岛市",
		"city_130200": "唐山市",
		"city_131000": "廊坊市",
		"city_130600": "保定市",
		"city_130900": "沧州市",
		"city_131100": "衡水市",
		"city_130500": "邢台市",
		"city_130400": "邯郸市",
		"city_132000": "定州市",
		"city_132100": "辛集市"
	};
	hwo.getData = function (hwo) {
		var i, c;
		var req = hwo.dataIp + hwo.root.utTim.format(hwo.baseTim.dat.tim);
		var d = hwo.root.ajx.get(req);
		var o = hwo.root.utJson.toObj(d);
		var a = o.cityPublishDatas;
		var r = {
			root: this,
			id: "prvn_" + o.ProvicePublishData.CityCode,
			name: o.ProvicePublishData.CityName,
			level: "prvn",
			broadcast: o.ProvicePublishData.ForecastInfo,
			chd_: this.cityOrder
		};

		// 处理 imgUrl 属性
		var hdImgUrl = function (data) {
			return "images/city_" + data.CityCode + ".png";
		};

		// 处理 broadcast 属性
		var hdBroadcast = function (fom, alm) {
			var s = "";
			if (fom !== "无") {
				s += fom;
			}
			if (alm !== "无") {
				s += alm;
			}
			return s;
		};

		// 处理 aqi 属性
		var hdAqi = function (data, clsLev, alm) {
			var aqi = {};

			// 最小值
			if (data.MinAQI !== "-999") {
				aqi.hd_min = parseInt(data.MinAQI, 10);
			}

			// 最大值
			if (data.MaxAQI !== "-999") {
				aqi.hd_max = parseInt(data.MaxAQI, 10);
			}

			// 首要污染物
			if (data.Pollutant !== "无") {
				aqi.mainFom = data.Pollutant.split(",");
			}

			// 污染级别
			aqi.memo = {};
			if (data.Level !== "无") {
				aqi.memo.fomLevelName = data.Level;
			} else {
				aqi.memo.fomLevelName = "";
			}

			// 预警信息（暂无）
			if (alm !== "无") {
				aqi.alarmLevel = "v" + alm;
			}

			return aqi;
		};

		for (i = 0; i<a.length; i++) {
			c = {
				id: "city_" + a[i].CityCode,
				name: a[i].CityName,
				geoJson: [parseFloat(a[i].loncen), parseFloat(a[i].latcen)],
				broadcast: hdBroadcast(a[i].ForecastInfo, a[i].WarningInfo),
				imgUrl: hdImgUrl(a[i]),
				level: "city",
				hd_aqis: {
					"24": hdAqi (a[i].Date1, this.root.Efl, a[i].WarningLevel),
					"48": hdAqi (a[i].Date2, this.root.Efl, a[i].WarningLevel),
					"72": hdAqi (a[i].Date3, this.root.Efl, a[i].WarningLevel),
				}
			};
			r.chd_[c.id] = c;
		}
// console.log (o);
		return r;
	};
	hwo.list = new hw.Dm( hwo.getData(hwo) );
*/

	// 城市数据（单机版）
	v = {
		root: hwo,
		id: "p001",
		name: "河北省",
		level: "prvn",
		broadcast: "未来一周，京津冀及周边区域空气质量总体较好，出现大面积PM2.5重污染过程的可能性较小；受大风扬尘影响，可能出现短时PM10污染过程。（更多预报信息请参照各地预报结果）8～10日，扩散条件总体有利，京津冀北部、内蒙古中部、山东东部和山西大部优良；11～12日，扩散条件逐步转差，内蒙古中部以优良为主.京津冀中南部、山东西部和河南北部以良至轻度污染为主，首要污染物为PM2.5和PM10。11～12日，扩散条件逐步转差，内蒙古中部以优良为主.来一周，京津冀及周边区域空气质量总体较好，出现大面积PM2.5重污染过程的可能性较小；受大风扬尘影响，可能出现短时PM10污染过程。（更多预报信息请参照各地预报结果）8～10日，扩散条件总体有利，京津冀北部、内蒙古中部、山东东部和山西大部优良；11～12日，扩散条件逐步转差，内蒙古中部以优良为主.",
		chd_: {
			"city_130100": {
				name: "石家庄市",
				geoJson: [114.52, 38.05],
				level: "city",
				broadcast: "Hello World !!"
			},
			"city_130800": {
				name: "承德市",
				geoJson: [117.97, 40.96]
			},
			"city_130700": {
				name: "张家口市",
				geoJson: [114.88, 40.78],
				broadcast: "3月10-11日，受强冷空气影响，珠三角地区空气质量以优为主，12日，空气质量优至良，首要污染物主要为PM2.5或NO2。"
			},
			"city_130300": {
				name: "秦皇岛市",
				geoJson: [119.61, 39.95]
			},
			"city_130200": {
				name: "唐山市",
				geoJson: [118.19, 39.65]
			},
			"city_131000": {
				name: "廊坊市",
				geoJson: [116.68, 39.56]
			},
			"city_130600": {
				name: "保定市",
				geoJson: [115.47, 38.89]
			},
			"city_130900": {
				name: "沧州市",
				geoJson: [116.84, 38.32]
			},
			"city_131100": {
				name: "衡水市",
				geoJson: [115.66, 37.75]
			},
			"city_130500": {
				name: "邢台市",
				geoJson: [114.51, 37.08]
			},
			"city_130400": {
				name: "邯郸市",
				geoJson: [114.53, 36.64]
			},
			"city_132000": {
				name: "定州市",
				geoJson: [114.996, 38.522]
			},
			"city_132100": {
				name: "辛集市",
				geoJson: [115.22, 37.95]
			}
		}
	};
	// 生成随机数据
	t = function () {
		var r = {};
		var aqi = Math.round(Math.random() * 500);
		if (aqi > 15) {
			r.hd_min = aqi - 15;
		} else {
			r.hd_min = 1;
		}
		if (aqi < 485) {
			r.hd_max = aqi + 15;
		} else {
			r.hd_max = 500;
		}
		r.memo = {
			fomLevelName: (hw.Efl[hw.Efl.prototype.getKeyByAqi(r.hd_min)].name + "-" + hw.Efl[hw.Efl.prototype.getKeyByAqi(r.hd_max)].name)
		};
		switch (Math.floor(Math.random() * 8)) {
			case 1:
				r.alarmLevel = "v1";
				break;
			case 2:
				r.alarmLevel = "v2";
				break;
			case 3:
				r.alarmLevel = "v3";
				break;
		}
		switch (Math.floor(Math.random() * 10)) {
			case 1:
				r.mainFom = ["pm10"];
				break;
			case 2:
				r.mainFom = ["no2"];
				break;
			case 3:
				r.mainFom = ["so2"];
				break;
			case 4:
				r.mainFom = ["co"];
				break;
			case 5:
				r.mainFom = ["o3"];
				break;
			default:
				r.mainFom = ["pm25"];
				break;
		}
		return r;
	};
	for (s in v.chd_) {
		v.chd_[s].level = "city";
		v.chd_[s].imgUrl = "/Pic/img/web/ReleaseS/V0/" + s + ".png";
		v.chd_[s].hd_aqis = {
				"24": t(),
				"48": t(),
				"72": t()
		};
	}
	hwo.list = new hw.Dm(v);


	// 城市列表
	hwo.list.boardDoe = new hw.Doe ({ hd_doe: prvnBroadcast, dat: hwo.list });
	hwo.list.boardDoe.doe.innerHTML = hwo.list.broadcast;
	hwo.list.view = new hw.Doe ({ hd_doe: list, dat: hwo.list });
	hwo.cityModel = hwo.list.view.del("city");	// 城市模型
	hwo.smallModel = new hw.Doe ({	// 小图标模型
		id: "small",
		hd_typ: "div",
		hd_css: "mapSmall noselect",
		chd_: {
			levelImgOut: {
				hd_typ: "div",
				hd_css: "mapLevelImg",
				chd_: {
					levelImg: {
						hd_typ: "img"
					}
				}
			},
			name: {
				hd_typ: "div",
				hd_css: "name"
			},
			level: {
				hd_typ: "div",
				hd_css: "mapLevel"
			}
		}
	});
	hwo.bigModel = hwo.smallModel.clone();	// 大图标模型
	hwo.bigModel.id.set("big");
	// hwo.bigModel.chgCss("mapBig noselect");
	hwo.list2map = function () {
		// 设置地图中心点和缩放级别
		var doeo = this;
		var d = doeo.dat;
		var r = d.root.get();
		if (r.list.ctrl.vcCur.get()) {
			var g = [];
			g[0] = d.geoJson[0] + 0.1;
			g[1] = d.geoJson[1] - 0.1;
			r.map.getView().setCenter( r.root.utOlproj(g) );
			r.map.getView().setZoom( r.zoomBase );
		}
	};
	hwo.map2list = function () {
		// 地图定位列表
		var doeo = this;
		var d = doeo.dat;
		var r = d.root.get();
		if (r.list.ctrl.vcCur.get()) {
			// r.map.getView().setCenter( r.root.utOlproj(d.geoJson) );
			// r.map.getView().setZoom( r.zoomBase );
		}
	};
	hwo.boardChange = function (doeo, self, old) {
		var d, r;
		if (doeo) {
			d = doeo.dat;
			r = d.root.get();
			// d.boardDoe.doe.src = d.imgUrl;
			d.boardDoe.doe.src = "/Pic/img/web/ReleaseS/V0/" + d.id.get() + ".png";
			d.boardDoe.delCss("nosee");

			// 显示提示框
			r.showTitl(d);
		} else {
			d = old.dat;
			r = d.root.get();
			d.boardDoe.doe.src = "/Pic/img/web/ReleaseS/V0/city_.png";
			r.hidTitl.call(r.titl);
		}
	};
	hwo.list.ctrl = new hw.Scd ();
	hwo.list.ctrl.css = "city_M";
	hwo.list.ctrl.only = false;
	hwo.list.ctrl.vcCur.setEventObj (hwo);
	hwo.list.ctrl.vcCur.evt.change.add (hwo.boardChange);
	for (s in hwo.list.subs) {
		v = hwo.list.subs[s];
		v.view = hwo.cityModel.clone();
		v.view.dat = v;
		v.boardDoe = new hw.Doe ({ hd_doe: cityImg, dat: v });
		hwo.list.view.add (v.view, s);
		hwo.list.ctrl.add (v.view);
		v.view.addEvt ("click",  hwo.list2map, "gzfbxt_list2map");
		v.view.getById("name").doe.innerHTML = v.name;
		v.view.getById("midFom").doe.innerHTML = " - ";

		// 小图标
		v.mapSmallDoe = hwo.smallModel.clone();
		v.mapSmallDoe.getById("name").doe.innerHTML =  v.name;
		v.mapSmallDoe.dat = v;
		hwo.list.ctrl.add (v.mapSmallDoe);
		v.mapSmallDoe.view = new hw.Ovy({
			position: hw.utOlproj(v.geoJson),
			positioning: "center-center",
			element: v.mapSmallDoe.doe,
			stopEvent: false
		});

		// 大图标
		v.mapBigDoe = hwo.bigModel.clone();
		v.mapBigDoe.getById("name").doe.innerHTML =  v.name;
		v.mapBigDoe.dat = v;
		hwo.list.ctrl.add (v.mapBigDoe);
		v.mapBigDoe.view = new hw.Ovy({
			position: hw.utOlproj(v.geoJson),
			positioning: "center-center",
			element: v.mapBigDoe.doe,
			stopEvent: false
		});

		hwo.map.addOverlay(v.mapSmallDoe.view);
	}

	// 刷新城市列表数据
	hwo.flush = function () {
		var s, v, n, f, vs, vb, min, max, e;
		n = this.timScd.vcCur.get().dat.tim;
		for (s in this.list.subs) {
			v = this.list.subs[s].view;
			vs = this.list.subs[s].mapSmallDoe;
			vb = this.list.subs[s].mapBigDoe;
			f = v.dat.aqis[n];
			min = f.min.emLevel.get();
			max = f.max.emLevel.get();

			v.getById("mainFom").doe.innerHTML = f.getOneMainFom().get().htm;
			v.getById("levelName").doe.innerHTML = f.memo.fomLevelName;
			if (min === max) {
				e = ".png";
			} else {
				e = "A.png";
			}
			v.getById("levelImg").doe.src = min.imgUrl + e;
			e = min.mapImgUrl + e;
			vs.getById("levelImg").doe.src = e;
			vb.getById("levelImg").doe.src = e;
			v.getById("minFom").chgCss (min.numCss);
			v.getById("minFom").doe.innerHTML = f.min.vcAqi.get();
			v.getById("maxFom").chgCss (max.numCss);
			v.getById("maxFom").doe.innerHTML = f.max.vcAqi.get();
			e = f.min.vcAqi.get() + " - " + f.max.vcAqi.get();
			vs.getById("level").doe.innerHTML = e;
			vb.getById("level").doe.innerHTML = e;
			v.getById("alarm").chgCss ("alarm " + f.emAlarmLevel.get().css);
			v.getById("alarm").doe.innerHTML = f.emAlarmLevel.get().name;
		}
	};
// console.log (hwo);

	// 启动
	hwo.tim.getById("tim24").dat.hct_scd.set(true);

}
