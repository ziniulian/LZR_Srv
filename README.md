李泽荣 的 服务
=======

*******************************************************************

缓存：
-------------------------------------------------------------------

- 整合以前所有分散的O3服务
	- 访问记录
	- 股服务
	- 指纹跟踪
	- 日记服务
- 临时图床，待正式的图床服务完善后，作品展示再改用正式的图床。
- 作品展示
	- 时间轴
	- 河北页面
	- 空气质量预警系统
	- 风场服务
	- 空气质量发布系统
	- WebGL
	- 虚拟实验
	- 地图盒子
	- 长征网
	- 电商网站
	- 测温标签演示页
	- 图片库
	- 罗盘
	- 铁路手持机模拟器
	- 四方厂配件管理模拟器
	- 卧具演示模拟器
	- 新疆民航仓库模拟器
	- 测温模拟器
- 新版股票服务
	- 每日收盘功能
	- 市盈率图表分析
	- 基本面条件筛选、记录、叠加
	- 基本数据更新测试
	- 市盈率补充
	- 收盘时添加大盘数据的收盘
	- 大盘历史数据补充
	- 量能抓取
	- 抓取调整充分的、接近10或20日均线的、出现地量的微涨的股，并根据历史数据测试其操作成功率
	- 整合测试功能，各种类型的统一界面 + 统一 POST + 统一的接口
	- 整合原均线附近地量测试功能
	- 放量涨、放量跌分析
	- 三阳的测试
	- 集合竞价加入股票名称
	- 集合竞价最高价、最低价、开盘价换算为相对昨收的百分比涨幅；取消现有幅度参数
	- 集合竞价概览路由并入LZR库中
	- 避免服务启动时因无法连接数据库而报错
	- 解决 600705 分红信息中出现 "暂缓分配" 的特殊词汇问题
	- 日K线数据添加昨收价和换手率。当今日收盘价与第二日的昨收价不相等时，即为除权所致
	- 补充遗漏的收盘数据 ： 2019-4-29、2019-5-27、2019-6-18、2019-6-27、2019-7-4
	- 删除股票：小天鹅（000418）已退市
	- 补充季度K线信息功能
	- 添加自选股操作页面
	- 自选股操作页面直接访问新浪接口，不再使用股服务的查询接口。
	- 自选股操作页面区分斩仓和止盈两种类型的卖价
	- 添加自选股修改页面
	- 分时图显示买五到卖五数据
	- 采用新浪数据，重新计算内外盘的新分时图
	- 分时图数据保存
	- 分时图回放
	- 量比线改为标准量比减1
	- 盘口增加柱状图显示
	- 分时数据[1]将量比改为量差
	- 数据回放也对应改为盘口柱状图，并修改量比算法
	- 将旧分时数据的量比全部修改为量差
	- 分时图添加曲线补偿功能
	- 分时图嵌入交易页面
	- 分时图添加快捷键功能
	- 分时图国债大于2.9时动画提示
- 数据库连接字不再使用 OPENSHIFT_MONGODB_DB_URL

*******************************************************************


计划：
-------------------------------------------------------------------

- 实现数据库的在线备份与恢复功能
- 新版股票服务
	- 分时图的涨跌停数据处理
	- 收盘前半小时抓取量比小于0.6的股，缩量的股，后几天的上涨概率很大。
	- 分时图保存大盘数据
	- 分时图数据，后台多股录制功能
	- 基于后台记录数据的新版分时图
	- 分割股服务
	- 自动收盘功能
	- 循环更新全部股票的财务数据
	- 避免基本面信息更新时的并发问题
	- 检查并解决在初始化基本面信息时，网络卡死的问题
	- 首页

	- 分时图再次使用东方财富网络接口
	- 分时图加入对应板块的走势
	- 加入净利率（净利润/主营业务收入）
	- 加入动态市盈率
	- 按照动态市盈率重新计算市盈率K线图，静态市盈率不再作为主要参数

	- 自动操盘工具
	- 新的选股法 ： 年度和季度的扣非净利润同比必须向上、净资产每股收益要好、市净率市盈率资产负债率要低
	- 符合模拟测试条件的筛选器
	- 三阳的测试（三连阴。放量跌：五日内最大量。放量涨：十日内最大量，以近三天的最低点为止损点。）
- 分类服务
- 图床服务（ws形式、URL形式）
	- 设计外链图片数据库
	- 图片的关联与导入
	- 批量上传图片的功能
	- 图片查询及管理
- 相册服务
- 用户服务
- 账号服务
- 作品展示
	- 检测所板卡APP
	- 文件管理APP
	- NFC识别APP
	- 完善空气质量预警系统的风场动画
	- 电商网站交易模块改为我的支付宝账户
- 赌博数据统计
- 赌博游戏
- 比特币交易系统

*******************************************************************


开发明细：
-------------------------------------------------------------------

##### 2020-5-11（ 更新作品展示内容 ）：

##### 2020-4-30 （ 分时图优化 ）：
	图表鼠标改为十字星
	快捷键功能调整
	国债动画提示限界改为2.6
	在图表更新前处理指数数据
	分时图回放加入翻页按钮

##### 2020-3-20 （ 分时图曲线补偿 ）：
	分时图添加曲线补偿功能
	分时图嵌入交易页面
	分时图添加快捷键功能
	分时图国债大于2.9时动画提示

##### 2020-3-6 （ 盘口柱状图 ）：

##### 2020-3-5 （ 彩色的盘口线 ）：
	对放量的盘口线进行标记（效果不佳）
	量比改为递增曲线（效果不佳）

##### 2020-3-4 （ 分时图回放 ）：
	将分时图的图表数据{f,v,w}改为数组
	分时图数据保存
	分时图回放

##### 2020-2-26 （ 新版分时图 ）：
	分时图中包含了挂单信息和大盘信息
	分时图使用新浪数据

##### 2020-1-17 （ 分时图可脱离零轴 ）：
	分时图可脱离零轴
	自选股操作以万二手续费计算成本

##### 2020-1-10 （ 分时图数据优化 ）：
	盘口和主力全部以日平均量计算比例

##### 2020-1-10 （ 分时图表缩放 ）：
	分时图加入时间轴控制条，用于缩放图表
	分时图代码切换
	分时图数据输出

##### 2020-1-3 （ 分时图表 ）：
	完成分时图表

##### 2019-12-6 （ 自选股优化 ）：
	自选股的止盈不需要缓冲，止损需加入1%的缓冲。
	自选股添加总成本统计项
	自选股添加国债逆回购项
	自选股修改页面可以设置数量为零的交易明细
	自选股接近范围缩小到0.5和1.2

##### 2019-10-31 （ 自选股修改页面 ）：
	添加自选股修改页面
	测试区内删除了有关集合竞价测试的功能
	修改了自选股信息的数据结构
	根据新的数据结构修正自选股操作页面
	自选股操作页面直接跨域访问新浪接口，不再使用股服务的查询接口
	优化自选股页面的成本价显示
	保证底仓也要设止损位，4%的止损

##### 2019-10-19 （ T+0功能规划 ）：

##### 2019-10-8 （ 股票操作修正 ）：
	自选股操作页面刷新时清空之前显示的数字

##### 2019-9-30 （ 股票操作 ）：
	补充季度K线信息功能
	添加自选股操作页面
	数据整理

##### 2019-9-17 （ 添加昨收价和换手率 ）：
	日K线数据结构添加昨收价和换手率
	日线补充功能

##### 2019-5-17 （ 改用1.3.7版数据库连接字 ）：
	取消老版股票服务
	取消 OPENSHIFT_MONGODB_DB_URL 的数据库连接字
	数据库在线备份恢复功能（未完成）

##### 2019-4-26 （ 集合竞价测试 ）：

##### 2019-4-26 （ 三阳测试 ）：
	三阳测试
	集合竞价数据抓取（未完成）

##### 2019-4-23 （ 模拟测试框架 ）：
	搭建模拟测试框架

##### 2019-4-12 （ 模拟测试 ）：
	测试结果不理想，无规律性，需优化筛选条件

##### 2019-4-11 （ 量能抓取器 ）：
	添加量能抓取器
	将聚合排序分页查询功能整合到LZR库

##### 2019-4-8 （ 年报查询器添加挑选条件 ）：

##### 2019-4-7 （ 股服务，年报查询器 ）：

##### 2019-4-6 （ 股服务，图表分析 ）：

##### 2019-4-4 （ 股服务，将核心内容提取到LZR库 ）：

##### 2019-4-3 （ 股服务，完成收盘功能 ）：

##### 2019-4-3 （ 尝试聚合排序 ）：

##### 2019-4-2 （ 股服务，完成基本面数据抓取 ）：

##### 2019-3-31 （ 股服务，抓取年报数据 ）：

##### 2019-3-29 （ 股服务，抓取股本信息 ）：

##### 2019-3-29 （ 通用分页模板的优化 ）：
	1. 改用 cont 作为分页删除的条件，可避免对分页查询进行 修正删除条件 的后处理
	1. 将 mark 从 qrypro.def 中提出，可更加灵活的控制页面数据

##### 2019-3-29 （ 新增东方财富版股服务，未完成 ）：

##### 2019-3-7 （ 测温模拟器 ）：

##### 2019-3-1 （ 新疆民航仓库管理 ）：

##### 2019-2-21 （ 卧具管理 ）：

##### 2019-2-20 （ 四方厂配件管理 ）：
	四方厂配件管理
	卧具管理（未完成）

##### 2019-2-18 （ 铁路手持机模拟器 ）：

##### 2019-2-15 （ 图片库、罗盘 ）：
	图片库
	罗盘
	RFID模拟器（未完成）

##### 2019-2-14 （ 外网部署 ）：
	外网部署
	电商网站部署
	测温标签演示页

##### 2019-2-13 （ 地图盒子 ）：
	地图盒子
	长征网
	V1版空气质量预警

##### 2019-2-12 （ 兼容 LX_JS 临时资源库 ）：
	首页
	WebGL
	虚拟实验
	兼容 LX_JS 临时资源库

##### 2019-1-30 （ 作品展示-1 ）：
	风场服务
	时间轴
	空气质量预警系统
	空气质量发布系统

##### 2019-1-23 （ BUG修正 ）：
	解决 tools.js 通用工具中 获取客户端公网IP方法 在https页面下不能加载 http 资源的问题。

##### 2019-1-23 （ 服务整合 ）：
	整合原来分散的 股服务 和 日记服务

##### 2019-1-23 （ 初建 ）：
	初建

*******************************************************************
