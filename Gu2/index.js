// 股票模块

// 文件位置
var curPath = require.resolve("./index.js").replace("index.js", "");

// LZR 子模块加载
LZR.load([
	"LZR.Node.Db.NodeAjax",
	"LZR.Pro.Gu.ParseBySohu"
]);

// 需要用到的工具函数
var tools = {
	utPs: new LZR.Pro.Gu.ParseBySohu(),
	keys: {	// 关键字对应表
		Main : "cwzb",	// 主要指标
		Pf : "lr",	// 利润表
		Blc : "zcfz",	// 资产负债表
		Cash : "xjll",	// 现金流量表
		Num : "gbjg",	// 股本结构
		Inc : "srgc",	// 收入构成
		Dvd : "fhsp",	// 分红送配
		Ant : "yjyg"	// 业绩预告
	},
};
tools.utTim = tools.utPs.utTim;

// Ajax
var ajax = new LZR.Node.Db.NodeAjax ({
	enc: "gb2312",
	hd_sqls: {
		sohu: "http://q.stock.sohu.com/cn/<0>/<1>.shtml",	// 搜狐基本面
		sinaK: "http://hq.sinajs.cn/list=<0>",	// 新浪实时数据接口
		sinaH: "http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=<0>&scale=240&ma=no&datalen=<1>"	// 新浪历史数据接口
	}
});

ajax.evt.sohu.add(function (r, req, res, next) {
	var a;
	switch (req.qpobj.mth) {
		case "parse":
			a = tools.utPs["parse" + req.qpobj.key](r);
			res.json(a);
			break;
		case "tabtmp":
			a = tools.utPs.crtTmp(r, req.qpobj.css[req.qpobj.id]);
			if (a) {
				req.qpobj.r[req.qpobj.dbNam[req.qpobj.id]] = a;
				req.qpobj.id ++;
				if (req.qpobj.id < req.qpobj.keys.length) {
					ajax.qry("sohu", req, res, next, [req.params.id, tools.keys[req.qpobj.keys[req.qpobj.id]]]);
				} else {
					// TODO: 保存至数据库
					tools.utPs.setTmp(req.qpobj.r);
					res.json(req.qpobj.r);
				}
			} else {
				res.send("301 : 解析失败");
			}
			break;
	}
});

// 创建路由
var r = new LZR.Node.Router ({
	path: curPath
});

// 添加

// 生成表格模板
r.get("/crtmp/:id", function (req, res, next) {
	if (tools.utPs.tmpMain === null) {
		req.qpobj = {
			mth: "tabtmp",
			id: 0,
			keys: ["Main", "Pf", "Blc", "Cash", "Num"],
			dbNam: ["main", "profit", "balance", "cash", "num"],
			css: ["reportA", "tableP", "tableP", "tableP", "tableC"],
			r:{}	// 结果
		};
		ajax.qry("sohu", req, res, next, [req.params.id, tools.keys.Main]);
	} else {
		res.send("模板已存在!");
	}
});

// 测试
r.get("/test/:id/:key", function (req, res, next) {
	req.qpobj = {
		mth: "parse",
		key: req.params.key
	};
	ajax.qry("sohu", req, res, next, [req.params.id, tools.keys[req.params.key]]);
});

module.exports = r;
