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

*******************************************************************


计划：
-------------------------------------------------------------------

- 新版股票服务
	- 抓取调整充分的、接近10或20日均线的、出现地量的微涨的股，并根据历史数据测试其操作成功率
	- 检查并解决在初始化基本面信息时，网络卡死的问题
	- 避免基本面信息更新时的并发问题
- 分类服务
- 图床服务（ws形式、URL形式）
	- 设计外链图片数据库
	- 图片的关联与导入
	- 批量上传图片的功能
	- 图片查询及管理
- 相册服务
- 赌博数据统计
- 用户服务
- 账号服务
- 赌博游戏
- 作品展示
	- 检测所板卡APP
	- 完善空气质量预警系统的风场动画
	- 电商网站交易模块改为我的支付宝账户
- 比特币交易系统

*******************************************************************


开发明细：
-------------------------------------------------------------------

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
