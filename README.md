├── mock                     # 本地模拟数据
├── public
│   └── favicon.ico          # Favicon
├── src
│   ├── assets               # 本地静态资源
│   ├── common               # 应用公用配置，如导航信息
│   ├── components           # 业务通用组件
│   ├── e2e                  # 集成测试用例
│   ├── layouts              # 通用布局
│   ├── models               # dva model
│   ├── routes               # 业务页面入口和常用模板
│   ├── services             # 后台接口服务
│   ├── utils                # 工具库
│   ├── g2.js                # 可视化图形配置
│   ├── theme.js             # 主题配置
│   ├── index.ejs            # HTML 入口模板
│   ├── index.js             # 应用入口
│   ├── index.less           # 全局样式
│   └── router.js            # 路由入口
├── tests                    # 测试工具
├── README.md
└── package.json

Res_MapLayerInfo表中LayerType定义

1	图层容器
2	普通图层
3	区域类型图层
4	道路中心线
5	用作底图的图层
6          厂区基础装置区域图（用作区域计算的基础图层）
7          栅格图层（卫星图片图层）
8          需要改变图层叠加顺序的图层
21	火灾探测相关图层
22	气体探测相关图层
23	消防设施相关图层
24	环保设施相关图层
25	质量设施相关图层
26	工业视频相关图层
