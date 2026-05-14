# Murphy 梦晖 — 个人作品集（纯 HTML/CSS/JS）

> 说明：你提到“首页/Work 要和参考站一模一样”。我做的是**原创实现**，在结构与交互节奏上“高度接近/借鉴”，但不会逐像素复制对方的具体设计与代码（避免侵权与同质化）。你可以继续给我截图/更明确的细节，我再把版式与动效进一步调到你想要的感觉。

## 1) 本地预览

在这个文件所在目录启动一个静态服务器即可。

**方式 A（推荐）：Python**
```bash
python3 -m http.server 8000
```
然后访问：`http://localhost:8000`

**方式 B：VS Code**
- 安装扩展：Live Server
- 右键 `index.html` → “Open with Live Server”

## 2) 你最常改的地方（项目内容）

打开 `projects.js`，修改 `window.PROJECTS = [...]` 里的条目：
- `title` 标题
- `deck` 一句话概述
- `details` 项目详情（目前是文字占位）
- `year / category / tags`
- `link`（可选）外链地址

分类 `category` 建议使用这些（会自动生成筛选按钮）：
- `design` 设计
- `photography` 摄影
- `content` 内容运营
- `reflection` 实习思考
- `product` 产品原型
- `painting` 绘画

## 2.5) 替换你的个人照片（首页 About 区块）

目前首页用的是占位图：`assets/profile-placeholder.svg`。

你可以用任意照片替换：
- 方式 A：把你的照片放到 `assets/profile.jpg`，然后把 `index.html` 里的头像 `src` 改成 `./assets/profile.jpg`
- 方式 B：直接把 `index.html` 里 `src="./assets/profile-placeholder.svg"` 改成你想用的图片路径

建议照片比例：竖图（接近 4:5 或 3:4），清晰度 1200px 以上更好。

## 2.6) 简历（Resume）

导航栏的 Resume 指向 `resume.html`。你只需要把简历 PDF 放到：
- `assets/resume.pdf`

即可在 `resume.html` 里直接打开下载。

## 3) 页面结构

- `index.html`：首页（feed 流：名字滚动触发动效 → Work 分类入口 → 精选图集 → Information）
- `work.html`：Work 列表（分类筛选 + 大字列表）
- `project.html`：项目详情（由 `?id=xxx` 决定展示哪个项目）
- `info.html`：Information

## 4) 下一步我建议你补充（越具体越好）

1. 你的**邮箱/社媒链接**（我帮你替换掉占位）
2. 每个大类下你准备放几个项目（先写标题也行）
3. 如果你能给我 2-3 张“你觉得非常对味”的参考截图（尤其是 hover/动效），我可以把交互细节做得更贴近你想要的效果。
