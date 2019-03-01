function init() {
	tools.memo.bind(memoDom);
	userDom.innerHTML = mn.getUser().nam;
}

dat = {
	signOut: function () {
		mn.signOut();
		window.location.href = "signIn.html";
	},

	back: function () {
		tools.memo.exit("再按一次退出！", "Exit");
	}
};
