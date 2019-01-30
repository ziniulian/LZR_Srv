function Test (hw, br) {
	return {
		loadNum: 0,	// 加载数量

		startup: function() {
/*
			// this.idDiv = document.getElementById(this.id);
			// LZR.HTML5.Util.Css.addClass (this.idDiv, this.baseClass);
			LZR.HTML5.Util.Css.addClass (map, this.baseClass);

			LZR.HTML5.Util.Css.addClass (map, this.baseClass);
			LZR.HTML5.loadJs([
				LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2.js"
			]);

			CandS_date_out.innerHTML = CandS_date.value;
			on ( this.CandS_date, "change", hw.bind (this, function() {
				CandS_date_out.innerHTML = CandS_date.value;
				this.md.m_time.productTime.set(LZR.Util.Date.getDate(this.CandS_date.toString() + " " + this.CandS_tim.value));
			}) );
			on ( this.CandS_tim, "change", hw.bind (this, function() {
				CandS_tim_out.innerHTML = this.CandS_tim.domNode.textContent;
				this.md.m_time.productTime.set(LZR.Util.Date.getDate(this.CandS_date.toString() + " " + this.CandS_tim.value));
			}) );
			on ( this.CandS_mod, "change", hw.bind (this, function() {
				CandS_mod_out.innerHTML = this.CandS_mod.domNode.textContent;
				this.md.mod.set(this.CandS_mod.value);
			}) );
*/
			this.init();
			this.initNiceScroll();
			this.showNiceScroll();
		},
/*
		onOpen: function() {
			LZR.HTML5.Util.Css.addClass (map, this.baseClass);

			// this.domNode.parentNode.parentNode.parentNode.style.display = "none";
			// document.getElementById(this.id + "_panel").style.display = "none";

			this.md.ctrl.style.display = "";
			this.md.m_time.ctrl.div.style.display = "";
			this.md.view.stationLayer.setVisible(true);
			this.md.view.cityLayer.setVisible(true);
			this.md.m_time.ctrl.init();
			this.showNiceScroll();
		},

		onClose: function() {
			this.hidNiceScroll();
			LZR.HTML5.Util.Css.removeClass (map, this.baseClass);
			this.closeRight();
			this.md.ctrl.style.display = "none";
			this.md.m_time.ctrl.div.style.display = "none";
			this.md.view.stationLayer.setVisible(false);
			this.md.view.cityLayer.setVisible(false);
		},
*/
		init: function() {
			this.buildModel();
			this.buildTimeAxis();
			// this.createLegend();

			this.getStations();

			this.oldz = this.map.getView().getZoom();
			this.map.on("moveend", hw.bind (this, this.zoomChange));
			this.map.on("pointermove", hw.bind (this, this.mapCtrl, "overCity", "overStation"));
			this.map.on("click", hw.bind (this, this.mapCtrl, "city", "station"));
			// this.stationInfoQueryTask = new AllCityAndStaListQueryTask(this.appConfig.restApiServerUrl.url);
		},

		buildModel: function() {
			this.md = new hw.HTML5.Project.Bp.StationInfo.Model ({
				map: this.map
			});
			this.md.zoomBase = 11;

			this.md.m_data = {
				p: {},
				c: {},
				s: {},
				cs: {},
				ss: {}
			};

			this.md.cur = {
				station: new hw.Base.ValCtrl(),
				city: new hw.Base.ValCtrl(),
				overStation: new hw.Base.ValCtrl(),
				overCity: new hw.Base.ValCtrl(),
				position: new hw.Base.ValCtrl()
			};
			this.md.cur.station.setEventObj (this);
			this.md.cur.station.event.change.append(this.selectedStation);
			this.md.cur.city.setEventObj (this);
			this.md.cur.city.event.change.append(this.selectedCity);
			this.md.cur.overStation.setEventObj (this);
			this.md.cur.overStation.event.change.append(this.hoverStation);
			this.md.cur.overCity.setEventObj (this);
			this.md.cur.overCity.event.change.append(this.hoverCity);
			this.md.m_time.productTime.setEventObj (this);
			this.md.m_time.productTime.event.change.append(this.changeTim);

			this.md.mod.setEventObj (this);
			this.md.mod.event.change.append(this.changeMod);

			this.md.view = {
				stationLayer: new ol.layer.Vector({
					source: new ol.source.Vector(),
					style: null
				}),
				cityLayer: new ol.layer.Vector({
					source: new ol.source.Vector(),
					style: null
				})
			};
			this.md.view.stationLayer.setZIndex(10);
			this.map.addLayer (this.md.view.stationLayer);
			this.map.addLayer (this.md.view.cityLayer);

			// this.md.ctrl = document.createElement("div");
			// LZR.HTML5.Util.Css.addClass (this.md.ctrl, "left_out");
			// this.domNode.appendChild(this.md.ctrl);
			this.md.ctrl = document.getElementById("CandS_leftOut");

			// this.idDiv.appendChild(this.md.ctrl);
			// map.appendChild(this.md.ctrl);
/*
			this.md.ctrl.date = this.CandS_date;
			this.md.ctrl.tim = this.CandS_tim;
			this.md.ctrl.mod = this.CandS_mod;
*/
			this.md.ctrl.date = document.getElementById("CandS_date");
			this.md.ctrl.tim = document.getElementById("CandS_tim");
			this.md.ctrl.mod = document.getElementById("CandS_mod");
			// this.md.ctrl.date.value = this.timeToFomQryString(this.addHour(-24)).substring(0, 10);		// 当天日期
			LZR.HTML5.Util.Event.addEvent (this.md.ctrl.date, "change", hw.bind(this, function () {
				this.md.m_time.productTime.set(LZR.Util.Date.getDate(this.md.ctrl.date.value + " " + this.md.ctrl.tim.value));
			}), false);
			LZR.HTML5.Util.Event.addEvent (this.md.ctrl.tim, "change", hw.bind(this, function () {
				this.md.m_time.productTime.set(LZR.Util.Date.getDate(this.md.ctrl.date.value + " " + this.md.ctrl.tim.value));
			}), false);
			LZR.HTML5.Util.Event.addEvent (this.md.ctrl.mod, "change", hw.bind(this, function () {
				this.md.mod.set(this.md.ctrl.mod.value);
			}), false);
/*
			this.md.ctrl.date.out = CandS_dateOut;
			this.md.ctrl.tim.out = CandS_timOut;
			this.md.ctrl.mod.out = CandS_modOut;

			this.md.ctrl.appendChild(this.md.ctrl.tim.out);
			this.md.ctrl.appendChild(this.md.ctrl.date.out);
			this.md.ctrl.appendChild(this.md.ctrl.mod.out);
*/
			// 城市筛选、排名
			this.md.ctrl.bar = document.getElementById("CandS_selectBar");
			this.md.ctrl.bar.city = document.getElementById("CandS_city");
			this.md.ctrl.bar.primary = document.getElementById("CandS_primary");
			this.md.ctrl.bar.level = document.getElementById("CandS_level");
			this.md.ctrl.bar.order = document.getElementById("CandS_order");
			this.md.ctrl.bar.order.value = "stb";
			LZR.HTML5.Util.Event.addEvent (this.md.ctrl.bar.city, "change", hw.bind(this, this.selectChange, this.md.ctrl.bar.city), false);
			LZR.HTML5.Util.Event.addEvent (this.md.ctrl.bar.primary, "change", hw.bind(this, this.selectChange, this.md.ctrl.bar.primary), false);
			LZR.HTML5.Util.Event.addEvent (this.md.ctrl.bar.level, "change", hw.bind(this, this.selectChange, this.md.ctrl.bar.level), false);
			LZR.HTML5.Util.Event.addEvent (this.md.ctrl.bar.order, "click", hw.bind(this, this.selectOrder, this.md.ctrl.bar.order), false);
			// this.md.ctrl.appendChild(this.md.ctrl.bar);

			// this.md.ctrl.stations = document.createElement("div");
			// LZR.HTML5.Util.Css.addClass (this.md.ctrl.stations, "stations");
			this.md.ctrl.stations = document.getElementById("stations");
			var d = document.createElement("div");
			d.style.marginBottom = "10px";
			this.md.ctrl.stations.appendChild(d);
			this.md.ctrl.stations.inDiv = d;
			// this.md.ctrl.appendChild(this.md.ctrl.stations);
		},

		initAfter: function() {
			for (var i in this.md.m_data.p) {
				s = this.md.m_data.p[i];
				var op = document.createElement("option");
				op.value = i;
				op.innerHTML = s.name;
				op.className = "selectOption";
				this.md.ctrl.bar.city.appendChild(op);
			}
			this.getFom();
			this.getCitys();
		},

		handleError: function() {
			alert("error");
		},

		getGeoServerUrl: function(layerName) {
			var url = this.appConfig.map.geoServerUrl;
			url += "/";
			url += this.appConfig.map.operateLayer.workspaceName;
			url += "/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=";
			url += this.appConfig.map.operateLayer.workspaceName;
			url += ":";
			url += this.appConfig.map.operateLayer[layerName];
			url += "&outputFormat=text/javascript&srsname=EPSG:3857";
			return url;
		},

		getCitys: function() {
			new LZR.HTML5.Util.Ajax().get( "/Pic/json/cas/cityGeoJson.js", hw.bind(this, this.handleCitys) );
/*
			var url = this.getGeoServerUrl("cityLayerName");
			geoScript.get(url, {
				jsonp: "format_options=callback"
			}).then ( hw.bind(this, this.handleCitys), hw.bind(this, this.handleError) );
*/
		},

		handleCitys: function(data) {
			data = JSON.parse(data);
// console.log (data);
			for (var i=0; i<data.features.length; i++) {
				var c = data.features[i];
				var mc = this.md.m_data.c[c.properties.code];
				if (mc) {
					mc.geoJson = c.geometry.coordinates;
					mc.pro = c.properties;
					// mc.view = new ol.format.GeoJSON().readFeature(c);
					mc.view = new ol.Feature(new ol.geom.MultiPolygon(mc.geoJson));
					mc.view.data = mc;
					mc.flushView();
					this.md.view.cityLayer.getSource().addFeature (mc.view);
				}
			}

			setTimeout(hw.bind(this, this.hidLoading), 10);
		},

		getColor: function () {
			return [200, 200, 200, 0.5];
		},

		getStations: function() {
			new LZR.HTML5.Util.Ajax().get( "/Pic/json/cas/stationInfo.js", hw.bind(this, this.handleStations) );
/*
			var url = this.getGeoServerUrl("stationLayerName");
			geoScript.get(url, {
				jsonp: "format_options=callback"
			}).then ( hw.bind(this, this.handleStations), hw.bind(this, this.handleError) );
*/
		},

		handleStations: function(data) {
			data = JSON.parse(data);
// console.log (data);
			var s, md = this.md;
			var sdClass = hw.HTML5.Project.Bp.StationInfo.Model;
			var pLevel = sdClass.prototype.LEVEL;
			var cLevel = pLevel.city;
			var sLevel = pLevel.point;
			pLevel = pLevel.province;
			sdClass = sdClass.SpatialData;

			for (var i=0; i<data.features.length; i++) {
				s = new sdClass ({
					id: data.features[i].properties.stationcode,
					name: data.features[i].properties.stationname,
					level: sLevel,
					geoJson: data.features[i].geometry.coordinates,
					pro: data.features[i].properties
				});
				md.m_data.s[s.id.val] = s;
				s.changeStyle = this.changeStyle;
				s.flushView = this.flushView;
				s.flushStationView = this.flushStationView;
				s.flushCityView = this.flushCityView;
				s.matchColor = this.matchColor;
				s.charts = {
					aqi: [],
					pm25: [],
					pm10: [],
					o3: [],
					so2: [],
					no2: [],
					co: []
				};

				var pid = s.pro.provincename;
				var p = md.children[pid];
				if (!p) {
					p = new sdClass ({
						id: pid,
						name: pid,
						level: pLevel
					});
					md.m_data.p[pid] = p;
					p.changeStyle = this.changeStyle;
					p.flushView = this.flushView;
					p.flushStationView = this.flushStationView;
					p.flushCityView = this.flushCityView;
					p.matchColor = this.matchColor;
					p.charts = {
						aqi: [],
						pm25: [],
						pm10: [],
						o3: [],
						so2: [],
						no2: [],
						co: []
					};
					md.append(p);
					this.createCityCtrl(p);
				}

				var cid = s.pro.citycode;
				var c = p.children[cid];
				if (!c) {
					c = new sdClass ({
						id: cid,
						name: s.pro.cityname,
						level: cLevel
					});
					md.m_data.c[cid] = c;
					c.changeStyle = this.changeStyle;
					c.flushView = this.flushView;
					c.flushStationView = this.flushStationView;
					c.flushCityView = this.flushCityView;
					c.matchColor = this.matchColor;
					c.charts = {
						aqi: [],
						pm25: [],
						pm10: [],
						o3: [],
						so2: [],
						no2: [],
						co: []
					};
					c.expandPoint = this.expandPoint;
					c.locateCityList = this.locateCityList;
					c.expand = new hw.Base.ValCtrl(false);
					c.expand.setEventObj (c);
					c.expand.event.change.append(c.expandPoint);
					p.append(c);
					this.createCityCtrl(c);
				}

				c.append(s);
				this.createView(s);
				this.createStationCtrl(s);
			}
// console.log (md);
			this.initAfter();
		},

		createView: function (s, css) {
			if (!css) {
				css = "defaultPoint noselect";
			}
			var d = document.createElement("div");
			d.title = s.parent.val.parent.val.name + " - " + s.parent.val.name + " - " + s.name;
			LZR.HTML5.Util.Css.addClass (d, css);

			s.view = new ol.Feature(new ol.geom.Point(s.geoJson));
			s.view.data = s;
			s.flushView();
			this.md.view.stationLayer.getSource().addFeature (s.view);
		},

		zoomChange: function () {
			var s, z = this.map.getView().getZoom();
			if (z >= this.md.zoomBase && this.oldz < this.md.zoomBase) {
				this.oldz = z;
				for (s in this.md.m_data.s) {
					this.md.m_data.s[s].flushView();
				}
			} else if (this.oldz >= this.md.zoomBase && z < this.md.zoomBase) {
				this.oldz = z;
				for (s in this.md.m_data.s) {
					this.md.m_data.s[s].flushView();
				}
			}
		},

		flushView: function () {
			if (this.view) {
				if (this.level.level == 10) {
					this.flushStationView();
				} else {
					this.flushCityView();
				}
			}
		},

		// 刷新站点样式
		flushStationView: function () {
			var s = this;
			var ss = [];
			var fom = s.m_fom[s.root.val.cur.position.val];
			var z = 0, stroke, alpha;
			if (s.root.val.cur.overStation.val === s) {
				z = 5;
				alpha = 1;
				stroke = new ol.style.Stroke({
					color: [0, 0, 255, 1],
					width: 1
				});
			} else {
				alpha = 1;
				stroke = new ol.style.Stroke({
					color: [200, 200, 200, 1],
					width: 1
				});
			}
			if (s.root.val.cur.station.val === s) {
				z = 10;
				stroke = new ol.style.Stroke({
					color: [0, 204, 255, 0.7],
					width: 7
				});
			}
			var color = s.matchColor(alpha);
			var big = (s.root.val.map.getView().getZoom() >= s.root.val.zoomBase);
			var txt = null;
			var img = null;
			if (fom) {
				color = s.matchColor(alpha, fom.memo.levelNum);
				if (big) {
					txt = new ol.style.Text({
						text: fom.aqi,

						// font: "12px 微软雅黑",
						font: "8px 微软雅黑",

						textAlign: "center",

						// textBaseline: "middle",
						offsetY: -2,

						fill: new ol.style.Fill({
							color: "#EEE"
						}),
						stroke: new ol.style.Stroke({
							color: "#666",

							// width: 5
							width: 2

						})
					});
				}
			}
			if (big) {

				img = new ol.style.RegularShape({
					fill: new ol.style.Fill({
						color: color
					}),
					stroke: stroke,
					points: 4,
					radius: 25,
					radius2: 15,
					angle: 0
				});

/*
				var imageName = "-999";
				if (fom) {
					imageName = fom.memo.levelNum;
				}
				img = new ol.style.Icon({
					src: "images/" + imageName + ".png"
				});
*/
				// 显示站点名称
				ss.push( new ol.style.Style({
					text: new ol.style.Text({
						text: s.name,

						// font: "12px 微软雅黑",
						font: "10px 微软雅黑",

						textAlign: "center",

						offsetY: 35,

						fill: new ol.style.Fill({
							color: "#666"
						}),
						stroke: new ol.style.Stroke({
							color: "#EEE",

							// width: 5
							width: 2

						})
					})
				}) );
			} else {
				img = new ol.style.Circle({
					fill: new ol.style.Fill({
						color: color
					}),
					stroke: stroke,
					radius: 8,
				});
			}

			ss.push( new ol.style.Style({
				image: img,
				text: txt,
				zIndex: z
			}) );
			s.view.setStyle (ss);
		},

		flushCityView: function () {
			var s = this;
			var fom = s.m_fom[s.root.val.cur.position.val];
			var z = 0, stroke, alpha;
			if (s.root.val.cur.overCity.val === s) {
				z = 5;
				alpha = 0.6;
				stroke = new ol.style.Stroke({
					color: [0, 0, 255, 0.5],
					width: 2
				});
			} else {
				alpha = 0.6;
				stroke = new ol.style.Stroke({
					color: [200, 200, 200, 1],
					width: 0.1
				});
			}
			if (s.root.val.cur.city.val === s) {
				z = 10;
				stroke = new ol.style.Stroke({
					color: [0, 204, 255, 0.7],
					width: 7
				});
			}
			var color = s.matchColor(alpha);
			if (fom) {
				color = s.matchColor(alpha, fom.memo.levelNum);
			}
			s.view.setStyle (new ol.style.Style({
				fill: new ol.style.Fill({
					color: color
				}),
				stroke: stroke,
				zIndex: z
			}));
		},

		matchColor: function (alpha, level) {
			switch (level) {
				case "1":
					return [0, 228, 0, alpha];
				case "2":
					return [255, 255, 0, alpha];
				case "3":
					return [255, 126, 0, alpha];
				case "4":
					return [255, 0, 0, alpha];
				case "5":
					return [153, 0, 76, alpha];
				case "6":
					return [126, 0, 35, alpha];
				default:
					return [200, 200, 200, alpha];
			}
		},

		createStationCtrl: function (s) {
			s.ctrl = {
				out: document.createElement("div"),
				title: document.createElement("div"),
				color: document.createElement("div"),
				primary: document.createElement("div"),
				value: document.createElement("div")
			};
			LZR.HTML5.Util.Css.addClass (s.ctrl.out, "station");
			LZR.HTML5.Util.Css.addClass (s.ctrl.title, "Stitle");
			LZR.HTML5.Util.Css.addClass (s.ctrl.color, "station_color");
			LZR.HTML5.Util.Css.addClass (s.ctrl.primary, "memo");
			LZR.HTML5.Util.Css.addClass (s.ctrl.value, "value");

			LZR.HTML5.Util.Event.addEvent (s.ctrl.out, "mouseover", hw.bind(this, this.mouseover, s), false);
			LZR.HTML5.Util.Event.addEvent (s.ctrl.out, "mouseout", hw.bind(this, this.mouseout, s), false);
			LZR.HTML5.Util.Event.addEvent (s.ctrl.out, "click", hw.bind(this, this.click, s), false);

			s.ctrl.title.innerHTML = s.name;
			s.ctrl.primary.innerHTML = "";
			s.ctrl.value.innerHTML = "";

			s.ctrl.out.appendChild (s.ctrl.color);
			s.ctrl.out.appendChild (s.ctrl.title);
			var bot = document.createElement("div");
			s.ctrl.out.appendChild (bot);
			bot.appendChild (s.ctrl.value);
			bot.appendChild (s.ctrl.primary);
		},

		createCityCtrl: function (s) {
			s.ctrl = {
				out: document.createElement("div"),
				title: document.createElement("div"),
				color: document.createElement("div"),
				primary: document.createElement("div"),
				value: document.createElement("div"),
				expand: document.createElement("div"),
				inDiv: document.createElement("div")
			};
			LZR.HTML5.Util.Css.addClass (s.ctrl.out, "city");
			LZR.HTML5.Util.Css.addClass (s.ctrl.title, "Ctitle");
			LZR.HTML5.Util.Css.addClass (s.ctrl.color, "city_color");
			LZR.HTML5.Util.Css.addClass (s.ctrl.primary, "memo");
			LZR.HTML5.Util.Css.addClass (s.ctrl.value, "memo");
			LZR.HTML5.Util.Css.addClass (s.ctrl.expand, "expand noselect");

			LZR.HTML5.Util.Event.addEvent (s.ctrl.out, "mouseover", hw.bind(this, this.mouseover, s), false);
			LZR.HTML5.Util.Event.addEvent (s.ctrl.out, "mouseout", hw.bind(this, this.mouseout, s), false);
			LZR.HTML5.Util.Event.addEvent (s.ctrl.out, "click", hw.bind(this, this.click, s), false);
			LZR.HTML5.Util.Event.addEvent (s.ctrl.expand, "click", hw.bind(this, function(s, e) {
				LZR.HTML5.Util.stopBubble(e);
				s.expand.set(!s.expand.val);
			}, s), false);

			s.ctrl.title.innerHTML = s.name;
			s.ctrl.primary.innerHTML = "首要污染物：--";
			s.ctrl.value.innerHTML = "污染浓度：- ug/m<sup>3</sup>";
			s.ctrl.expand.innerHTML = "▽";

			s.ctrl.out.appendChild (s.ctrl.expand);
			s.ctrl.out.appendChild (s.ctrl.title);
			var bot = document.createElement("div");
			s.ctrl.out.appendChild (bot);
			bot.appendChild (s.ctrl.color);

			d = document.createElement("div");
			LZR.HTML5.Util.Css.addClass (d, "memoout");
			bot.appendChild (d);
			d.appendChild (s.ctrl.primary);
			d.appendChild (s.ctrl.value);

			s.ctrl.out.appendChild (s.ctrl.inDiv);
		},

		mapCtrl: function (c, s, e) {
			// var pixel = this.map.getEventPixel(e.originalEvent);
			var pixel = e.pixel;
			this.temp = null;
			this.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
				if (!this.temp) {
					this.temp = feature.data;
				}
			}, this);
			if (this.temp) {
				if (this.temp.level.level == 10) {
					this.md.cur[c].set(null);
					if (c == "city") {
						if (this.md.cur[s].val === this.temp) {
							this.md.cur[s].set(null);
						} else {
							this.md.cur[s].set(this.temp);
							this.temp.parent.val.expand.set(true);
							this.locateStationList (this.temp);
						}
					} else {
						this.md.cur[s].set(this.temp);
					}
				} else {
					this.md.cur[s].set(null);
					if (c == "city") {
						if (this.md.cur[c].val === this.temp) {
							this.md.cur[c].set(null);
						} else {
							this.md.cur[c].set(this.temp);
							this.temp.locateCityList();
						}
					} else {
						this.md.cur[c].set(this.temp);
					}
				}
			} else {
				this.md.cur[c].set(null);
				this.md.cur[s].set(null);
			}
		},

		mouseover: function (s, e) {
			LZR.HTML5.Util.stopBubble(e);
			var key = "overCity";
			if (s.level.level == 10) {
				key = "overStation";
			}
			if (this.md.cur[key].val !== s) {
				this.md.cur[key].set(s);
			}
		},

		mouseout: function (s) {
			var key = "overCity";
			if (s.level.level == 10) {
				key = "overStation";
			}
			this.md.cur[key].set(null);
		},

		click: function (s, e) {
			LZR.HTML5.Util.stopBubble(e);
			var key = "city";
			if (s.level.level == 10) {
				this.md.cur[key].set(null);
				key = "station";
			} else {
				this.md.cur.station.set(null);
			}
			if (this.md.cur[key].val === s) {
				s = null;
			} else {
				if (key == "city") {
					this.locateCityMap(s);
				} else {
					this.locateStationMap(s);
				}
			}
			this.md.cur[key].set(s);
		},

		locateCityList: function () {
			if (this.root.val.m_data.cs[this.id.val]) {
				var d = this.ctrl.out;
				var p = this.root.val.ctrl.stations;
				var top = d.offsetTop - p.offsetTop;
				p.scrollTop = top - 10;
			}
		},

		locateStationList: function (s) {
			if (this.md.m_data.ss[s.id.val]) {
				var c = s.parent.val;
				c.locateCityList();

				if (c.expand.val) {
					var d = s.ctrl.out;
					var p = this.md.ctrl.stations;
					var top = d.offsetTop - p.offsetTop;
					var bot = p.scrollTop + p.clientHeight;
					var dbt = top + d.clientHeight + 10;
					if (dbt > bot) {
						if (dbt >= p.scrollHeight) {
							dbt = p.scrollHeight-1;
						}
						p.scrollTop = dbt - p.clientHeight;
					}
				}
			}
		},

		locateCityMap: function (c) {
			this.map.getView().fit(c.view.getGeometry().getExtent(), this.map.getSize());
		},

		locateStationMap: function (s) {
			this.map.getView().setCenter (s.geoJson);
			this.map.getView().setZoom (this.md.zoomBase);
		},

		selectedStation: function (s, self, old) {
// console.log (s);
			if (old) {
				if (old.view) {
					old.flushView();
				}
				if (old.ctrl) {
					LZR.HTML5.Util.Css.removeClass (old.ctrl.out, "station_selected");
				}
			}
			if (s) {
				if (s.view) {
					s.flushView();
				}
				if (s.ctrl) {
					LZR.HTML5.Util.Css.addClass (s.ctrl.out, "station_selected");
				}
				this.openRight(s);
			} else {
				this.closeRight();
			}
		},

		selectedCity: function (s, self, old) {
// console.log (s);
			if (old) {
				if (old.view) {
					old.flushView();
				}
				if (old.ctrl) {
					LZR.HTML5.Util.Css.removeClass (old.ctrl.out, "city_selected");
				}
			}
			if (s) {
				if (s.view) {
					s.flushView();
				}
				if (s.ctrl) {
					LZR.HTML5.Util.Css.addClass (s.ctrl.out, "city_selected");
				}
				this.openRight(s);
			} else {
				this.closeRight();
			}
		},

		hoverStation: function (s, self, old) {
			if (old) {
				if (old.view) {
					old.flushView();
				}
				if (old.ctrl) {
					LZR.HTML5.Util.Css.removeClass (old.ctrl.out, "station_hover");
				}
			}
			if (s) {
				if (s.view) {
					s.flushView();
				}
				if (s.ctrl) {
					LZR.HTML5.Util.Css.addClass (s.ctrl.out, "station_hover");
				}
			}
		},

		hoverCity: function (s, self, old) {
			if (old) {
				if (old.view) {
					old.flushView();
				}
				if (old.ctrl) {
					LZR.HTML5.Util.Css.removeClass (old.ctrl.out, "city_hover");
				}
			}
			if (s) {
				if (s.view) {
					s.flushView();
				}
				if (s.ctrl) {
					LZR.HTML5.Util.Css.addClass (s.ctrl.out, "city_hover");
				}
			}
		},

		// 创建时间轴
		buildTimeAxis: function() {
			this.md.mod.set(this.md.ctrl.mod.value, false);
			this.md.m_time.timeCount.set(7, false);
			this.md.m_time.timeStep.set(3600, false);
			this.md.m_time.timeCurrentIndex.set(0, false);
			this.md.m_time.productTime.set(LZR.Util.Date.getDate(this.md.ctrl.date.value + " " + this.md.ctrl.tim.value), false);
			this.md.m_time.timeStart.set(this.addHour( (24 - parseInt(this.md.ctrl.tim.value, 10)), this.md.m_time.productTime.val ), false);
			this.md.cur.position.set(new Date().getHours(), false);

			var td = document.createElement("div");
			td.className = "timeAxis";
			document.getElementById("map").appendChild(td);

			// 创建时间轴速度选项
			this.md.m_time.speeds = {
				id: "speeds",
				root: this.md,
				children: {
					fast: {
						id: "fast",
						parent: null,
						root: this.md,
							value: 50,
							html: "快",
							select: new LZR.Util.ValCtrl(true),
						view: null
					},
					mid: {
						id: "mid",
						parent: null,
						root: this.md,
							value: 700,
							html: "中",
							select: new LZR.Util.ValCtrl(false),
						view: null
					},
					slow: {
						id: "slow",
						parent: null,
						root: this.md,
							value: 1500,
							html: "慢",
							select: new LZR.Util.ValCtrl(false),
						view: null
					}
				},
				cur: null,
				outDiv: new LZR.HTML5.Util.Layout.BaseDiv({}),
				changeSpeed: function (v) {
					if (v) {
						if (this != this.parent.cur) {
							var tmp = this.parent.cur;
							this.parent.cur = this;
							tmp.select.set (false);
							this.root.m_time.ctrl.setter("playSpeed", this.value);
						} else {
							return false;
						}
					} else if (this == this.parent.cur) {
						return false;
					}
				}
			};
			this.md.m_time.speeds.outDiv.div = document.getElementById("CandS_speeds");
			// this.md.m_time.speeds.outDiv.addClass("speedBtnOut");
			// this.md.m_time.speeds.outDiv.placeTo(this.md.ctrl);
			for (var s in this.md.m_time.speeds.children) {
				var sp = this.md.m_time.speeds.children[s];
				sp.parent = this.md.m_time.speeds;
				if (sp.select.val) {
					sp.parent.cur = sp;
				}
				sp.select.setEventObj (sp);
				sp.select.event.before.append (sp.parent.changeSpeed);
				sp.view = new LZR.HTML5.Bp.AirqMg.RegStat2.SelectView({
					html: sp.html,
					selected: sp.select,
					cssNormal: "speedBtn noselect",
					cssSelected: "speedBtn noselect selected"
				});
				sp.parent.outDiv.addChild (sp.view.bdo);
			}

			this.md.m_time.ctrl = new LZR.HTML5.Bp.Util.BpTimeAxis ({
				div: td,
				count: this.md.m_time.timeCount.val,		// 时间刻度数量
				style: 1,		// 风格（0：压线（含最大时间）；1：压中（不含最大时间））
				timeLong: this.md.m_time.timeCount.val * 24,	// 时间长度
				timeStep: this.md.m_time.timeStep.val,	// 时间间隔（秒）
				startTime: this.md.m_time.timeStart.val,
				playSpeed: this.md.m_time.speeds.cur.value	// 时间轴播放速度（毫秒）
			});
			this.md.m_time.ctrl.onchange = hw.bind(this, this.timeChange);
			this.md.m_time.ctrl.init(this.md.cur.position.val);
		},




		timeChange: function (time, position) {
			this.md.cur.position.set(position);
			for (var c in this.md.m_data.c) {
				this.md.m_data.c[c].changeStyle (position);
			}
			for (var s in this.md.m_data.s) {
				this.md.m_data.s[s].changeStyle (position);
			}
		},

		addHour: function (n, time) {
			if (!time) {
				time = new Date();
			}
			time = time.valueOf();
			time += n * 3600 * 1000;
			return new Date(time);
		},

		normalize: function (time, hour) {
			if (!time) {
				time = new Date();
			}
			if (!hour) {
				hour = 0;
			}
			time.setMinutes(0);
			time.setSeconds(0);
			time.setMilliseconds(0);
			time.setHours(hour);
			return time;
		},

		timeToFomQryString: function (time) {
			var s = time.getFullYear();
			s += "-";
			s += LZR.HTML5.Util.format( (time.getMonth() + 1), 2, "0" );
			s += "-";
			s += LZR.HTML5.Util.format( time.getDate(), 2, "0" );
			s += " ";
			s += LZR.HTML5.Util.format(time.getHours(), 2, "0");
			s += ":";
			s += LZR.HTML5.Util.format(time.getMinutes(), 2, "0");
			s += ":";
			s += LZR.HTML5.Util.format(time.getSeconds(), 2, "0");
			return s;
		},

		getFom: function() {
			if (this.md.ctrl.date.value === "2015-11-15" && this.md.ctrl.tim.value === "20" && this.md.ctrl.mod.value === "naqpms") {
				new LZR.HTML5.Util.Ajax().get( "/Pic/json/cas/fom.js", hw.bind(this, this.handleFom) );
			} else {
				new LZR.HTML5.Util.Ajax().get( "/Pic/json/cas/fomNull.js", hw.bind(this, this.handleFom) );
			}
/*
			this.stationInfoQueryTask.GetTargetValueOfAllCityAndStation({
				prjName: this.appConfig.prjInfo.name,
				modeName: this.md.mod.val,
				areaName: "d0",
				productDate: this.timeToFomQryString (this.md.m_time.productTime.val),
				startDate: this.timeToFomQryString (this.md.m_time.timeStart.val),
				endDate: this.timeToFomQryString ( this.addHour(24 * this.md.m_time.timeCount.val, this.md.m_time.timeStart.val) ),
				target: "aqi,pm25_1h,pm10_1h,o3_1h,so2_1h,no2_1h,co_1h,primary_pollutant,aqi_level",
				dateType: "hour"
			}).then( hw.bind(this, this.handleFom), hw.bind (this, this.handleError) );
*/
		},

		handleFom: function(data) {
			data = JSON.parse(data);
// console.log (data);
			this.fillFom(data.cityInfo, "c", "cs");
			this.fillFom(data.stationInfo, "s", "ss");

			setTimeout(hw.bind(this, this.hidLoading), 10);
		},

		// 解析AQI
		parseByAqi: function (aqi) {
			var r = {};
			if (aqi >= 0 && aqi <= 50) {
				r.levelNum = "1";
			} else if (aqi <= 100) {
				r.levelNum = "2";
			} else if (aqi <= 150) {
				r.levelNum = "3";
			} else if (aqi <= 200) {
				r.levelNum = "4";
			} else if (aqi <= 300) {
				r.levelNum = "5";
			} else if (aqi <= 500) {
				r.levelNum = "6";
			}
			return r;
		},

		// 填充污染物信息
		fillFom: function (data, list, show) {
			var curtim, cts, ctid;
			var ts = this.md.m_time.timeStart.val.valueOf();
			var tc = this.md.m_time.timeCount.val * 24;
			var tp = this.md.m_time.timeStep.val * 1000;
			var tcur = this.md.cur.position.val;
			var m = this.md.m_data[list];
			var ms = this.md.m_data[show];
			for (var i=0; i<data.length; i++) {
				var d = data[i];
				var s = m[d.code];
				if (d.datadate && s) {
					if (cts != d.datadate) {
						cts = d.datadate;
						curtim = LZR.Util.Date.getDate( cts.replace(/T/, " ") );
						ctid = (curtim.valueOf() - ts)/tp;
					}
					if (ctid >= 0 && ctid < tc && s) {
						var fom = new hw.HTML5.Project.Bp.StationInfo.Model.FomInfo ({
							time: curtim,
							aqi: d.aqi
						});
						fom.mainFom = this.getFomName ({primary: this.orderPrimary(d.primary_pollutant)[0]});
						fom.concentration = d[fom.mainFom.key];
						fom.level = d.aqi_level;
						fom.memo = this.parseByAqi (fom.aqi);
						// fom.memo = utils.getInfoByAqiValue(fom.aqi, this.appConfig.gradeColors);
						s.m_fom[ctid] = fom;

						this.setCharts(s.charts.aqi, ctid, d.aqi);
						this.setCharts(s.charts.pm25, ctid, d.pm25_1h);
						this.setCharts(s.charts.pm10, ctid, d.pm10_1h);
						this.setCharts(s.charts.o3, ctid, d.o3_1h);
						this.setCharts(s.charts.so2, ctid, d.so2_1h);
						this.setCharts(s.charts.no2, ctid, d.no2_1h);
						this.setCharts(s.charts.co, ctid, Math.floor(d.co_1h * 10) / 10);

						if (ctid == tcur) {
							s.changeStyle (tcur);
						}
					}
				}
				if (!ms[d.code] && s) {
					ms[d.code] = s;
					if (list == "c") {
						this.md.ctrl.stations.inDiv.appendChild(s.ctrl.out);
					}
				}
			}
		},

		setCharts: function (obj, id, value) {
			obj[id] = value;
			if (!obj.min) {
				obj.min = value;
				obj.max = value;
			} else if (obj.min > value) {
				obj.min = value;
			} else if (obj.max < value) {
				obj.max = value;
			}
		},

		expandPoint: function (exp) {
			var s;
			if (exp) {
				this.ctrl.inDiv.innerHTML = "<div class='line'></div>";
				for (s in this.children) {
					if (this.root.val.m_data.ss[s]) {
						this.ctrl.inDiv.appendChild(this.children[s].ctrl.out);
					}
				}
				this.ctrl.expand.innerHTML = "△";
				this.locateCityList();
			} else {
				for (s in this.children) {
					this.ctrl.inDiv.removeChild(this.children[s].ctrl.out);
				}
				this.ctrl.inDiv.innerHTML = "";
				this.ctrl.expand.innerHTML = "▽";
			}
		},

		getFomName: function (obj) {
			var v = {
				pm25: {
					key: "pm25_1h",
					primary: "pm2.5",
					html: "PM<sub>2.5</sub>"
				},
				pm10: {
					key: "pm10_1h",
					primary: "pm10",
					html: "PM<sub>10</sub>"
				},
				o3: {
					key: "o3_1h",
					primary: "o3",
					html: "O<sub>3</sub>"
				},
				so2: {
					key: "so2_1h",
					primary: "so2",
					html: "SO<sub>2</sub>"
				},
				no2: {
					key: "no2_1h",
					primary: "no2",
					html: "NO<sub>2</sub>"
				},
				co: {
					key: "co_1h",
					primary: "co",
					html: "CO"
				}
			};
			for (var s in obj) {
				if (obj[s]) {
					for (var f in v) {
						if (v[f][s] == obj[s]) {
							return v[f];
						}
					}
					return null;
				}
			}
			return null;
		},

		orderPrimary: function (obj) {
			var order = ["pm2.5", "pm10", "o3", "so2", "no2", "co"];
			var r = [];
			for (var i = 0; i<order.length; i++) {
				if (obj.match(order[i])) {
					r.push(order[i]);
				}
			}
			return r;
		},

		changeStyle: function(position) {
			var s = this;
			s.flushView();
			var fl = s.ctrl.color.className;
			var fom = fl.indexOf("fomLevel_");
			if (fom > -1) {
				fl = fl.substring(fom, fom + 10);
				LZR.HTML5.Util.Css.removeClass (s.ctrl.color, fl);
			}

			fom = s.m_fom[position];
			var a = "", p = "--", v = "- ug/m<sup>3</sup>";
			if (fom) {
				LZR.HTML5.Util.Css.addClass (s.ctrl.color, "fomLevel_" + fom.memo.levelNum);
				a = fom.aqi;
				p = fom.mainFom.html;
				v = fom.concentration;
				if (p == "CO") {
					v += " mg/m<SUP>3</SUP>";
				} else {
					v += " ug/m<SUP>3</SUP>";
				}
			}

			if (s.level.level == 10) {
				s.ctrl.value.innerHTML = a;
				// s.ctrl.primary.innerHTML = p + "：" + v;
				if (p == "--") {
					s.ctrl.primary.innerHTML = "";
				} else {
					s.ctrl.primary.innerHTML = p + "：" + v;
				}
			} else {
				s.ctrl.color.innerHTML = a;
				s.ctrl.primary.innerHTML = "首要污染物：" + p;
				s.ctrl.value.innerHTML = "污染浓度：" + v;
			}
		},

		changeTim: function(d) {
			this.clreanFom();
			this.md.m_time.timeStart.set( this.addHour( (24 - parseInt(this.md.ctrl.tim.value, 10)), this.md.m_time.productTime.val) );
			this.md.m_time.ctrl.setter("startTime",  this.md.m_time.timeStart.val);
			this.md.cur.position.set(this.md.m_time.ctrl.ta.getCurrentPosition());
			this.getFom();
		},

		changeMod: function(m) {
			this.clreanFom();
			this.getFom();
		},

		clreanFom: function() {
			var i, s;
			for (i in this.md.m_data.c) {
				s = this.md.m_data.c[i];
				s.m_fom = [];
				s.charts = {
					aqi: [],
					pm25: [],
					pm10: [],
					o3: [],
					so2: [],
					no2: [],
					co: []
				};
				s.changeStyle (-1);
			}
			for (i in this.md.m_data.s) {
				s = this.md.m_data.s[i];
				s.m_fom = [];
				s.charts = {
					aqi: [],
					pm25: [],
					pm10: [],
					o3: [],
					so2: [],
					no2: [],
					co: []
				};
				s.changeStyle (-1);
			}
			this.md.m_data.ss = {};
			for (i = 0; i<this.md.m_data.cs.length; i++) {
				s.expand.set(false);
				this.md.ctrl.stations.inDiv.removeChild(s.ctrl.out);
			}
			this.md.m_data.cs = {};

			this.md.cur.city.set(null);
			this.md.cur.station.set(null);
		},

		// 触发一个Event事件
		fireEvent: function (element,event){
			var evt;
			if (document.createEventObject){
				// dispatch for IE
				evt = document.createEventObject();
				return element.fireEvent('on'+event,evt);
			} else{
				// dispatch for firefox + others
				evt = document.createEvent("HTMLEvents");
				evt.initEvent(event, true, true );		// event type,bubbling,cancelable
				return element.dispatchEvent(evt);
			}
		},

		// 打开右边栏
		openRight: function (s) {
			if (s.m_fom.length > 0) {
				document.getElementById("bRight").className = "bRight";
				var div = document.getElementById("bLeft");
				div.className = "CandS bLeft";
				br.init(s);
				this.map.setSize([div.clientWidth, div.clientHeight]);
				this.md.m_time.ctrl.init();
			}
		},

		// 关闭右边栏
		closeRight: function () {
			document.getElementById("bRight").className = "nosee bRight";
			var div = document.getElementById("bLeft");
			div.className = "CandS";
			this.map.setSize([div.clientWidth, div.clientHeight]);
			this.md.m_time.ctrl.init();
		},

		// 列表筛选
		selectChange: function(div) {
			// this.md.m_time.ctrl.stop();
			if (div.value == "all") {
				LZR.HTML5.Util.Css.addClass (div, "selectAll");
			} else {
				LZR.HTML5.Util.Css.removeClass (div, "selectAll");
			}
			this.selectFlush();
		},

		// 列表排序
		selectOrder: function(div) {
			// this.md.m_time.ctrl.stop();
			if (div.value == "stb") {
				div.value = "bts";
				div.title = "从大到小排序";
				div.innerHTML = "▼";
			} else {
				div.value = "stb";
				div.title = "从小到大排序";
				div.innerHTML = "▲";
			}
			this.selectFlush();
		},

		// 刷新列表
		selectFlush: function() {
			// 容器清空
			var div = this.md.ctrl.stations.inDiv;
			var sub, i, j;
			while (sub = div.firstChild, sub) {
				div.removeChild(sub);
			}

			// 筛选并排序
			var a, city = this.md.ctrl.bar.city.value;
			var primary = this.md.ctrl.bar.primary.value;
			var level = this.md.ctrl.bar.level.value;

			if (city == "all") {
				a = this.selectFilte (this.md.m_data.cs, primary, level);
			} else {
				a = this.selectFilte (this.md.m_data.p[city].children, primary, level);
			}

			// 塞入容器
			if (this.md.ctrl.bar.order.value == "stb") {
				for (i = 0; i < a.length; i++) {
					if (a[i]) {
						for (j = 0; j < a[i].length; j++) {
							div.appendChild(a[i][j].ctrl.out);
						}
					}
				}
			} else {
				for (i = a.length-1; i >= 0; i--) {
					if (a[i]) {
						for (j = a[i].length-1; j >= 0; j--) {
							div.appendChild(a[i][j].ctrl.out);
						}
					}
				}
			}
		},

		// 筛选器
		selectFilte: function(data, primary, level) {
			var r = [];
			r[0] = [];
			var tcur = this.md.m_time.ctrl.ta.getCurrentPosition();
			for (var i in data) {
				var s = this.md.m_data.cs[i];
				if (s) {
					var f = s.m_fom[tcur];
					if (!f) {
						r[0].push(s);
					} else if ( (level == "all" || level == f.memo.levelNum) && (primary == "all" || primary == f.mainFom.primary) ) {
						if (!r[f.aqi]) {
							r[f.aqi] = [];
						}
						r[f.aqi].push(s);
					}
				}
			}
			return r;
		},

		// 添加图例
		createLegend: function() {
			this.md.legend = {
				id: "legend",
				parent: this.data,
				root: this.data,
				view: null,
				ctrl: null
			};
			this.md.legend.children = {
				aqi: {
					id: "aqi",
					parent: this.md.legend,
					root: this.md,
						legendUrl: {
							defaultLegend: "d/PM2.5_d.png",
							hoverLegend: "d/PM2.5_daqi.png"
						},
					view: new LZR.HTML5.Util.Layout.BaseDiv({}),
					ctrl: null
				}
			};

			// 图例变化
			var changeLegend = function (leg, hover) {
				if (leg && leg.legendUrl) {
					var url = leg.legendUrl[hover];
					if (url) {
						leg.view.div.style.display = "";
						leg.view.div.style.backgroundImage = "url(widgets/RegStat/images/" + url + ")";
						return;
					}
				}
				leg.view.div.style.display = "none";
			};

			this.md.legend.view = new LZR.HTML5.Util.Layout.BaseDiv({});
			this.md.legend.view.addClass ("legendOut");
			for (var s in this.md.legend.children) {
				var leg = this.md.legend.children[s];
				leg.view.addClass("legend");
				this.md.legend.view.addChild (leg.view);

				// ---------- 事件 ----------
				LZR.HTML5.Util.Event.addEvent (leg.view.div, "mouseover", LZR.bind(this, changeLegend, leg, "hoverLegend"), false);
				LZR.HTML5.Util.Event.addEvent (leg.view.div, "mouseout", LZR.bind(this, changeLegend, leg, "defaultLegend"), false);
			}
			changeLegend (this.md.legend.children.aqi, "defaultLegend");
			this.md.legend.view.placeTo(this.md.m_time.ctrl.div);
		},

		// 兼容各浏览器的滚动条样式
		initNiceScroll: function () {
			$("#stations").niceScroll({
				cursorcolor: "rgba(255, 255, 255, 0.43)",	//#CC0071 光标颜色
				cursoropacitymax: 1,	//改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
				touchbehavior: false,	//使光标拖动滚动像在台式电脑触摸设备
				cursorwidth: "5px",	//像素光标的宽度
				cursorborder: "0",	//游标边框css定义
				cursorborderradius: "5px",	//以像素为光标边界半径
				autohidemode: false	//是否隐藏滚动条
			});
		},

		// 显示滚动条
		showNiceScroll: function () {
			$("#stations").getNiceScroll().show();
		},

		// 隐藏滚动条
		hidNiceScroll: function () {
			$("#stations").getNiceScroll().hide();
		},

		// 隐藏Loading
		hidLoading: function () {
			if (this.loadNum === 1) {
				document.getElementById("loading").style.width = "0px";
				document.getElementById("loading").style.height = "0px";
				// document.getElementById("loading").className = "nosee";
				this.loadNum --;
			} else if (this.loadNum > 0) {
				this.loadNum --;
			}
		}

	};
}

// 右边栏
function bRight() {
	return {
		init: function(data) {
			var div = document.getElementById("bRight");
			this.clearDiv (div);

			if (data.charts.aqi.length > 0) {
				var outDiv = document.createElement("div");
				outDiv.className = "out";
				var aqiDiv = document.createElement("div");
				aqiDiv.className = "aqi";
				outDiv.appendChild(aqiDiv);
				var pm25Div = document.createElement("div");
				pm25Div.className = "pm25";
				outDiv.appendChild(pm25Div);
				var pm10Div = document.createElement("div");
				pm10Div.className = "pm10";
				outDiv.appendChild(pm10Div);
				var o3Div = document.createElement("div");
				o3Div.className = "o3";
				outDiv.appendChild(o3Div);
				var so2Div = document.createElement("div");
				so2Div.className = "so2";
				outDiv.appendChild(so2Div);
				var no2Div = document.createElement("div");
				no2Div.className = "no2";
				outDiv.appendChild(no2Div);
				var coDiv = document.createElement("div");
				coDiv.className = "co";
				outDiv.appendChild(coDiv);
				div.appendChild(outDiv);

				var axisData = this.getAxisData(data.root.val.m_time);
				var aqiOp = this.handleAqi(data, axisData);
				var pmOp = this.handlePm(data, axisData);
				var sonOp = this.handleSon(data, axisData);
				var co3Op = this.handleCo3(data, axisData);

				var aqi = echarts.init(aqiDiv);
				aqi.setOption(aqiOp);
				var pm = echarts.init(pm25Div);
				pm.setOption(pmOp);
				var son = echarts.init(so2Div);
				son.setOption(sonOp);
				var co3 = echarts.init(coDiv);
				co3.setOption(co3Op);

				aqi.connect([pm, son, co3]);
				pm.connect([aqi, son, co3]);
				son.connect([aqi, pm, co3]);
				co3.connect([aqi, pm, son]);
			}
		},

		// 清空div内元素
		clearDiv: function(div) {
			var cs = div.childNodes;
			for (var i = cs.length - 1; i>=0; i--) {
				div.removeChild(cs[i]);
			}
		},

		// 整理AQI数据
		handleAqi: function (data, axisData) {
			var title = "分析统计图";
			if (data.level.level == 10) {
				title = "站点" + title;
			} else {
				title = "城市" + title;
			}
			var r = {
				title: {
					text: data.name + title
				},
				tooltip: {
					trigger: "axis",
					showDelay: 0,
					formatter: function (params) {
						var r = params[0].name + "<br/>";
						if (params[0]) {
							r += params[0].seriesName + " : " + params[0].value;
						}
						if (params[1]) {
							r += "<br/>" + params[1].seriesName + " : " + params[1].value;
						}
						return r;
					}
				},
				legend: {
					data: ["AQI小时", "AQI日均"],
					selected: {
						"AQI小时": false
					},
					x: "center",
					y: 38
				},
				grid: {
					x: 40,
					y: 75,
					x2: 40,
					y2: 30
				},
				xAxis: [
					{
						type: "category",
						boundaryGap: true,
						axisTick: {onGap:false},
						splitLine: {show:false},
						data: axisData
					}
				],
				yAxis: [
					{
						name: "AQI",
						type: "value",
						scale: true,
						splitNumber: 5,
						boundaryGap: [0.05, 0.05],
						axisLabel: {
							formatter: function (v) {
								return v;
							}
						},
						min: 0,
						max: 500,
						splitArea: {show : true}
					}
				],
				series: [
					{
						name: "AQI小时",
						type: "line",
						symbol: "none",
						data: data.charts.aqi
					},
					{
						name: "AQI日均",
						type: "line",
						symbol: "none",
						itemStyle: {normal: {areaStyle: {type: 'default'}}},
						data: this.calcAqi(data.charts.aqi)
					}
				]
			};
			return r;
		},

		// 计算日均AQI
		calcAqi: function (data) {
			var r = [];
			var d = Math.ceil(data.length / 24);
			for (var i = 0; i<d; i++) {
				var v = 0;
				for (var j = 0; j<24; j++) {
					var dv = data[i*24 + j];
					if (!isNaN(dv)) {
						v += data[i*24 + j];
					}
				}
				v = Math.floor(v / 24);
				for (j = 0; j<24; j++) {
					r.push(v);
				}
			}
			return r;
		},

		// 生成时间轴数据
		getAxisData: function (time, axisData) {
			var ts = time.timeStart.val.valueOf();
			var tc = time.timeCount.val * 24;
			var tp = time.timeStep.val * 1000;
			var a = [];
			for (var i=0; i<tc; i++) {
				var t = new Date( i * tp + ts );
				var s = t.getMonth() + 1;
				s += "/" + t.getDate();
				s += " " + t.getHours() + "时";
				a.push(s);
			}
			return a;
		},

		// 整理pm2.5和pm10数据
		handlePm: function (data, axisData) {
			var max = (data.charts.pm25.max > data.charts.pm10.max) ? data.charts.pm25.max : data.charts.pm10.max;
			max = (Math.ceil(Math.ceil(max/10) / 3)) * 30;
			var r = {
				tooltip: {
					trigger: "axis",
					showDelay: 0,
					formatter: function (params) {
						var r = params[0].name;
						if (params[0]) {
							r += (params[0].seriesName == "PM2.5") ? "<br/>PM<sub>2.5</sub> : " : "<br/>PM<sub>10</sub> : ";
							r += params[0].value + " ug/m<sup>3</sup>";
						}
						if (params[1]) {
							r += "<br/>PM<sub>10</sub> : " + params[1].value + " ug/m<sup>3</sup>";
						}
						return r;
					}
				},
				legend: {
					data: ["PM2.5", "PM10"],
					x: "center",
					y: 10
				},
				grid: {
					x: 40,
					y: 25,
					x2: 40,
					y2: 30
				},
				xAxis: [
					{
						type: "category",
						boundaryGap: true,
						axisTick: {onGap:false},
						splitLine: {show:false},
						data: axisData
					}
				],
				yAxis: [
					{
						name: "PM2.5(ug/m³)",
						type: "value",
						splitNumber: 3,
						boundaryGap: [0.05, 0.05],
						axisLabel: {
							formatter: function (v) {
								return v;
							}
						},
						min: 0,
						max: max,
						splitArea: {show : true}
					},
					{
						name: "PM10(ug/m³)",
						type: "value",
						splitNumber: 3,
						boundaryGap: [0.05, 0.05],
						axisLabel: {
							formatter: function (v) {
								return v;
							}
						},
						min: 0,
						max: max,
						splitArea: {show : false}
					}
				],
				series: [
					{
						name: "PM2.5",
						type: "line",
						symbol: "none",
						data: data.charts.pm25
					},
					{
						name: "PM10",
						type: "line",
						yAxisIndex:1,
						symbol: "none",
						data: data.charts.pm10
					}
				]
			};
			return r;
		},

		// 整理so2和no2数据
		handleSon: function (data, axisData) {
			var max = (data.charts.so2.max > data.charts.no2.max) ? data.charts.so2.max : data.charts.no2.max;
			max = (Math.ceil(Math.ceil(max/10) / 3)) * 30;
			var r = {
				tooltip: {
					trigger: "axis",
					showDelay: 0,
					formatter: function (params) {
						var r = params[0].name;
						if (params[0]) {
							r += (params[0].seriesName == "SO2") ? "<br/>SO<sub>2</sub> : " : "<br/>NO<sub>2</sub> : ";
							r += params[0].value + " ug/m<sup>3</sup>";
						}
						if (params[1]) {
							r += "<br/>NO<sub>2</sub> : " + params[1].value + " ug/m<sup>3</sup>";
						}
						return r;
					}
				},
				legend: {
					data: ["SO2", "NO2"],
					x: "center",
					y: 10
				},
				grid: {
					x: 40,
					y: 25,
					x2: 40,
					y2: 30
				},
				xAxis: [
					{
						type: "category",
						boundaryGap: true,
						axisTick: {onGap:false},
						splitLine: {show:false},
						data: axisData
					}
				],
				yAxis: [
					{
						name: "SO2(ug/m³)",
						type: "value",
						splitNumber: 3,
						boundaryGap: [0.05, 0.05],
						axisLabel: {
							formatter: function (v) {
								return v;
							}
						},
						min: 0,
						max: max,
						splitArea: {show : true}
					},
					{
						name: "NO2(ug/m³)",
						type: "value",
						splitNumber: 3,
						boundaryGap: [0.05, 0.05],
						axisLabel: {
							formatter: function (v) {
								return v;
							}
						},
						min: 0,
						max: max,
						splitArea: {show : false}
					}
				],
				series: [
					{
						name: "SO2",
						type: "line",
						symbol: "none",
						data: data.charts.so2
					},
					{
						name: "NO2",
						type: "line",
						yAxisIndex:1,
						symbol: "none",
						data: data.charts.no2
					}
				]
			};
			return r;
		},

		// 整理co和o3数据
		handleCo3: function (data, axisData) {
			var max = data.charts.co.max * 10;
			max = (data.charts.o3.max > max) ? data.charts.o3.max : max;
			max = (Math.ceil(Math.ceil(max/10) / 3)) * 30;
			var r = {
				tooltip: {
					trigger: "axis",
					showDelay: 0,
					formatter: function (params) {
						var r = params[0].name;
						if (params[0]) {
							r += (params[0].seriesName == "CO") ? "<br/>CO : " : "<br/>O<sub>3</sub> : ";
							r += params[0].value;
							r += (params[0].seriesName == "CO") ? " mg/m<sup>3</sup>" : " ug/m<sup>3</sup>";
						}
						if (params[1]) {
							r += "<br/>O<sub>3</sub> : " + params[1].value + " ug/m<sup>3</sup>";
						}
						return r;
					}
				},
				legend: {
					data: ["CO", "O3"],
					x: "center",
					y: 10
				},
				grid: {
					x: 40,
					y: 25,
					x2: 40,
					y2: 60
				},
				dataZoom: {
					show: true,
					realtime: true,
					start: 0,
					end: 100
				},
				xAxis: [
					{
						type: "category",
						boundaryGap: true,
						axisTick: {onGap:false},
						splitLine: {show:false},
						data: axisData
					}
				],
				yAxis: [
					{
						name: "CO(mg/m³)",
						type: "value",
						splitNumber: 3,
						boundaryGap: [0.05, 0.05],
						axisLabel: {
							formatter: function (v) {
								return v;
							}
						},
						min: 0,
						max: max / 10,
						splitArea: {show : true}
					},
					{
						name: "O3(ug/m³)",
						type: "value",
						splitNumber: 3,
						boundaryGap: [0.05, 0.05],
						axisLabel: {
							formatter: function (v) {
								return v;
							}
						},
						min: 0,
						max: max,
						splitArea: {show : false}
					}
				],
				series: [
					{
						name: "CO",
						type: "line",
						symbol: "none",
						data: data.charts.co
					},
					{
						name: "O3",
						type: "line",
						yAxisIndex:1,
						symbol: "none",
						data: data.charts.o3
					}
				]
			};
			return r;
		}

	};
}

function init () {
	// 加载LZR库
	LZR.HTML5.jsPath = "/Pic/js/old/";
	LZR.HTML5.loadJs([
		LZR.HTML5.jsPath + "HTML5/util/Ajax.js",
		LZR.HTML5.jsPath + "HTML5/Bp/Util/BpTimeAxis.js",
		LZR.HTML5.jsPath + "HTML5/Bp/AirqMg/RegStat2/SelectView.js"
	]);

	// 加载数据结构
	var hw = HelloWorld();
	var br = new bRight();
	var t = new Test (hw, br);

	// 加载地图
	t.map = new ol.Map({
		layers: [
			new ol.layer.Tile({
				source: new ol.source.OSM()
			})
		],
		target: "map",
		view: new ol.View({
			projection: "EPSG:3857",
			zoom: 6,
			center: ol.proj.fromLonLat([108, 45])
		})
	});

	// 删除地图的 controls
	t.map.getControls().clear();

	// 修改 getFom 方法
	// 添加 解析AQI 方法
	// 修改 getCitys 方法
	// 修改 getStations 方法
	// 修改 flushStationView 方法：大图标不使用图片
	// 不添加图例 createLegend
	// 替换dojo控件
	t.startup();

}
