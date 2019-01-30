
function init () {
	LZR.load([
		"LZR.Util",
		"LZR.HTML.Base.Doe",
		"LZR.HTML.Base.Ajax"
	]);
	var hw = {
		root: LZR,
		obj: {},
		Doe: LZR.HTML.Base.Doe,
		bind: LZR.getSingleton(LZR.Util).bind,
		ajx: new LZR.HTML.Base.Ajax(),
		utJson: LZR.getSingleton(LZR.Base.Json)
	};
	hw.obj.root = hw;
	var hwo = hw.obj;

}
