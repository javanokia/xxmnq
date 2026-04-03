# 工作记忆 · 项目长期决策记录

## 《一介凡尘》改造项目决策

### 改造计划文档（2026-04-01更新）
- 文件位置：`/Users/jiamacmini/projets/xxmnq/《一介凡尘》改造计划.md`
- 总周期：17周，分4个Phase
- 核心模块优先级：cultivation.js > alchemy.js > space.js > reputation.js

### 项目当前状态（2026-04-02 更新）
- 中文化进度：98%（仅剩极少量edge case）
- 修炼事件：✅ 100%（15个事件完成）
- 天劫模块：90%
- 叙事设计：全部完成（7个文档）
- **宗门系统**：✅ 新增（方案C）
- **轮回叙事**：✅ 90%（传承选项逻辑就绪，UI界面待实现）

### 已集成模块清单
- **buff.js** - Buff图标栏系统 ✅
- **artifact.js** - 法宝装备系统 ✅
- **exploration.js** - 修仙地图探索 ✅
- **alchemy.js** - 丹方炼制 ✅
- **cultivation.js** - 境界系统核心框架 ✅
- **sect.js** - 宗门系统（方案C：建筑+境界解锁）✅ **新增**

### 版本决策记录（2026-03-26 → 2026-04-01更新）

#### 最终推荐：版本B（原创世界观）
- **评分**：92/100
- **开发周期**：约17周
- **核心特性**：
  - 完整六阶境界体系（凝气→开脉→铸基→凝元→归虚→渡劫）
  - 原创资源系统（灵晶/生铁矿/阴火石/焚晶砂/天外陨铁碎）
  - 40+原创随机事件
  - 3个新模块：cultivation.js / alchemy.js / reputation.js
- **优势**：
  - 在开发周期、世界观深度、市场潜力三维度最佳平衡
  - 原创世界观，零版权风险，可商业发布
  - 末法设定与ADR的资源匮乏机制完美契合
- **劣势**：
  - 需开发3个新模块，存在集成风险

#### 宗门系统方案C（2026-04-01实施）

**设计理念**：建筑树 + 境界自动解锁

**实现方式**：
- 宗门等级 = 玩家境界等级
- 建筑按境界解锁，而非独立升级
- 复用ADR全部建筑逻辑

**建筑映射表**：
| 原版建筑 | 修仙版 | 解锁境界 |
|---------|-------|---------|
| hut | 弟子居 | 凡境(Lv.0) |
| cart | 运灵车 | 凡境(Lv.0) |
| trap | 捕妖阵 | 凡境(Lv.0) |
| lodge | 灵兽阁 | 凝气境(Lv.1) |
| trading post | 藏宝阁 | 凝气境(Lv.1) |
| tannery | 制符殿 | 开脉境(Lv.2) |
| smokehouse | 丹房 | 铸基境(Lv.3) |
| workshop | 炼器殿 | 铸基境(Lv.3) |
| steelworks | 天工坊 | 凝元境(Lv.4) |
| armoury | 武库 | 凝元境(Lv.4) |
| ruins | 遗迹入口 | 归虚境(Lv.5) |

**宗门等级名称**：
- Lv.0 散修孤庐（凡境）
- Lv.1 散修营地（凝气境）
- Lv.2 小有所成（开脉境）
- Lv.3 一方修士（铸基境）
- Lv.4 修真门派（凝元境）
- Lv.5 仙道宗门（归虚境）
- Lv.6 飞升传承（渡劫境）

**宗门加成**：
- Lv.0: 基础产出
- Lv.1: +50%
- Lv.2: +100%
- Lv.3: +200%
- Lv.4: +300%
- Lv.5: +400%
- Lv.6: +500%

**技术实现**：
- 装饰器模式覆盖 `Room.craftUnlocked()` 和 `Room.buyUnlocked()`
- 监听境界变化自动更新宗门显示
- 建筑名称本地化通过覆盖显示逻辑实现
- **宗门UI完善（2026-04-01 16:17）**：
  - 宗门信息面板（等级、名称、境界、加成倍率）
  - 下一个解锁提示（显示下一境界可解锁的建筑）
  - 未解锁建筑红色锁定标签
  - 宗门面板渐变背景+金色边框样式

---

## 微信小程序移植项目（2026-04-01 新建）

**项目位置**：`/Users/jiamacmini/projets/yijiefanchen`

**项目结构**：
```
yijiefanchen/
├── app.js                    # 小程序入口
├── app.json                  # 页面配置
├── app.wxss                  # 全局样式
├── project.config.json       # 项目配置
├── sitemap.json              # SEO配置
├── store/
│   └── index.js             # 状态管理（替代$SM）
├── services/
│   ├── gameEngine.js        # 游戏引擎
│   ├── cultivation.js        # 境界系统
│   ├── sect.js              # 宗门系统
│   ├── alchemy.js           # 炼丹系统
│   └── exploration.js       # 探索系统
├── pages/
│   ├── index/               # 首页（资源/境界/采集）
│   ├── room/                # 宗门（建筑建造）
│   ├── cultivation/         # 修炼（境界详情）
│   ├── exploration/         # 探索（地图探索）
│   ├── alchemy/             # 炼丹（丹方/丹药）
│   └── sect/                # 宗门详情
└── assets/                  # 静态资源
```

**技术选型**：
- 纯微信小程序原生开发（不使用 Taro）
- 状态管理：自定义 Store 类
- 样式：CSS Variables 修仙风格
- 存储：wx.setStorageSync

**已实现模块**：
- ✅ audio.js - 音频服务（背景音乐+音效）
- ✅ AudioControl 组件 - 音量控制UI
- ✅ 首页音频集成（采集/突破音效）
- ✅ tabBar 图标（8个：home/alchemy/cultivate/explore 各2个状态）
- ✅ 音频文件（24个 MP3，flac 转换而来）
- ✅ 微信登录（login.js + button open-type="getUserInfo"）

**登录功能**：
- services/login.js - 登录服务（单例模式）
- 首页登录按钮（头像+昵称）
- 用户信息持久化（wx.setStorageSync）
- 登录状态订阅机制

**tabBar 配置**：
- 首页、炼丹、修炼、探索（4个tab）
- 图标：81×81 PNG，深色圆形背景+金色符号
- 图标生成脚本：assets/tab/generate_icons.py

**音频文件列表**：
```
assets/audio/
├── bgm.mp3              # 背景音乐
├── gather.mp3           # 采集
├── build.mp3            # 建造
├── craft.mp3            # 炼制
├── breakthrough.mp3     # 突破
├── combat-1/2/3.mp3    # 战斗
├── explore.mp3          # 探索
├── footsteps-1/2/3.mp3 # 脚步声
├── death.mp3            # 死亡
├── fire.mp3            # 火焰
├── tribulation-1/2.mp3 # 天劫
└── ...
```

**下一步**：
1. 微信支付集成（充值灵晶）
2. 真机测试音频播放
3. 用户数据云同步（可选）

---

*最后更新：2026-04-01 17:35*
