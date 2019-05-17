// 数据库备份服务

// 文件位置
var fs = require("fs");
var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Router"
]);

// 创建路由
var r = new LZR.Node.Router ({
	path: curPath
});

// 需要用到的工具
var tools = {
	// utTim: LZR.getSingleton(LZR.Base.Time),
	// utJson: LZR.getSingleton(LZR.Base.Json),
	status: 0,	// 状态。0:待机,1:备份数据库,2:压缩文档,3:删除备份信息,4:解压文档,5:恢复数据库,6:删除备份信息
	dir: process.env.O3DB_DBCDIR || "L:/Doc/dbc/",	// 文件存储路径
	dbnam: process.env.O3DB_NAM || "lzr",	// 数据库名
	fnam: "lzr.tgz"	// 文件名
};

// 主页
r.get("/home/", function (req, res, next) {
	res.sendFile("index.html", {
		root: curPath
	});
});

// 下载备份
r.get("/" + tools.fnam, function (req, res, next) {
	if (tools.status) {
		res.send(tools.status + " 备份中，请稍候 ...");
	} else {
		res.sendFile(tools.fnam, {
			root: tools.dir
		}, function (err) {
			if (err) {
				res.send("尚无备份文件");
			} else {
				fs.unlink(tools.dir + tools.fnam);
			}
		});
	}
});

// 刷新备份
r.get("/flush/", function (req, res, next) {
	if (tools.status) {
		res.redirect(tools.fnam);
	} else {
		tools.status = 1;
		res.redirect(tools.fnam);
		fs.unlinkSync(tools.dir + tools.fnam);	// 删除原有压缩包
		fs.unlinkSync(tools.dir + tools.dbnam);	// 删除原有备份信息
		// 执行命令 ...
	}
});

// 备份恢复
r.post("/restore/", function (req, res, next) {
	res.send("restore");
});

module.exports = r;
