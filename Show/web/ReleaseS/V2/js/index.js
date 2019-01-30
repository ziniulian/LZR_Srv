
function init() {
	var i, j, s, v, n, x, y, t;
	LZR.curPath = "/myLib";
	LZR.load([
		"LZR.HTML.Base.Ctrl.SglScd",
		"LZR.Pro.Green.Airq.App.ReleaseSys.DatMod",
		"LZR.Base.Time",
		"LZR.HTML.Base.Ajax"
	]);
	var hw = {
		root: LZR,
		obj: {},
		Dm: LZR.Pro.Green.Airq.App.ReleaseSys.DatMod,
		Aqi: LZR.Pro.Green.Airq.Fom.Aqi,
		Doe: LZR.HTML.Base.Doe,
		Scd: LZR.HTML.Base.Ctrl.SglScd,
		Eal: LZR.Pro.Green.Airq.Alarm.EmAlarmLevel,
		Efl: LZR.Pro.Green.Airq.Fom.EmFomLevel,
		bind: LZR.getSingleton(LZR.Util).bind,
		ajx: new LZR.HTML.Base.Ajax(),
		utJson: LZR.getSingleton(LZR.Base.Json),
		utTim: LZR.getSingleton(LZR.Base.Time)
	};
	hw.obj.root = hw;
	var hwo = hw.obj;

	// 配置信息
	hw.Efl.emnull.numCss = "number-0";	// 颜色样式
	hw.Efl.v1.numCss = "number-a";
	hw.Efl.v2.numCss = "number-b";
	hw.Efl.v3.numCss = "number-c";
	hw.Efl.v4.numCss = "number-d";
	hw.Efl.v5.numCss = "number-e";
	hw.Efl.v6.numCss = "number-f";
	hw.Efl.emnull.numBgCss = "number-0-bg";	// 背景色样式
	hw.Efl.v1.numBgCss = "number-a-bg";
	hw.Efl.v2.numBgCss = "number-b-bg";
	hw.Efl.v3.numBgCss = "number-c-bg";
	hw.Efl.v4.numBgCss = "number-d-bg";
	hw.Efl.v5.numBgCss = "number-e-bg";
	hw.Efl.v6.numBgCss = "number-f-bg";
	hw.Eal.v1.css = "alarm3";	// 预警样式
	hw.Eal.v2.css = "alarm2";
	hw.Eal.v3.css = "alarm1";
	hwo.cityOrder = {	// 城市排序
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
		"city_130682": "定州市",
		"city_130181": "辛集市"
	};
	// hwo.timIp = "http://api.k780.com:88/?app=life.time&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json";	// 时间接口
	// hwo.timIp = "http://www.hko.gov.hk/cgi-bin/gts/time5a.pr?a=0";	// 时间接口
	hwo.timIp = "http://192.168.1.235/hbServer/api/CityPublishInfo/GetCurrentDate";	// 时间接口
	hwo.dataIp = "http://192.168.1.235/hbServer/api/CityPublishInfo/GetProvinceAndCityPublishData?publishDate=";	// 基本数据接口
	hwo.imgIp = "http://192.168.1.235/hbServer/api/CityPublishInfo/GetPicUrlByDateCondiction?modeName=naqpms&dateType=day";	// 图片接口
	hwo.barIp = "/Pic/json/web/ReleaseS/V2/bar.js?prjName=v0140&modeName=naqpms&dateType=day&target=aqi&citycode=";	// 模式AQI接口
	hwo.tabIp = "/Pic/json/web/ReleaseS/V2/tab.js?prjName=v0140&modeName=naqpms&dateType=hour&target=aqi";	// 图表接口

	// 获取时间
	hwo.tim = new hw.Doe ({ hd_doe: document.getElementById("tim")});
	hwo.tim.dat = {
		// bas: hw.utTim.stringToDate (hw.ajx.get(hwo.timIp))	// 基础时间
		bas: new Date()	// 基础时间
	};
	hwo.tim.dat.reset = function (hwo, pubtim, protim, hw) {
		// 发布时间
		hwo.tim.dat.pub = hw.utTim.stringToDate(pubtim);

		// 产品时间
		hwo.tim.dat.pro = hw.utTim.stringToDate(protim);
		hw.utTim.normalize (hwo.tim.dat.pro, 20);

		// 图表起始时间
		hwo.tim.dat.tabS = hw.utTim.normalize (hwo.tim.dat.pub, 0, true);
		hw.utTim.addHour (24, hwo.tim.dat.tabS);
		hwo.tim.dat.tabE = hw.utTim.addHour (71, hwo.tim.dat.tabS, true);

		// AQI起始时间
		hwo.tim.dat.aqiS = hw.utTim.addHour (72, hwo.tim.dat.tabS, true);
		hwo.tim.dat.aqiE = hw.utTim.addHour (71, hwo.tim.dat.aqiS, true);

		// 显示时间
		hwo.tim.dat["d24"] = hwo.tim.dat.tabS;
		hwo.tim.dat["d48"] = hw.utTim.addHour (24, hwo.tim.dat["d24"], true);
		hwo.tim.dat["d72"] = hw.utTim.addHour (24, hwo.tim.dat["d48"], true);
		hwo.tim.dat["d96"] = hw.utTim.addHour (24, hwo.tim.dat["d72"], true);
		hwo.tim.dat["d120"] = hw.utTim.addHour (24, hwo.tim.dat["d96"], true);
		hwo.tim.dat["d144"] = hw.utTim.addHour (24, hwo.tim.dat["d120"], true);

// console.log (hw.utTim.format(hwo.tim.dat.bas));
// console.log (hw.utTim.format(hwo.tim.dat.pub));
// console.log (hw.utTim.format(hwo.tim.dat.pro));
// console.log (hw.utTim.format(hwo.tim.dat.tabS));
// console.log (hw.utTim.format(hwo.tim.dat.tabE));
// console.log (hw.utTim.format(hwo.tim.dat.aqiS));
// console.log (hw.utTim.format(hwo.tim.dat.aqiE));
// console.log (hw.utTim.format(hwo.tim.dat.d0));
// console.log (hw.utTim.format(hwo.tim.dat.d1));
// console.log (hw.utTim.format(hwo.tim.dat.d2));
// console.log (hw.utTim.format(hwo.tim.dat.d3));
// console.log (hw.utTim.format(hwo.tim.dat.d4));
// console.log (hw.utTim.format(hwo.tim.dat.d5));
	};
/*
	// 获取城市数据
	hwo.getData = function (hwo) {
		var i, c;
		var req = hwo.dataIp + hwo.root.utTim.format(hwo.tim.dat.bas);
		var d = hwo.root.ajx.get(req);
		var o = hwo.root.utJson.toObj(d);
		var a = o.cityPublishDatas;

		// 调整产品时间
		if (a[0]) {
			hwo.tim.dat.reset(hwo, a[0].CorrectPublishDate, a[0].CorrectPredictionDate, hwo.root);
		}

		var r = {
			root: this,
			id: "prvn_" + o.ProvicePublishData.CityCode,
			name: o.ProvicePublishData.CityName,
			level: "prvn",
			broadcast: o.ProvicePublishData.ForecastInfo,
			chd_: this.cityOrder
		};

		// 取消省级公告板的“无”字
		if (r.broadcast === "无") {
			r.broadcast = "";
		}

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
					"72": hdAqi (a[i].Date3, this.root.Efl, a[i].WarningLevel)
				}
			};
			r.chd_[c.id] = c;
		}
// console.log (o);
		return r;
	};
	hwo.list = new hw.Dm( hwo.getData(hwo) );
*/

	// 获取城市数据（单机版）
	hwo.tim.dat.reset(hwo, "2016-7-4 17:00", "2016-7-3 20:00", hw);
	hwo.list = new hw.Dm({
		root: hwo,
		id: "p001",
		name: "河北省",
		level: "prvn",
		broadcast: "区域形势：未来一周，京津冀及周边区域空气质量总体较好，出现大面积PM2.5重污染过程的可能性较小；受大风扬尘影响，可能出现短时PM10污染过程。（更多预报信息请参照各地预报结果）8～10日，扩散条件总体有利，京津冀北部、内蒙古中部、山东东部和山西大部优良；11～12日，扩散条件逐步转差，内蒙古中部以优良为主.京津冀中南部、山东西部和河南北部以良至轻度污染为主，首要污染物为PM2.5和PM10。11～12日，扩散条件逐步转差，内蒙古中部以优良为主.来一周，京津冀及周边区域空气质量总体较好，出现大面积PM2.5重污染过程的可能性较小；受大风扬尘影响，可能出现短时PM10污染过程。（更多预报信息请参照各地预报结果）8～10日，扩散条件总体有利，京津冀北部、内蒙古中部、山东东部和山西大部优良；11～12日，扩散条件逐步转差，内蒙古中部以优良为主.",
		chd_: {
			"city_130100": {
				name: "石家庄市",
				geoJson: [114.52, 38.05],
				level: "city",
				broadcast: "Hello World !!",
				hd_aqis: {
					"24": {
						hd_min: 150,
						hd_max: 305,
						memo: { fomLevelName: "优-良" },
						alarmLevel: "v1",
						mainFom: ["pm25"]
					},
					"48": {
						hd_min: 253,
						hd_max: 405,
						memo: { fomLevelName: "轻度-中度" },
						alarmLevel: "v2",
						mainFom: ["pm25"]
					},
					"72": {
						hd_min: 15,
						hd_max: 73,
						memo: { fomLevelName: "良-轻度" },
						alarmLevel: "v3",
						mainFom: ["pm25"]
					},
				}
			},
			"city_130800": {
				name: "承德市",
				geoJson: [117.97, 40.96],
				level: "city",
				hd_aqis: {
					"72": {
						hd_min: 150,
						hd_max: 305,
						memo: { fomLevelName: "" },
						alarmLevel: "v1",
						mainFom: ["pm25"]
					}
				}
			},
			"city_130700": {
				name: "张家口市",
				geoJson: [114.88, 40.78],
				level: "city",
				imgUrl: "images/foot.png",
				broadcast: "3月10-11日，受强冷空气影响，珠三角地区空气质量以优为主，12日，空气质量优至良，首要污染物主要为PM2.5或NO2。"
			},
			"city_130300": {
				name: "秦皇岛市",
				geoJson: [119.61, 39.95],
				level: "city"
			},
			"city_130200": {
				name: "唐山市",
				geoJson: [118.19, 39.65],
				level: "city"
			},
			"city_131000": {
				name: "廊坊市",
				geoJson: [116.68, 39.56],
				level: "city"
			},
			"city_130600": {
				name: "保定市",
				geoJson: [115.47, 38.89],
				level: "city"
			},
			"city_130900": {
				name: "沧州市",
				geoJson: [116.84, 38.32],
				level: "city"
			},
			"city_131100": {
				name: "衡水市",
				geoJson: [115.66, 37.75],
				level: "city"
			},
			"city_130500": {
				name: "邢台市",
				geoJson: [114.51, 37.08],
				level: "city"
			},
			"city_130400": {
				name: "邯郸市",
				geoJson: [114.53, 36.64],
				level: "city"
			},
			"city_130682": {
				name: "定州市",
				geoJson: [114.996, 38.522],
				level: "city"
			},
			"city_130181": {
				name: "辛集市",
				geoJson: [115.22, 37.95],
				level: "city"
			}
		}
	});

// console.log (hwo.list);

	// 获取图片
	hwo.img = new hw.Doe({hd_doe:document.getElementById("img")});
/*
	v = hwo.imgIp;
	v += "&productDate=";
	v += hw.utTim.format(hwo.tim.dat.pro);
	v += "&startDate=";
	v += hw.utTim.format(hwo.tim.dat.tabS, "date");
	v += "&endDate=";
	v += hw.utTim.format(hwo.tim.dat.tabE, "date");
// console.log (v);
	n = hw.utJson.toObj(hw.ajx.get(v));
// console.log (n);
	hwo.img.dat = {};
	for (i=0; i<n.length; i++) {
		hwo.img.dat[i.toString()] = n[i];
	}
*/

	hwo.img.dat = {	// 单机数据
		"0": "/Pic/img/fom/Day/pm25/2015082320/PM25DailySpa_d01_NAQPMS_2015082320_052.png",
		"1": "/Pic/img/fom/Day/pm25/2015082320/PM25DailySpa_d01_NAQPMS_2015082320_076.png",
		"2": "/Pic/img/fom/Day/pm25/2015082320/PM25DailySpa_d01_NAQPMS_2015082320_100.png"
	};

	// 图片自动播放事件
	hwo.img.autoPlay = true;
	hwo.img.onchg = function (doeo) {
		doeo.view.setStyle("background-image", "url('" + doeo.dat.url + "')");
		if (this.img.autoPlay) {
			clearTimeout(this.img.autoPlay);
			this.img.autoPlay = setTimeout(this.root.bind(this, this.img.play), 1000);
		}
	};
	hwo.img.play = function () {
		var cd = this.img.ctrl.vcCur.get();
		var c = cd.parent.get().count;
		var id = parseInt(cd.id.get(), 10);
		id ++;
		if (id === c) {
			id = 0;
		}
		this.img.getById(id.toString()).dat.hct_scd.set(true);
	};
	hwo.img.addEvt("mouseover", hw.bind(hwo, function() {
		if (this.img.autoPlay) {
			clearTimeout(this.img.autoPlay);
			this.img.autoPlay = false;
		}
	}));
	hwo.img.addEvt("mouseout", hw.bind(hwo, function() {
		if (this.img.autoPlay === false) {
			this.img.autoPlay = setTimeout(this.root.bind(this, this.img.play), 1000);
		}
	}));

	// 图片控制器
	n = hwo.img.getById("mid");
	hwo.img.ctrl = new hw.Scd();
	hwo.img.ctrl.css = "btnScd";
	hwo.img.ctrl.vcCur.setEventObj (hwo);
	hwo.img.ctrl.vcCur.evt.change.add (hwo.img.onchg);
	for (s in hwo.img.dat) {
		v = hwo.img.getById(s);
		v.dat = {
			url: hwo.img.dat[s]
		};
		v.view = n;
		v.doe.innerHTML = hw.utTim.format(hwo.tim.dat["d" + (s * 24 + 24)], "mdChn");
		hwo.img.ctrl.add (v);
	}
	v.dat.hct_scd.set(true);

	// 获取模式AQI
	v = hwo.barIp;
	v += "&productionDate=";
	v += hw.utTim.format(hwo.tim.dat.pro);
	v += "&startDate=";
	v += hw.utTim.format(hwo.tim.dat.aqiS, "date");
	v += "&endDate=";
	v += hw.utTim.format(hwo.tim.dat.aqiE, "date");
// console.log (v);
	n = hw.utJson.toObj(hw.ajx.get(v));
// console.log (n);
	for (i=0; i<n.length; i++) {
		s = "city_" + n[i].code;
		if (hwo.list.subs[s]) {
			if (!hwo.list.subs[s].aqi) {
				hwo.list.subs[s].aqi = [
					{
						v: 0,
						e: new hw.Efl ()
					},
					{
						v: 0,
						e: new hw.Efl ()
					},
					{
						v: 0,
						e: new hw.Efl ()
					}
				];
			}
			v = hw.utTim.stringToDate(n[i].datadate.substr(0, 10)).valueOf();
			switch (v) {
				case hwo.tim.dat["d96"].valueOf():
					hwo.list.subs[s].aqi[0].v = n[i].aqi;
					hwo.list.subs[s].aqi[0].e.setByAqi(n[i].aqi);
					break;
				case hwo.tim.dat["d120"].valueOf():
					hwo.list.subs[s].aqi[1].v = n[i].aqi;
					hwo.list.subs[s].aqi[1].e.setByAqi(n[i].aqi);
					break;
				case hwo.tim.dat["d144"].valueOf():
					hwo.list.subs[s].aqi[2].v = n[i].aqi;
					hwo.list.subs[s].aqi[2].e.setByAqi(n[i].aqi);
					break;
			}
		}
	}

	// 填数
	hwo.tim.getById("d24").doe.innerHTML = hw.utTim.format(hwo.tim.dat.d24, "mdChn");
	hwo.tim.getById("d48").doe.innerHTML = hw.utTim.format(hwo.tim.dat.d48, "mdChn");
	hwo.tim.getById("d72").doe.innerHTML = hw.utTim.format(hwo.tim.dat.d72, "mdChn");
	hwo.tim.getById("pub").doe.innerHTML = hw.utTim.format(hwo.tim.dat.pub, "hourChn") + "发布";

	if (hwo.list.broadcast) {
		document.getElementById("msgTxt").innerHTML = hwo.list.broadcast;
	} else {
		document.getElementById("msg").className = "nosee";
		document.getElementById("msgBtn").className = "nosee";
	}

	hwo.out = new hw.Doe ({ hd_doe: document.getElementById("out")});
	hwo.mod = hwo.out.del("mod");
	for (s in hwo.list.subs) {
		v = hwo.list.subs[s];
		n = hwo.mod.clone();
		n.getById("cityName").doe.innerHTML = v.name;
		n.getById("straqi").doe.innerHTML = "AQI小时预报:";
		if (v.broadcast) {
			n.getById("strinfo").doe.innerHTML = "预报信息：";
			n.getById("broad").doe.innerHTML = v.broadcast;
		} else {
			n.getById("broadOut").addCss("nosee");
		}

		j = null;	// 预警信息
		for (i in v.aqis) {
			x = n.getById("d" + i);
			x.getById("strand").doe.innerHTML = " - ";
			y = x.getById("min");
			y.doe.innerHTML = v.aqis[i].min.vcAqi.get();
			y.addCss(v.aqis[i].min.emLevel.get().numCss);
			y = x.getById("max");
			y.doe.innerHTML = v.aqis[i].max.vcAqi.get();
			y.addCss(v.aqis[i].max.emLevel.get().numCss);
			x.getById("level").doe.innerHTML = v.aqis[i].memo.fomLevelName;
			x.getById("element").doe.innerHTML = v.aqis[i].getOneMainFom().get().htm;
			t = v.aqis[i].emAlarmLevel.get();
			if (t.css) {
				j = t;
			}
		}
		if (j) {
			t = n.getById("alarm");
			t.addCss(j.css);
			t.doe.innerHTML = j.name;
		}

		x = n.getById("bar");
		y = [0, 1, 2];
		for (i=0; i<y.length; i++) {
			for (j = i+1; j<y.length; j++) {
				if (v.aqi[y[i]].v > v.aqi[y[j]].v) {
					t = y[i];
					y[i] = y[j];
					y[j] = t;
				}
			}
		}
		for (i=0; i<y.length; i++) {
			j = v.aqi[y[i]];
			x.getById("t" + y[i]).doe.innerHTML = j.v;
			t = x.getById("b" + y[i]);
			t.addCss("miniBar_" + i + " " + j.e.get().numBgCss);
		}

		x = n.getById("city");
		x.setAtt("datLzr", v.id.get());
		hwo.out.add(x, s);
		hwo.out.add(n.getById("cm"), s + "cm");
	}
// console.log (hwo.list);

	// 加载图表
	hwo.creatChart = function(dom, id) {
		var url = hwo.tabIp;
		url += "&citycode=";
		url += id;
		url += "&productionDate=";
		url += hw.utTim.format(hwo.tim.dat.pro);
		url += "&startDate=";
		url += hw.utTim.format(hwo.tim.dat.aqiS);
		url += "&endDate=";
		url += hw.utTim.format(hwo.tim.dat.aqiE);
		var dat = hw.utJson.toObj(hw.ajx.get(url));
		var op = {
			xAxis : [
				{
					type : 'category',
					boundaryGap : false,
					data : []
				}
			],
			tooltip : {
			},
			yAxis : [
				{
					type : 'value'
				}
			],
			grid: {
				x: 35,
				y: 10,
				x2: 0,
				y2: 20
			},
			series : [
				{
					type:'line',
					itemStyle: {
						normal: {
							areaStyle: {
								type: 'default',
								color: "#0FF"
							},
							lineStyle: {
								color: "#F0F"
							}
						}
					},
					data:[]
				}
			]
		};
		for (var i=0; i<dat.length; i++) {
			op.series[0].data.push(dat[i].aqi);
			op.xAxis[0].data.push(dat[i].datadate.replace("T", " ").substr(5, 8) + "时");
		}
		echarts.init(dom).setOption(op);
	};

	// 展开功能
	$(function(){
		$(".city").click(function(){
			// $(this).toggleClass("currentDd").siblings(".subNav").removeClass("currentDd");
			// $(this).toggleClass("currentDt").siblings(".subNav").removeClass("currentDt");
			var cm = $(this).next(".city_more");
			var s = cm[0].style.display;
			cm.slideToggle(500).siblings(".city_more").slideUp(500);
			if (s !== "block") {
				var c = document.getElementById("chart");
				c.className = "chart";
				c.innerHTML = "";
				cm.find(".city_more_a")[0].appendChild(c);
				hwo.creatChart(c, $(this).attr("datLzr").substr(5));
			}
		});
	});
}
