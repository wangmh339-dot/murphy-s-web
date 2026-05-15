/* 全站项目数据：你只需要改这里就能更新 Work 列表和项目详情 */
window.PROJECTS = [
  {
    id: "xiaohongshu-ops-01",
    title: "小红书内容运营 — 亚文化垂类账号案例",
    titleEn: "Xiaohongshu Content Operations — Subculture Vertical Account",
    year: "2024",
    category: "notes",
    tags: ["内容运营", "小红书", "亚文化", "IP联动", "本地化流量"],
    preview: "./assets/xhs-nana-new.jpg",
    cover: "./assets/xhs-nana-new.jpg",
    deck: "以美术生真实身份为支点，打造「街头涂鸦 × 海娜手绘」垂类内容账号，探索亚文化 IP 联动与本地化流量策略的有机结合。",
    details: "以「Murphy_W」账号运营实践，验证亚文化垂类内容在小红书平台的增长路径。通过「川大涂鸦打卡」与「成都海娜手绘」两条内容线，实现 217 粉丝积累 5,280 赞藏，单篇最高 713 点赞、1.2 万浏览。",
    stats: [
      { value: "5,280", label: "总赞藏" },
      { value: "713", label: "最高点赞" },
      { value: "1.2万", label: "最高浏览" },
      { value: "5篇", label: "爆款" }
    ],
    strategies: [
      {
        name: "内容线 A：川大涂鸦打卡",
        desc: "以四川大学江安校区白石桥洞下涂鸦墙为固定场景，将自身创作行为转化为可打卡的本地化内容。通过音乐 IP（Green Day）联动，放大内容共鸣与搜索流量。",
        tags: ["川大江安校区", "涂鸦", "IP联动", "打卡引导"],
        image: "./assets/xhs-greenday-new.jpg"
      },
      {
        name: "内容线 B：成都海娜手绘",
        desc: "以「成都海娜」作为品类标签，展示花胸手绘作品集合，兼顾时尚穿搭与刺青审美两类受众。高质量视觉封面驱动收藏转化，收藏率明显高于涂鸦系列，体现强参考价值属性。",
        tags: ["成都海娜", "tattoo", "视觉驱动", "高收藏率"],
        image: "./assets/xhs-henna-3.jpg"
      }
    ],
    cases: [
      {
        title: "成都海娜｜花胸",
        type: "TOP 1",
        image: "./assets/xhs-henna-1-new.jpg",
        metrics: { likes: "713", saves: "332", views: "1.2万" },
        original: "模特宝宝太米#海娜手绘 #tattoo #穿搭 #川大江安校区 #成都海娜",
        optimized: "用画笔替代针头，不留伤的刺青美学。这是我近期最喜欢的一组花胸——从蝴蝶骨延伸出去的线条，像是皮肤在生长。成都海娜预约 DM。",
        logic: "强视觉冲击封面 + 穿搭场景化呈现，封面即内容，直接触发收藏行为；1.2 万浏览中转化赞藏率极高（约 8.7%）。",
        highlight: "「成都海娜」作为地域品类标签精准锁定搜索流量；赞藏总比接近 1:0.47，收藏率说明内容具备强参考价值。"
      },
      {
        title: "我看川大江安的还有谁没去打卡 NANA",
        type: "TOP 2",
        image: "./assets/xhs-nana-new.jpg",
        metrics: { likes: "413", comments: "81", shares: "83" },
        original: "白石桥洞下面更新涂鸦了～被咬了亿个蚊子包换来的，喜欢的宝宝们去打卡，ps：创作不易，爱护涂鸦 #川大 #川大江安校区 #艺术创作 #涂鸦",
        optimized: "被蚊子咬了一晚上，换来白石桥洞的新涂鸦。NANA 的烟、她的眼神，在水泥墙上待着了。去打卡的宝子记得爱护它。",
        logic: "「还有谁没去打卡」句式制造群体感召，引发用户主动 @ 转发；IP NANA 本身自带垂直圈层粉丝基础，标题直接命中搜索词。",
        highlight: "评论量 82 显示高互动，评论区出现大量打卡询问；「被蚊子咬」细节制造真实感与创作人格，提升账号亲近度。"
      },
      {
        title: "或许你能在川大江安找到 Green Day",
        type: "TOP 3",
        image: "./assets/xhs-greenday-new.jpg",
        metrics: { likes: "389", comments: "82" },
        original: "#涂鸦墙 #川大江安校区 #涂鸦 心情烦闷的时候适合给自己半个小时来涂一涂",
        optimized: "心情烦的时候，来白石桥洞待半小时。颜料喷在墙上，Green Day 就在那里。摇滚不一定要很大声，有时候是两个人接吻的剪影，是黄色的晕光，是你举着喷漆的手。",
        logic: "Green Day 为经典摇滚 IP，命中校园乐队 / 复古摇滚受众；画面呈现创作过程（手持喷漆）增强代入感。",
        highlight: "「心情烦闷半小时」场景设定贴合大学生情绪痛点，引发共情；地点标记「四川大学江安校区」强化本地打卡属性。"
      },
      {
        title: "川大涂鸦 — Death Note L",
        type: "TOP 4",
        image: "./assets/xhs-deathnote-new.jpg",
        metrics: { likes: "297", comments: "43" },
        original: "\"正义是必胜的\"白石桥下涂鸦又更新了！下午画爽了！#川大江安校区 #涂鸦 #川大 死亡笔记",
        optimized: "「正义是必胜的。」——L 从不相信这句话，但他还是赢了。白石桥洞下新增：死亡笔记 L，锁链和眼神都在。去找他的记得拍好看一点。",
        logic: "Death Note 为超高 IP 知名度的经典动漫，L 角色粉丝基础广泛；引用台词「正义是必胜的」作为钩子文案，引发圈内共鸣与转发。",
        highlight: "评论量 43 显示 ACG 粉主动互动；帖子与 NANA 帖共同构成「川大 ACG 涂鸦系列」内容矩阵，形成账号辨识度。"
      },
      {
        title: "成都海娜 — Syber Sigilism",
        type: "TOP 5",
        image: "./assets/xhs-henna-2-new.jpg",
        metrics: { likes: "282", saves: "112" },
        original: "近期花胸集合#海娜 #tattoo #美术生的日常 #四川大学",
        optimized: "Syber Sigilism 是最近很迷的一种刺青风格——像电路板长出了荆棘，像咒语和代码混在了一起。用海娜临摹了一下，感觉还可以。成都有想体验的欢迎来找我。",
        logic: "Syber Sigilism 为小众新兴纹身风格，在小红书属于蓝海搜索词；英文标题封面具有高辨识度。",
        highlight: "收藏量/点赞量比率为本账号最高（39.7%），证明内容具备强「参考型」属性；精准覆盖小众审美圈层，粉丝质量高。"
      }
    ],
    insights: [
      { num: "01", title: "地域标签锁流量", text: "以「川大江安校区」作为内容的地理锚点，绑定本地化搜索流量，降低冷启动难度，同时塑造具体可感的内容场景。" },
      { num: "02", title: "IP 联动借势", text: "选择 NANA、Death Note、Green Day 等圈层认知度高的 IP 作为创作主题，直接借用 IP 存量粉丝的搜索与转发行为放大传播。" },
      { num: "03", title: "身份即内容", text: "「美术生」「被蚊子咬」「下午画爽了」等细节真实呈现创作者身份，建立高亲近度人设，评论区互动质量明显优于纯展示型内容。" },
      { num: "04", title: "双线内容互补", text: "涂鸦系列以评论 / 转发驱动互动（最高 82 评论），海娜系列以收藏驱动留存（最高 332 收藏），两条线覆盖不同用户行为模式。" },
      { num: "05", title: "封面即文案", text: "高赞帖封面均具备强视觉辨识度（涂鸦人物 / 花胸特写），减少用户认知成本，封面信息密度与点击欲望成正比。" },
      { num: "06", title: "蓝海标签策略", text: "「Syber Sigilism」等小众风格关键词竞争度低但精准，以收藏率 39.7% 验证：找到细分圈层比追热点更易形成稳定互动。" }
    ],
    reflection: {
      good: [
        "成功验证亚文化垂类内容在小红书的可行性",
        "通过 IP 联动实现冷启动，无需付费推广",
        "双线策略覆盖不同用户行为，数据表现均衡"
      ],
      improve: [
        "更新频率不稳定，影响账号权重",
        "未建立固定的评论区互动机制",
        "缺乏商业变现路径的设计"
      ],
      next: [
        "建立内容日历，保持稳定更新节奏",
        "尝试直播创作过程，增强粉丝粘性",
        "探索海娜手绘的预约变现模式"
      ]
    },
    conversion: {
      steps: [
        {
          icon: "📱",
          title: "线上内容曝光",
          desc: "通过小红书涂鸦与海娜内容积累本地关注度，帖子搜索流量持续带来新用户"
        },
        {
          icon: "📍",
          title: "本地引流转化",
          desc: "「川大江安校区」「成都海娜」等地域标签精准锁定成都本地用户，私信咨询量显著增长"
        },
        {
          icon: "🎪",
          title: "NEED! 市集出摊",
          desc: "受邀参加知名市集品牌 NEED! 的线下活动，将线上流量转化为线下体验与即时收入"
        },
        {
          icon: "💰",
          title: "预约订单转化",
          desc: "市集曝光 + 小红书内容形成闭环，大量用户通过私信预约海娜手绘服务，实现持续变现"
        }
      ],
      images: [
        "./assets/need-markets-1.jpg",
        "./assets/need-markets-2.jpg"
      ],
      note: "<strong>核心洞察：</strong>亚文化垂类内容不仅是「内容资产」，更是「商业入口」。通过线上内容建立专业认知 → 本地标签锁定精准人群 → 线下市集完成信任转化 → 预约订单实现持续变现，形成完整的 O2O 闭环。"
    },
    link: ""
  },
  {
    id: "design-system-01",
    title: "Design Portfolio — Visual System",
    year: "2026",
    category: "design",
    tags: ["设计", "视觉", "品牌"],
    preview: "./assets/project-placeholder.svg",
    deck: "以高级感与克制的排版为核心，建立个人作品集的视觉系统与交互节奏。",
    details:
      "你可以把这里写成更完整的项目说明：背景、目标、过程、产出、反思。后续也可以在 project.html 里扩展图文模块。",
    link: ""
  },
  {
    id: "photo-essay-01",
    title: "Photo Essay — City Light",
    year: "2025",
    category: "visual",
    tags: ["摄影", "叙事"],
    preview: "./assets/project-placeholder.svg",
    deck: "城市夜景摄影与短篇文字结合的叙事实验。",
    details: "建议补充：拍摄主题、器材、后期风格与选择逻辑。",
    link: ""
  },
  {
    id: "content-ops-01",
    title: "Content Ops Case — Growth Campaign",
    year: "2025",
    category: "lab",
    tags: ["内容运营", "增长", "策略"],
    preview: "./assets/project-placeholder.svg",
    deck: "围绕目标人群与内容矩阵搭建的活动案例复盘。",
    details: "建议补充：目标/数据指标、内容矩阵、节奏、结果与复盘。",
    link: ""
  },
  {
    id: "intern-reflection-01",
    title: "Internship Notes — Lessons & Thinking",
    year: "2024",
    category: "notes",
    tags: ["实习思考", "复盘"],
    preview: "./assets/project-placeholder.svg",
    deck: "关于协作、节奏、产出标准与沟通方式的阶段性反思。",
    details: "建议补充：具体场景、做法、影响、下一次会怎么做。",
    link: ""
  },
  {
    id: "product-proto-01",
    title: "Product Prototype — Doc & Insights",
    year: "2024",
    category: "product",
    tags: ["产品原型", "文档", "用户体验"],
    preview: "./assets/project-placeholder.svg",
    deck: "围绕问题定义、信息架构与原型迭代的文档总结。",
    details: "建议补充：问题、假设、用户研究、原型迭代、关键决策。",
    link: ""
  },
  {
    id: "painting-01",
    title: "Paintings — Study Series",
    year: "2023",
    category: "visual",
    tags: ["绘画", "练习"],
    preview: "./assets/project-placeholder.svg",
    deck: "以色彩与形体训练为主的作品合集。",
    details: "建议补充：材料、尺寸、时间跨度与个人风格探索。",
    link: ""
  }
];
