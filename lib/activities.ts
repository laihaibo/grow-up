export type Domain = 'health' | 'language' | 'social' | 'science' | 'art'

export type FocusTag =
  | 'hanzi'
  | 'english'
  | 'math'
  | 'logic'
  | 'motor'
  | 'listen'
  | 'speak'
  | 'read'
  | 'social'
  | 'life'
  | 'nature'
  | 'music'
  | 'draw'
  | 'craft'

export type Activity = {
  id: string
  title: string
  domain: Domain
  focus: FocusTag[]
  minutes: number
  materials?: string
  steps: string[]
  guide?: string
  tip?: string
  weekendBoost?: boolean
}

export const DOMAIN_META: Record<
  Domain,
  { name: string; color: string; soft: string; emoji: string; guideLine: string }
> = {
  health: {
    name: '健康',
    color: '#5CD6A0',
    soft: 'rgba(92,214,160,0.22)',
    emoji: '🌿',
    guideLine: '身心状况 · 动作发展 · 生活习惯',
  },
  language: {
    name: '语言',
    color: '#FFB07C',
    soft: 'rgba(255,176,124,0.22)',
    emoji: '🗣️',
    guideLine: '倾听与表达 · 阅读与书写准备',
  },
  social: {
    name: '社会',
    color: '#FF6B9D',
    soft: 'rgba(255,107,157,0.22)',
    emoji: '💞',
    guideLine: '人际交往 · 社会适应',
  },
  science: {
    name: '科学',
    color: '#A78BFA',
    soft: 'rgba(167,139,250,0.22)',
    emoji: '🔬',
    guideLine: '科学探究 · 数学认知',
  },
  art: {
    name: '艺术',
    color: '#F472B6',
    soft: 'rgba(244,114,182,0.22)',
    emoji: '🎨',
    guideLine: '感受与欣赏 · 表现与创造',
  },
}

export const FOCUS_META: Record<FocusTag, { name: string; short: string }> = {
  hanzi: { name: '汉字启蒙', short: '汉字' },
  english: { name: '英语启蒙', short: '英语' },
  math: { name: '数学认知', short: '数学' },
  logic: { name: '逻辑思维', short: '逻辑' },
  motor: { name: '动作发展', short: '运动' },
  listen: { name: '倾听理解', short: '倾听' },
  speak: { name: '口语表达', short: '表达' },
  read: { name: '早期阅读', short: '阅读' },
  social: { name: '社会交往', short: '社交' },
  life: { name: '生活能力', short: '生活' },
  nature: { name: '自然探究', short: '自然' },
  music: { name: '音乐感知', short: '音乐' },
  draw: { name: '绘画表现', short: '绘画' },
  craft: { name: '手工创造', short: '手工' },
}

export const PRIORITY_FOCUS: FocusTag[] = ['hanzi', 'english', 'math', 'logic']

/** BIRTHDAY: 2026-10-18 — child turns 4 */
export const BIRTHDAY = new Date(2026, 9, 18)

export function ageInfo(now = new Date()) {
  const ms = BIRTHDAY.getTime() - now.getTime()
  const daysToFour = Math.max(0, Math.ceil(ms / 86400000))
  const turnedFour = ms <= 0
  // months since birth assuming birthday is 4th on 2026-10-18 → born 2022-10-18
  const born = new Date(2022, 9, 18)
  const months =
    (now.getFullYear() - born.getFullYear()) * 12 + (now.getMonth() - born.getMonth()) - (now.getDate() < born.getDate() ? 1 : 0)
  return { months: Math.max(0, months), daysToFour, turnedFour, displayAge: turnedFour ? '4 岁' : `${Math.floor(months / 12)} 岁 ${months % 12} 个月` }
}

export function isWeekend(d = new Date()) {
  const day = d.getDay()
  return day === 0 || day === 6
}

export function minutesBudget(d = new Date()) {
  return isWeekend(d) ? 300 : 90
}

const activities: Activity[] = [
  // ——— 语言 · 汉字 ———
  {
    id: 'hz-shape-cards',
    title: '象形字配对卡',
    domain: 'language',
    focus: ['hanzi', 'logic'],
    minutes: 15,
    materials: '字卡或自制图卡（日、月、山、水、火、人）',
    steps: [
      '把图片和汉字打乱放在桌面上',
      '先指认图片：“这是什么？”',
      '一起找对应的汉字，边找边念',
      '玩“字宝宝回家”：把字盖在图上',
    ],
    guide: '喜欢听故事、对文字符号感兴趣',
    tip: '每次 4–6 个字就够，认错很正常，多玩几轮。',
  },
  {
    id: 'hz-scan-hunt',
    title: '汉字寻宝',
    domain: 'language',
    focus: ['hanzi'],
    minutes: 12,
    materials: '家中带字的物品（包装、绘本封面）',
    steps: [
      '给孩子一个小篮子或贴纸当“宝藏印章”',
      '约定今天要找的字，如“大”“小”“人”',
      '在家中走动，找到就贴纸或模仿字形',
      '结束时把找到的字念一遍',
    ],
    tip: '超市包装、零食袋都是好素材，生活里认字最牢。',
  },
  {
    id: 'hz-stroke-air',
    title: '空中写字',
    domain: 'language',
    focus: ['hanzi', 'motor'],
    minutes: 10,
    steps: [
      '伸出食指当“魔法笔”',
      '妈妈说一个简单字，一起空中写',
      '边写边说笔画：横、竖、撇、捺',
      '可写在对方手心上互猜',
    ],
    guide: '愿意涂涂画画，感受笔画方向',
  },
  {
    id: 'hz-rhyme-book',
    title: '儿歌绘本指读',
    domain: 'language',
    focus: ['hanzi', 'read', 'listen'],
    minutes: 15,
    materials: '一首短儿歌绘本或打印稿',
    steps: [
      '妈妈有感情地读一遍',
      '第二遍用手指逐字慢指',
      '邀请孩子接最后一个词',
      '一起拍手读到会背一两句',
    ],
    tip: '重复是金，同一本周读 3 天比天天换书更有效。',
  },

  // ——— 语言 · 英语 ———
  {
    id: 'en-color-flash',
    title: '颜色闪卡小剧场',
    domain: 'language',
    focus: ['english'],
    minutes: 12,
    materials: '红黄蓝绿卡片或积木',
    steps: [
      '举起颜色说 red / yellow / blue / green',
      '玩 “Touch the ___”：摸对应颜色',
      '交换角色：孩子当小老师发指令',
      '用中文确认一遍，降低压力',
    ],
    tip: '一天 3–4 个词，听说先行，不要求跟读完美。',
  },
  {
    id: 'en-body-song',
    title: 'Head Shoulders 身体歌',
    domain: 'language',
    focus: ['english', 'motor', 'music'],
    minutes: 12,
    steps: [
      '慢速唱 Head, Shoulders, Knees and Toes',
      '指对应身体部位，夸张动作',
      '第二遍加速，孩子会笑场',
      '单独说单词：head? toes? 做动作确认',
    ],
  },
  {
    id: 'en-animal-sound',
    title: '动物英语声',
    domain: 'language',
    focus: ['english', 'speak'],
    minutes: 10,
    materials: '动物玩偶或图片',
    steps: [
      '展示动物：cat, dog, duck, bird',
      '学叫声：Meow! Woof! Quack!',
      '提问 “What’s this?” 孩子指/说',
      '玩神秘袋：摸到再猜英文名',
    ],
  },
  {
    id: 'en-count-hello',
    title: 'Hello 与数数',
    domain: 'language',
    focus: ['english', 'math'],
    minutes: 10,
    steps: [
      '互相 Hello / Bye-bye 打招呼',
      '用英文数 1–5，边数边拍手',
      '藏起一个玩具，猜 “How many?”',
      '用中文再数一遍巩固数量感',
    ],
  },

  // ——— 科学 · 数学 ———
  {
    id: 'math-count-fruit',
    title: '水果点数超市',
    domain: 'science',
    focus: ['math'],
    minutes: 15,
    materials: '积木/水果模型/瓶盖作“商品”',
    steps: [
      '摆出 1–5 个物品各一堆',
      '请孩子当收银员点数',
      '问：“哪堆最多？哪堆最少？”',
      '玩“再买一个”感受数量加一',
    ],
    guide: '感知和理解数量，会点数 5 以内的物体',
    tip: '一定要手口一致地点：指一个数一个。',
  },
  {
    id: 'math-shape-search',
    title: '形状侦探',
    domain: 'science',
    focus: ['math', 'logic'],
    minutes: 12,
    steps: [
      '说出目标形状：圆形 / 三角形 / 正方形',
      '在家中寻找对应形状物品',
      '把找到的按形状排成“形状火车”',
      '说一句：“圆形像轮子”',
    ],
  },
  {
    id: 'math-compare',
    title: '长短高矮比一比',
    domain: 'science',
    focus: ['math'],
    minutes: 10,
    materials: '两支笔、两本书、两个玩偶',
    steps: [
      '拿出两样东西问：“谁长？谁短？”',
      '并排对齐比一比',
      '扩展：高矮、轻重、多少',
      '请孩子出题考妈妈',
    ],
  },
  {
    id: 'math-pattern-clap',
    title: '拍拍找规律',
    domain: 'science',
    focus: ['math', 'logic'],
    minutes: 12,
    materials: '两色积木或贴纸',
    steps: [
      '摆出 ABAB：红蓝红蓝红…',
      '问：“下一个是什么颜色？”',
      '用拍手做规律：拍-拍-跺、拍-拍-跺',
      '请孩子设计自己的规律',
    ],
  },

  // ——— 逻辑思维 ———
  {
    id: 'logic-sort-color',
    title: '袜子分类挑战',
    domain: 'science',
    focus: ['logic', 'life'],
    minutes: 12,
    materials: '干净袜子若干',
    steps: [
      '把袜子混在一起',
      '约定分类标准：先按颜色',
      '完成后再按大小分一次',
      '讨论：“还可以怎么分？”',
    ],
    tip: '分类是逻辑的起点，标准要先说清楚。',
  },
  {
    id: 'logic-sequence',
    title: '先后顺序排一排',
    domain: 'science',
    focus: ['logic', 'speak'],
    minutes: 12,
    materials: '3–4 张生活场景图或凭记忆口述',
    steps: [
      '讲一件简单的事：起床→穿衣→刷牙→吃饭',
      '打乱顺序请孩子重新排',
      '用“先…然后…最后…”说完整句',
      '换成孩子自己的故事再排一次',
    ],
  },
  {
    id: 'logic-maze-light',
    title: '纸迷宫寻宝',
    domain: 'science',
    focus: ['logic'],
    minutes: 15,
    materials: '简单纸迷宫或地板胶带迷宫',
    steps: [
      '用手指先“空走”一遍路线',
      '再用彩笔画出正确路径',
      '成功后奖励一枚贴纸',
      '难度：从只有 1 个分叉开始',
    ],
  },
  {
    id: 'logic-odd-one',
    title: '谁是不一样的？',
    domain: 'science',
    focus: ['logic', 'speak'],
    minutes: 10,
    materials: '四张图卡（三张水果一张玩具等）',
    steps: [
      '展示四样东西',
      '问：“哪个不一样？为什么？”',
      '接受孩子任何有理由的答案',
      '换类别：交通工具 / 动物 / 颜色',
    ],
  },

  // ——— 健康 ———
  {
    id: 'health-balance',
    title: '小熊过独木桥',
    domain: 'health',
    focus: ['motor'],
    minutes: 15,
    materials: '地板胶带一条线或抱枕排成桥',
    steps: [
      '张开手臂当小熊耳朵',
      '脚跟贴脚尖沿线走',
      '中途伸手“摘果子”蹲下捡起',
      '到终点欢呼，再倒走回来',
    ],
    guide: '沿地面直线或低矮物体行走，保持身体平衡',
  },
  {
    id: 'health-jump',
    title: '青蛙跳荷叶',
    domain: 'health',
    focus: ['motor'],
    minutes: 15,
    materials: '地垫或画圈当荷叶',
    steps: [
      '摆好间距适中的“荷叶”',
      '双脚并拢连续跳',
      '说儿歌助兴：小青蛙，跳跳跳',
      '拉开距离挑战，失败也没关系',
    ],
  },
  {
    id: 'health-brush',
    title: '刷牙小卫士',
    domain: 'health',
    focus: ['life'],
    minutes: 10,
    materials: '牙刷、玩偶',
    steps: [
      '先给玩偶示范刷牙',
      '上牙往下、下牙往上、咬合面来回',
      '和孩子一起刷，唱 20 秒刷牙歌',
      '夸奖“牙齿亮晶晶”',
    ],
    guide: '有基本的生活自理能力，早晚刷牙',
  },
  {
    id: 'health-throw',
    title: '纸球投准',
    domain: 'health',
    focus: ['motor'],
    minutes: 12,
    materials: '废纸揉成球、洗衣篮',
    steps: [
      '把篮子放在 1–2 米外',
      '单手肩上投掷纸球',
      '记录投进几个（简单点数）',
      '移动篮子远近调节难度',
    ],
  },

  // ——— 社会 ———
  {
    id: 'social-role-shop',
    title: '娃娃家小超市',
    domain: 'social',
    focus: ['social', 'speak', 'math'],
    minutes: 20,
    materials: '玩具商品、钱包（卡片代替钱）',
    steps: [
      '分配角色：售货员 / 顾客',
      '练习礼貌用语：你好、谢谢、再见',
      '买两样东西，说清楚要什么',
      '交换角色再来一轮',
    ],
    guide: '愿意与人交往，会使用礼貌用语',
  },
  {
    id: 'social-share',
    title: '分享时刻',
    domain: 'social',
    focus: ['social', 'speak'],
    minutes: 12,
    steps: [
      '围坐，每人说一件今天开心的事',
      '练习“我看到你…我觉得…”句式',
      '如果有多余零食/贴纸，商量如何分享',
      '拥抱结束',
    ],
  },
  {
    id: 'social-rule',
    title: '红灯绿灯停',
    domain: 'social',
    focus: ['social', 'motor'],
    minutes: 12,
    steps: [
      '一人当指挥，喊“绿灯走，红灯停”',
      '走的过程中练习听指令停下',
      '犯规就笑一笑重新开始',
      '谈一句：规则让游戏更好玩',
    ],
    guide: '理解并遵守日常生活中基本的社会行为规则',
  },

  // ——— 科学 · 自然 ———
  {
    id: 'sci-plant-watch',
    title: '阳台小植物观察',
    domain: 'science',
    focus: ['nature', 'speak'],
    minutes: 15,
    materials: '一盆绿植或豆芽',
    steps: [
      '一起看叶子：颜色、形状、摸起来的感觉',
      '浇水，讨论植物需要什么',
      '画一片叶子带回家',
      '约定三天后再观察一次',
    ],
  },
  {
    id: 'sci-float-sink',
    title: '沉浮小实验',
    domain: 'science',
    focus: ['nature', 'logic'],
    minutes: 15,
    materials: '一盆水、积木、树叶、小石子、塑料勺',
    steps: [
      '猜一猜：谁会浮？谁会沉？',
      '一件件放入验证',
      '按浮/沉分成两排',
      '用一句话总结发现',
    ],
  },
  {
    id: 'sci-shadow',
    title: '影子捉迷藏',
    domain: 'science',
    focus: ['nature'],
    minutes: 15,
    materials: '手电筒或阳光',
    steps: [
      '玩手影：小狗、兔子',
      '观察影子什么时候变长',
      '踩影子游戏',
      '问：“为什么会有影子？”',
    ],
  },

  // ——— 艺术 ———
  {
    id: 'art-finger-paint',
    title: '手指点画春天',
    domain: 'art',
    focus: ['draw'],
    minutes: 20,
    materials: '安全颜料、画纸',
    steps: [
      '用手指蘸色点出花瓣',
      '掌印当树冠，手指画枝干',
      '边画边编一句小故事',
      '贴在冰箱上“办画展”',
    ],
  },
  {
    id: 'art-sing-clap',
    title: '节奏小乐队',
    domain: 'art',
    focus: ['music'],
    minutes: 15,
    materials: '锅盖、沙锤（米+瓶）',
    steps: [
      '妈妈拍简单节奏，孩子模仿',
      '用乐器跟儿歌打拍子',
      '强弱对比：轻轻/重重',
      '孩子当指挥家',
    ],
  },
  {
    id: 'art-collage',
    title: '撕贴拼贴画',
    domain: 'art',
    focus: ['craft', 'draw'],
    minutes: 20,
    materials: '彩纸、胶棒、画纸',
    steps: [
      '撕出大小不同的纸片',
      '在画纸上拼成房子/小花',
      '涂胶粘贴，锻炼手部力量',
      '起个作品名字写在角落（家长代写）',
    ],
    guide: '能用撕、贴、画等方式进行简单表现',
  },
  {
    id: 'art-mood-draw',
    title: '今天的心情色',
    domain: 'art',
    focus: ['draw', 'speak'],
    minutes: 12,
    materials: '蜡笔、画纸',
    steps: [
      '问：“今天心里是什么颜色？”',
      '选颜色自由涂满一张纸',
      '说说为什么选这个颜色',
      '把画贴在“心情墙”',
    ],
  },

  // ——— 周末加长 / 综合 ———
  {
    id: 'wk-outdoor-walk',
    title: '小区自然漫步',
    domain: 'health',
    focus: ['nature', 'motor', 'speak'],
    minutes: 40,
    weekendBoost: true,
    materials: '小背包、水壶',
    steps: [
      '慢走观察：树叶、石头、小狗',
      '捡 3 片不同叶子',
      '数数台阶或路灯（数学融入）',
      '回家后把叶子贴进观察本',
    ],
  },
  {
    id: 'wk-story-theater',
    title: '家庭故事剧场',
    domain: 'language',
    focus: ['speak', 'read', 'social'],
    minutes: 35,
    weekendBoost: true,
    materials: '披风/手偶可选',
    steps: [
      '选一个熟悉的故事',
      '分配角色，简单道具',
      '演一遍，允许即兴改台词',
      '演完互相说“我喜欢你的…”',
    ],
  },
  {
    id: 'wk-bake-count',
    title: '亲子小面点',
    domain: 'science',
    focus: ['math', 'life'],
    minutes: 40,
    weekendBoost: true,
    materials: '面团或橡皮泥、模具',
    steps: [
      '数材料：几勺水、几块面团',
      '揉、压、按模具成形',
      '排成一排比较大小',
      '若真烘焙，观察烤箱计时（安全由家长）',
    ],
  },
  {
    id: 'wk-hanzi-poster',
    title: '我的汉字海报',
    domain: 'language',
    focus: ['hanzi', 'draw'],
    minutes: 30,
    weekendBoost: true,
    materials: '大画纸、字卡、彩笔',
    steps: [
      '从本周认过的字里挑 5 个',
      '每个字配一幅小画',
      '贴成海报，孩子当讲解员',
      '挂在每天路过的地方',
    ],
  },
  {
    id: 'wk-english-circle',
    title: 'English Circle Time',
    domain: 'language',
    focus: ['english', 'speak'],
    minutes: 25,
    weekendBoost: true,
    steps: [
      '围坐唱 Hello 歌',
      '复习本周颜色/动物/数字',
      '玩 “Show me…” 指令游戏',
      '用一句话中文总结今天学了什么',
    ],
  },
  {
    id: 'wk-block-city',
    title: '积木城市工程',
    domain: 'science',
    focus: ['logic', 'math', 'craft'],
    minutes: 35,
    weekendBoost: true,
    materials: '积木/乐高',
    steps: [
      '说目标：建一条路或一座桥',
      '搭建中比较高低、长短、数量',
      '给建筑物起名字并编号',
      '用玩偶“住进”城市讲故事',
    ],
  },
  {
    id: 'wk-help-family',
    title: '家务小帮手',
    domain: 'social',
    focus: ['life', 'social'],
    minutes: 25,
    weekendBoost: true,
    steps: [
      '选一件力所能及的事：叠袜子/摆碗筷',
      '分步骤示范一次',
      '一起做，过程中聊天',
      '完成后具体表扬：“你把碗摆得很整齐”',
    ],
  },
  {
    id: 'art-clay',
    title: '彩泥变变变',
    domain: 'art',
    focus: ['craft'],
    minutes: 30,
    weekendBoost: true,
    materials: '彩泥',
    steps: [
      '搓圆、搓长条、压扁三个基本功',
      '拼一条毛毛虫或一朵花',
      '给作品编名字',
      '收藏在展示盒',
    ],
  },
  {
    id: 'health-stretch',
    title: '亲子瑜伽拉伸',
    domain: 'health',
    focus: ['motor'],
    minutes: 20,
    steps: [
      '猫牛式、树式简单动作',
      '配合呼吸：吸气抬手、呼气放下',
      '当镜子互相模仿',
      '最后躺下休息 1 分钟',
    ],
  },
  {
    id: 'logic-matching',
    title: '翻牌配对游戏',
    domain: 'science',
    focus: ['logic', 'hanzi'],
    minutes: 15,
    materials: '配对卡片（字-图或色-色）',
    steps: [
      '卡片背面朝上排成网格',
      '轮流翻两张，找到一对收走',
      '配对时大声说出内容',
      '结束数数谁的多',
    ],
  },

  // ——— 性别开放：建构 / 竞技 / 探险 / 机械 ———
  {
    id: 'open-tower',
    title: '谁能搭得更高',
    domain: 'science',
    focus: ['logic', 'math'],
    minutes: 15,
    materials: '积木、纸杯、木块均可',
    steps: [
      '约定规则：只能用同样材料往上叠',
      '各自搭自己的塔，比一比高度',
      '失败了就分析：哪里倒了？怎么改？',
      '合作搭一座“世界第一高塔”',
    ],
    tip: '比的是办法，不是谁“应该”更会搭。鼓励大胆尝试。',
  },
  {
    id: 'open-obstacle',
    title: '客厅障碍闯关',
    domain: 'health',
    focus: ['motor', 'logic'],
    minutes: 20,
    materials: '抱枕、胶带线、纸箱',
    steps: [
      '一起设计关卡：钻、跨、绕、跳',
      '轮流当挑战者和裁判',
      '计时或计步，看自己有没有进步',
      '邀请孩子发明新关卡',
    ],
  },
  {
    id: 'open-rocket',
    title: '纸筒小火箭',
    domain: 'science',
    focus: ['nature', 'craft'],
    minutes: 20,
    materials: '卫生纸筒、彩纸、胶带',
    steps: [
      '装饰纸筒，说说火箭要飞去哪里',
      '做发射台：把筒立在手掌或斜坡上',
      '练习“倒数发射”并向前送/抛软物',
      '讨论：怎样才能飞得更远？',
    ],
  },
  {
    id: 'open-map',
    title: '家庭藏宝图',
    domain: 'science',
    focus: ['logic', 'draw'],
    minutes: 25,
    materials: '纸、笔、一个小“宝藏”',
    steps: [
      '在家中选起点和终点',
      '画简单地图：箭头、叉叉、圆圈',
      '一人藏、一人按图寻宝',
      '交换角色，难度由孩子决定',
    ],
  },
  {
    id: 'open-mud-kitchen',
    title: '泥巴/沙土实验室',
    domain: 'science',
    focus: ['nature', 'life'],
    minutes: 30,
    weekendBoost: true,
    materials: '沙土或盆栽土、水、小铲',
    steps: [
      '允许弄脏，围裙即可（不必怕）',
      '试验干沙/湿沙：能堆城堡吗？',
      '挖河道引水，观察水流',
      '洗手环节也算生活练习',
    ],
    tip: '脏一点的探索，常常记得最牢。',
  },
  {
    id: 'open-race',
    title: '短跑与折返挑战',
    domain: 'health',
    focus: ['motor'],
    minutes: 15,
    materials: '两个标志物',
    steps: [
      '练习起跑姿势与安全冲刺',
      '折返跑：碰到标志再回来',
      '和自己的昨天比，不和别人比',
      '结束后一起大口呼吸、放松',
    ],
  },
  {
    id: 'open-leader',
    title: '今天我指挥',
    domain: 'social',
    focus: ['social', 'speak', 'logic'],
    minutes: 18,
    steps: [
      '孩子当“队长”，决定游戏顺序',
      '家长认真听指令并执行',
      '练习说清楚：先做什么、再做什么',
      '换家长当队长，学习轮流',
    ],
  },
  {
    id: 'open-machine',
    title: '斜坡滚滚乐',
    domain: 'science',
    focus: ['math', 'logic', 'nature'],
    minutes: 18,
    materials: '硬皮书/纸板作斜坡、小球、小车',
    steps: [
      '用书搭斜坡，从低到高变化',
      '放球/车下落，比谁滚得远',
      '猜想：坡越陡会怎样？',
      '改造斜坡：加挡板改变方向',
    ],
  },
  {
    id: 'open-badge',
    title: '勇敢尝试徽章',
    domain: 'social',
    focus: ['social', 'life'],
    minutes: 12,
    materials: '贴纸或画一枚徽章',
    steps: [
      '说出一件今天想挑战的小事',
      '完成后贴上徽章，说一句感受',
      '家长分享自己当年也害怕过的事',
      '强调：害怕很正常，试了就很棒',
    ],
  },

  // ——— 勇敢表达 · 边界 · 求助（针对胆小、受欺负不敢说） ———
  {
    id: 'brave-stop',
    title: '大声说“停”的魔法',
    domain: 'social',
    focus: ['social', 'speak'],
    minutes: 15,
    materials: '玩偶两个',
    steps: [
      '用玩偶演：一个抢玩具，一个不舒服',
      '示范双手前推、站稳、大声说：“停！我不喜欢这样！”',
      '她来扮演被抢的孩子，练习说 3 遍（音量越来越大）',
      '再演：说了“停”之后，对方仍不停 → 离开 + 告诉大人',
      '夸具体点：“你刚才声音很稳，这就是勇敢。”',
    ],
    guide: '愿意表达自己的想法和需要，在提醒下敢于维护自己的合理权益',
    tip: '在家里先练熟，外面才用得出来。不要求“打赢”，要求“说出口 + 走开 + 求助”。',
  },
  {
    id: 'brave-teacher',
    title: '报告老师小剧场',
    domain: 'social',
    focus: ['social', 'speak'],
    minutes: 15,
    materials: '椅子当“老师办公桌”',
    steps: [
      '家长扮老师，她扮小朋友',
      '练一句完整话：“老师，XX 打我/抢我东西，我很不舒服。”',
      '补充细节：什么时候、在哪里、发生了什么',
      '老师角色回应：“谢谢你告诉我，我会处理。”——让她感到报告有用',
      '交换角色，她当老师，学会倾听求助的孩子',
    ],
    tip: '明确告诉她：告诉老师不是“告状/丢人”，是保护自己和别人。',
  },
  {
    id: 'brave-body-rules',
    title: '身体边界红绿灯',
    domain: 'social',
    focus: ['social', 'life'],
    minutes: 12,
    materials: '红黄绿三色纸或贴纸',
    steps: [
      '绿灯：欢迎的接触（拥抱家人、击掌）',
      '黄灯：不确定时要问/不想时可以拒绝',
      '红灯：绝对要拒绝并离开（打、掐、脱衣、碰隐私部位）',
      '她说出自己的红灯清单，家长写下来贴在家里',
      '强调：被欺负或被碰不舒服，**一定要告诉爸爸妈妈/老师**，永远不会被骂',
    ],
  },
  {
    id: 'brave-scene-roleplay',
    title: '幼儿园情景演练',
    domain: 'social',
    focus: ['social', 'speak', 'logic'],
    minutes: 18,
    steps: [
      '情景 A：排队被推 → 后退一步 + 说“请别推我” + 告诉老师',
      '情景 B：玩具被抢 → 说“这是我的，请还给我” → 不给就找老师',
      '情景 C：被起难听外号 → “我不喜欢这个称呼” + 走开 + 记住是谁、什么时候',
      '情景 D：好朋友也被欺负 → 陪她去告诉大人（不是只围观）',
      '演练后问：“哪一句你觉得最难说出口？”只针对那一句多练',
    ],
    guide: '在冲突中逐渐学习保护自己并寻求帮助',
    tip: '一次练 1–2 个情景就够。重复比“讲大道理”有效。',
  },
  {
    id: 'brave-voice-meter',
    title: '音量勇气表',
    domain: 'language',
    focus: ['speak', 'social'],
    minutes: 10,
    steps: [
      '画三档：蚊子音 / 普通说话 / 勇敢大声',
      '用同一句话练习三档：“请把书还给我。”',
      '讨论：什么场合用哪一档（维护自己 → 勇敢大声）',
      '玩“勇气挑战”：在阳台/客厅用勇敢大声说一遍，家人鼓掌',
    ],
  },
  {
    id: 'brave-trusted-adults',
    title: '我的安全大人名单',
    domain: 'social',
    focus: ['social', 'life'],
    minutes: 12,
    materials: '画纸',
    steps: [
      '一起列出可以求助的人：爸爸、妈妈、老师、保健医、亲戚…',
      '每人画一个符号，贴在固定位置',
      '练一句：“我需要帮助。”',
      '约定：不管发生什么，她都可以求助，家里永远站在她这边',
    ],
  },
  {
    id: 'brave-story-talk',
    title: '故事里的勇敢选择',
    domain: 'language',
    focus: ['listen', 'social', 'speak'],
    minutes: 15,
    materials: '绘本或自编故事',
    steps: [
      '讲一个“被欺负/被抢东西”的小故事（不必恐吓）',
      '停下来问：“他/她可以怎么做？”',
      '列出至少 2 种办法：说停、走开、告诉大人、和朋友一起找老师',
      '讨论：“如果不敢说怎么办？”→ 可以拉同学的手一起去',
      '让她画下“勇敢的自己”',
    ],
  },
  {
    id: 'brave-power-pose',
    title: '超人站姿充电',
    domain: 'health',
    focus: ['motor', 'speak'],
    minutes: 8,
    steps: [
      '双手叉腰、脚分开、抬头挺胸站 20 秒',
      '深呼吸三次：吸气变大，呼气更稳',
      '一起喊：“我可以保护自己！我可以说出来！”',
      '出门前/上学前快速做一遍当“充电”',
    ],
  },
]

/** 每日自选角：孩子自主选择的方向（不预设性别） */
export const CHOICE_PROMPTS = [
  { id: 'choice-build', label: '我想搭建', hint: '积木、纸箱、火箭、斜坡…', domain: 'science' as Domain, focus: ['logic'] as FocusTag[], minutes: 20 },
  { id: 'choice-move', label: '我想动起来', hint: '闯关、跳、跑、平衡…', domain: 'health' as Domain, focus: ['motor'] as FocusTag[], minutes: 20 },
  { id: 'choice-story', label: '我想讲故事/认字', hint: '绘本、汉字寻宝、角色扮演…', domain: 'language' as Domain, focus: ['hanzi', 'speak'] as FocusTag[], minutes: 15 },
  { id: 'choice-create', label: '我想画/做/演', hint: '颜料、彩泥、节奏、剧场…', domain: 'art' as Domain, focus: ['draw', 'craft'] as FocusTag[], minutes: 20 },
  { id: 'choice-ask', label: '我想问为什么', hint: '沉浮、影子、植物、形状…', domain: 'science' as Domain, focus: ['nature'] as FocusTag[], minutes: 15 },
  { id: 'choice-help', label: '我想帮忙/当队长', hint: '家务、发指令、分享时刻…', domain: 'social' as Domain, focus: ['social', 'life'] as FocusTag[], minutes: 15 },
]

export const ALL_ACTIVITIES = activities

export function activitiesByDomain(domain: Domain) {
  return activities.filter((a) => a.domain === domain)
}

export function getActivity(id: string) {
  return activities.find((a) => a.id === id)
}
