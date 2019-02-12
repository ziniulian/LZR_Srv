function init(o) {
	// 获取画布元素
	var dom = document.getElementById("mainCanvas");
	dom.width = document.body.offsetWidth;
	dom.height = document.body.offsetHeight;
	o.canvas = dom;

	// 加载LZR库
	LZR.HTML5.jsPath = "/Pic/js/old/";
	LZR.HTML5.loadJs([
		LZR.HTML5.jsPath + "HTML5/WebGL/THREE/Web3d.js"
	]);

	// 创建3D场景
	return new LZR.HTML5.WebGL.Three.Web3d (o);
};
