/*******  表名 ： gub  *******/
var gub = [
{	// 个股基本信息
	typ:"info",
	id: "股票代码",
	ec: "所属的交易所",	// sh:上证,sz:深证
	sim: ["分类1", "分类2", "..."],	// 分类
	nam: "名称",
	pe: "底部市盈率",	// 根据150综合市盈率分析出来的底部
		// 第一种判断方法 （默认方案） ： 以历年参照市盈率的最低值
		// 第二种判断方法 ： 在历史记录中有一定出现概率的最低值
		// 第三种判断方法 ： 参考每历熊市行情时的最低值
	eps: "扣非每股收益参照值",	// 1-3季报以上年度年报为准
	num: "总股本",
	numA: "流通A股",
	numTim: "股本最新更新的变动日期",	// 日时间戳
	dvd: "分红预案",
	dvdTim: "分红最新更新的公告日期",	// 日时间戳
	rpTim: "年报最新更新的报告期",	// 日时间戳
	days:"日线数据起始时间",	// 日时间戳
	daye:"日线数据结束时间"	// 日时间戳
},

{	// 报表
	typ:"report",
	id: "股票代码",
	tim: "报告期",	// 日时间戳
	year: "年份",
	quarter: "季度",
	nam: "名称",
	num: "总股本",	// 最接近报告期的总股本
	p: "参考价",	// 最接近报告期的收盘价
	pe: {	// 报告期后未来150个自然日的市盈率分析
		p: "扣非每股收益参照值", // 所有市盈率参照此值来计算。 main.per.kfmgsy ， 1-3季报以上年度年报为准
		o: "开盘市盈率",
		c: "收盘市盈率",
		h: "最高市盈率",
		l: "最低市盈率",
		m: "平均市盈率",	// 以每天的最低价进行平均计算
		f: "涨幅",
		v: "成交量",
		vf: "换手率",
		r: "参照市盈率",		// 自定义安全边际 = (平均市盈率 + 最低市盈率) / 2
		rf: "以参照市盈率为参考的振幅范围",	// = (最高市盈率 - 最低市盈率) / 参照市盈率
		ry: "参照市盈率同比变化" // 用于与 营收、扣非利润、毛利率 同比进行比较
		// 营业收入同比变化,	profit.inc.otyoy	// 该指标越大越好，历年数据不得低于20%，且要尽量稳定
		// 扣非净利润同比变化,	profit.np.nt.yoy	// 该指标越大越好，历年数据要稳定，且不得低于10%
		// 毛利率,	profit.gpm	// 该指标历年要稳中有增
		// 资产负债率,	balance.dar		// 该指标越低越好
		// 净资产,	balance.equity.t	// 该指标历年要稳中有增
		// 净利润,	profit.np.t	// 该指标保持线性增长
		// 扣非净利润,	profit.np.nt.t	// 该指标保持线性增长
		// 营业收入,	profit.inc.ot	// 该指标保持线性增长
	},
	main: {	// 主要指标
		// http://f10.eastmoney.com/NewFinanceAnalysis/MainTargetAjax?type=0&code=SH600186
		// http://f10.eastmoney.com/NewFinanceAnalysis/MainTargetAjax?type=1&code=SH600186 （年度）
		per: {},	// 每股指标
		grop: {},	// 成长能力指标
		profit: {},	// 盈利能力指标
		quality: {},	// 盈利质量指标
		operat: {},	// 运营能力指标
		risk: {}	// 财务风险指标
	},
	balance: {	// 资产负债表
		// http://f10.eastmoney.com/NewFinanceAnalysis/zcfzbAjax?companyType=4&reportDateType=0&reportType=1&endDate=&code=SH600186
		// http://f10.eastmoney.com/NewFinanceAnalysis/zcfzbAjax?companyType=4&reportDateType=1&reportType=1&endDate=2013%2F12%2F31+0%3A00%3A00&code=SH600186 （年度）
		assets: {	// 资产
			current: {	// 流动资产
				fa: {}	// 金融资产
			},
			nc: {}	// 非流动资产
		},
		liability: {	// 负债
			current: {	// 流动负债
				fl: {}	// 金融负债
			},
			nc: {	// 非流动负债
				bp: {}	// 应付债券
			}
		},
		equity: {	// 股东权益
			parent: {	// 公司股东权益
				oe: {}	// 其他权益工具
			},
			minority: {}	// 少数股东权益
		},
		dar: 0,	// 资产负债率 = balance.liability.t / balance.assets.t
	},
	profit: {	// 利润表
		// http://f10.eastmoney.com/NewFinanceAnalysis/lrbAjax?companyType=4&reportDateType=0&reportType=1&endDate=&code=SH600186
		inc: {},	// 收入
		cost: {},	// 成本
		np: {	// 净利润
			total: {	// 利润总额
				t: 0,	// 合计
				operate: {	// 营业利润
					t: 0,	// 合计
					invest: {	// 加:投资收益
						joint: 0,	// 其中:对联营企业和合营企业的投资收益
					}
				},
				norev: {	// 营业外收入
					t: 0,	// 合计
					asset: 0,	// 资产处置
				},
				noexp: {	// 营业外支出
					t: 0,	// 合计
					asset: 0,	// 资产处置
				}
			},
			tax: 0,	// 税费
			t: 0,	// 合计
			nt: {},	// 扣除非经常性损益后的净利润
			parent: 0,	// 公司股东净利润
			minority: 0,	// 少数股东损益
		},
		oinc: {	// 其它收益
			t: 0,	// 合计
			parent: 0,	// 公司股东其它收益
			minority: 0	// 少数股东其它收益
		},
		cinc: {	// 综合收益
			t: 0,	// 合计
			parent: 0,	// 公司股东综合收益
			minority: 0	// 少数股东综合收益
		},
		eps: {	// 每股收益
			t: 0,	// 基本每股收益
			dilute: 0,	// 稀释每股收益
		},
		gpm: 0	// 毛利率 = (profit.inc.ot - profit.cost.ot) / profit.inc.ot
	},
	cash: {	// 现金流量表
		// http://f10.eastmoney.com/NewFinanceAnalysis/xjllbAjax?companyType=4&reportDateType=0&reportType=1&endDate=&code=SH600186
		operate: {	// 经营活动
			in: {},	// 流入
			out: {}	// 流出
		},
		investment: {	// 投资活动
			in: {},	// 流入
			out: {}	// 流出
		},
		financing: {	// 筹资活动
			in: {},	// 流入
			out: {}	// 流出
		},
		ceq: {},	// 现金及现金等价物
	}
},

{	// 报表模板
	/* 匹配数组说明：
		接口属性名:[
			数据属性名,
			数据类型,
				0: 不用保存的数据,
				1: 转换为数字,
				2: 转换为日时间戳,
				3: 转换为数字，需注意后边的单位（万、亿 等）,
				4: 转换为日时间戳，需添加 0:0 后缀,
			中文备注
		]
	*/
	typ: "tmp",
	id: "eastmoney",	// 东方财富版
	main: {	// 主要指标
		date: ["tim", 4, "报告期"],
		jbmgsy: ["main.per.jbmgsy", 1, "基本每股收益(元)"],
		kfmgsy: ["main.per.kfmgsy", 1, "扣非每股收益(元)"],
		xsmgsy: ["main.per.xsmgsy", 1, "稀释每股收益(元)"],
		mgjzc: ["main.per.mgjzc", 1, "每股净资产(元)"],
		mggjj: ["main.per.mggjj", 1, "每股公积金(元)"],
		mgwfply: ["main.per.mgwfply", 1, "每股未分配利润(元)"],
		mgjyxjl: ["main.per.mgjyxjl", 1, "每股经营现金流(元)"],
		yyzsr: ["main.grop.yyzsr", 3, "营业总收入(元)"],
		mlr: ["main.grop.mlr", 3, "毛利润(元)"],
		gsjlr: ["main.grop.gsjlr", 3, "归属净利润(元)"],
		kfjlr: ["main.grop.kfjlr", 3, "扣非净利润(元)"],
		yyzsrtbzz: ["main.grop.yyzsrtbzz", 1, "营业总收入同比增长(%)"],
		gsjlrtbzz: ["main.grop.gsjlrtbzz", 1, "归属净利润同比增长(%)"],
		kfjlrtbzz: ["main.grop.kfjlrtbzz", 1, "扣非净利润同比增长(%)"],
		yyzsrgdhbzz: ["main.grop.yyzsrgdhbzz", 1, "营业总收入滚动环比增长(%)"],
		gsjlrgdhbzz: ["main.grop.gsjlrgdhbzz", 1, "归属净利润滚动环比增长(%)"],
		kfjlrgdhbzz: ["main.grop.kfjlrgdhbzz", 1, "扣非净利润滚动环比增长(%)"],
		jqjzcsyl: ["main.profit.jqjzcsyl", 1, "加权净资产收益率(%)"],
		tbjzcsyl: ["main.profit.tbjzcsyl", 1, "摊薄净资产收益率(%)"],
		tbzzcsyl: ["main.profit.tbzzcsyl", 1, "摊薄总资产收益率(%)"],
		mll: ["main.profit.mll", 1, "毛利率(%)"],
		jll: ["main.profit.jll", 1, "净利率(%)"],
		sjsl: ["main.profit.sjsl", 1, "实际税率(%)"],
		yskyysr: ["main.quality.yskyysr", 1, "预收款/营业收入"],
		xsxjlyysr: ["main.quality.xsxjlyysr", 1, "销售现金流/营业收入"],
		jyxjlyysr: ["main.quality.jyxjlyysr", 1, "经营现金流/营业收入"],
		zzczzy: ["main.operat.zzczzy", 1, "总资产周转率(次)"],
		yszkzzts: ["main.operat.yszkzzts", 1, "应收账款周转天数(天)"],
		chzzts: ["main.operat.chzzts", 1, "存货周转天数(天)"],
		zcfzl: ["main.risk.zcfzl", 1, "资产负债率(%)"],
		ldzczfz: ["main.risk.ldzczfz", 1, "流动负债/总负债(%)"],
		ldbl: ["main.risk.ldbl", 1, "流动比率"],
		sdbl: ["main.risk.sdbl", 1, "速动比率"]
	},
	balance: {	// 资产负债表
		typ: 4,	// 数据格式类型 （对应东方财富接口的 companyType 参数）
		SECURITYCODE: ["id", 0, "股票代码"],
		REPORTDATE: ["tim", 2, "报告期"],
		MONETARYFUND: ["balance.assets.current.MONETARYFUND", 1, "货币资金"],
		SETTLEMENTPROVISION: ["balance.assets.current.SETTLEMENTPROVISION", 1, "结算备付金"],
		LENDFUND: ["balance.assets.current.LENDFUND", 1, "拆出资金"],
		FVALUEFASSET: ["balance.assets.current.fa.t", 1, "以公允价值计量且其变动计入当期损益的金融资产"],
		TRADEFASSET: ["balance.assets.current.fa.TRADEFASSET", 1, "其中:交易性金融资产"],
		DEFINEFVALUEFASSET: ["balance.assets.current.fa.DEFINEFVALUEFASSET", 1, "其中:指定为以公允价值计量且其变动计入当期损益的金融资产"],	// 结构不明
		BILLREC: ["balance.assets.current.BILLREC", 1, "应收票据"],
		ACCOUNTREC: ["balance.assets.current.ACCOUNTREC", 1, "应收账款"],
		ADVANCEPAY: ["balance.assets.current.ADVANCEPAY", 1, "预付款项"],
		PREMIUMREC: ["balance.assets.current.PREMIUMREC", 1, "应收保费"],
		RIREC: ["balance.assets.current.RIREC", 1, "应收分保账款"],
		RICONTACTRESERVEREC: ["balance.assets.current.RICONTACTRESERVEREC", 1, "应收分保合同准备金"],
		INTERESTREC: ["balance.assets.current.INTERESTREC", 1, "应收利息"],
		DIVIDENDREC: ["balance.assets.current.DIVIDENDREC", 1, "应收股利"],
		OTHERREC: ["balance.assets.current.OTHERREC", 1, "其他应收款"],
		EXPORTREBATEREC: ["balance.assets.current.EXPORTREBATEREC", 1, "应收出口退税"],
		SUBSIDYREC: ["balance.assets.current.SUBSIDYREC", 1, "应收补贴款"],
		INTERNALREC: ["balance.assets.current.INTERNALREC", 1, "内部应收款"],
		BUYSELLBACKFASSET: ["balance.assets.current.BUYSELLBACKFASSET", 1, "买入返售金融资产"],
		INVENTORY: ["balance.assets.current.INVENTORY", 1, "存货"],
		CLHELDSALEASS: ["balance.assets.current.CLHELDSALEASS", 1, "划分为持有待售的资产"],
		NONLASSETONEYEAR: ["balance.assets.current.NONLASSETONEYEAR", 1, "一年内到期的非流动资产"],
		OTHERLASSET: ["balance.assets.current.OTHERLASSET", 1, "其他流动资产"],
		SUMLASSET: ["balance.assets.current.t", 1, "流动资产合计"],
		LOANADVANCES: ["balance.assets.nc.LOANADVANCES", 1, "发放委托贷款及垫款"],
		SALEABLEFASSET: ["balance.assets.nc.SALEABLEFASSET", 1, "可供出售金融资产"],
		HELDMATURITYINV: ["balance.assets.nc.HELDMATURITYINV", 1, "持有至到期投资"],
		LTREC: ["balance.assets.nc.LTREC", 1, "长期应收款"],
		LTEQUITYINV: ["balance.assets.nc.LTEQUITYINV", 1, "长期股权投资"],
		ESTATEINVEST: ["balance.assets.nc.ESTATEINVEST", 1, "投资性房地产"],
		FIXEDASSET: ["balance.assets.nc.FIXEDASSET", 1, "固定资产"],
		CONSTRUCTIONPROGRESS: ["balance.assets.nc.CONSTRUCTIONPROGRESS", 1, "在建工程"],
		CONSTRUCTIONMATERIAL: ["balance.assets.nc.CONSTRUCTIONMATERIAL", 1, "工程物资"],
		LIQUIDATEFIXEDASSET: ["balance.assets.nc.LIQUIDATEFIXEDASSET", 1, "固定资产清理"],
		PRODUCTBIOLOGYASSET: ["balance.assets.nc.PRODUCTBIOLOGYASSET", 1, "生产性生物资产"],
		OILGASASSET: ["balance.assets.nc.OILGASASSET", 1, "油气资产"],
		INTANGIBLEASSET: ["balance.assets.nc.INTANGIBLEASSET", 1, "无形资产"],
		DEVELOPEXP: ["balance.assets.nc.DEVELOPEXP", 1, "开发支出"],
		GOODWILL: ["balance.assets.nc.GOODWILL", 1, "商誉"],
		LTDEFERASSET: ["balance.assets.nc.LTDEFERASSET", 1, "长期待摊费用"],
		DEFERINCOMETAXASSET: ["balance.assets.nc.DEFERINCOMETAXASSET", 1, "递延所得税资产"],
		OTHERNONLASSET: ["balance.assets.nc.OTHERNONLASSET", 1, "其他非流动资产"],
		SUMNONLASSET: ["balance.assets.nc.t", 1, "非流动资产合计"],
		SUMASSET: ["balance.assets.t", 1, "资产总计"],
		STBORROW: ["balance.liability.current.STBORROW", 1, "短期借款"],
		BORROWFROMCBANK: ["balance.liability.current.BORROWFROMCBANK", 1, "向中央银行借款"],
		DEPOSIT: ["balance.liability.current.DEPOSIT", 1, "吸收存款及同业存放"],
		BORROWFUND: ["balance.liability.current.BORROWFUND", 1, "拆入资金"],
		FVALUEFLIAB: ["balance.liability.current.fl.t", 1, "以公允价值计量且其变动计入当期损益的金融负债"],
		TRADEFLIAB: ["balance.liability.current.fl.TRADEFLIAB", 1, "其中：交易性金融负债"],
		DEFINEFVALUEFLIAB: ["balance.liability.current.fl.DEFINEFVALUEFLIAB", 1, "其中:指定以公允价值计量且其变动计入当期损益的金融负债"],	// 结构不明
		BILLPAY: ["balance.liability.current.BILLPAY", 1, "应付票据"],
		ACCOUNTPAY: ["balance.liability.current.ACCOUNTPAY", 1, "应付账款"],
		ADVANCERECEIVE: ["balance.liability.current.ADVANCERECEIVE", 1, "预收款项"],
		SELLBUYBACKFASSET: ["balance.liability.current.SELLBUYBACKFASSET", 1, "卖出回购金融资产款"],
		COMMPAY: ["balance.liability.current.COMMPAY", 1, "应付手续费及佣金"],
		SALARYPAY: ["balance.liability.current.SALARYPAY", 1, "应付职工薪酬"],
		TAXPAY: ["balance.liability.current.TAXPAY", 1, "应交税费"],
		INTERESTPAY: ["balance.liability.current.INTERESTPAY", 1, "应付利息"],
		DIVIDENDPAY: ["balance.liability.current.DIVIDENDPAY", 1, "应付股利"],
		RIPAY: ["balance.liability.current.RIPAY", 1, "应付分保账款"],
		INTERNALPAY: ["balance.liability.current.INTERNALPAY", 1, "内部应付款"],
		OTHERPAY: ["balance.liability.current.OTHERPAY", 1, "其他应付款"],
		ANTICIPATELLIAB: ["balance.liability.current.ANTICIPATELLIAB", 1, "预计流动负债"],
		CONTACTRESERVE: ["balance.liability.current.CONTACTRESERVE", 1, "保险合同准备金"],
		AGENTTRADESECURITY: ["balance.liability.current.AGENTTRADESECURITY", 1, "代理买卖证券款"],
		AGENTUWSECURITY: ["balance.liability.current.AGENTUWSECURITY", 1, "代理承销证券款"],
		DEFERINCOMEONEYEAR: ["balance.liability.current.DEFERINCOMEONEYEAR", 1, "一年内的递延收益"],
		STBONDREC: ["balance.liability.current.STBONDREC", 1, "应付短期债券"],
		CLHELDSALELIAB: ["balance.liability.current.CLHELDSALELIAB", 1, "划分为持有待售的负债"],
		NONLLIABONEYEAR: ["balance.liability.current.NONLLIABONEYEAR", 1, "一年内到期的非流动负债"],
		OTHERLLIAB: ["balance.liability.current.OTHERLLIAB", 1, "其他流动负债"],
		SUMLLIAB: ["balance.liability.current.t", 1, "流动负债合计"],
		LTBORROW: ["balance.liability.nc.LTBORROW", 1, "长期借款"],
		BONDPAY: ["balance.liability.nc.bp.t", 1, "应付债券"],
		PREFERSTOCBOND: ["balance.liability.nc.bp.PREFERSTOCBOND", 1, "其中:优先股"],
		SUSTAINBOND: ["balance.liability.nc.bp.SUSTAINBOND", 1, "其中:永续债"],	// 结构不明
		LTACCOUNTPAY: ["balance.liability.nc.LTACCOUNTPAY", 1, "长期应付款"],
		LTSALARYPAY: ["balance.liability.nc.LTSALARYPAY", 1, "长期应付职工薪酬"],
		SPECIALPAY: ["balance.liability.nc.SPECIALPAY", 1, "专项应付款"],
		ANTICIPATELIAB: ["balance.liability.nc.ANTICIPATELIAB", 1, "预计负债"],
		DEFERINCOME: ["balance.liability.nc.DEFERINCOME", 1, "递延收益"],
		DEFERINCOMETAXLIAB: ["balance.liability.nc.DEFERINCOMETAXLIAB", 1, "递延所得税负债"],
		OTHERNONLLIAB: ["balance.liability.nc.OTHERNONLLIAB", 1, "其他非流动负债"],
		SUMNONLLIAB: ["balance.liability.nc.t", 1, "非流动负债合计"],
		SUMLIAB: ["balance.liability.t", 1, "负债合计"],
		SHARECAPITAL: ["balance.equity.parent.SHARECAPITAL", 1, "实收资本（或股本）"],
		OTHEREQUITY: ["balance.equity.parent.oe.t", 1, "其他权益工具"],
		PREFERREDSTOCK: ["balance.equity.parent.oe.PREFERREDSTOCK", 1, "其中:优先股"],
		SUSTAINABLEDEBT: ["balance.equity.parent.oe.SUSTAINABLEDEBT", 1, "其中:永续债"],	// 结构不明
		OTHEREQUITYOTHER: ["balance.equity.parent.oe.OTHEREQUITYOTHER", 1, "其中:其他权益工具"],	// 结构不明
		CAPITALRESERVE: ["balance.equity.parent.CAPITALRESERVE", 1, "资本公积"],
		INVENTORYSHARE: ["balance.equity.parent.INVENTORYSHARE", 1, "库存股"],
		SPECIALRESERVE: ["balance.equity.parent.SPECIALRESERVE", 1, "专项储备"],
		SURPLUSRESERVE: ["balance.equity.parent.SURPLUSRESERVE", 1, "盈余公积"],
		GENERALRISKPREPARE: ["balance.equity.parent.GENERALRISKPREPARE", 1, "一般风险准备"],
		UNCONFIRMINVLOSS: ["balance.equity.parent.UNCONFIRMINVLOSS", 1, "未确定的投资损失"],
		RETAINEDEARNING: ["balance.equity.parent.RETAINEDEARNING", 1, "未分配利润"],
		PLANCASHDIVI: ["balance.equity.parent.PLANCASHDIVI", 1, "拟分配现金股利"],
		DIFFCONVERSIONFC: ["balance.equity.parent.DIFFCONVERSIONFC", 1, "外币报表折算差额"],
		SUMPARENTEQUITY: ["balance.equity.parent.t", 1, "归属于母公司股东权益合计"],
		MINORITYEQUITY: ["balance.equity.minority.t", 1, "少数股东权益"],
		SUMSHEQUITY: ["balance.equity.t", 1, "股东权益合计(= SUMPARENTEQUITY + MINORITYEQUITY || = SUMASSET - SUMLIAB)"],

		SUMLIABSHEQUITY: [0, 0, "负债和股东权益合计(= SUMASSET)"],
		REPORTTYPE: [0, 0, "周期类别"],	// 1:普通数据;2:环比数据
		TYPE: [0, 0, "数据格式类型"],
		MONETARYFUND_YOY: [0, 0, ""],
		SETTLEMENTPROVISION_YOY: [0, 0, ""],
		LENDFUND_YOY: [0, 0, ""],
		FVALUEFASSET_YOY: [0, 0, ""],
		TRADEFASSET_YOY: [0, 0, ""],
		DEFINEFVALUEFASSET_YOY: [0, 0, ""],
		BILLREC_YOY: [0, 0, ""],
		ACCOUNTREC_YOY: [0, 0, ""],
		ADVANCEPAY_YOY: [0, 0, ""],
		PREMIUMREC_YOY: [0, 0, ""],
		RIREC_YOY: [0, 0, ""],
		RICONTACTRESERVEREC_YOY: [0, 0, ""],
		INTERESTREC_YOY: [0, 0, ""],
		DIVIDENDREC_YOY: [0, 0, ""],
		OTHERREC_YOY: [0, 0, ""],
		EXPORTREBATEREC_YOY: [0, 0, ""],
		SUBSIDYREC_YOY: [0, 0, ""],
		INTERNALREC_YOY: [0, 0, ""],
		BUYSELLBACKFASSET_YOY: [0, 0, ""],
		INVENTORY_YOY: [0, 0, ""],
		CLHELDSALEASS_YOY: [0, 0, ""],
		NONLASSETONEYEAR_YOY: [0, 0, ""],
		OTHERLASSET_YOY: [0, 0, ""],
		SUMLASSET_YOY: [0, 0, ""],
		LOANADVANCES_YOY: [0, 0, ""],
		SALEABLEFASSET_YOY: [0, 0, ""],
		HELDMATURITYINV_YOY: [0, 0, ""],
		LTREC_YOY: [0, 0, ""],
		LTEQUITYINV_YOY: [0, 0, ""],
		ESTATEINVEST_YOY: [0, 0, ""],
		FIXEDASSET_YOY: [0, 0, ""],
		CONSTRUCTIONPROGRESS_YOY: [0, 0, ""],
		CONSTRUCTIONMATERIAL_YOY: [0, 0, ""],
		LIQUIDATEFIXEDASSET_YOY: [0, 0, ""],
		PRODUCTBIOLOGYASSET_YOY: [0, 0, ""],
		OILGASASSET_YOY: [0, 0, ""],
		INTANGIBLEASSET_YOY: [0, 0, ""],
		DEVELOPEXP_YOY: [0, 0, ""],
		GOODWILL_YOY: [0, 0, ""],
		LTDEFERASSET_YOY: [0, 0, ""],
		DEFERINCOMETAXASSET_YOY: [0, 0, ""],
		OTHERNONLASSET_YOY: [0, 0, ""],
		SUMNONLASSET_YOY: [0, 0, ""],
		SUMASSET_YOY: [0, 0, ""],
		STBORROW_YOY: [0, 0, ""],
		BORROWFROMCBANK_YOY: [0, 0, ""],
		DEPOSIT_YOY: [0, 0, ""],
		BORROWFUND_YOY: [0, 0, ""],
		FVALUEFLIAB_YOY: [0, 0, ""],
		TRADEFLIAB_YOY: [0, 0, ""],
		DEFINEFVALUEFLIAB_YOY: [0, 0, ""],
		BILLPAY_YOY: [0, 0, ""],
		ACCOUNTPAY_YOY: [0, 0, ""],
		ADVANCERECEIVE_YOY: [0, 0, ""],
		SELLBUYBACKFASSET_YOY: [0, 0, ""],
		COMMPAY_YOY: [0, 0, ""],
		SALARYPAY_YOY: [0, 0, ""],
		TAXPAY_YOY: [0, 0, ""],
		INTERESTPAY_YOY: [0, 0, ""],
		DIVIDENDPAY_YOY: [0, 0, ""],
		RIPAY_YOY: [0, 0, ""],
		INTERNALPAY_YOY: [0, 0, ""],
		OTHERPAY_YOY: [0, 0, ""],
		ANTICIPATELLIAB_YOY: [0, 0, ""],
		CONTACTRESERVE_YOY: [0, 0, ""],
		AGENTTRADESECURITY_YOY: [0, 0, ""],
		AGENTUWSECURITY_YOY: [0, 0, ""],
		DEFERINCOMEONEYEAR_YOY: [0, 0, ""],
		STBONDREC_YOY: [0, 0, ""],
		CLHELDSALELIAB_YOY: [0, 0, ""],
		NONLLIABONEYEAR_YOY: [0, 0, ""],
		OTHERLLIAB_YOY: [0, 0, ""],
		SUMLLIAB_YOY: [0, 0, ""],
		LTBORROW_YOY: [0, 0, ""],
		BONDPAY_YOY: [0, 0, ""],
		PREFERSTOCBOND_YOY: [0, 0, ""],
		SUSTAINBOND_YOY: [0, 0, ""],
		LTACCOUNTPAY_YOY: [0, 0, ""],
		LTSALARYPAY_YOY: [0, 0, ""],
		SPECIALPAY_YOY: [0, 0, ""],
		ANTICIPATELIAB_YOY: [0, 0, ""],
		DEFERINCOME_YOY: [0, 0, ""],
		DEFERINCOMETAXLIAB_YOY: [0, 0, ""],
		OTHERNONLLIAB_YOY: [0, 0, ""],
		SUMNONLLIAB_YOY: [0, 0, ""],
		SUMLIAB_YOY: [0, 0, ""],
		SHARECAPITAL_YOY: [0, 0, ""],
		OTHEREQUITY_YOY: [0, 0, ""],
		PREFERREDSTOCK_YOY: [0, 0, ""],
		SUSTAINABLEDEBT_YOY: [0, 0, ""],
		OTHEREQUITYOTHER_YOY: [0, 0, ""],
		CAPITALRESERVE_YOY: [0, 0, ""],
		INVENTORYSHARE_YOY: [0, 0, ""],
		SPECIALRESERVE_YOY: [0, 0, ""],
		SURPLUSRESERVE_YOY: [0, 0, ""],
		GENERALRISKPREPARE_YOY: [0, 0, ""],
		UNCONFIRMINVLOSS_YOY: [0, 0, ""],
		RETAINEDEARNING_YOY: [0, 0, ""],
		PLANCASHDIVI_YOY: [0, 0, ""],
		DIFFCONVERSIONFC_YOY: [0, 0, ""],
		SUMPARENTEQUITY_YOY: [0, 0, ""],
		MINORITYEQUITY_YOY: [0, 0, ""],
		SUMSHEQUITY_YOY: [0, 0, ""],
		SUMLIABSHEQUITY_YOY: [0, 0, ""],
		CURRENCY: [0, 0, "币种"]
	},
	profit: {	// 利润表
		typ: 4,	// 数据格式类型
		REPORTDATE: ["tim", 2, ""],
		TOTALOPERATEREVE: ["profit.inc.t", 1, "营业总收入"],
		OPERATEREVE: ["profit.inc.ot", 1, "营业收入"],
		OPERATEREVE_YOY: ["profit.inc.otyoy", 0, "营业收入同比变化"],
		INTREVE: ["profit.inc.INTREVE", 1, "利息收入"],
		PREMIUMEARNED: ["profit.inc.PREMIUMEARNED", 1, "已赚保费"],
		COMMREVE: ["profit.inc.COMMREVE", 1, "手续费及佣金收入"],
		OTHERREVE: ["profit.inc.OTHERREVE", 1, "其他业务收入"],
		TOTALOPERATEEXP: ["profit.cost.t", 1, "营业总成本"],
		OPERATEEXP: ["profit.cost.ot", 1, "营业成本"],
		INTEXP: ["profit.cost.INTEXP", 1, "利息支出"],
		COMMEXP: ["profit.cost.COMMEXP", 1, "手续费及佣金支出"],
		RDEXP: ["profit.cost.RDEXP", 1, "研发费用"],
		SURRENDERPREMIUM: ["profit.cost.SURRENDERPREMIUM", 1, "退保金"],
		NETINDEMNITYEXP: ["profit.cost.NETINDEMNITYEXP", 1, "赔付支出净额"],
		NETCONTACTRESERVE: ["profit.cost.NETCONTACTRESERVE", 1, "提取保险合同准备金净额"],
		POLICYDIVIEXP: ["profit.cost.POLICYDIVIEXP", 1, "保单红利支出"],
		RIEXP: ["profit.cost.RIEXP", 1, "分保费用"],
		OTHEREXP: ["profit.cost.OTHEREXP", 1, "其他业务成本"],
		OPERATETAX: ["profit.cost.OPERATETAX", 1, "营业税金及附加"],
		SALEEXP: ["profit.cost.SALEEXP", 1, "销售费用"],
		MANAGEEXP: ["profit.cost.MANAGEEXP", 1, "管理费用"],
		FINANCEEXP: ["profit.cost.FINANCEEXP", 1, "财务费用"],
		ASSETDEVALUELOSS: ["profit.cost.ASSETDEVALUELOSS", 1, "资产减值损失"],
		FVALUEINCOME: ["profit.np.total.operate.FVALUEINCOME", 1, "加:公允价值变动收益"],
		INVESTINCOME: ["profit.np.total.operate.invest.t", 1, "加:投资收益"],
		INVESTJOINTINCOME: ["profit.np.total.operate.invest.joint", 1, "其中:对联营企业和合营企业的投资收益"],
		EXCHANGEINCOME: ["profit.np.total.operate.EXCHANGEINCOME", 1, "汇兑收益"],
		OPERATEPROFIT: ["profit.np.total.operate.t", 1, "营业利润"],
		NONOPERATEREVE: ["profit.np.total.norev.t", 1, "加:营业外收入"],
		NONLASSETREVE: ["profit.np.total.norev.asset", 1, "其中:非流动资产处置利得"],
		NONOPERATEEXP: ["profit.np.total.noexp.t", 1, "减:营业外支出"],
		NONLASSETNETLOSS: ["profit.np.total.noexp.asset", 1, "其中:非流动资产处置净损失"],
		SUMPROFIT: ["profit.np.total.t", 1, "利润总额(= OPERATEPROFIT + NONOPERATEREVE - NONOPERATEEXP)"],
		INCOMETAX: ["profit.np.tax", 1, "减:所得税费用"],
		COMBINEDNETPROFITB: ["profit.np.COMBINEDNETPROFITB", 1, "被合并方在合并前实现利润"],
		NETPROFIT: ["profit.np.t", 1, "净利润(= SUMPROFIT - INCOMETAX) || (= PARENTNETPROFIT + MINORITYINCOME)"],
		PARENTNETPROFIT: ["profit.np.parent", 1, "其中:归属于母公司股东的净利润"],
		MINORITYINCOME: ["profit.np.minority", 1, "少数股东损益"],
		KCFJCXSYJLR: ["profit.np.nt.t", 1, "扣除非经常性损益后的净利润"],
		KCFJCXSYJLR_YOY: ["profit.np.nt.yoy", 1, "扣除非经常性损益后的净利润（同比变化）"],
		BASICEPS: ["profit.eps.base", 1, "基本每股收益"],
		DILUTEDEPS: ["profit.eps.dilute", 1, "稀释每股收益"],
		OTHERCINCOME: ["profit.oinc.t", 1, "其他综合收益"],
		PARENTOTHERCINCOME: ["profit.oinc.parent", 1, "归属于母公司股东的其他综合收益"],
		MINORITYOTHERCINCOME: ["profit.oinc.minority", 1, "归属于少数股东的其他综合收益"],
		SUMCINCOME: ["profit.cinc.t", 1, "综合收益总额(= PARENTCINCOME + MINORITYCINCOME)"],
		PARENTCINCOME: ["profit.cinc.parent", 1, "归属于母公司所有者的综合收益总额"],
		MINORITYCINCOME: ["profit.cinc.minority", 1, "归属于少数股东的综合收益总额"],

		SECURITYCODE: [0, 0, ""],
		REPORTTYPE: [0, 0, ""],
		TYPE: [0, 0, ""],
		TOTALOPERATEREVE_YOY: [0, 0, ""],
		INTREVE_YOY: [0, 0, ""],
		PREMIUMEARNED_YOY: [0, 0, ""],
		COMMREVE_YOY: [0, 0, ""],
		OTHERREVE_YOY: [0, 0, ""],
		TOTALOPERATEEXP_YOY: [0, 0, ""],
		OPERATEEXP_YOY: [0, 0, ""],
		INTEXP_YOY: [0, 0, ""],
		COMMEXP_YOY: [0, 0, ""],
		RDEXP_YOY: [0, 0, ""],
		SURRENDERPREMIUM_YOY: [0, 0, ""],
		NETINDEMNITYEXP_YOY: [0, 0, ""],
		NETCONTACTRESERVE_YOY: [0, 0, ""],
		POLICYDIVIEXP_YOY: [0, 0, ""],
		RIEXP_YOY: [0, 0, ""],
		OTHEREXP_YOY: [0, 0, ""],
		OPERATETAX_YOY: [0, 0, ""],
		SALEEXP_YOY: [0, 0, ""],
		MANAGEEXP_YOY: [0, 0, ""],
		FINANCEEXP_YOY: [0, 0, ""],
		ASSETDEVALUELOSS_YOY: [0, 0, ""],
		FVALUEINCOME_YOY: [0, 0, ""],
		INVESTINCOME_YOY: [0, 0, ""],
		INVESTJOINTINCOME_YOY: [0, 0, ""],
		EXCHANGEINCOME_YOY: [0, 0, ""],
		OPERATEPROFIT_YOY: [0, 0, ""],
		NONOPERATEREVE_YOY: [0, 0, ""],
		NONLASSETREVE_YOY: [0, 0, ""],
		NONOPERATEEXP_YOY: [0, 0, ""],
		NONLASSETNETLOSS_YOY: [0, 0, ""],
		SUMPROFIT_YOY: [0, 0, ""],
		INCOMETAX_YOY: [0, 0, ""],
		NETPROFIT_YOY: [0, 0, ""],
		COMBINEDNETPROFITB_YOY: [0, 0, ""],
		PARENTNETPROFIT_YOY: [0, 0, ""],
		MINORITYINCOME_YOY: [0, 0, ""],
		BASICEPS_YOY: [0, 0, ""],
		DILUTEDEPS_YOY: [0, 0, ""],
		OTHERCINCOME_YOY: [0, 0, ""],
		PARENTOTHERCINCOME_YOY: [0, 0, ""],
		MINORITYOTHERCINCOME_YOY: [0, 0, ""],
		SUMCINCOME_YOY: [0, 0, ""],
		PARENTCINCOME_YOY: [0, 0, ""],
		MINORITYCINCOME_YOY: [0, 0, ""],
		CURRENCY: [0, 0, "币种"]
	},
	cash: {	// 现金流量表
		typ: 4,	// 数据格式类型
		REPORTDATE: ["tim", 2, ""],
		SALEGOODSSERVICEREC: ["cash.operate.in.SALEGOODSSERVICEREC", 1, "销售商品、提供劳务收到的现金"],
		NIDEPOSIT: ["cash.operate.in.NIDEPOSIT", 1, "客户存款和同业存放款项净增加额"],
		NIBORROWFROMCBANK: ["cash.operate.in.NIBORROWFROMCBANK", 1, "向中央银行借款净增加额"],
		NIBORROWFROMFI: ["cash.operate.in.NIBORROWFROMFI", 1, "向其他金融机构拆入资金净增加额"],
		PREMIUMREC: ["cash.operate.in.PREMIUMREC", 1, "收到原保险合同保费取得的现金"],
		NETRIREC: ["cash.operate.in.NETRIREC", 1, "收到再保险业务现金净额"],
		NIINSUREDDEPOSITINV: ["cash.operate.in.NIINSUREDDEPOSITINV", 1, "保户储金及投资款净增加额"],
		NIDISPTRADEFASSET: ["cash.operate.in.NIDISPTRADEFASSET", 1, "处置交易性金融资产净增加额"],
		INTANDCOMMREC: ["cash.operate.in.INTANDCOMMREC", 1, "收取利息、手续费及佣金的现金"],
		NIBORROWFUND: ["cash.operate.in.NIBORROWFUND", 1, "拆入资金净增加额"],
		NDLOANADVANCES: ["cash.operate.in.NDLOANADVANCES", 1, "发放贷款及垫款的净减少额"],
		NIBUYBACKFUND: ["cash.operate.in.NIBUYBACKFUND", 1, "回购业务资金净增加额"],
		TAXRETURNREC: ["cash.operate.in.TAXRETURNREC", 1, "收到的税费返还"],
		OTHEROPERATEREC: ["cash.operate.in.OTHEROPERATEREC", 1, "收到其他与经营活动有关的现金"],
		SUMOPERATEFLOWIN: ["cash.operate.in.t", 1, "经营活动现金流入小计"],
		BUYGOODSSERVICEPAY: ["cash.operate.out.BUYGOODSSERVICEPAY", 1, "购买商品、接受劳务支付的现金"],
		NILOANADVANCES: ["cash.operate.out.NILOANADVANCES", 1, "客户贷款及垫款净增加额"],
		NIDEPOSITINCBANKFI: ["cash.operate.out.NIDEPOSITINCBANKFI", 1, "存放中央银行和同业款项净增加额"],
		INDEMNITYPAY: ["cash.operate.out.INDEMNITYPAY", 1, "支付原保险合同赔付款项的现金"],
		INTANDCOMMPAY: ["cash.operate.out.INTANDCOMMPAY", 1, "支付利息、手续费及佣金的现金"],
		DIVIPAY: ["cash.operate.out.DIVIPAY", 1, "支付保单红利的现金"],
		EMPLOYEEPAY: ["cash.operate.out.EMPLOYEEPAY", 1, "支付给职工以及为职工支付的现金"],
		TAXPAY: ["cash.operate.out.TAXPAY", 1, "支付的各项税费"],
		OTHEROPERATEPAY: ["cash.operate.out.OTHEROPERATEPAY", 1, "支付其他与经营活动有关的现金"],
		SUMOPERATEFLOWOUT: ["cash.operate.out.t", 1, "经营活动现金流出小计"],
		NETOPERATECASHFLOW: ["cash.operate.t", 1, "经营活动产生的现金流量净额"],
		DISPOSALINVREC: ["cash.investment.in.DISPOSALINVREC", 1, "收回投资收到的现金"],
		INVINCOMEREC: ["cash.investment.in.INVINCOMEREC", 1, "取得投资收益收到的现金"],
		DISPFILASSETREC: ["cash.investment.in.DISPFILASSETREC", 1, "处置固定资产、无形资产和其他长期资产收回的现金净额"],
		DISPSUBSIDIARYREC: ["cash.investment.in.DISPSUBSIDIARYREC", 1, "处置子公司及其他营业单位收到的现金净额"],
		REDUCEPLEDGETDEPOSIT: ["cash.investment.in.REDUCEPLEDGETDEPOSIT", 1, "减少质押和定期存款所收到的现金"],
		OTHERINVREC: ["cash.investment.in.OTHERINVREC", 1, "收到其他与投资活动有关的现金"],
		SUMINVFLOWIN: ["cash.investment.in.t", 1, "投资活动现金流入小计"],
		BUYFILASSETPAY: ["cash.investment.out.BUYFILASSETPAY", 1, "购建固定资产、无形资产和其他长期资产支付的现金"],
		INVPAY: ["cash.investment.out.INVPAY", 1, "投资支付的现金"],
		NIPLEDGELOAN: ["cash.investment.out.NIPLEDGELOAN", 1, "质押贷款净增加额"],
		GETSUBSIDIARYPAY: ["cash.investment.out.GETSUBSIDIARYPAY", 1, "取得子公司及其他营业单位支付的现金净额"],
		ADDPLEDGETDEPOSIT: ["cash.investment.out.ADDPLEDGETDEPOSIT", 1, "增加质押和定期存款所支付的现金"],
		OTHERINVPAY: ["cash.investment.out.OTHERINVPAY", 1, "支付其他与投资活动有关的现金"],
		SUMINVFLOWOUT: ["cash.investment.out.t", 1, "投资活动现金流出小计"],
		NETINVCASHFLOW: ["cash.investment.t", 1, "投资活动产生的现金流量净额"],
		ACCEPTINVREC: ["cash.financing.in.ACCEPTINVREC", 1, "吸收投资收到的现金"],
		SUBSIDIARYACCEPT: ["cash.financing.in.SUBSIDIARYACCEPT", 1, "子公司吸收少数股东投资收到的现金"],
		LOANREC: ["cash.financing.in.LOANREC", 1, "取得借款收到的现金"],
		ISSUEBONDREC: ["cash.financing.in.ISSUEBONDREC", 1, "发行债券收到的现金"],
		OTHERFINAREC: ["cash.financing.in.OTHERFINAREC", 1, "收到其他与筹资活动有关的现金"],
		SUMFINAFLOWIN: ["cash.financing.in.t", 1, "筹资活动现金流入小计"],
		REPAYDEBTPAY: ["cash.financing.out.REPAYDEBTPAY", 1, "偿还债务支付的现金"],
		DIVIPROFITORINTPAY: ["cash.financing.out.DIVIPROFITORINTPAY", 1, "分配股利、利润或偿付利息支付的现金"],
		SUBSIDIARYPAY: ["cash.financing.out.SUBSIDIARYPAY", 1, "子公司支付给少数股东的股利、利润"],
		BUYSUBSIDIARYPAY: ["cash.financing.out.BUYSUBSIDIARYPAY", 1, "购买子公司少数股权而支付的现金"],
		OTHERFINAPAY: ["cash.financing.out.OTHERFINAPAY", 1, "支付其他与筹资活动有关的现金"],
		SUBSIDIARYREDUCTCAPITAL: ["cash.financing.out.SUBSIDIARYREDUCTCAPITAL", 1, "子公司减资支付给少数股东的现金"],
		SUMFINAFLOWOUT: ["cash.financing.out.t", 1, "筹资活动现金流出小计"],
		NETFINACASHFLOW: ["cash.financing.t", 1, "筹资活动产生的现金流量净额"],
		EFFECTEXCHANGERATE: ["cash.EFFECTEXCHANGERATE", 1, "汇率变动对现金及现金等价物的影响"],
		NICASHEQUI: ["cash.ceq.t", 1, "现金及现金等价物净增加额"],
		CASHEQUIBEGINNING: ["cash.ceq.begin", 1, "加:期初现金及现金等价物余额"],
		CASHEQUIENDING: ["cash.ceq.end", 1, "期末现金及现金等价物余额"],

		SECURITYCODE: [0, 0, ""],
		REPORTTYPE: [0, 0, ""],
		TYPE: [0, 0, ""],
		SALEGOODSSERVICEREC_YOY: [0, 0, ""],
		NIDEPOSIT_YOY: [0, 0, ""],
		NIBORROWFROMCBANK_YOY: [0, 0, ""],
		NIBORROWFROMFI_YOY: [0, 0, ""],
		PREMIUMREC_YOY: [0, 0, ""],
		NETRIREC_YOY: [0, 0, ""],
		NIINSUREDDEPOSITINV_YOY: [0, 0, ""],
		NIDISPTRADEFASSET_YOY: [0, 0, ""],
		INTANDCOMMREC_YOY: [0, 0, ""],
		NIBORROWFUND_YOY: [0, 0, ""],
		NDLOANADVANCES_YOY: [0, 0, ""],
		NIBUYBACKFUND_YOY: [0, 0, ""],
		TAXRETURNREC_YOY: [0, 0, ""],
		OTHEROPERATEREC_YOY: [0, 0, ""],
		SUMOPERATEFLOWIN_YOY: [0, 0, ""],
		BUYGOODSSERVICEPAY_YOY: [0, 0, ""],
		NILOANADVANCES_YOY: [0, 0, ""],
		NIDEPOSITINCBANKFI_YOY: [0, 0, ""],
		INDEMNITYPAY_YOY: [0, 0, ""],
		INTANDCOMMPAY_YOY: [0, 0, ""],
		DIVIPAY_YOY: [0, 0, ""],
		EMPLOYEEPAY_YOY: [0, 0, ""],
		TAXPAY_YOY: [0, 0, ""],
		OTHEROPERATEPAY_YOY: [0, 0, ""],
		SUMOPERATEFLOWOUT_YOY: [0, 0, ""],
		NETOPERATECASHFLOW_YOY: [0, 0, ""],
		DISPOSALINVREC_YOY: [0, 0, ""],
		INVINCOMEREC_YOY: [0, 0, ""],
		DISPFILASSETREC_YOY: [0, 0, ""],
		DISPSUBSIDIARYREC_YOY: [0, 0, ""],
		REDUCEPLEDGETDEPOSIT_YOY: [0, 0, ""],
		OTHERINVREC_YOY: [0, 0, ""],
		SUMINVFLOWIN_YOY: [0, 0, ""],
		BUYFILASSETPAY_YOY: [0, 0, ""],
		INVPAY_YOY: [0, 0, ""],
		NIPLEDGELOAN_YOY: [0, 0, ""],
		GETSUBSIDIARYPAY_YOY: [0, 0, ""],
		ADDPLEDGETDEPOSIT_YOY: [0, 0, ""],
		OTHERINVPAY_YOY: [0, 0, ""],
		SUMINVFLOWOUT_YOY: [0, 0, ""],
		NETINVCASHFLOW_YOY: [0, 0, ""],
		ACCEPTINVREC_YOY: [0, 0, ""],
		SUBSIDIARYACCEPT_YOY: [0, 0, ""],
		LOANREC_YOY: [0, 0, ""],
		ISSUEBONDREC_YOY: [0, 0, ""],
		OTHERFINAREC_YOY: [0, 0, ""],
		SUMFINAFLOWIN_YOY: [0, 0, ""],
		REPAYDEBTPAY_YOY: [0, 0, ""],
		DIVIPROFITORINTPAY_YOY: [0, 0, ""],
		SUBSIDIARYPAY_YOY: [0, 0, ""],
		BUYSUBSIDIARYPAY_YOY: [0, 0, ""],
		OTHERFINAPAY_YOY: [0, 0, ""],
		SUBSIDIARYREDUCTCAPITAL_YOY: [0, 0, ""],
		SUMFINAFLOWOUT_YOY: [0, 0, ""],
		NETFINACASHFLOW_YOY: [0, 0, ""],
		EFFECTEXCHANGERATE_YOY: [0, 0, ""],
		NICASHEQUI_YOY: [0, 0, ""],
		CASHEQUIBEGINNING_YOY: [0, 0, ""],
		CASHEQUIENDING_YOY: [0, 0, ""],
		CURRENCY: [0, 0, ""]
	}
},

{	// 股本历史
	// http://f10.eastmoney.com/CapitalStockStructure/CapitalStockStructureAjax?code=SH600186
	typ:"num",
	id: "股票代码",
	tim: "变动日期",	// 日时间戳
	t: "总股本",
	a: "流通A股",
	msg: "变动原因",
	o: {},	// 其它
},

{	// 分红融资
	// http://f10.eastmoney.com/BonusFinancing/BonusFinancingAjax?code=SH600660
	typ:"dvd",
	id: "股票代码",
	tim: "公告日期",	// 日时间戳 | 增发时间
	regTim: "股权登记日",	// 日时间戳
	exdTim: "除权除息日",	// 日时间戳 | 增发上市日
	cn:	10,	// 基数
	gift: "送股",
	transfer: "转增股",
	dividend: "派息",
	dt: "派息税后金额",
	allotment: {	// 配股
		p: "配股价",
		n: "计划对应基数的配股数量",
		num: "实际配股数量"
	},
	addIss: {	// 增发
		p: "增发价",
		num: "实际增发数量",
		net: "实际募集净额"
	}
},

{	// 收入构成
	// http://f10.eastmoney.com/BusinessAnalysis/BusinessAnalysisAjax?code=SH600186
	typ: "inccop",
	id: "股票代码",
	tim: "报告期",	// 日时间戳
	simi: "分类",	// 1:主营产品构成,2:行业收入构成,3:地区收入构成
	item: "项目",
	income: "收入",
	scaleI: "收入占比",
	cost: "成本",
	scaleC: "成本占比",
	gpm: "毛利率"
},

// 业绩预告
];
