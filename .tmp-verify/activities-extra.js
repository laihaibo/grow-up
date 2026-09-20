"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXTRA_ACTIVITIES = void 0;
/** 扩充题库：汉字/英语/数学/逻辑 + 五大领域开放活动 */
exports.EXTRA_ACTIVITIES = [
    // ——— 汉字 ———
    { id: 'hz-radical-lego', title: '偏旁积木拼字', domain: 'language', focus: ['hanzi', 'logic'], minutes: 15, materials: '偏旁字卡（氵、亻、木、口等）+ 单字卡', steps: ['摆出偏旁当「左半边」', '摆出「工、马、门」等右半边', '拼出江、妈、问，边拼边念', '问：还有谁能和「氵」做朋友？'], guide: '对汉字结构产生兴趣', tip: '只玩拼和念，不要求默写。' },
    { id: 'hz-market-words', title: '超市价签认字', domain: 'language', focus: ['hanzi'], minutes: 12, steps: ['逛超市或看照片价签', '找「大、小、多、米、奶」', '读给她听，让她跟一次', '回家画一张「超市字卡」'], tip: '生活场景比闪卡更牢。' },
    { id: 'hz-story-replace', title: '故事里的替换单字', domain: 'language', focus: ['hanzi', 'speak'], minutes: 12, steps: ['读熟悉的短句：小猫吃鱼', '把「猫」换成「狗」，句子怎么变', '她来替换一个字，全家一起读', '笑一笑：句子变出了新故事'], tip: '理解字与义的关系。' },
    { id: 'hz-body-parts', title: '身体部位汉字', domain: 'language', focus: ['hanzi', 'motor'], minutes: 10, steps: ['写/认：口、手、目、足', '摸对应身体部位', '家长说字，她快速摸', '她说字，家长摸'], tip: '动起来认字，记忆更深。' },
    { id: 'hz-calendar-job', title: '日历小帮手', domain: 'language', focus: ['hanzi', 'math'], minutes: 8, steps: ['看日历：今天几号、星期几', '圈出她的生日或周末', '认「月、日、周」', '数还有几天到周末'], tip: '每天 2 分钟即可。' },
    // ——— 英语 ———
    { id: 'en-food-menu', title: 'English 小菜单', domain: 'language', focus: ['english', 'speak'], minutes: 15, materials: '玩具食物或图片', steps: ['词：apple, milk, bread, egg', '玩点餐：I want apple.', '售货员问：apple? yes/no', '吃完说 Thank you / Yummy'], tip: '吃相关词她通常最积极。' },
    { id: 'en-super-simon', title: 'Simon Says 英语版', domain: 'language', focus: ['english', 'motor'], minutes: 12, steps: ['Simon says touch your nose.', 'Simon says jump.', '没说 Simon 就不能动', '交换当 Simon'], tip: '听懂指令优先于跟读。' },
    { id: 'en-opposite-game', title: '反义词拍拍', domain: 'language', focus: ['english', 'logic'], minutes: 10, steps: ['big–small, up–down, fast–slow', '说 big 她做大动作', '说 small 她缩小身体', '她出题家长做'], tip: '动作编码记忆更牢。' },
    { id: 'en-bath-words', title: '洗澡英文词', domain: 'language', focus: ['english', 'life'], minutes: 8, steps: ['water, soap, towel, duck', '指物说词', '泡泡：bubble bubble', '洗完：clean!'], tip: '嵌进固定作息。' },
    { id: 'en-sing-replace', title: '儿歌换词', domain: 'language', focus: ['english', 'speak'], minutes: 12, steps: ['唱熟悉的 Twinkle Twinkle', '把 star 换成 cookie 哈哈唱', '她决定下一个换什么', '录音回听，很有成就感'], tip: '改词=创造性使用语言。' },
    // ——— 数学 ———
    { id: 'math-stair-count', title: '楼梯数数挑战', domain: 'science', focus: ['math', 'motor'], minutes: 8, steps: ['上楼每阶数一个数', '下楼倒着数', '几阶？一共多少？', '隔天对比速度/阶数'], tip: '融入日常动线。' },
    { id: 'math-snack-share', title: '零食公平分', domain: 'science', focus: ['math', 'social'], minutes: 10, materials: '可分享的小零食或积木', steps: ['3 个人怎么分 6 块饼干', '一人一块轮流发', '多的/少的怎么办', '「公平」比「一样多」更值得聊'], tip: '用积木替代真零食也可以。' },
    { id: 'math-dice-race', title: '骰子走步棋', domain: 'science', focus: ['math'], minutes: 15, materials: '大骰子、棋盘或地板格', steps: ['掷骰子，点数是几走几步', '大声数步数', '到终点击掌', '可两人比赛或自己挑战'], tip: '点数与数量对应的金标准游戏。' },
    { id: 'math-money-play', title: '玩具钱币 1–5', domain: 'science', focus: ['math'], minutes: 12, materials: '自制 1–5 点数卡当钱', steps: ['玩具标价：车=3，球=2', '付对应点数的钱', '钱不够：帮她数差几个', '买卖成功击掌'], tip: '不要求加减符号，只要「够不够」。' },
    { id: 'math-height-ruler', title: '身高墙贴', domain: 'science', focus: ['math'], minutes: 12, materials: '卷尺、便利贴', steps: ['贴墙量身高，做个记号', '比玩偶谁高', '用「积木高」表示：你=14块', '每月看一次变化'], tip: '测量比抽象数字有趣。' },
    // ——— 逻辑 ———
    { id: 'logic-detective-yesno', title: '是或不是侦探', domain: 'science', focus: ['logic', 'speak'], minutes: 12, steps: ['心里想一个家里物品', '她只问「是不是…」', '用是/否回答', '她猜中就换人'], tip: '提问能力=逻辑核心。' },
    { id: 'logic-if-then', title: '如果…就…', domain: 'science', focus: ['logic', 'speak'], minutes: 10, steps: ['如果下雨，就……', '如果饿了，就……', '如果玩具坏了，就……', '她出题家长答，再交换'], tip: '因果句式自然练逻辑与语言。' },
    { id: 'logic-packing', title: '旅行小书包装什么', domain: 'science', focus: ['logic', 'life'], minutes: 12, steps: ['要去公园，书包装什么？', '分组：水/食物/玩具/纸巾', '讨论：用不上的要不要装', '她画清单'], tip: '分类+计划+生活能力。' },
    { id: 'logic-copy-cat', title: '复制积木', domain: 'science', focus: ['logic'], minutes: 12, materials: '两套积木', steps: ['家长搭 3–5 块的简单造型', '她观察后在对面复制', '从 3 块加到 5 块', '交换：她搭家长抄'], tip: '空间记忆与观察。' },
    { id: 'logic-broken-toy', title: '玩具医院诊断', domain: 'science', focus: ['logic', 'speak'], minutes: 15, materials: '可拆装玩具/坏遥控（无电池）', steps: ['假装玩具坏了', '「哪里不舒服？轮子掉了吗？」', '一步步检查：轮子→车身→螺丝', '「修好」并记录病例'], tip: '系统性检查是工程思维萌芽。' },
    // ——— 健康 ———
    { id: 'health-bubble-pop', title: '泡泡追逐战', domain: 'health', focus: ['motor'], minutes: 15, materials: '泡泡水', steps: ['家长吹泡泡', '她拍、跳、追', '数一数拍破几个', '她练习吹泡泡（口腔肌肉）'], tip: '户外或防水地面。' },
    { id: 'health-crawl-tunnel', title: '钻隧道运货', domain: 'health', focus: ['motor'], minutes: 15, materials: '纸箱隧道或桌椅被窝隧道', steps: ['隧道里运一个玩偶', '头不碰「隧道顶」', '计时挑战', '自己设计更难路线'], tip: '本体觉与协调。' },
    { id: 'health-bed-yoga', title: '睡前伸展 5 分钟', domain: 'health', focus: ['motor', 'life'], minutes: 8, steps: ['像猫一样拱背', '像树一样站', '躺下肚子呼吸', '今天的身体哪里最累？'], tip: '固定在睡前，形成仪式。' },
    { id: 'health-veg-hero', title: '蔬菜英雄挑战', domain: 'health', focus: ['life'], minutes: 12, steps: ['认识一种今天吃的菜', '摸一摸、闻一闻（不要求吃）', '给它起英雄名字', '勇敢舔一口也算英雄'], tip: '接触量比吞咽量重要，不强迫。' },
    // ——— 社会 ———
    { id: 'social-phone-call', title: '打电话练习', domain: 'social', focus: ['speak', 'social'], minutes: 10, materials: '玩具电话或纸杯电话', steps: ['喂，你好，我是……', '请问妈妈在吗？', '说清楚一件事再再见', '给玩偶/亲戚真打一通'], tip: '完整句与礼貌用语。' },
    { id: 'social-wait-turn', title: '轮流金字塔', domain: 'social', focus: ['social', 'logic'], minutes: 12, steps: ['玩一个必须轮流的游戏', '每人一次，大声说「轮到你/我」', '用沙漏可视化等待时间', '结束后讨论等待的感受'], tip: '等待是技能，可以练习。' },
    { id: 'social-proud-list', title: '骄傲清单', domain: 'social', focus: ['social', 'speak'], minutes: 10, steps: ['说 3 件自己会的事', '家长补充她没说到的', '画下来或录音', '贴在床头'], tip: '对抗胆小的自我认知训练。' },
    { id: 'social-guest-host', title: '小主人待客', domain: 'social', focus: ['social', 'life'], minutes: 20, weekendBoost: true, steps: ['有客人来或角色扮演', '请坐、递水、介绍玩具', '客人走时说再见', '复盘：哪里可以更自然'], tip: '真实场景优于空讲道理。' },
    // ——— 科学/自然 ———
    { id: 'sci-ice-melt', title: '冰块融化实验', domain: 'science', focus: ['nature'], minutes: 15, materials: '冰块、温水/冷水两杯', steps: ['摸摸冰：什么感觉？', '猜：哪杯里的冰化得快？', '每 3 分钟观察一次', '说发现：热水更快'], tip: '引入「观察记录」意识。' },
    { id: 'sci-magnify', title: '放大镜巡检', domain: 'science', focus: ['nature'], minutes: 12, materials: '放大镜', steps: ['看布料、指纹、树叶脉', '「放大后有什么不同？」', '画下来', '找「放大后很美」的东西'], tip: '细节观察力。' },
    { id: 'sci-weather-journal', title: '天气观察本', domain: 'science', focus: ['nature', 'draw'], minutes: 8, steps: ['今天晴/阴/雨？', '画一个符号', '温度冷/热（体感）', '连续记 7 天看规律'], tip: '与逻辑「找规律」衔接。' },
    // ——— 艺术 ———
    { id: 'art-box-town', title: '纸箱迷你小镇', domain: 'art', focus: ['craft', 'logic'], minutes: 35, weekendBoost: true, materials: '小纸箱、胶带、彩笔', steps: ['每个纸箱当建筑：医院/学校/警局', '画门牌，编街道名', '玩偶入住，演日常', '讨论：小镇还需要什么？'], tip: '建构+角色+叙事一次到位。' },
    { id: 'art-sound-story', title: '声音讲故事', domain: 'art', focus: ['music', 'listen'], minutes: 12, materials: '锅碗瓢盆、沙锤', steps: ['雷声、雨声、脚步声怎么打', '家长讲短故事，她配音', '她讲故事，家长配音', '不评判「乱敲」，问像不像'], tip: '听觉想象与表达。' },
    { id: 'art-window-light', title: '窗影涂鸦', domain: 'art', focus: ['draw'], minutes: 15, materials: '可水洗窗画笔或阳光下纸影', steps: ['在玻璃/纸上画简单轮廓', '看光影投在地板', '描影子的形状', '擦掉再来一幅'], tip: '注意材料可擦洗与安全。' },
    { id: 'art-film-still', title: '四格小漫画', domain: 'art', focus: ['draw', 'speak'], minutes: 20, materials: '纸折成四格', steps: ['第一格：出门', '第二格：遇见…', '第三格：发生了什么', '第四格：回家/解决', '讲给家人听'], tip: '叙事结构启蒙，不要求画得好。' },
    // ——— 综合优先方向 ———
    { id: 'mix-hanzi-hopscotch', title: '汉字跳房子', domain: 'language', focus: ['hanzi', 'motor', 'math'], minutes: 18, materials: '胶带/粉笔写格子字', steps: ['格子里写本周认的字', '跳到哪格念哪个字', '念对可前进', '集齐 5 字成功'], tip: '运动+认字+数格子。' },
    { id: 'mix-en-shop', title: '中英双语小卖部', domain: 'language', focus: ['english', 'math', 'social'], minutes: 20, weekendBoost: true, steps: ['商品标中文名+英文名', '点餐可中英混说', '用点数卡付钱', '角色互换'], tip: '不纠正口音，重点敢说。' },
    { id: 'mix-logic-dress', title: '穿衣决策树', domain: 'science', focus: ['logic', 'life'], minutes: 10, steps: ['今天冷还是热？', '室外活动多吗？', '如果…就穿…', '她做决定并说明理由'], tip: '真实决策胜过题目。' },
    { id: 'mix-brave-qa', title: '勇敢问答小剧场', domain: 'social', focus: ['social', 'speak'], minutes: 15, steps: ['家长扮演「麻烦制造者」', '她练习：停/走开/告诉老师', '每答对一题贴贴纸', '最后总结口诀三句'], tip: '与 brave 系列重复强化。' },
    { id: 'mix-night-review', title: '睡前三件事回顾', domain: 'social', focus: ['speak', 'social'], minutes: 8, steps: ['今天做了什么好玩的', '有没有一次「说出来」', '明天最想玩什么', '晚安，警长小芽'], tip: '把成长重点放进每日仪式。' },
    // ——— 防诱拐演练任务（窗口 2026-09-20 ~ 09-23） ———
    {
        id: 'mission-brief',
        title: '认识警员任务',
        domain: 'social',
        focus: ['speak', 'listen', 'social'],
        minutes: 12,
        materials: '可选：贴纸「见习警员徽章」',
        steps: [
            '宣布：幼儿园防诱拐演习是「黑猫警长见习任务」，不是考试',
            '家长缓慢读一遍完整背诵稿（见 /mission 页原文）',
            '拆成四句口令贴在桌上：自我介绍 / 零食 / 跟人走 / 找老师',
            '只重点学第一句自我介绍，跟读 2–3 遍',
            '发放「见习警员」贴纸，今天到此结束',
        ],
        guide: '愿意倾听安全提醒，在鼓励下尝试自我介绍',
        tip: '今天不要求背全文。先建立「我是见习警员」的游戏身份。',
    },
    {
        id: 'mission-snack',
        title: '零食防线演练',
        domain: 'social',
        focus: ['social', 'speak', 'life'],
        minutes: 12,
        materials: '玩具零食或空包装；可选玩偶当陌生人',
        steps: [
            '家长扮「陌生人」，微笑递出玩具零食/糖果',
            '孩子练习摇头 + 摆手 + 说：「我不能要」',
            '接上口令原句：陌生人给的零食、糖果不能要',
            '强调：真的陌生人给的不吃；家里/老师给的可以吃',
            '互换角色：她当陌生人，你示范拒绝',
        ],
        guide: '知道陌生人给的食物不能要，在提醒下能做出拒绝动作',
        tip: '不要恐吓「会被抓走」。重点是清晰拒绝 + 告诉大人。',
    },
    {
        id: 'mission-follow',
        title: '跟人走陷阱演练',
        domain: 'social',
        focus: ['social', 'speak', 'logic'],
        minutes: 15,
        materials: '椅子当「幼儿园门口」；可选玩偶',
        steps: [
            '情景：陌生人说「我是你妈妈的朋友，带你去找爸爸妈妈」',
            '练习：不跟走 · 后退一步 · 大声说「我不跟你走」',
            '转身去找老师/熟悉的大人，说「有陌生人要带我走」',
            '接上口令原句两句：不能跟他走 + 赶紧找老师',
            '完整演一遍：拒绝 → 离开 → 报告 → 老师表扬',
        ],
        guide: '在冲突情景中尝试保护自己并寻求帮助',
        tip: '一次演 1–2 遍就够。孩子说不完整时给填空，不打断否定。',
    },
    {
        id: 'mission-drill',
        title: '演习日彩排',
        domain: 'social',
        focus: ['speak', 'social', 'motor'],
        minutes: 15,
        materials: '可选：镜子或面对玩偶观众',
        steps: [
            '见习警员站姿：脚分开、抬头、眼睛看「观众」',
            '家长当同学/老师，孩子完整说一遍背诵稿',
            '卡壳时给开头两三个字提示，不代替说完',
            '音量分三档试一遍：普通 → 勇敢大声（幼儿园能听清）',
            '出门前充电：叉腰 + 我是见习警员 + 一次口令',
        ],
        guide: '愿意在家人面前完整尝试表达安全提醒',
        tip: '演习日以敢开口、说完为成功；错一两个字不纠正到哭。',
    },
];
