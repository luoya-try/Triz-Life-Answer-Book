const pptxgen = require("pptxgenjs");

let pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = 'TRIZ - 问题解决之道';
pres.author = 'TRIZ Team';

// 配色：温暖珊瑚主题 - 吸引情感/家庭用户
const COLORS = {
  coral: 'F96167',
  gold: 'F9E795',
  navy: '2F3C7E',
  cream: 'FFFBF0',
  dark: '1A1A2E'
};

function createSlide1() {
  let slide = pres.addSlide();
  slide.background = { color: COLORS.coral };
  
  // 装饰圆形
  slide.addShape(pres.shapes.OVAL, {
    x: 7.5, y: 0.5, w: 2.5, h: 2.5,
    fill: { color: COLORS.gold, transparency: 30 }
  });
  
  // 主标题
  slide.addText("生活难题\n不再困扰", {
    x: 0.8, y: 1.2, w: 6, h: 2,
    fontSize: 44, fontFace: 'Georgia', color: 'FFFFFF',
    bold: true, align: 'left', valign: 'middle'
  });
  
  // 副标题
  slide.addText("TRIZ发明问题解决理论", {
    x: 0.8, y: 3.4, w: 6, h: 0.8,
    fontSize: 20, fontFace: 'Arial', color: COLORS.gold,
    align: 'left'
  });
  
  // 描述
  slide.addText("用科学方法\n化解情感困境·家庭矛盾·生活烦恼", {
    x: 0.8, y: 4.3, w: 6, h: 1.2,
    fontSize: 16, fontFace: 'Arial', color: 'FFFFFF',
    align: 'left'
  });
}

function createSlide2() {
  let slide = pres.addSlide();
  slide.background = { color: COLORS.cream };
  
  // 标题
  slide.addText("你是否也遇到这些困境？", {
    x: 0.5, y: 0.4, w: 9, h: 0.8,
    fontSize: 32, fontFace: 'Georgia', color: COLORS.navy,
    bold: true, align: 'center'
  });
  
  // 问题卡片布局
  const problems = [
    { icon: "💔", text: "夫妻沟通困难", sub: "话不投机半句多" },
    { icon: "👨‍👩‍👧", text: "家庭矛盾不断", sub: "代际冲突难调和" },
    { icon: "😫", text: "生活琐事困扰", sub: "明明很小却很累" },
    { icon: "🤔", text: "决策进退两难", sub: "鱼与熊掌如何选" }
  ];
  
  let startY = 1.5;
  problems.forEach((p, i) => {
    let x = (i % 2) * 4.8 + 0.5;
    let y = startY + Math.floor(i / 2) * 2;
    
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: y, w: 4.3, h: 1.8,
      fill: { color: 'FFFFFF' },
      shadow: { type: 'outer', color: '000000', blur: 8, offset: 2, opacity: 0.1 }
    });
    
    slide.addText(p.icon, {
      x: x + 0.3, y: y + 0.3, w: 0.8, h: 0.6,
      fontSize: 28, align: 'center', valign: 'middle'
    });
    
    slide.addText(p.text, {
      x: x + 1.2, y: y + 0.25, w: 2.8, h: 0.5,
      fontSize: 18, fontFace: 'Arial', color: COLORS.navy,
      bold: true, align: 'left'
    });
    
    slide.addText(p.sub, {
      x: x + 1.2, y: y + 0.75, w: 2.8, h: 0.4,
      fontSize: 13, fontFace: 'Arial', color: '666666',
      align: 'left'
    });
  });
}

function createSlide3() {
  let slide = pres.addSlide();
  slide.background = { color: COLORS.cream };
  
  // 标题
  slide.addText("什么是TRIZ？", {
    x: 0.5, y: 0.4, w: 9, h: 0.8,
    fontSize: 32, fontFace: 'Georgia', color: COLORS.navy,
    bold: true, align: 'center'
  });
  
  // 左侧介绍
  slide.addText([
    { text: "TRIZ (发明问题解决理论)", options: { bold: true, breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "源自苏联专利研究的科学方法论", options: { breakLine: true } },
    { text: "全球500强企业都在使用的创新工具", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "它能帮你：", options: { breakLine: true } },
    { text: "• 将模糊困扰转化为清晰问题", options: { breakLine: true, bullet: true } },
    { text: "• 找到矛盾的核心所在", options: { breakLine: true, bullet: true } },
    { text: "• 获得经过验证的创新方案", options: { breakLine: true, bullet: true } }
  ], {
    x: 0.5, y: 1.4, w: 4.2, h: 4,
    fontSize: 16, fontFace: 'Arial', color: '333333',
    align: 'left', valign: 'top'
  });
  
  // 右侧装饰
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.2, y: 1.4, w: 4.3, h: 3.5,
    fill: { color: COLORS.coral }
  });
  
  slide.addText("用科学\n代替猜测", {
    x: 5.2, y: 1.4, w: 4.3, h: 3.5,
    fontSize: 28, fontFace: 'Georgia', color: 'FFFFFF',
    bold: true, align: 'center', valign: 'middle'
  });
}

function createSlide4() {
  let slide = pres.addSlide();
  slide.background = { color: COLORS.cream };
  
  slide.addText("三大核心功能", {
    x: 0.5, y: 0.4, w: 9, h: 0.8,
    fontSize: 32, fontFace: 'Georgia', color: COLORS.navy,
    bold: true, align: 'center'
  });
  
  const features = [
    { num: "01", title: "智能问卷", desc: "AI引导式提问\n帮你理清问题全貌" },
    { num: "02", title: "矛盾识别", desc: "精准定位\n问题中的核心矛盾" },
    { num: "03", title: "方案生成", desc: "匹配创新原理\n给出可落地方案" }
  ];
  
  features.forEach((f, i) => {
    let x = 0.8 + i * 3;
    
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 1.5, w: 2.8, h: 3.8,
      fill: { color: i === 0 ? COLORS.coral : i === 1 ? COLORS.gold : COLORS.navy }
    });
    
    slide.addText(f.num, {
      x: x + 0.3, y: 1.7, w: 2.2, h: 0.6,
      fontSize: 24, fontFace: 'Georgia', color: i === 1 ? COLORS.navy : 'FFFFFF',
      bold: true, align: 'center'
    });
    
    slide.addText(f.title, {
      x: x + 0.3, y: 2.4, w: 2.2, h: 0.6,
      fontSize: 18, fontFace: 'Arial', color: i === 1 ? COLORS.navy : 'FFFFFF',
      bold: true, align: 'center'
    });
    
    slide.addText(f.desc, {
      x: x + 0.3, y: 3.1, w: 2.2, h: 1.8,
      fontSize: 14, fontFace: 'Arial', color: i === 1 ? COLORS.navy : 'FFFFFF',
      align: 'center'
    });
  });
}

function createSlide5() {
  let slide = pres.addSlide();
  slide.background = { color: COLORS.navy };
  
  slide.addText("真实案例", {
    x: 0.5, y: 0.4, w: 9, h: 0.8,
    fontSize: 32, fontFace: 'Georgia', color: COLORS.gold,
    bold: true, align: 'center'
  });
  
  // 案例卡片
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.4, w: 8.4, h: 4,
    fill: { color: 'FFFFFF' }
  });
  
  slide.addText("案例：与父母的代际沟通困境", {
    x: 1.2, y: 1.6, w: 8, h: 0.6,
    fontSize: 20, fontFace: 'Arial', color: COLORS.coral,
    bold: true, align: 'left'
  });
  
  slide.addText([
    { text: "问题：想独立但不想伤害父母感情", options: { breakLine: true } },
    { text: "矛盾：个人自由 ←→ 家庭和谐", options: { breakLine: true } },
    { text: "方案：找到'既能独立又不让父母感到被抛弃'的第三条路", options: { breakLine: true } }
  ], {
    x: 1.2, y: 2.4, w: 8, h: 2.5,
    fontSize: 16, fontFace: 'Arial', color: '333333',
    align: 'left', valign: 'top'
  });
}

function createSlide6() {
  let slide = pres.addSlide();
  slide.background = { color: COLORS.cream };
  
  slide.addText("双重版本，满足不同需求", {
    x: 0.5, y: 0.4, w: 9, h: 0.8,
    fontSize: 32, fontFace: 'Georgia', color: COLORS.navy,
    bold: true, align: 'center'
  });
  
  // 专业版
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.4, w: 4.1, h: 3.8,
    fill: { color: COLORS.navy }
  });
  
  slide.addText("专业版", {
    x: 0.8, y: 1.5, w: 4.1, h: 0.7,
    fontSize: 22, fontFace: 'Georgia', color: COLORS.gold,
    bold: true, align: 'center'
  });
  
  slide.addText([
    { text: "• 严谨的问题分析框架", options: { breakLine: true } },
    { text: "• 完整的TRIZ工具链", options: { breakLine: true } },
    { text: "• 深度的矛盾分析", options: { breakLine: true } },
    { text: "• 适合复杂商业问题", options: { breakLine: true } }
  ], {
    x: 1.2, y: 2.3, w: 3.3, h: 2.6,
    fontSize: 15, fontFace: 'Arial', color: 'FFFFFF',
    align: 'left'
  });
  
  // 生活版
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.1, y: 1.4, w: 4.1, h: 3.8,
    fill: { color: COLORS.coral }
  });
  
  slide.addText("生活版", {
    x: 5.1, y: 1.5, w: 4.1, h: 0.7,
    fontSize: 22, fontFace: 'Georgia', color: 'FFFFFF',
    bold: true, align: 'center'
  });
  
  slide.addText([
    { text: "• 轻松易懂的语言", options: { breakLine: true } },
    { text: "• 聚焦日常生活场景", options: { breakLine: true } },
    { text: "• 快速获得行动指南", options: { breakLine: true } },
    { text: "• 夫妻·家庭·人际关系", options: { breakLine: true } }
  ], {
    x: 5.5, y: 2.3, w: 3.3, h: 2.6,
    fontSize: 15, fontFace: 'Arial', color: 'FFFFFF',
    align: 'left'
  });
}

function createSlide7() {
  let slide = pres.addSlide();
  slide.background = { color: COLORS.coral };
  
  slide.addText("使用流程", {
    x: 0.5, y: 0.4, w: 9, h: 0.8,
    fontSize: 32, fontFace: 'Georgia', color: 'FFFFFF',
    bold: true, align: 'center'
  });
  
  const steps = [
    { n: "1", t: "描述困扰" },
    { n: "2", t: "AI引导分析" },
    { n: "3", t: "发现矛盾" },
    { n: "4", t: "获得方案" }
  ];
  
  steps.forEach((s, i) => {
    let x = 1.2 + i * 2.3;
    
    slide.addShape(pres.shapes.OVAL, {
      x: x + 0.4, y: 1.5, w: 1.4, h: 1.4,
      fill: { color: COLORS.gold }
    });
    
    slide.addText(s.n, {
      x: x + 0.4, y: 1.5, w: 1.4, h: 1.4,
      fontSize: 28, fontFace: 'Georgia', color: COLORS.navy,
      bold: true, align: 'center', valign: 'middle'
    });
    
    slide.addText(s.t, {
      x: x, y: 3.1, w: 2.2, h: 0.5,
      fontSize: 14, fontFace: 'Arial', color: 'FFFFFF',
      align: 'center'
    });
    
    if (i < 3) {
      slide.addShape(pres.shapes.LINE, {
        x: x + 1.8, y: 2.2, w: 0.5, h: 0,
        line: { color: COLORS.gold, width: 2, dashType: 'dash' }
      });
    }
  });
  
  slide.addText("3分钟发现问题症结\n10分钟获得解决方案", {
    x: 0.5, y: 4, w: 9, h: 1.2,
    fontSize: 18, fontFace: 'Arial', color: 'FFFFFF',
    align: 'center'
  });
}

function createSlide8() {
  let slide = pres.addSlide();
  slide.background = { color: COLORS.navy };
  
  slide.addText("开始改变，从这一刻起", {
    x: 0.5, y: 0.5, w: 9, h: 0.8,
    fontSize: 32, fontFace: 'Georgia', color: COLORS.gold,
    bold: true, align: 'center'
  });
  
  slide.addText([
    { text: "每一个困境，都藏着一个更好的解决方案", options: { breakLine: true } },
    { text: "", options: { breakLine: true } },
    { text: "让TRIZ帮你找到它", options: { breakLine: true } }
  ], {
    x: 0.5, y: 1.5, w: 9, h: 2,
    fontSize: 20, fontFace: 'Arial', color: 'FFFFFF',
    align: 'center'
  });
  
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 3.5, y: 3.5, w: 3, h: 1.2,
    fill: { color: COLORS.coral }
  });
  
  slide.addText("立即体验", {
    x: 3.5, y: 3.5, w: 3, h: 1.2,
    fontSize: 20, fontFace: 'Georgia', color: 'FFFFFF',
    bold: true, align: 'center', valign: 'middle'
  });
  
  slide.addText("扫码使用 TRIZ 问题解决小程序", {
    x: 0.5, y: 4.9, w: 9, h: 0.5,
    fontSize: 14, fontFace: 'Arial', color: COLORS.gold,
    align: 'center'
  });
}

// 创建所有幻灯片
createSlide1();
createSlide2();
createSlide3();
createSlide4();
createSlide5();
createSlide6();
createSlide7();
createSlide8();

pres.writeFile({ fileName: "docs/TRIZ项目介绍.pptx" })
  .then(() => console.log("PPT已生成: docs/TRIZ项目介绍.pptx"))
  .catch(err => console.error("生成失败:", err));
