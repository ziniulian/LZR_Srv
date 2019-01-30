
var hw, hwo;

// 填充气象数据
function fillWeatherDat (dat, modID) {
	var mod = new hw.Doe({hd_doe: document.getElementById(modID)});
	mod.getById("temN").doe.innerHTML = dat.tem.now + "℃";
	mod.getById("wsImg").doe.src = dat.ws.img;
	mod.getById("temA").doe.innerHTML = dat.tem.min + "℃-" + dat.tem.max + "℃";
	mod.getById("ws").doe.innerHTML = dat.ws.name;
	mod.getById("rh").doe.innerHTML = "相对湿度：" + dat.humidity;
	mod.getById("windD").doe.innerHTML = "当天主导风：" + dat.wind.dir.name + " " + dat.wind.pow.id + "级";
	mod.getById("windN").doe.innerHTML = "实时风力情况：" + dat.wind.state;
	return mod;
}

// 获取气象数据
function getWeatherData (ip) {
	var d;
	var r = {};
	if (ip) {
		d = hw.utJson.toObj( hw.ajx.get(ip) );
		r.tim = d.DateTime;		// 时间
		r.humidity = d.humidity;	// 湿度
		r.tem = {	// 温度
			min: Math.floor(d.MinTem),	// 最小值
			max: Math.floor(d.MaxTem),	// 最大值
			now: Math.floor(d.NowTem)	// 当前值
		};
		r.wind = {	// 风
			state: d.windState,	// 状态
			dir: parseEmByName(hw.Ewd, d.windDir),	// 风向
			pow: hw.Ewp[parseInt(d.windPower, 10)]	// 风力
		};
		r.ws = parseEmByName(hw.Ews, d.StateDetailed);	// 天气
	} else {
		// 无 IP 则生成随机数据
		r.tim = "10:00";
		r.humidity = Math.round(Math.random() * 99) + "%";

		// 温度
		r.tem = {
			min: Math.floor(Math.random() * 80) - 40,
			max: Math.floor(Math.random() * 80) - 40
		};
		if (r.tem.min > r.tem.max) {
			d = r.tem.min;
			r.tem.min = r.tem.max;
			r.tem.max = d;
		}
		r.tem.now = Math.floor((r.tem.max - r.tem.min) / 2) + r.tem.min;

		// 风
		r.wind = {
			dir: hw.Ewd[Math.floor(Math.random() * 8)],
			pow: hw.Ewp[Math.floor(Math.random() * 13)]
		};
		r.wind.state = r.wind.pow.name;

		// 天气
		r.ws = hw.Ews[Math.floor(Math.random() * 32)];
	}
	r.ws.img = "/Pic/img/web/Weather/V0/a_" + r.ws.id + ".gif";
	return r;
}

// 风力枚举
function EmWindPower () {
	return {
		"emnull": {
			id: "emnull",
			name: "",
			minSpeed: 0,	// 最小风速
			maxSpeed: 0,	// 最大风速
			phenomenon: "",	// 陆地现象
			sea: "",		// 海面波浪
			wave: 0		// 浪高
		},
		"0": {
			id: 0,
			name: "无风",
			minSpeed: 0.0,
			maxSpeed: 0.2,
			phenomenon: "烟直上",
			sea: "平静",
			wave: 0.0
		},
		"1": {
			id: 1,
			name: "软风",
			minSpeed: 0.3,
			maxSpeed: 1.5,
			phenomenon: "烟示风向",
			sea: "微波峰无飞沫",
			wave: 0.1
		},
		"2": {
			id: 2,
			name: "轻风",
			minSpeed: 1.6,
			maxSpeed: 3.3,
			phenomenon: "感觉有风",
			sea: "小波峰未破碎",
			wave: 0.2
		},
		"3": {
			id: 3,
			name: "微风",
			minSpeed: 3.4,
			maxSpeed: 5.4,
			phenomenon: "旌旗展开",
			sea: "小波峰顶破裂",
			wave: 0.6
		},
		"4": {
			id: 4,
			name: "和风",
			minSpeed: 5.5,
			maxSpeed: 7.9,
			phenomenon: "吹起尘土",
			sea: "小浪白沫波峰",
			wave: 1.0
		},
		"5": {
			id: 5,
			name: "劲风",
			minSpeed: 8.0,
			maxSpeed: 10.7,
			phenomenon: "小树摇摆",
			sea: "中浪折沫峰群",
			wave: 2.0
		},
		"6": {
			id: 6,
			name: "强风",
			minSpeed: 10.8,
			maxSpeed: 13.8,
			phenomenon: "电线有声",
			sea: "大浪到个飞沫",
			wave: 3.0
		},
		"7": {
			id: 7,
			name: "疾风",
			minSpeed: 13.9,
			maxSpeed: 17.1,
			phenomenon: "步行困难",
			sea: "破峰白沫成条",
			wave: 4.0
		},
		"8": {
			id: 8,
			name: "大风",
			minSpeed: 17.2,
			maxSpeed: 20.7,
			phenomenon: "折毁树枝",
			sea: "浪长高有浪花",
			wave: 5.5
		},
		"9": {
			id: 9,
			name: "烈风",
			minSpeed: 20.8,
			maxSpeed: 24.4,
			phenomenon: "小损房屋",
			sea: "浪峰倒卷",
			wave: 7.0
		},
		"10": {
			id: 10,
			name: "狂风",
			minSpeed: 24.5,
			maxSpeed: 28.4,
			phenomenon: "拔起树木",
			sea: "海浪翻滚咆哮",
			wave: 9.0
		},
		"11": {
			id: 11,
			name: "暴风",
			minSpeed: 28.5,
			maxSpeed: 32.6,
			phenomenon: "损毁普遍",
			sea: "波峰全呈飞沫",
			wave: 11.5
		},
		"12": {
			id: 12,
			name: "台风",
			minSpeed: 32.7,
			maxSpeed: -1,
			phenomenon: "摧毁巨大",
			sea: "海浪滔天",
			wave: 14.0
		}
	};
}

// 风向枚举
function EmWindDir () {
	return {
		"emnull": {
			id: "emnull",
			name: ""
		},
		"0": {
			id: 0,
			name: "东风"
		},
		"1": {
			id: 1,
			name: "东南风"
		},
		"2": {
			id: 2,
			name: "南风"
		},
		"3": {
			id: 3,
			name: "西南风"
		},
		"4": {
			id: 4,
			name: "西风"
		},
		"5": {
			id: 5,
			name: "西北风"
		},
		"6": {
			id: 6,
			name: "北风"
		},
		"7": {
			id: 7,
			name: "东北风"
		}
	};
}

// 气象枚举
function EmWeathers () {
	return {
		"emnull": {
			id: "emnull",
			name: ""
		},
		"0": {
			id: 0,
			name: "晴"
		},
		"1": {
			id: 1,
			name: "多云"
		},
		"2": {
			id: 2,
			name: "阴"
		},
		"3": {
			id: 3,
			name: "阵雨"
		},
		"4": {
			id: 4,
			name: "雷阵雨"
		},
		"5": {
			id: 5,
			name: "雷阵雨并伴有冰雹"
		},
		"6": {
			id: 6,
			name: "雨加雪"
		},
		"7": {
			id: 7,
			name: "小雨"
		},
		"8": {
			id: 8,
			name: "中雨"
		},
		"9": {
			id: 9,
			name: "大雨"
		},
		"10": {
			id: 10,
			name: "暴雨"
		},
		"11": {
			id: 11,
			name: "大暴雨"
		},
		"12": {
			id: 12,
			name: "特大暴雨"
		},
		"13": {
			id: 13,
			name: "阵雪"
		},
		"14": {
			id: 14,
			name: "小雪"
		},
		"15": {
			id: 15,
			name: "中雪"
		},
		"16": {
			id: 16,
			name: "大雪"
		},
		"17": {
			id: 17,
			name: "暴雪"
		},
		"18": {
			id: 18,
			name: "雾"
		},
		"19": {
			id: 19,
			name: "冻雨"
		},
		"20": {
			id: 20,
			name: "沙尘暴"
		},
		"21": {
			id: 21,
			name: "小雨-中雨"
		},
		"22": {
			id: 22,
			name: "中雨-大雨"
		},
		"23": {
			id: 23,
			name: "大雨-暴雨"
		},
		"24": {
			id: 24,
			name: "暴雨-大暴雨"
		},
		"25": {
			id: 25,
			name: "大暴雨-特大暴雨"
		},
		"26": {
			id: 26,
			name: "小雪-中雪"
		},
		"27": {
			id: 27,
			name: "中雪-大雪"
		},
		"28": {
			id: 28,
			name: "大雪-暴雪"
		},
		"29": {
			id: 29,
			name: "浮尘"
		},
		"30": {
			id: 30,
			name: "扬沙"
		},
		"31": {
			id: 31,
			name: "强沙尘暴"
		}
	};
}

// 通过名称解析枚举
function parseEmByName (em, n) {
	for (var s in em) {
		if (em[s].name === n) {
			return em[s];
		}
	}
	return em.emnull;
}

// 填充数据
function fillDat (dat, modID, contentID) {
	var mod = new hw.Doe({hd_doe: document.getElementById(modID)});
	var s, v, d, doeo, f, dd;
	for (v in dat) {
		doeo = mod;
		doeo.view = document.getElementById(contentID);
		for (s in dat[v].aqis) {
			f = dat[v].aqis[s];
			d = doeo.getById("fom" + s);
			dd = d.getById("minAqi");
			dd.doe.innerHTML = f.min.vcAqi.get();
			dd.chgCss ("number-all " + f.min.emLevel.get().numCss);
			dd = d.getById("maxAqi");
			dd.doe.innerHTML = f.max.vcAqi.get();
			dd.chgCss ("number-all " + f.max.emLevel.get().numCss);
			d.getById("level").doe.innerHTML = f.memo.fomLevelName;
			d.getById("main").doe.innerHTML = "首要污染物：" + f.getOneMainFom().get().htm;
		}

		doeo.view.innerHTML = dat[v].broadcast;
		return mod;
	}
}

// 获取数据（网络）
function getDataByWeb (order) {
	var req = hwo.dataIp + hw.utTim.format( hw.utTim.normalize (null, 10) );
	var d = hw.ajx.get(req);
	var o = hw.utJson.toObj(d);
	var a = o.cityPublishDatas;
	var r = {
		root: this,
		id: "prvn_" + o.ProvicePublishData.CityCode,
		name: o.ProvicePublishData.CityName,
		level: "prvn",
		broadcast: o.ProvicePublishData.ForecastInfo,
		chd_: order
	};

	// 处理 imgUrl 属性
	var hdImgUrl = function (data) {
		return "/Pic/img/web/ReleaseS/city_" + data.CityCode + ".png";
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

	var i, c;
	for (i = 0; i<a.length; i++) {
		c = {
			id: "city_" + a[i].CityCode,
			name: a[i].CityName,
			geoJson: [parseFloat(a[i].loncen), parseFloat(a[i].latcen)],
			broadcast: hdBroadcast(a[i].ForecastInfo, a[i].WarningInfo),
			imgUrl: hdImgUrl(a[i]),
			level: "city",
			hd_aqis: {
				"24": hdAqi (a[i].Date1, hw.Efl, a[i].WarningLevel),
				"48": hdAqi (a[i].Date2, hw.Efl, a[i].WarningLevel),
				"72": hdAqi (a[i].Date3, hw.Efl, a[i].WarningLevel),
			}
		};
		r.chd_[c.id] = c;
	}

	return r;
}

// 获取数据（单机）
function getData (order) {
	var r = {
		root: hwo,
		id: "p001",
		name: "河南省",
		level: "prvn",
		broadcast: "未来一周，京津冀及周边区域空气质量总体较好，出现大面积PM2.5重污染过程的可能性较小；受大风扬尘影响，可能出现短时PM10污染过程。（更多预报信息请参照各地预报结果）8～10日，扩散条件总体有利，京津冀北部、内蒙古中部、山东东部和山西大部优良；11～12日，扩散条件逐步转差，内蒙古中部以优良为主.京津冀中南部、山东西部和河南北部以良至轻度污染为主，首要污染物为PM2.5和PM10。11～12日，扩散条件逐步转差，内蒙古中部以优良为主.来一周，京津冀及周边区域空气质量总体较好，出现大面积PM2.5重污染过程的可能性较小；受大风扬尘影响，可能出现短时PM10污染过程。（更多预报信息请参照各地预报结果）8～10日，扩散条件总体有利，京津冀北部、内蒙古中部、山东东部和山西大部优良；11～12日，扩散条件逐步转差，内蒙古中部以优良为主.",
		chd_: order
	};

	// 生成随机数据
	var t = function () {
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

	var s;
	for (s in r.chd_) {
		r.chd_[s].level = "city";
		r.chd_[s].imgUrl = "/Pic/img/web/ReleaseS/" + s + ".png";
		r.chd_[s].hd_aqis = {
				"24": t(),
				"48": t(),
				"72": t()
		};
	}
	return r;
}

// 健康提示
function healthBoard (titleID, contentID, selectedCSS) {
	var s, v;
	var r = new hw.Doe({hd_doe: document.getElementById(titleID)});
	r.view = document.getElementById(contentID);
	r.ctrl = new hw.Scd({css: selectedCSS});
	r.dat = {
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
	r.ctrl.vcCur.setEventObj (r);
	r.ctrl.vcCur.evt.change.add ( function (doeo) {
		doeo.view.innerHTML = doeo.dat.memo;
	} );
	for (s in r.dat) {
		v = r.subs[s];
		v.dat = r.dat[s];
		v.view = r.view;
		r.ctrl.add (v);
	}
	r.subs.t1.dat.hct_scd.set(true);
	return r;
}

function init () {
	LZR.curPath = "/myLib";
	LZR.load([
		"LZR.HTML.Base.Ctrl.SglScd",
		"LZR.Pro.Green.Airq.App.ReleaseSys.DatMod",
		"LZR.Base.Time",
		"LZR.HTML.Base.Ajax"
	]);
	hw = {
		// bind: LZR.getSingleton(LZR.Util).bind,
		// Aqi: LZR.Pro.Green.Airq.Fom.Aqi,
		// Ol: ol,
		// Ovy: ol.Overlay,
		// utOlproj: ol.proj.fromLonLat,

		root: LZR,
		obj: {},
		Dm: LZR.Pro.Green.Airq.App.ReleaseSys.DatMod,
		Doe: LZR.HTML.Base.Doe,
		Scd: LZR.HTML.Base.Ctrl.SglScd,
		Eal: LZR.Pro.Green.Airq.Alarm.EmAlarmLevel,
		Efl: LZR.Pro.Green.Airq.Fom.EmFomLevel,
		ajx: new LZR.HTML.Base.Ajax(),
		utJson: LZR.getSingleton(LZR.Base.Json),
		utTim: LZR.getSingleton(LZR.Base.Time),
	};
	hw.obj.root = hw;
	hwo = hw.obj;

	// 配置信息
	hwo.dataIp = "http://192.168.1.235/zhzServer/api/CityPublishInfo/GetProvinceAndCityPublishData?publishDate=";
	// hwo.weatherIP = "http://flash.weather.com.cn/wmaps/xml/zhengzhou.xml";
	hwo.weatherIP = "http://192.168.1.235/hbServer/api/CityMonitor/GetCurrentWeatherInfoByCityName?provenceName=henan&cityname=zhengzhou";
	hw.Efl.emnull.imgUrl = "/Pic/img/web/ReleaseS/a_Level0";
	hw.Efl.v1.imgUrl = "/Pic/img/web/ReleaseS/a_Level1";
	hw.Efl.v2.imgUrl = "/Pic/img/web/ReleaseS/a_Level2";
	hw.Efl.v3.imgUrl = "/Pic/img/web/ReleaseS/a_Level3";
	hw.Efl.v4.imgUrl = "/Pic/img/web/ReleaseS/a_Level4";
	hw.Efl.v5.imgUrl = "/Pic/img/web/ReleaseS/a_Level5";
	hw.Efl.v6.imgUrl = "/Pic/img/web/ReleaseS/a_Level6";
	hw.Efl.emnull.mapImgUrl = "/Pic/img/web/ReleaseS/Level0";
	hw.Efl.v1.mapImgUrl = "/Pic/img/web/ReleaseS/Level1";
	hw.Efl.v2.mapImgUrl = "/Pic/img/web/ReleaseS/Level2";
	hw.Efl.v3.mapImgUrl = "/Pic/img/web/ReleaseS/Level3";
	hw.Efl.v4.mapImgUrl = "/Pic/img/web/ReleaseS/Level4";
	hw.Efl.v5.mapImgUrl = "/Pic/img/web/ReleaseS/Level5";
	hw.Efl.v6.mapImgUrl = "/Pic/img/web/ReleaseS/Level6";
	hw.Efl.emnull.numCss = "number-0";
	hw.Efl.v1.numCss = "number-a";
	hw.Efl.v2.numCss = "number-b";
	hw.Efl.v3.numCss = "number-c";
	hw.Efl.v4.numCss = "number-d";
	hw.Efl.v5.numCss = "number-e";
	hw.Efl.v6.numCss = "number-f";
	// hw.Efl.v3.name = "轻度";
	// hw.Efl.v4.name = "中度";
	// hw.Efl.v5.name = "重度";
	// hw.Efl.v6.name = "严重";
	hw.Eal.v1.css = "alarm1";
	hw.Eal.v2.css = "alarm2";
	hw.Eal.v3.css = "alarm3";

	// 健康提示
	hwo.hb = healthBoard("tips", "tipMemo", "rignt_c_2_scd");

/*
	// 数据（网络）
	hwo.dat = new hw.Dm( getDataByWeb({
		"city_130100": "郑州市"
	}) );
*/

	// 数据（单机）
	hwo.dat = new hw.Dm( getData({
		"city_130100": {
			name: "郑州市",
			geoJson: [114.52, 38.05],
			broadcast: "PM2.5被吸入人体后易引发包括哮喘、支气管炎和心血管病等方面的疾病。而PM2.5产生的主要来源，是日常发电、工业生产、汽车尾气排放等过程中经过燃烧而排放的残留物。"
		}
	}) );


	// 填充数据
	hwo.mod = fillDat(hwo.dat.subs, "fomMod", "broad");

	// 气象枚举
	hw.Ews = EmWeathers();
	hw.Ewd = EmWindDir();
	hw.Ewp = EmWindPower();

	// 气象数据
	hwo.wDat = getWeatherData();	// （单机）
	// hwo.wDat = getWeatherData(hwo.weatherIP);

	// 填充气象数据
	hwo.weather = fillWeatherDat (hwo.wDat, "weather");

}
