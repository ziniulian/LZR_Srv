// 简易图床模块

// 文件位置
// var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Srv.Result"
]);

// 创建路由
var r = new LZR.Node.Router ({
	path: "L:\\Doc\\Pic\\",
	hd_web: "tmp"
});

module.exports = r;
