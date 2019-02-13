// 放置控件
function placeView (data) {
	// 总控制按钮
	var b = new LZR.HTML5.Util.Layout.BaseDiv({});
	b.addClass ("button");
	b.placeTo(document.body);
	b.div.onclick = function () {
		if (LZR.temp.ctrlDiv.div.style.display === "none") {
			LZR.temp.ctrlDiv.div.style.display = "";
		} else {
			LZR.temp.ctrlDiv.div.style.display = "none";
		}
	}

	// 放置控件的容器
	var s, d;
	d = new LZR.HTML5.Util.Layout.BaseDiv({});
	d.addClass ("ctrlDiv");
	d.placeTo (LZR.temp.map.getViewport());
	LZR.temp.ctrlDiv = d;

	// 放置污染物
	data.fom.view = new LZR.HTML5.Util.Layout.BaseDiv({});
	data.fom.view.addClass ("out");
	d.addChild (data.fom.view);
	for (s in data.fom.children) {
		var f = data.fom.children[s].view;
		f.data.cssNormal.set("normal noselect");
		f.data.cssSelected.set("normal noselect selected");
		data.fom.view.addChild (f.bdo);
	}

	// 放置等高线
	data.line.view = new LZR.HTML5.Util.Layout.BaseDiv({});
	data.line.view.addClass ("out");
	d.addChild (data.line.view);
	for (s in data.line.children) {
		var f = data.line.children[s].view;
		f.data.cssNormal.set("normal noselect");
		f.data.cssSelected.set("normal noselect selected");
		data.line.view.addChild (f.bdo);
	}

	// 放置风场
	data.wind.view = new LZR.HTML5.Util.Layout.BaseDiv({});
	data.wind.view.addClass ("out");
	d.addChild (data.wind.view);
	for (s in data.wind.children) {
		var f = data.wind.children[s].view;
		f.data.cssNormal.set("normal noselect");
		f.data.cssSelected.set("normal noselect selected");
		data.wind.view.addChild (f.bdo);
	}

	// 放置模式
	data.mod.view = new LZR.HTML5.Util.Layout.BaseDiv({});
	data.mod.view.addClass ("out");
	d.addChild (data.mod.view);
	for (s in data.mod.children) {
		var f = data.mod.children[s].view;
		f.data.cssNormal.set("normal noselect");
		f.data.cssSelected.set("normal noselect selected");
		data.mod.view.addChild (f.bdo);
	}

	// 放置区域
	data.area.view = new LZR.HTML5.Util.Layout.BaseDiv({});
	data.area.view.addClass ("out");
	d.addChild (data.area.view);
	for (s in data.area.children) {
		var f = data.area.children[s].view;
		f.data.cssNormal.set("normal noselect");
		f.data.cssSelected.set("normal noselect selected");
		data.area.view.addChild (f.bdo);
	}

	// 放置时长
	data.timeStep.view = new LZR.HTML5.Util.Layout.BaseDiv({});
	data.timeStep.view.addClass ("out");
	d.addChild (data.timeStep.view);
	for (s in data.timeStep.children) {
		var f = data.timeStep.children[s].view;
		f.data.cssNormal.set("normal noselect");
		f.data.cssSelected.set("normal noselect selected");
		data.timeStep.view.addChild (f.bdo);
	}

	// 放置产品时次
	data.time.view = new LZR.HTML5.Util.Layout.BaseDiv({});
	data.time.view.addClass ("out");
	d.addChild (data.time.view);
	for (s in data.time.children) {
		var f = data.time.children[s].view;
		f.data.cssNormal.set("normal noselect");
		f.data.cssSelected.set("normal noselect selected");
		data.time.view.addChild (f.bdo);
	}

	// 放置产品日期
	data.date.view.className = "out normal date";
	d.div.appendChild(data.date.view);

	// LZR.temp.ctrlDiv.div.style.display = "none";
}

function changeFun () {
	LZR.HTML5.Bp.AirqMg.RegStat2.Query.prototype.qry = function () {
		var y = this.layers[this.index];
		if (y) {
			if (this.foc.tim === "2015070220" && this.foc.mod === "NAQPMS") {
				switch (y.className) {
					case "LZR.HTML5.Bp.AirqMg.RegStat2.OlLayer":
					case "LZR.HTML5.Bp.AirqMg.RegStat2.OlGeoJsonLayer":
						this.foc.num = y.num.val;
						this.handleClose (this.qry2(this.foc));
						break;
					case "LZR.HTML5.Bp.AirqMg.RegStat2.WindLayer":
						this.handleClose (this.creWindSQL(y));
						break;
				}
			} else {
				this.handleClose ([]);
			}
		} else {
			this.index = -1;
		}
	};

	LZR.HTML5.Bp.AirqMg.RegStat2.Query.prototype.qry2 = function (foc) {
		var path, nam, obj, step, i, t, pt;
		var r = [];
		var ex = ".png";
		switch (foc.num) {
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
				path = "/fom/Day/o3/";
				nam = "O3DailySpa_";
				step = 24;
				break;
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
				ex = ".js";
				break;
			case "51":
				path = "/meteor/Day/Rh/";
				nam = "RhDailySpa_";
				step = 24;
				ex = ".js";
				break;
			case "50":
				path = "/meteor/Day/Te/";
				nam = "TeDailySpa_";
				step = 24;
				ex = ".js";
				break;
			case "4Y":
				path = "/meteor/Hour/Pr/";
				nam = "PrHourlySpa_";
				step = 1;
				ex = ".js";
				break;
			case "4X":
				path = "/meteor/Hour/Rh/";
				nam = "RhHourlySpa_";
				step = 1;
				ex = ".js";
				break;
			case "4W":
				path = "/meteor/Hour/Te/";
				nam = "TeHourlySpa_";
				step = 1;
				ex = ".js";
				break;
			default:
				return r;
		}
		path += foc.tim;
		nam += foc.area;
		nam += "_";
		nam += foc.mod;
		nam += "_";
		nam += foc.tim;
		nam += "_";
		path += "/";
		path = foc.resultType.pre + path + nam;

		pt = "";
		for (i=0; i<foc.tim.length; i++) {
			pt += foc.tim[i];
			switch(i) {
				case 3:
				case 5:
					pt += "/";
					break;
				case 7:
					pt += " ";
					break;
			}
		}
		pt += ":00:00";
		pt = new Date(pt).valueOf();
		for (i = foc.start; i < foc.end; i += step) {
			nam = new LZR.HTML5.Bp.Util.CatchImgByWebsocket.Result({
				ret: path + LZR.HTML5.Util.format (i, 3, "0") + ex
			});
			t = new Date (pt + i * 3600 * 1000);
			nam.tim = t.getFullYear() + LZR.HTML5.Util.format (t.getMonth()+1, 2, "0") + LZR.HTML5.Util.format (t.getDate(), 2, "0");
			if (step === 1) {
				nam.tim += LZR.HTML5.Util.format (t.getHours(), 2, "0");
			}
			r.push(nam);
		}
		return r;
	};
}

function init() {
	LZR.HTML5.jsPath = "/Pic/js/old/";
	LZR.HTML5.loadJs([
		LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2.js"	// V0.1.2
	]);

	LZR.temp = {};
	changeFun();

	// 创建等经纬度地图（WGS84）
	var attribution = new ol.Attribution({
		html: "Copyright (C) 2019 犟子工作室 www.ziniulian.tk"
	});
	var projection = ol.proj.get('EPSG:4326');
	var tileSize = 512;
	var urlTemplate = "http://services.arcgisonline.com/arcgis/rest/services/" + "ESRI_Imagery_World_2D/MapServer/tile/{z}/{y}/{x}";
	LZR.temp.map = new ol.Map({
		target: "map",
		layers: [
			new ol.layer.Tile({
				source: new ol.source.XYZ ({
					attributions: [attribution],
					maxZoom: 16,
					projection: projection,
					tileSize: tileSize,
					tileUrlFunction: function(tileCoord) {
						return urlTemplate.replace('{z}', (tileCoord[0] - 1).toString()).replace('{x}', tileCoord[1].toString()).replace('{y}', (-tileCoord[2] - 1).toString());
					},
					wrapX: true
				})
			})
		],
		view: new ol.View({
			projection: "EPSG:4326",
			center: [105, 37],
			zoom: 5,
			minZoom: 2
		})
	});

	// 删除地图的 controls
	LZR.temp.map.getControls().clear();

	LZR.temp.data = new LZR.HTML5.Bp.AirqMg.RegStat2.ViewData();
	LZR.temp.data.timeAxis.view = timeAxis;
	LZR.temp.data.wind.children.Lagrange.windUrl = "/Show/windSrv";
	LZR.temp.data.wind.children.Lagrange.isLLC = true;
	LZR.temp.data.qry.urlPre = "/Pic/img";

// 经纬度转墨卡托
// console.log(ol.proj.transform([47.02134865, -16.45396135], ol.proj.get("EPSG:4326"), ol.proj.get("EPSG:3857")));
// 墨卡托转经纬度
// console.log(ol.proj.transform([5234392.588130982, -1857354.395370978], ol.proj.get("EPSG:3857"), ol.proj.get("EPSG:4326")));

	// 设置区域坐标
	LZR.temp.data.area.children.d01.range = [47.122699999962336, -16.39374078012422, 164.7063642965198, 60.471713300008815];
	LZR.temp.data.area.children.d02.range = [90.2812300000861, 14.297822758859823, 141.88580192691992, 55.255541359984676];
	LZR.temp.data.area.children.d03.range = [107.84330000030326, 32.15116662191214, 127.21630479696474, 45.10059899997739];

	LZR.temp.rs = new LZR.HTML5.Bp.AirqMg.RegStat2({
		olmap: LZR.temp.map,
		data: LZR.temp.data,
		windFlash: false
	});
	LZR.temp.data.qry.ctrl.backImg = "/Pic/img/web/RegS/V2/back.png";
	LZR.temp.data.qry.ctrl.backJson = "/Pic/img/web/RegS/V2/back.json";
// console.log (LZR.temp.data);

	LZR.temp.data.timeAxis.ctrl.init();
	placeView (LZR.temp.data);

	LZR.temp.rs.flush();

	setTimeout(function () {
		LZR.temp.data.cur.fom.visible.set(true);
		LZR.temp.data.cur.line.visible.set(true);
		LZR.temp.data.cur.wind.visible.set(true);
	}, 1);

	// LZR.temp.data.fom.children.O3.visible.set(true);

	// for (var s in LZR.temp.data.fom.children.AQI.visible.event.change.funs) {
	// 	console.log (s);
	// }
}
