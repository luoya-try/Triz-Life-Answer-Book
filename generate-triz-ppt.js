const pptxgen = require("pptxgenjs");
const path = require("path");

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';

pres.author = "TRIZ Team";
pres.title = "TRIZ答案之书 - 介绍推广";
pres.subject = "TRIZ推广PPT";
pres.company = "TRIZ";

const Coral = "FF6B9D";
const Yellow = "FFD93D";
const Pink = "FF9AA2";
const Cream = "FFF9E6";
const White = "FFFFFF";
const TextDark = "2D3436";

function addTitleSlide() {
  const slide = pres.addSlide();
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: "100%", h: 1.2,
    fill: { color: Coral }
  });
  
  slide.addShape(pres.shapes.OVAL, {
    x: 6.5, y: 0.2, w: 2.5, h: 0.8,
    fill: { color: Yellow },
    align: "center"
  });
  
  slide.addText("🧠", {
    x: 7.2, y: 0.3, w: 1.5, h: 0.6,
    fontSize: 48,
    align: "center",
    valign: "middle"
  });
  
  slide.addText("TRIZ答案之书", {
    x: 0.5, y: 0.3, w: 8, h: 0.8,
    fontSize: 44,
    bold: true,
    color: White,
    fontFace: "Microsoft YaHei"
  });
  
  slide.addText("智能结构化 · 创新解决方案", {
    x: 1, y: 1.4, w: 6, h: 0.4,
    fontSize: 20,
    color: TextDark,
    fontFace: "Microsoft YaHei"
  });
  
  slide.addText("✨ 让创新变得简单 ✨", {
    x: 2, y: 5, w: 4, h: 0.6,
    fontSize: 24,
    bold: true,
    color: Coral,
    fontFace: "Microsoft YaHei",
    align: "center"
  });
  
  slide.addText("2026", {
    x: 3.5, y: 6.2, w: 1.5, h: 0.4,
    fontSize: 16,
    color: "888888",
    align: "center"
  });
}

function addWhatIsTRIZ() {
  const slide = pres.addSlide();
  
  slide.addText("什么是TRIZ？", {
    x: 0.5, y: 0.3, w: 8, h: 0.8,
    fontSize: 36,
    bold: true,
    color: Coral,
    fontFace: "Microsoft YaHei"
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 8.5, h: 0.05,
    fill: { color: Yellow }
  });
  
  slide.addText([
    { text: "TRIZ是俄文发明问题解决理论的缩写", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "它是一套系统化的创新方法论，", options: { breakLine: true } },
    { text: "帮助我们从【灵光一现】走向【结构化创新】", options: { breakLine: true } }
  ], {
    x: 0.8, y: 1.4, w: 5.5, h: 2.5,
    fontSize: 20,
    color: TextDark,
    fontFace: "Microsoft YaHei",
    valign: "top"
  });
  
  const features = [
    { icon: "🎯", text: "结构化问题分析" },
    { icon: "🔄", text: "识别核心矛盾" },
    { icon: "💡", text: "借用成熟原理" },
    { icon: "🚀", text: "生成创新方案" }
  ];
  
  features.forEach((f, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = 6.8 + col * 2.5;
    const y = 1.5 + row * 1.6;
    
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x - 1, y: y, w: 2.2, h: 1.3,
      fill: { color: White },
      shadow: { type: "outer", blur: 6, offset: 2, angle: 45, color: "CCCCCC" },
      rectRadius: 0.1
    });
    
    slide.addText(f.icon, {
      x: x - 0.5, y: y + 0.1, w: 1.5, h: 0.5,
      fontSize: 32,
      align: "center"
    });
    
    slide.addText(f.text, {
      x: x - 0.8, y: y + 0.55, w: 2, h: 0.5,
      fontSize: 14,
      bold: true,
      color: TextDark,
      fontFace: "Microsoft YaHei",
      align: "center"
    });
  });
  
  slide.addText("💡 传统方法 vs TRIZ方法", {
    x: 0.8, y: 4.8, w: 8, h: 0.5,
    fontSize: 18,
    bold: true,
    color: Pink,
    fontFace: "Microsoft YaHei"
  });
  
  slide.addText("凭感觉→结构化 | 碰运气→有章法 | 一次性思维→系统化复用", {
    x: 0.8, y: 5.3, w: 8.5, h: 0.6,
    fontSize: 16,
    color: TextDark,
    fontFace: "Microsoft YaHei",
    align: "center"
  });
}

function addAdvantages() {
  const slide = pres.addSlide();
  
  slide.addText("四大核心优势", {
    x: 0.5, y: 0.3, w: 8, h: 0.8,
    fontSize: 36,
    bold: true,
    color: Coral,
    fontFace: "Microsoft YaHei"
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 8.5, h: 0.05,
    fill: { color: Yellow }
  });
  
  const advantages = [
    { num: "1", title: "九宫格结构化描述", desc: "AI引导式问卷，智能挖掘问题背景", color: "FF6B9D" },
    { num: "2", title: "矛盾自动提取与可视化", desc: "自动识别16组技术矛盾，交互式呈现", color: "FFD93D" },
    { num: "3", title: "原理智能推荐与方案生成", desc: "基于40个TRIZ原理，智能匹配推荐", color: "FF9AA2" },
    { num: "4", title: "知识库自学习优化", desc: "用户反馈驱动，系统越用越智能", color: "98D8AA" }
  ];
  
  advantages.forEach((adv, i) => {
    const x = (i % 2) * 4.5 + 0.5;
    const y = Math.floor(i / 2) * 2.2 + 1.5;
    
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 4.2, h: 1.8,
      fill: { color: White },
      shadow: { type: "outer", blur: 8, offset: 3, angle: 45, color: "DDDDDD" },
      rectRadius: 0.1
    });
    
    slide.addShape(pres.shapes.OVAL, {
      x: x + 0.2, y: y - 0.2, w: 0.8, h: 0.8,
      fill: { color: adv.color }
    });
    
    slide.addText(adv.num, {
      x: x + 0.2, y: y - 0.15, w: 0.8, h: 0.7,
      fontSize: 24,
      bold: true,
      color: White,
      align: "center",
      valign: "middle"
    });
    
    slide.addText(adv.title, {
      x: x + 1.2, y: y + 0.1, w: 2.8, h: 0.5,
      fontSize: 16,
      bold: true,
      color: TextDark,
      fontFace: "Microsoft YaHei"
    });
    
    slide.addText(adv.desc, {
      x: x + 1.2, y: y + 0.6, w: 2.8, h: 0.8,
      fontSize: 12,
      color: "666666",
      fontFace: "Microsoft YaHei"
    });
  });
}

function addHomepageSlide() {
  const slide = pres.addSlide();
  
  slide.addText("01  首页概览", {
    x: 0.5, y: 0.3, w: 8, h: 0.6,
    fontSize: 28,
    bold: true,
    color: Coral,
    fontFace: "Microsoft YaHei"
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.9, w: 8.5, h: 0.05,
    fill: { color: Yellow }
  });
  
  slide.addText("功能入口 + 品牌展示", {
    x: 0.5, y: 1.1, w: 8, h: 0.4,
    fontSize: 16,
    color: "888888",
    fontFace: "Microsoft YaHei"
  });
  
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.6, w: 4.5, h: 3.5,
    fill: { color: "EEEEEE" },
    rectRadius: 0.1
  });
  
  slide.addText([
    { text: "【📸 截图位置】", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "请在此处粘贴", options: { breakLine: true } },
    { text: "首页界面截图", options: { breakLine: true } }
  ], {
    x: 0.5, y: 1.6, w: 4.5, h: 3.5,
    fontSize: 14,
    color: "999999",
    align: "center",
    valign: "middle"
  });
  
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.2, y: 1.6, w: 3.8, h: 3.5,
    fill: { color: White },
    shadow: { type: "outer", blur: 6, offset: 2, angle: 45, color: "CCCCCC" },
    rectRadius: 0.1
  });
  
  const features = [
    "🧠 Logo + 大脑图标",
    "📱 开始分析按钮",
    "📋 四大功能卡片",
    "🎨 渐变配色风格"
  ];
  
  features.forEach((f, i) => {
    slide.addText(`• ${f}`, {
      x: 5.5, y: 1.8 + i * 0.8, w: 3.3, h: 0.6,
      fontSize: 14,
      color: TextDark,
      fontFace: "Microsoft YaHei"
    });
  });
  
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 5.3, w: 8.5, h: 0.8,
    fill: { color: "FFF9E6" },
    rectRadius: 0.1
  });
  
  slide.addText("💡 多巴胺主题：暖黄背景 + 粉黄珊瑚渐变，让创新更快乐！", {
    x: 0.7, y: 5.5, w: 8, h: 0.5,
    fontSize: 12,
    color: Coral,
    fontFace: "Microsoft YaHei"
  });
}

function addQuestionnaireSlide() {
  const slide = pres.addSlide();
  
  slide.addText("02  问卷分析页面", {
    x: 0.5, y: 0.3, w: 8, h: 0.6,
    fontSize: 28,
    bold: true,
    color: Coral,
    fontFace: "Microsoft YaHei"
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.9, w: 8.5, h: 0.05,
    fill: { color: Yellow }
  });
  
  slide.addText("九宫格结构化录入，AI智能解析填充", {
    x: 0.5, y: 1.1, w: 8, h: 0.4,
    fontSize: 16,
    color: "888888",
    fontFace: "Microsoft YaHei"
  });
  
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.6, w: 4.5, h: 3.5,
    fill: { color: "EEEEEE" },
    rectRadius: 0.1
  });
  
  slide.addText([
    { text: "【📸 截图位置】", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "请在此处粘贴", options: { breakLine: true } },
    { text: "问卷分析界面截图", options: { breakLine: true } }
  ], {
    x: 0.5, y: 1.6, w: 4.5, h: 3.5,
    fontSize: 14,
    color: "999999",
    align: "center",
    valign: "middle"
  });
  
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.2, y: 1.6, w: 3.8, h: 3.5,
    fill: { color: White },
    shadow: { type: "outer", blur: 6, offset: 2, angle: 45, color: "CCCCCC" },
    rectRadius: 0.1
  });
  
  const features = [
    "📊 进度条 (1/9 → 9/9)",
    "💾 保存 / 📥 导入按钮",
    "✨ AI帮你填 (输入→自动填充)",
    "🔢 快速跳转九宫格",
    "⚡ 查看矛盾快捷入口"
  ];
  
  features.forEach((f, i) => {
    slide.addText(`• ${f}`, {
      x: 5.5, y: 1.8 + i * 0.65, w: 3.3, h: 0.6,
      fontSize: 13,
      color: TextDark,
      fontFace: "Microsoft YaHei"
    });
  });
}

function addAISlide() {
  const slide = pres.addSlide();
  
  slide.addText("03  AI智能填充", {
    x: 0.5, y: 0.3, w: 8, h: 0.6,
    fontSize: 28,
    bold: true,
    color: Coral,
    fontFace: "Microsoft YaHei"
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.9, w: 8.5, h: 0.05,
    fill: { color: Yellow }
  });
  
  slide.addText("输入一段描述，AI自动填满九宫格", {
    x: 0.5, y: 1.1, w: 8, h: 0.4,
    fontSize: 16,
    color: "888888",
    fontFace: "Microsoft YaHei"
  });
  
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.6, w: 4.5, h: 3.5,
    fill: { color: "EEEEEE" },
    rectRadius: 0.1
  });
  
  slide.addText([
    { text: "【📸 截图位置】", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "请在此处粘贴", options: { breakLine: true } },
    { text: "AI智能填充界面截图", options: { breakLine: true } }
  ], {
    x: 0.5, y: 1.6, w: 4.5, h: 3.5,
    fontSize: 14,
    color: "999999",
    align: "center",
    valign: "middle"
  });
  
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.2, y: 1.6, w: 3.8, h: 3.5,
    fill: { color: White },
    shadow: { type: "outer", blur: 6, offset: 2, angle: 45, color: "CCCCCC" },
    rectRadius: 0.1
  });
  
  const features = [
    "📝 最多2000字输入",
    "🤖 AI智能解析填充9格",
    "⏱️ 实时字数统计",
    "✅ 50字即可触发AI",
    "🎯 精准匹配九宫格"
  ];
  
  features.forEach((f, i) => {
    slide.addText(`• ${f}`, {
      x: 5.5, y: 1.8 + i * 0.65, w: 3.3, h: 0.6,
      fontSize: 13,
      color: TextDark,
      fontFace: "Microsoft YaHei"
    });
  });
  
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 5.3, w: 8.5, h: 0.8,
    fill: { color: "FFF9E6" },
    rectRadius: 0.1
  });
  
  slide.addText("💡 九宫格=时间维度矩阵：过去/当前/未来 × 超系统/系统/子系统", {
    x: 0.7, y: 5.5, w: 8, h: 0.5,
    fontSize: 12,
    color: Coral,
    fontFace: "Microsoft YaHei"
  });
}

function addContradictionSlide() {
  const slide = pres.addSlide();
  
  slide.addText("04  矛盾提取可视化", {
    x: 0.5, y: 0.3, w: 8, h: 0.6,
    fontSize: 28,
    bold: true,
    color: Coral,
    fontFace: "Microsoft YaHei"
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.9, w: 8.5, h: 0.05,
    fill: { color: Yellow }
  });
  
  slide.addText("自动识别相邻格子间的16组技术矛盾", {
    x: 0.5, y: 1.1, w: 8, h: 0.4,
    fontSize: 16,
    color: "888888",
    fontFace: "Microsoft YaHei"
  });
  
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.6, w: 4.5, h: 3.5,
    fill: { color: "EEEEEE" },
    rectRadius: 0.1
  });
  
  slide.addText([
    { text: "【📸 截图位置】", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "请在此处粘贴", options: { breakLine: true } },
    { text: "矛盾提取界面截图", options: { breakLine: true } }
  ], {
    x: 0.5, y: 1.6, w: 4.5, h: 3.5,
    fontSize: 14,
    color: "999999",
    align: "center",
    valign: "middle"
  });
  
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.2, y: 1.6, w: 3.8, h: 3.5,
    fill: { color: White },
    shadow: { type: "outer", blur: 6, offset: 2, angle: 45, color: "CCCCCC" },
    rectRadius: 0.1
  });
  
  const features = [
    "🔗 水平/垂直/对角线矛盾",
    "🎨 颜色+形状编码核心程度",
    "⭐ AI加载动画",
    "📊 五星评分系统",
    "📝 矛盾详情弹窗"
  ];
  
  features.forEach((f, i) => {
    slide.addText(`• ${f}`, {
      x: 5.5, y: 1.8 + i * 0.65, w: 3.3, h: 0.6,
      fontSize: 13,
      color: TextDark,
      fontFace: "Microsoft YaHei"
    });
  });
  
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 5.3, w: 8.5, h: 0.8,
    fill: { color: "FFF9E6" },
    rectRadius: 0.1
  });
  
  slide.addText("💡 矛盾是创新的起点 — 识别矛盾=找到突破口！", {
    x: 0.7, y: 5.5, w: 8, h: 0.5,
    fontSize: 12,
    color: Coral,
    fontFace: "Microsoft YaHei"
  });
}

function addSolutionSlide() {
  const slide = pres.addSlide();
  
  slide.addText("05  解决方案生成", {
    x: 0.5, y: 0.3, w: 8, h: 0.6,
    fontSize: 28,
    bold: true,
    color: Coral,
    fontFace: "Microsoft YaHei"
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 0.9, w: 8.5, h: 0.05,
    fill: { color: Yellow }
  });
  
  slide.addText("选择矛盾 + 选择原理 → AI生成创新方案", {
    x: 0.5, y: 1.1, w: 8, h: 0.4,
    fontSize: 16,
    color: "888888",
    fontFace: "Microsoft YaHei"
  });
  
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.6, w: 4.5, h: 3.5,
    fill: { color: "EEEEEE" },
    rectRadius: 0.1
  });
  
  slide.addText([
    { text: "【📸 截图位置】", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "请在此处粘贴", options: { breakLine: true } },
    { text: "解决方案界面截图", options: { breakLine: true } }
  ], {
    x: 0.5, y: 1.6, w: 4.5, h: 3.5,
    fontSize: 14,
    color: "999999",
    align: "center",
    valign: "middle"
  });
  
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.2, y: 1.6, w: 3.8, h: 3.5,
    fill: { color: White },
    shadow: { type: "outer", blur: 6, offset: 2, angle: 45, color: "CCCCCC" },
    rectRadius: 0.1
  });
  
  const features = [
    "🎯 选择矛盾对",
    "🔮 智能推荐原理",
    "📋 浏览40个TRIZ原理",
    "✨ 自动生成方案",
    "💾 保存方案历史"
  ];
  
  features.forEach((f, i) => {
    slide.addText(`• ${f}`, {
      x: 5.5, y: 1.8 + i * 0.65, w: 3.3, h: 0.6,
      fontSize: 13,
      color: TextDark,
      fontFace: "Microsoft YaHei"
    });
  });
}

function addValueSlide() {
  const slide = pres.addSlide();
  
  slide.addText("你能获得什么？", {
    x: 0.5, y: 0.3, w: 8, h: 0.8,
    fontSize: 36,
    bold: true,
    color: Coral,
    fontFace: "Microsoft YaHei"
  });
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.1, w: 8.5, h: 0.05,
    fill: { color: Yellow }
  });
  
  const values = [
    { icon: "🧠", title: "结构化思维", desc: "从模糊问题到清晰框架" },
    { icon: "⚡", title: "效率提升", desc: "AI辅助，数分钟定位核心矛盾" },
    { icon: "📚", title: "知识沉淀", desc: "TRIZ 40年创新理论，现成可用" },
    { icon: "🔄", title: "持续进化", desc: "越用越懂你，系统越用越聪明" }
  ];
  
  values.forEach((v, i) => {
    const x = (i % 2) * 4.5 + 0.5;
    const y = Math.floor(i / 2) * 2.2 + 1.5;
    
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 4.2, h: 1.8,
      fill: { color: White },
      shadow: { type: "outer", blur: 8, offset: 3, angle: 45, color: "DDDDDD" },
      rectRadius: 0.1
    });
    
    slide.addText(v.icon, {
      x: x + 0.3, y: y + 0.3, w: 0.8, h: 0.7,
      fontSize: 36,
      align: "center"
    });
    
    slide.addText(v.title, {
      x: x + 1.3, y: y + 0.3, w: 2.6, h: 0.5,
      fontSize: 16,
      bold: true,
      color: TextDark,
      fontFace: "Microsoft YaHei"
    });
    
    slide.addText(v.desc, {
      x: x + 1.3, y: y + 0.8, w: 2.6, h: 0.7,
      fontSize: 12,
      color: "666666",
      fontFace: "Microsoft YaHei"
    });
  });
  
  slide.addText("📈", {
    x: 3, y: 4.8, w: 1.5, h: 0.7,
    fontSize: 40,
    align: "center"
  });
  
  slide.addText("创新成功率的系统性提升", {
    x: 0.5, y: 5.3, w: 8.5, h: 0.6,
    fontSize: 18,
    bold: true,
    color: Coral,
    fontFace: "Microsoft YaHei",
    align: "center"
  });
}

function addEndSlide() {
  const slide = pres.addSlide();
  
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: "100%", h: 1.2,
    fill: { color: Coral }
  });
  
  slide.addText("开始你的创新之旅", {
    x: 0.5, y: 0.4, w: 8.5, h: 0.8,
    fontSize: 40,
    bold: true,
    color: White,
    fontFace: "Microsoft YaHei",
    align: "center"
  });
  
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 2.5, y: 1.8, w: 4.5, h: 0.8,
    fill: { color: Yellow },
    rectRadius: 0.2
  });
  
  slide.addText("🚀 开始分析 → 立即体验", {
    x: 2.5, y: 1.9, w: 4.5, h: 0.6,
    fontSize: 20,
    bold: true,
    color: TextDark,
    fontFace: "Microsoft YaHei",
    align: "center",
    valign: "middle"
  });
  
  slide.addText("🧠 TRIZ答案之书", {
    x: 0.5, y: 3, w: 8.5, h: 0.6,
    fontSize: 28,
    bold: true,
    color: Coral,
    fontFace: "Microsoft YaHei",
    align: "center"
  });
  
  slide.addText("智能结构化 · 创新解决方案", {
    x: 0.5, y: 3.6, w: 8.5, h: 0.5,
    fontSize: 16,
    color: "666666",
    fontFace: "Microsoft YaHei",
    align: "center"
  });
  
  slide.addText("✨ 让每个人都能创新 ✨", {
    x: 1.5, y: 4.5, w: 6.5, h: 0.6,
    fontSize: 18,
    color: Pink,
    fontFace: "Microsoft YaHei",
    align: "center"
  });
}

addTitleSlide();
addWhatIsTRIZ();
addAdvantages();
addHomepageSlide();
addQuestionnaireSlide();
addAISlide();
addContradictionSlide();
addSolutionSlide();
addValueSlide();
addEndSlide();

const outputPath = path.join(__dirname, "docs", "TRIZ介绍推广.pptx");
pres.writeFile({ fileName: outputPath })
  .then(() => console.log(`✅ PPT已生成: ${outputPath}`))
  .catch(err => console.error("❌ 错误:", err));
