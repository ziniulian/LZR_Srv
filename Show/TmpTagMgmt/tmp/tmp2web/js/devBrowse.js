function check (u, k, o) {
	if (o) {
		u += "/true";
	} else {
		u += "/false";
	}
	if (k) {
		u += "/" + k;
	}
	window.location.href = u;
}

function init () {
	LZR.load([
		"LZR.HTML.Base.Ctrl.Txt"
	]);

// console.log (initObj);

	var keyEnter = false;
	var tc = new LZR.HTML.Base.Ctrl.Txt();
	var t = new LZR.HTML.Base.Doe ({
		hd_doe: initObj.keywordDom
	});

	t.addEvt ("keyup", function (e) {
		switch (e.keyCode) {
			case 13:	// 回车键
				keyEnter = true;
				break;
		}
	});

	tc.evt.chg.add(function (doe, key) {
		if (keyEnter) {
			keyEnter = false;
			check (initObj.url, key, initObj.odd);
		}
	})

	tc.add(t, (initObj.keyword === "undefined" ? undefined : initObj.keyword));

	initObj.btnDom.onclick = function () {
		check (initObj.url, t.doe.innerHTML, initObj.odd);
	}

	initObj.oddDom.onclick = function () {
		// check (initObj.url, initObj.keyword, !initObj.odd);
		check (initObj.url, t.doe.innerHTML, !initObj.odd);
	}
}
