
function Test () {
	// 配置信息
	this.config = {
		citys: [
			{
				title: "天津",
				url: "/Pic/json/orbit/tj.js",
				geoJson: ol.proj.fromLonLat([117.277846, 39.130513]),
				zoom: 8,
				dat: null,
				checked: false
			},
			{
				title: "内蒙古",
				url: "/Pic/json/orbit/nmg.js",
				geoJson: ol.proj.fromLonLat([111, 40.4]),
				zoom: 9,
				dat: null,
				checked: false
			},
		],
		heights: [
			{
				title: "100米",
				pic: "heightsPic",
				picDown: "heights1",
				checked: true
			},
			{
				title: "500米",
				pic: "heightsPic",
				picDown: "heights5",
				checked: true
			},
				{
				title: "1000米",
				pic: "heightsPic",
				picDown: "heights10",
				checked: true
			}
		]
	};

	// 创建地图
	this.buildMap = function (mapID) {
		var min = [73, 2];
		var max = [135, 54];
		var center = [108, 35];

		// 投影转换
		min = ol.proj.fromLonLat(min);
		max = ol.proj.fromLonLat(max);
		center = ol.proj.fromLonLat(center);

		min.push(max[0]);
		min.push(max[1]);

		// 创建地图
		this.map = new ol.Map({
			layers: [
				new ol.layer.Tile({
					source: new ol.source.OSM()
				})
			],
			target: mapID,
			view: new ol.View({
				projection: "EPSG:3857",
				zoom: 4,
				minZoom: 3,
				extent: min,
				center: center
			})
		});

		// 删除地图的 controls
		this.map.getControls().clear();

		return this.map;
	};

	// 创建轨迹
	this.buildOb = function (map) {
		this.ob = new LZR.HTML5.Bp.OpenLayers.Orbit ({
			map: map,
			showNode: 0,
			orbitColor: ["red", "green", "blue"],
			orbitShadowColor: ["red", "green", "blue"],
			orbitAnimationColor: ["white", "white", "white"],
			nodeMin : 6,
			nodeMax : 8,
			orbitBlur : 20,
			orbitSpeed:0.01,
			sourceColor: "yellow"
		});

		this.ob.init();

		return this.ob;
	};

	// 城市选项
	this.ajx = new LZR.HTML5.Util.Ajax();
	this.cityCur = null;
	this.citys = new LZR.HTML5.Util.Selector ({
		data: this.config.citys,
		type: 5,
		checked: 1,
		defaultClass: "citys noselect",
		overClass: "citysOver",
		downClass: "citysDown",
		rowNum: 0
	});
	this.citys.onDown = LZR.bind (this, function(d, i) {
		if (d[i].checked && d[i] !== this.cityCur) {
			this.cityCur = d[i];
			this.ajx.abort();
			if (!d[i].dat) {
				d[i].dat = JSON.parse( this.ajx.get(d[i].url) )[0].result;
			}
			this.ob.initData (d[i].dat);

			this.map.getView().setCenter (d[i].geoJson);
			this.map.getView().setZoom (d[i].zoom);

			for (i = 0; i<this.heights.children.length; i++) {
				this.ob.setVisible (i, this.heights.children[i].data.checked);
			}
		}
	});

	// 高度选项
	this.heights = new LZR.HTML5.Util.Selector ({
		data: this.config.heights,
		type: 5,
		checked: 2,
		defaultClass: "heights noselect",
		overClass: "heightsOver",
		downClass: "heightsDown",
		rowNum: 0
	});
	this.heights.onDown = LZR.bind (this, function(d, i) {
		this.ob.setVisible (i, d[i].checked);
	});

	this.init = function() {
		this.citys.children[0].handleDown();
	};

}

function init () {
	// 加载LZR库
	LZR.HTML5.jsPath = "/Pic/js/old/";
	LZR.HTML5.loadJs([
		LZR.HTML5.jsPath + "HTML5/util/Ajax.js",
		LZR.HTML5.jsPath + "HTML5/Bp/OpenLayers/Orbit.js",
		LZR.HTML5.jsPath + "HTML5/util/Selector.js"
	]);
	var t = new Test();

	t.buildOb( t.buildMap("map") );
	document.getElementById("condition").appendChild(t.citys.div);
	document.getElementById("condition").appendChild(t.heights.div);

	t.init();

}
