<div align="center">

# 🌱 小芽成长 · Grow Up

**面向 3–6 岁的每日亲子成长计划**  
*Daily play plans aligned with China’s《3-6岁儿童学习与发展指南》*

[![Live](https://img.shields.io/badge/Live-GitHub%20Pages-FF2D95?style=for-the-badge&logo=github&logoColor=white)](https://laihaibo.github.io/grow-up/)
[![Next.js](https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![pnpm](https://img.shields.io/badge/pnpm-CB3837?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io)
[![License](https://img.shields.io/badge/License-MIT-A78BFA?style=for-the-badge)](LICENSE)

[在线体验](https://laihaibo.github.io/grow-up/) · [功能](#-核心能力) · [快速开始](#-快速开始) · [架构](#-架构) · [贡献](#-贡献)

</div>

---

## 为什么是 Grow Up？

学龄前成长不是刷题，也不是「别人家孩子」清单。  
**Grow Up** 把《3-6岁儿童学习与发展指南》的五大领域，翻译成家长**今晚就能跟练**的活动：

- 工作日约 **90 分钟** · 周末约 **300 分钟** 的可执行日计划  
- 汉字 / 英语 / 数学 / 逻辑**有露出**，但不压过健康、社会与艺术  
- 每天 **自选角**——孩子决定玩什么；内容**不设性别刻板印象**  
- 内置 **勇敢表达** 跟练（说「停」→ 走开 → 告诉老师/家长）  
- **家长话术级** 跟练卡片：准备、跟练步骤、观察点、不想做时的降级  
- 睡前 **AI 互动故事提示词**（黑猫警长 / 警察梦），可复制到豆包、元宝、千问  
- 打卡数据 **JSON 导入导出**，只存在本机，不上传云端  

> 粉色是界面偏好，不是内容边界。运动、搭建、实验、当队长，和认字一样重要。

---

## 核心能力

| 模块 | 说明 |
|------|------|
| **今日跟练** | 按日期生成当日计划；卡片可折叠；话术可照读 |
| **时间花环** | 五大领域分钟数可视化，一眼看清今天的节奏 |
| **领域指南** | 对照《指南》3–4 / 4–4.5 岁要点 + 成长原则 |
| **睡前故事** | 8 套可复制提示词：长互动、勇敢表达、逻辑推理、晚安点名 |
| **成长足迹** | 本机打卡统计、领域覆盖、JSON 备份/恢复 |
| **活动库** | **97+** 条不重复活动，按日期种子动态组合，非固定课表 |

**五大领域**：健康 · 语言 · 社会 · 科学 · 艺术  
**本期认知重点**（融入而非独占）：汉字 · 英语 · 数学 · 逻辑思维  

---

## 截图 / 预览

| 今日跟练 | 睡前故事 | 成长足迹 |
|:---:|:---:|:---:|
| 移动端 Liquid Glass 粉卡 | 可复制 AI 提示词 | 打卡 + JSON 导出 |

打开仓库根目录 [`index.html`](./index.html) 可在手机模拟器中完整体验，无需构建。

---

## 快速开始

### 环境

- Node.js ≥ 20  
- [pnpm](https://pnpm.io) ≥ 9  

### 本地开发

```bash
git clone git@github.com:laihaibo/grow-up.git
cd grow-up
pnpm install
pnpm dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

### 静态构建

```bash
# 本地预览（无 basePath）
BASE_PATH= pnpm build

# GitHub Pages（项目站）
BASE_PATH=/grow-up pnpm build
# 产物在 out/
```

### 一键体验（无 Node）

用手机或桌面浏览器直接打开项目根目录的 **`index.html`**（自包含单页应用）。

---

## 架构

```
grow-up/
├── app/                    # Next.js App Router
│   ├── page.tsx            # 今日跟练
│   ├── domains/            # 五大领域 +《指南》
│   ├── stories/            # 睡前故事提示词
│   ├── week/               # 本周节律
│   ├── progress/           # 打卡与 JSON 备份
│   └── icon.svg            # 应用图标
├── lib/
│   ├── activities.ts       # 活动库（含合并逻辑）
│   ├── activities-extra.ts # 扩充题库
│   ├── coach.ts            # 家长跟练话术
│   ├── plan.ts             # 日计划生成（日期种子）
│   ├── stories.ts          # AI 故事提示词
│   └── storage.ts          # localStorage 进度
├── public/favicon.svg      # 站点图标
├── index.html              # 手机模拟器单页版
├── .github/workflows/      # Pages 自动部署
└── next.config.mjs         # output: 'export' + basePath
```

### 设计原则

1. **指南落地**：活动可追溯到五大领域目标，而不是凭空「鸡娃」。  
2. **日期种子**：同一天计划稳定可复现，不同天组合不同，避免「固定 N 天课表」僵化。  
3. **跟练优先**：卡片给家长可执行话术，而不是抽象建议。  
4. **数据主权**：进度只写本机 `localStorage`，导出/导入由用户控制。  
5. **性别开放**：自选角 + 开放活动库，避免用内容框住孩子。  

---

## 部署

推送到 `main` 后，GitHub Actions 自动构建并发布到 GitHub Pages。

1. 仓库 **Settings → Pages → Build and deployment**  
2. **Source** 选择 **GitHub Actions**  
3. 合并或 push 后访问：  

**https://laihaibo.github.io/grow-up/**

工作流见 [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)（pnpm 版本仅在 Action 中指定，`package.json` 不写 `packageManager`，避免冲突）。

---

## 配置要点

| 配置 | 说明 |
|------|------|
| `BASE_PATH` | Pages 项目站为 `/grow-up`；本地开发可为空 |
| `output: 'export'` | 纯静态导出，适配 GitHub Pages |
| `trailingSlash: true` | 目录式路由，避免 Pages 404 |
| `public/.nojekyll` | 防止 Jekyll 忽略 `_next` 资源 |

---

## 数据备份（JSON）

「成长」页支持：

- **导出 JSON** — `grow-up-progress-YYYYMMDD.json`  
- **导入 JSON** — 按日期合并，换设备不丢打卡  

结构示例：

```json
{
  "app": "grow-up",
  "version": 1,
  "exportedAt": "2026-09-18T10:00:00.000Z",
  "progress": {
    "2026-09-18": ["brave-stop", "hz-shape-cards"]
  }
}
```

---

## 活动与跟练

- 活动库 **97+** 条，覆盖汉字、英语、数学、逻辑、勇敢表达、开放挑战与周末加长项。  
- 每条重点活动含：**准备 → 跟练话术 → 观察点 → 不想做时 →（可选）加分挑战**。  
- 无手写脚本的活动会根据**该活动的真实步骤**生成具体跟练，而不是空泛套话。  

扩展活动：编辑 `lib/activities-extra.ts`；扩展话术：编辑 `lib/coach.ts`。

---

## 技术栈

- **框架**：Next.js 15 · React 19 · TypeScript  
- **包管理**：pnpm  
- **样式**：自研 Liquid Glass（粉系）· 无 UI 框架依赖  
- **数据**：localStorage · 确定性日计划算法  
- **交付**：静态导出 · GitHub Actions · GitHub Pages  
- **预览**：根目录 `index.html` 单文件应用  

---

## 路线图

- [ ] 活动库扩至 150+ 与「周不重复」排期  
- [ ] 自定义活动与家庭偏好（重点领域权重）  
- [ ] 一周计划导出 PDF / 打印版  
- [ ] 多子女档案  
- [ ] PWA 离线缓存  
- [ ] 英文文档与 i18n  

欢迎在 [Issues](https://github.com/laihaibo/grow-up/issues) 提需求。

---

## 贡献

欢迎 PR 与 Issue。

```bash
pnpm install
pnpm dev
# 修改后
pnpm build
```

贡献建议：

1. 新活动请附：领域、时长、材料、跟练话术（尽量可照读）。  
2. 避免性别刻板与超前刷题导向。  
3. 文案面向**家长可执行**，不是论文摘要。  
4. UI 改动请保持移动端优先与粉系 Liquid Glass。  

---

## 免责声明

本项目为**亲子活动辅助工具**，不能替代专业教育、医疗或心理建议。  
若孩子持续遇到社交困难或情绪问题，请寻求园所老师或专业人员帮助。

活动灵感来源于公开的《3-6岁儿童学习与发展指南》框架，内容为项目自撰，非官方出版物。

---

## License

[MIT](./LICENSE) © [laihaibo](https://github.com/laihaibo)

---

<div align="center">

**如果 Grow Up 对你的家庭有用，欢迎 Star ⭐ 支持**

*用一晚跟练，换孩子多一分表达与勇气。*

</div>
