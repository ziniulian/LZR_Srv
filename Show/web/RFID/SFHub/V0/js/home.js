function init() {
	tools.autoSynSart();
}

dat = {
	signOut: function () {
		mn.signOut();
		window.location.href = "signIn.html";
	},

	back: function () {
		if (document.title === "Home") {
			tools.autoSynStop();
			mn.exit();
		} else {
			window.history.back();
		}
	}
};
