// 	表名 ： gub
{
	typ:"tabtmp",	// 表格模板
	main:[	// 主要指标
		[栏位名,对应数据的数组编号],...
	],
	profit:[	// 利润表
		[栏位名,对应数据的数组编号],...
	],
	balance:[	// 资产负债表
		[栏位名,对应数据的数组编号],...
	],
	cash:[	// 现金流量表
		[栏位名,对应数据的数组编号],...
	],
	num:[	// 股本结构
		[栏位名,对应数据的数组编号],...
	]
},
{
	typ:"info",	// 个股基础信息
	id:代码,
	ec:所属的交易所,	// sh:上海,sz:深圳
	nam:名称,
	num:流通股本,
	pe:参考市盈率,
	eps:每股收益,
	sim:[分类1, 分类2, ...],	// 分类
	anticipation:预期,
	days:日时间戳,	// 日线数据起始时间
	daye:日时间戳,	// 日线数据结束时间
	financeTim:日时间戳,	// 财务最新报告期
	numTim:日时间戳,	// 股本最新变动日期
	aTim:日时间戳,	// 最新预告日期
	dTim:日时间戳,	// 最新分红日期
},
{
	typ:"finance",	// 个股财务报表信息
	id:代码,
	tim:日时间戳,	// 报告期
	nam:名称,
	rp:参考价,
	pe:市盈率,		// Price to Earning Ratio

	// 主要指标 ：http://q.stock.sohu.com/cn/600519/cwzb.shtml
	eps:每股收益,	// Earnings Per Share
	bps:每股净资产,	// Book Value Per Share
	pf:每股资本公积金,	// Capital reserve per share
	up:每股未分配利润,	// Undistributed profit per share
	ocf:每股经营现金流,	// Operating cash flow per share
	roe:净资产收益率,	// Return on Equity
	gpm:销售毛利率,	// Gross Profit Margin
	npm:净利润率,	// Net Profit Margin
	dar:资产负债率,	// Debt Asset ratio
	cr:流动比率,	// Current Ratio
	qr:速动比率,	// Quick Ratio
	yoy:{	// 同比变化
		eps:每股收益,
		bps:每股净资产,
		pf:每股资本公积金,
		up:每股未分配利润,
		ocf:每股经营现金流,
		roe:净资产收益率,
		gpm:销售毛利率,
		npm:净利润率,
		dar:资产负债率,
		cr:流动比率,
		qr:速动比率,
		minc:主营业务收入,
		mp:主营业务利润,
	},
	profit: [],	// 利润表 ：http://q.stock.sohu.com/cn/600519/lr.shtml
	balance: [],	// 资产负债表 ：http://q.stock.sohu.com/cn/600519/zcfz.shtml
	cash: [],	// 现金流量表 ：http://q.stock.sohu.com/cn/600519/xjll.shtml
	inccop: [,	// 收入构成 ：http://q.stock.sohu.com/cn/600519/srgc.shtml
		{
			typ:分类,	// 1:主营产品构成,2:行业收入构成,3:地区收入构成
			item:项目,
			scale:占比,
			income:收入,
			incyoy:收入同比,
			cost:成本,
			gp:毛利率,
			gpyoy:毛利率同比
		}
	]
},
{
	typ:"num",	// 个股股本变动信息 : http://q.stock.sohu.com/cn/600519/gbjg.shtml
	id:代码,
	tim:日时间戳,	// 变动日期
	dat:[]
},
{
	typ:"anticipation",	// 个股业绩预告 : http://q.stock.sohu.com/cn/600519/yjyg.shtml
	id:代码,
	tim:日时间戳,	// 预告报告期
	f:变动幅度,
	msg:相关说明
},
{
	typ:"dividend",	// 个股分红记录 : http://q.stock.sohu.com/cn/600519/fhsp.shtml
	id:代码,
	tim:日时间戳,	// 分红年度/配股上市日
	exdTim:日时间戳,	// 除权除息日
	dividend:派息,
	gift:送股,
	transfer:转增股,
	allotment:配股,
	ap:配股价,
	msg:其它信息
},
{
	typ:"errlog",	// 错误日志
	id:代码,
	tim:日时间戳,
	msg:错误信息
},

// 在新的表中记录交易信息	gud
{
	typ:"day",	// 个股日线数据 : http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=sh600519&scale=240&ma=no&datalen=2000
	id:代码,
	tim:日时间戳,
	c:收盘价,
	o:开盘价,
	h:最高价,
	l:最低价,
	f:涨幅,
	v:成交量,(手)
	t:成交额,(万元)
	cc:均价,	// 当有成交额时，可计算出均价。用此均价处理均线比用收盘价更合理。
	m5:周线,
	m10:十日均线,
	m20:月线,
	m60:季线,
	m120:半年线,
	m250:年线
},

/*****
	1. 添加股票，若上证综指和深圳成指必加
	2. 交易数据更新 days daye
	3. 收盘 daye
	4. 交易数据补充 daye

	5. 初次进行数据更新时，先自动生成通用表格模板。
	6. 基础数据更新时有缓存。代码若在缓存中，则提示正在更新，不在缓存中，才能开始更新。
	7. 数据更新出错时，缓存中也记录错误日志，待错误解除后，才可再次更新数据。

	8. 股本更新	num numTim
		1. 忽略所有 “定期报告”
	9. 业绩预告更新 anticipation aTim
	10. 分红更新 dTim
	11. 财务报表更新 nam financeTim eps(年度)
		1. 计算报告期
		2. 先更新交易数据，再更新基础数据 daye > 报告期。否则，提示先更新交易数据，而后退出。
		3. financeTim < 报告期。否则直接退出。
		4. 每次更新数据，都需要检查表格模板是否正确，若不正确则停止更新，报告错误。
		5. 先更新主要指标：
			a. 检查名称变化
			b. 检查需补充的报告期，若没有可更新的报告期，则直接退出。
			c. 补充数据
		6. 再更新 利润表、资产负债表、现金流量表
		7. 更新收入构成
			a. 检查有无可更新的收入构成，并更新

	12. 对历史数据进行条件模拟，分析成功与失败概率
		1. 判断缩量
		2. 判断地量
		3. 判断放量
		4. 趋势判断：何为强势、何为弱势、何为平势？

****/
