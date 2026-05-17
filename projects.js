window.PROJECTS = [
  {
    id: "xiaohongshu-ops-01",
    title: "小红书内容运营 — 亚文化垂类账号案例",
    titleEn: "Xiaohongshu Content Operations — Subculture Vertical Account",
    year: "2024",
    category: "notes",
    tags: ["内容运营", "小红书", "亚文化", "增长"],
    preview: "./assets/xhs-henna-1-new.jpg",
    cover: "./assets/xhs-henna-1-new.jpg",
    deck: "以美术生真实身份为支点，打造「街头涂鸦 × 海娜手绘」垂类内容账号，探索亚文化 IP 联动与本地化流量策略的有机结合。",
    details: "建议补充：账号定位、内容线、数据表现与复盘。",
    stats: [
      { value: "1.2万", label: "最高单帖浏览" },
      { value: "332", label: "最高收藏" },
      { value: "82", label: "最高评论" },
      { value: "39.7%", label: "收藏率峰值" }
    ],
    strategies: [
      {
        name: "内容线 A：川大涂鸦打卡",
        desc: "以四川大学江安校区白石桥洞下涂鸦墙为固定场景，将自身创作行为转化为可打卡的本地化内容。通过音乐 IP（Green Day）联动，放大内容共鸣与搜索流量。",
        tags: ["本地化", "IP 联动", "场景化"],
        image: "./assets/xhs-greenday-new.jpg"
      },
      {
        name: "内容线 B：成都海娜手绘",
        desc: "以「成都海娜」作为品类标签，展示花胸手绘作品集合，兼顾时尚穿搭与刺青审美两类受众。高质量视觉封面驱动收藏转化，收藏率明显高于涂鸦系列，体现强参考价值属性。",
        tags: ["视觉驱动", "品类标签", "收藏转化"],
        image: "./assets/xhs-henna-2-new.jpg"
      }
    ],
    cases: [
      {
        title: "成都海娜｜花胸",
        type: "爆款",
        image: "./assets/xhs-henna-1-new.jpg",
        metrics: { likes: "310", saves: "332", views: "1.2万" },
        original: "强视觉冲击封面 + 穿搭场景化呈现",
        optimized: "封面即内容，直接触发收藏行为；1.2 万浏览中转化赞藏率极高（约 8.7%）",
        logic: "「成都海娜」作为地域品类标签精准锁定搜索流量；赞藏总比接近 1:0.47，收藏率说明内容具备强参考价值。",
        highlight: "「封面即内容」的视觉策略直接驱动收藏行为。"
      },
      {
        title: "我看川大江安的还有谁没去打卡 NANA",
        type: "爆款",
        image: "./assets/xhs-nana-new.jpg",
        metrics: { likes: "196", comments: "82", views: "1.1万" },
        original: "「还有谁没去打卡」句式制造群体感召",
        optimized: "引发用户主动 @ 转发；IP NANA 本身自带垂直圈层粉丝基础，标题直接命中搜索词",
        logic: "评论量 82 显示高互动，评论区出现大量打卡询问；「被蚊子咬」细节制造真实感与创作人格，提升账号亲近度。",
        highlight: "群体感召句式 + 真实细节 = 高互动率。"
      },
      {
        title: "或许你能在川大江安找到 Green Day",
        type: "爆款",
        image: "./assets/xhs-greenday-new.jpg",
        metrics: { likes: "148", views: "1万" },
        original: "Green Day 为经典摇滚 IP，命中校园乐队 / 复古摇滚受众",
        optimized: "画面呈现创作过程（手持喷漆）增强代入感；「心情烦闷半小时」场景设定贴合大学生情绪痛点，引发共情",
        logic: "地点标记「四川大学江安校区」强化本地打卡属性；音乐 IP 联动带来圈层精准流量。",
        highlight: "IP 联动 + 情绪共鸣 + 本地属性 = 精准流量。"
      },
      {
        title: "川大涂鸦 — Death Note L",
        type: "爆款",
        image: "./assets/xhs-deathnote-new.jpg",
        metrics: { likes: "131", comments: "43" },
        original: "Death Note 为超高 IP 知名度的经典动漫，L 角色粉丝基础广泛",
        optimized: "引用台词「正义是必胜的」作为钩子文案，引发圈内共鸣与转发",
        logic: "评论量 43 显示 ACG 粉主动互动；帖子与 NANA 帖共同构成「川大 ACG 涂鸦系列」内容矩阵，形成账号辨识度。",
        highlight: "IP 矩阵化内容 + 圈层梗文案 = 高互动。"
      },
      {
        title: "成都海娜 — Syber Sigilism",
        type: "蓝海",
        image: "./assets/xhs-henna-3.jpg",
        metrics: { likes: "47", saves: "48", views: "3,000" },
        original: "Syber Sigilism 为小众新兴纹身风格，在小红书属于蓝海搜索词",
        optimized: "英文标题封面具有高辨识度；收藏量/点赞量比率为本账号最高（39.7%），证明内容具备强「参考型」属性",
        logic: "精准覆盖小众审美圈层，粉丝质量高；蓝海标签策略避开红海竞争，建立差异化内容壁垒。",
        highlight: "蓝海标签 + 高收藏率 = 精准高质量粉丝。"
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
        { icon: "📱", title: "线上内容曝光", desc: "通过小红书涂鸦与海娜内容积累本地关注度，帖子搜索流量持续带来新用户" },
        { icon: "📍", title: "本地引流转化", desc: "「川大江安校区」「成都海娜」等地域标签精准锁定成都本地用户，私信咨询量显著增长" },
        { icon: "🎪", title: "NEED! 市集出摊", desc: "受邀参加知名市集品牌 NEED! 的线下活动，将线上流量转化为线下体验与即时收入" },
        { icon: "💰", title: "预约订单转化", desc: "市集曝光 + 小红书内容形成闭环，大量用户通过私信预约海娜手绘服务，实现持续变现" }
      ],
      images: ["./assets/need-markets-1.jpg", "./assets/need-markets-2.jpg"],
      note: "<strong>核心洞察：</strong>亚文化垂类内容天然具备高粘性，通过「内容 → 社群 → 线下 → 变现」的闭环，可以实现从兴趣到收入的完整转化路径。"
    },
    link: "https://www.xiaohongshu.com/user/profile/5f5f5f5f5f5f5f5f5f5f5f5f"
  },
  {
    id: "space-design-01",
    title: "空间设计 — 春熙家树工作室",
    year: "2024",
    category: "design",
    tags: ["空间设计", "商业空间", "住宅"],
    preview: "./assets/project-placeholder.svg",
    deck: "参与商业空间与住宅项目的全流程设计支持。",
    details: "建议补充：项目类型、设计流程、软件工具、成果展示。",
    link: ""
  },
  {
    id: "lab-vibecoding-01",
    title: "Vibe Coding — 个人网站产品化实践",
    titleEn: "Vibe Coding — Personal Website Productization",
    year: "2025",
    category: "lab",
    template: "experiment",
    tags: ["AI Coding", "产品探索", "信息架构", "React", "Vite"],
    preview: "./assets/project-placeholder.svg",
    cover: "./assets/project-placeholder.svg",
    deck: "将个人网站作为 AI 协作式产品实验，探索信息架构、内容系统与 AI 在个人创作中的角色。",
    details: "这个项目最开始只是想搭建一个个人网站。但在真正开始之后，我逐渐意识到：我想做的并不只是一个「作品展示页」。我开始把它当作一次 AI 协作式产品实验——用来探索信息架构、内容系统与 AI 在个人创作中真正扮演的角色。",
    experiment: {
      background: "最开始只是想搭建一个个人网站。但在真正开始之后，我逐渐意识到：我想做的并不只是一个「作品展示页」。",
      motivation: "我开始把它当作一次 <strong>AI 协作式产品实验</strong>——用来探索信息架构、内容系统与 AI 在个人创作中真正扮演的角色。"
    },
    problems: [
      {
        num: "I",
        title: "信息表达割裂",
        desc: "简历、作品集、GitHub、内容平台各自独立——很难完整呈现一个人真实的思考方式。"
      },
      {
        num: "II",
        title: "内容维护成本高",
        desc: "每次新增一个项目，都需要分别修改多个页面、更新不同文档、重新整理内容结构。"
      },
      {
        num: "III",
        title: "缺少产品感",
        desc: "很多个人网站更像「作品堆叠」，而不是有结构、有逻辑、有体验的产品。"
      }
    ],
    goal: {
      desc: "相比单纯展示结果，我更希望呈现项目背景、思考过程、用户视角与迭代逻辑——让网站成为一个持续成长中的个人系统。",
      items: [
        { title: "建立可持续维护的内容系统", desc: "通过组件化架构和清晰的信息层级，降低内容更新成本" },
        { title: "探索 AI 协作工作流", desc: "找到人与 AI 在产品构建中的最佳协作方式" },
        { title: "培养产品化思维", desc: "从「作品展示」转向「产品体验」的思考方式" }
      ]
    },
    structure: {
      desc: "相比传统 Portfolio 结构（Works / About / Contact），这套分类的出发点是：<strong>网站应该像一个持续成长中的个人系统，而不是静态作品展示页。</strong>",
      columns: [
        { name: "Product", desc: "产品思考与社区研究" },
        { name: "Design", desc: "专业设计与空间项目" },
        { name: "Visual", desc: "内容创作与视觉表达" },
        { name: "Notes", desc: "旅行观察与长期记录" },
        { name: "Lab", desc: "AI / Vibe Coding 实验" }
      ]
    },
    workflow: [
      {
        phase: "01",
        title: "信息架构",
        subtitle: "Architecture",
        desc: "先通过自然语言梳理页面目标、内容层级、用户浏览路径与网站气质方向，再逐步拆解页面结构。",
        tags: ["页面目标", "内容层级", "用户路径", "气质定义"]
      },
      {
        phase: "02",
        title: "AI 协作",
        subtitle: "Collaboration",
        desc: "使用 AI 辅助完成页面结构生成、React 组件拆分、样式调整、内容优化与 Bug 排查。",
        tags: ["结构生成", "组件拆分", "样式调整", "文案润色"]
      },
      {
        phase: "03",
        title: "人工迭代",
        subtitle: "Iteration",
        desc: "持续调整页面留白、视觉层级、内容节奏、导航逻辑与情绪氛围——人的判断决定产品气质。",
        tags: ["审美判断", "页面节奏", "内容取舍", "情绪氛围"]
      }
    ],
    mindset: {
      before: [
        "页面完整、视觉统一",
        "内容放全、样式无误",
        "技术实现优先"
      ],
      after: [
        "用户第一眼注意什么？",
        "信息层级清晰吗？",
        "什么内容优先？",
        "浏览是否自然？",
        "情绪氛围如何建立？"
      ],
      conclusion: "我开始真正从「产品」的角度重新理解网站。每一个信息架构的决定、每一次内容取舍、每一处留白调整，都有人会感受到。"
    },
    outcomes: [
      { value: "5", label: "核心栏目" },
      { value: "∞", label: "持续迭代" },
      { value: "100%", label: "AI 协作" },
      { value: "1", label: "产品系统" }
    ],
    outcomeDetails: {
      cards: [
        {
          title: "做得好的",
          items: [
            "成功建立可持续维护的内容系统",
            "通过 AI 协作大幅提升开发效率",
            "从作品展示转向产品思维的实践"
          ]
        },
        {
          title: "可以改进的",
          items: [
            "需要更系统的 Prompt 工程方法沉淀",
            "部分视觉细节仍需人工精细调整",
            "内容更新频率可以更加稳定"
          ]
        },
        {
          title: "下一步",
          items: [
            "补充 AI 产品项目的完整案例文档",
            "将 Vibe Coding Prompt 方法系统化整理",
            "探索 Astro 框架重构以支持更好的内容管理"
          ]
        }
      ]
    },
    reflection: {
      quote: "AI 正在改变个人创作者与产品构建之间的关系。但 AI 可以提高效率，无法替代人的判断与审美。",
      body: "过去：<strong>想法 → 开发 → 上线</strong>，周期很长，门槛很高。<br>而现在：<strong>想法 → Prompt → 实验 → 迭代</strong>，已经可以快速完成。<br><br>但与此同时，我也越来越意识到——<strong>真正决定产品气质的，仍然是人的判断</strong>。"
    },
    nextSteps: [
      { title: "案例文档", desc: "补充 AI 产品项目的完整案例文档" },
      { title: "方法沉淀", desc: "将 Vibe Coding Prompt 方法系统化整理" },
      { title: "框架重构", desc: "探索 Astro 框架重构以支持更好的内容管理" }
    ],
    link: "https://wangmh339-dot.github.io/murphy-s-web/"
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
    id: "photography-01",
    title: "Photography — Visual Collection",
    titleEn: "Photography — Visual Collection",
    year: "2023-2024",
    category: "visual",
    tags: ["摄影", "城市风光", "人文纪实", "风格摄影"],
    preview: "./assets/photography/city/1.jpg",
    cover: "./assets/photography/city/1.jpg",
    deck: "个人摄影作品集，包含城市风光、风格摄影与人文纪实三个系列。",
    details: "通过镜头捕捉城市脉搏、视觉美学与人文故事。",
    link: "./visual.html",
    sections: [
      {
        name: "城市风光",
        nameEn: "Cityscape",
        desc: "3D卡片堆叠展示，带留白与深度感",
        count: 8,
        preview: "./assets/photography/city/1.jpg"
      },
      {
        name: "风格摄影",
        nameEn: "Style",
        desc: "全屏水平无限滚动",
        count: 4,
        preview: "./assets/photography/style/1.jpg"
      },
      {
        name: "人文纪实",
        nameEn: "Documentary",
        desc: "全屏水平无限滚动",
        count: 3,
        preview: "./assets/photography/documentary/1.jpg"
      }
    ]
  }
];
