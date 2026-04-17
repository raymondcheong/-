/**
 * 文章级四维度分析器
 * 对每篇文章提取：产品、影响、未来趋势、关税
 */

// 产品词典
const PRODUCT_KEYWORDS = {
  // 肉类
  meat: {
    beef: { cn: '牛肉', category: 'meat', related: ['cattle', 'steer', 'heifer', 'wagyu', 'angus'] },
    pork: { cn: '猪肉', category: 'meat', related: ['hog', 'swine', 'pig'] },
    chicken: { cn: '鸡肉', category: 'meat', related: ['poultry', 'broiler'] },
    lamb: { cn: '羊肉', category: 'meat', related: ['sheep', 'mutton'] },
    goat: { cn: '山羊肉', category: 'meat', related: [] },
    buffalo: { cn: '水牛肉', category: 'meat', related: ['bison'] },
  },
  // 冻肉/加工肉
  processed: {
    'frozen meat': { cn: '冻肉', category: 'frozen', related: ['frozen beef', 'frozen pork'] },
    'processed meat': { cn: '加工肉', category: 'processed', related: ['sausage', 'bacon', 'ham'] },
    offal: { cn: '内脏', category: 'processed', related: ['tripe', 'liver', 'kidney'] },
  },
  // 海鲜
  seafood: {
    salmon: { cn: '三文鱼', category: 'seafood', related: ['atlantic salmon', 'pacific salmon'] },
    shrimp: { cn: '虾', category: 'seafood', related: ['prawn', 'krill'] },
    crab: { cn: '蟹', category: 'seafood', related: ['snow crab', 'king crab', 'dungeness'] },
    lobster: { cn: '龙虾', category: 'seafood', related: ['rock lobster', 'spiny lobster'] },
    tuna: { cn: '金枪鱼', category: 'seafood', related: ['bluefin', 'yellowfin', 'skipjack'] },
    cod: { cn: '鳕鱼', category: 'seafood', related: ['atlantic cod', 'pacific cod'] },
    pollock: { cn: '狭鳕', category: 'seafood', related: ['alaska pollock'] },
    tilapia: { cn: '罗非鱼', category: 'seafood', related: [] },
    catfish: { cn: '鲶鱼', category: 'seafood', related: [] },
    scallop: { cn: '扇贝', category: 'seafood', related: [] },
    squid: { cn: '鱿鱼', category: 'seafood', related: ['calamari', 'illex'] },
    octopus: { cn: '章鱼', category: 'seafood', related: [] },
    mackerel: { cn: '鲭鱼', category: 'seafood', related: [] },
    herring: { cn: '鲱鱼', category: 'seafood', related: [] },
    sardine: { cn: '沙丁鱼', category: 'seafood', related: [] },
    anchovy: { cn: '凤尾鱼', category: 'seafood', related: [] },
    oyster: { cn: '牡蛎', category: 'seafood', related: ['mussel', 'clam'] },
  },
  // 畜牧业相关
  livestock: {
    cattle: { cn: '活牛', category: 'livestock', related: ['cow', 'bull', 'calf'] },
    hog: { cn: '生猪', category: 'livestock', related: ['pig', 'swine'] },
    sheep: { cn: '绵羊', category: 'livestock', related: ['lamb', 'ewe'] },
    poultry: { cn: '家禽', category: 'livestock', related: ['chicken', 'turkey', 'duck'] },
    feedlot: { cn: '育肥场', category: 'livestock', related: [] },
    abattoir: { cn: '屠宰场', category: 'livestock', related: ['slaughterhouse'] },
  },
};

// 关税/贸易政策关键词
const TARIFF_KEYWORDS = {
  tariff: { cn: '关税', weight: 10 },
  duty: { cn: '关税', weight: 10 },
  'import tax': { cn: '进口税', weight: 9 },
  'trade war': { cn: '贸易战', weight: 9 },
  'trade barrier': { cn: '贸易壁垒', weight: 8 },
  quota: { cn: '配额', weight: 8 },
  ban: { cn: '禁令', weight: 9 },
  restriction: { cn: '限制', weight: 7 },
  'anti-dumping': { cn: '反倾销', weight: 8 },
  'countervailing': { cn: '反补贴', weight: 8 },
  sanction: { cn: '制裁', weight: 7 },
  embargo: { cn: '禁运', weight: 9 },
  'customs duty': { cn: '海关关税', weight: 8 },
  'most favored nation': { cn: '最惠国待遇', weight: 6 },
  mfn: { cn: '最惠国', weight: 6 },
  'free trade agreement': { cn: '自贸协定', weight: 6 },
  fta: { cn: '自贸协定', weight: 6 },
  'bilateral trade': { cn: '双边贸易', weight: 5 },
  'export subsidy': { cn: '出口补贴', weight: 7 },
  'import license': { cn: '进口许可证', weight: 6 },
  'phytosanitary': { cn: '植物检疫', weight: 5 },
  sps: { cn: '卫生与植物检疫', weight: 5 },
};

// 影响关键词
const IMPACT_KEYWORDS = {
  // 价格上涨
  price: {
    'price increase': { cn: '价格上涨', sentiment: 'negative' },
    'price rise': { cn: '价格上升', sentiment: 'negative' },
    'price surge': { cn: '价格飙升', sentiment: 'negative' },
    'price hike': { cn: '价格暴涨', sentiment: 'negative' },
    'record high': { cn: '历史新高', sentiment: 'negative' },
    inflation: { cn: '通胀', sentiment: 'negative' },
    'cost pressure': { cn: '成本压力', sentiment: 'negative' },
  },
  // 价格下跌
  'price-down': {
    'price drop': { cn: '价格下跌', sentiment: 'positive' },
    'price fall': { cn: '价格下降', sentiment: 'positive' },
    'price decline': { cn: '价格下滑', sentiment: 'positive' },
    'record low': { cn: '历史新低', sentiment: 'positive' },
  },
  // 供应影响
  supply: {
    shortage: { cn: '短缺', sentiment: 'negative' },
    'supply chain': { cn: '供应链', sentiment: 'neutral' },
    disruption: { cn: '中断', sentiment: 'negative' },
    'production cut': { cn: '减产', sentiment: 'negative' },
    'harvest decline': { cn: '收成下降', sentiment: 'negative' },
  },
  // 需求影响
  demand: {
    'demand increase': { cn: '需求增加', sentiment: 'positive' },
    'demand growth': { cn: '需求增长', sentiment: 'positive' },
    'demand decline': { cn: '需求下降', sentiment: 'negative' },
    'consumer preference': { cn: '消费者偏好', sentiment: 'neutral' },
  },
  // 贸易影响
  trade: {
    'export growth': { cn: '出口增长', sentiment: 'positive' },
    'export decline': { cn: '出口下降', sentiment: 'negative' },
    'import surge': { cn: '进口激增', sentiment: 'neutral' },
    'trade deficit': { cn: '贸易逆差', sentiment: 'negative' },
    'trade surplus': { cn: '贸易顺差', sentiment: 'positive' },
  },
  // 行业影响
  industry: {
    'profit margin': { cn: '利润率', sentiment: 'neutral' },
    'market share': { cn: '市场份额', sentiment: 'neutral' },
    competition: { cn: '竞争', sentiment: 'neutral' },
    consolidation: { cn: '整合', sentiment: 'neutral' },
    bankruptcy: { cn: '破产', sentiment: 'negative' },
    'business closure': { cn: '停业', sentiment: 'negative' },
  },
};

// 未来趋势关键词
const TREND_KEYWORDS = {
  // 增长趋势
  growth: {
    'expected to grow': { cn: '预计增长' },
    'forecast increase': { cn: '预测上涨' },
    'projected rise': { cn: '预计上升' },
    'outlook positive': { cn: '前景乐观' },
    'bullish': { cn: '看涨' },
  },
  // 下降趋势
  decline: {
    'expected to decline': { cn: '预计下降' },
    'forecast decrease': { cn: '预测下跌' },
    'projected fall': { cn: '预计下滑' },
    'outlook negative': { cn: '前景悲观' },
    'bearish': { cn: '看跌' },
  },
  // 政策趋势
  policy: {
    'policy change': { cn: '政策变化' },
    'regulatory update': { cn: '法规更新' },
    'new legislation': { cn: '新立法' },
    'trade agreement': { cn: '贸易协定' },
  },
  // 市场趋势
  market: {
    'market expansion': { cn: '市场扩张' },
    'market contraction': { cn: '市场收缩' },
    'new market': { cn: '新市场' },
    'emerging demand': { cn: '新兴需求' },
  },
  // 技术趋势
  technology: {
    innovation: { cn: '创新' },
    automation: { cn: '自动化' },
    'sustainable farming': { cn: '可持续养殖' },
    'aquaculture expansion': { cn: '水产养殖扩张' },
  },
};

/**
 * 提取产品信息
 */
function extractProducts(text) {
  const products = [];
  const lowerText = text.toLowerCase();
  
  for (const [category, items] of Object.entries(PRODUCT_KEYWORDS)) {
    for (const [en, info] of Object.entries(items)) {
      // 检查主关键词
      if (lowerText.includes(en.toLowerCase())) {
        products.push({
          en,
          cn: info.cn,
          category: info.category,
          confidence: 'high',
        });
      }
      // 检查相关关键词
      for (const related of info.related) {
        if (lowerText.includes(related.toLowerCase())) {
          products.push({
            en: related,
            cn: info.cn,
            category: info.category,
            confidence: 'medium',
          });
        }
      }
    }
  }
  
  // 去重
  const seen = new Set();
  return products.filter(p => {
    const key = p.cn;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * 提取关税信息
 */
function extractTariffInfo(text) {
  const info = {
    hasTariff: false,
    keywords: [],
    details: [],
    countries: [],
  };
  
  const lowerText = text.toLowerCase();
  
  // 检查关税关键词
  for (const [en, data] of Object.entries(TARIFF_KEYWORDS)) {
    if (lowerText.includes(en.toLowerCase())) {
      info.hasTariff = true;
      info.keywords.push({ en, cn: data.cn, weight: data.weight });
    }
  }
  
  // 提取涉及国家
  const countries = [
    { en: 'china', cn: '中国' },
    { en: 'united states', cn: '美国' },
    { en: 'usa', cn: '美国' },
    { en: 'australia', cn: '澳大利亚' },
    { en: 'japan', cn: '日本' },
    { en: 'south korea', cn: '韩国' },
    { en: 'eu', cn: '欧盟' },
    { en: 'european union', cn: '欧盟' },
    { en: 'brazil', cn: '巴西' },
    { en: 'argentina', cn: '阿根廷' },
    { en: 'new zealand', cn: '新西兰' },
    { en: 'canada', cn: '加拿大' },
    { en: 'india', cn: '印度' },
    { en: 'vietnam', cn: '越南' },
    { en: 'thailand', cn: '泰国' },
    { en: 'indonesia', cn: '印尼' },
    { en: 'norway', cn: '挪威' },
    { en: 'chile', cn: '智利' },
    { en: 'russia', cn: '俄罗斯' },
    { en: 'mexico', cn: '墨西哥' },
  ];
  
  for (const country of countries) {
    if (lowerText.includes(country.en.toLowerCase())) {
      info.countries.push(country);
    }
  }
  
  // 提取具体税率/数字
  const ratePattern = /(\d+(?:\.\d+)?)\s*(?:%|percent)\s*(?:tariff|duty|tax)/gi;
  const rates = text.match(ratePattern) || [];
  info.details.push(...rates.map(r => ({ type: 'rate', value: r })));
  
  return info;
}

/**
 * 提取影响信息
 */
function extractImpact(text) {
  const impact = {
    categories: [],
    sentiment: 'neutral',
    keyPoints: [],
  };
  
  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;
  
  for (const [category, keywords] of Object.entries(IMPACT_KEYWORDS)) {
    const found = [];
    for (const [en, data] of Object.entries(keywords)) {
      if (lowerText.includes(en.toLowerCase())) {
        found.push({ en, cn: data.cn, sentiment: data.sentiment });
        if (data.sentiment === 'positive') positiveCount++;
        if (data.sentiment === 'negative') negativeCount++;
      }
    }
    if (found.length > 0) {
      impact.categories.push({ category, items: found });
    }
  }
  
  // 判断整体情感
  if (positiveCount > negativeCount) impact.sentiment = 'positive';
  if (negativeCount > positiveCount) impact.sentiment = 'negative';
  
  return impact;
}

/**
 * 提取未来趋势
 */
function extractTrends(text) {
  const trends = {
    direction: 'neutral',
    keywords: [],
    forecasts: [],
  };
  
  const lowerText = text.toLowerCase();
  let growthCount = 0;
  let declineCount = 0;
  
  for (const [category, keywords] of Object.entries(TREND_KEYWORDS)) {
    for (const [en, data] of Object.entries(keywords)) {
      if (lowerText.includes(en.toLowerCase())) {
        trends.keywords.push({ en, cn: data.cn, category });
        if (category === 'growth') growthCount++;
        if (category === 'decline') declineCount++;
      }
    }
  }
  
  // 判断趋势方向
  if (growthCount > declineCount) trends.direction = 'growth';
  if (declineCount > growthCount) trends.direction = 'decline';
  
  // 提取预测数字
  const forecastPattern = /(?:expected|forecast|projected|estimated)\s+(?:to\s+)?(?:grow|rise|increase|decline|fall|drop)\s+(?:by\s+)?(\d+(?:\.\d+)?\s*%)/gi;
  const forecasts = text.match(forecastPattern) || [];
  trends.forecasts = forecasts;
  
  return trends;
}

/**
 * 分析单篇文章
 */
function analyzeArticle(article) {
  const text = `${article.title} ${article.excerpt}`;
  
  return {
    ...article,
    analysis: {
      // 1. 产品分析
      products: extractProducts(text),
      
      // 2. 影响分析
      impact: extractImpact(text),
      
      // 3. 未来趋势
      trends: extractTrends(text),
      
      // 4. 关税分析
      tariff: extractTariffInfo(text),
      
      // 分析时间
      analyzedAt: new Date().toISOString(),
    },
  };
}

/**
 * 生成文章摘要
 */
function generateSummary(analysis) {
  const parts = [];
  
  // 产品
  if (analysis.products.length > 0) {
    const products = analysis.products.slice(0, 3).map(p => p.cn).join('、');
    parts.push(`涉及产品: ${products}`);
  }
  
  // 关税
  if (analysis.tariff.hasTariff) {
    const keywords = analysis.tariff.keywords.slice(0, 2).map(k => k.cn).join('、');
    parts.push(`关税相关: ${keywords}`);
  }
  
  // 影响
  if (analysis.impact.categories.length > 0) {
    const sentiment = analysis.impact.sentiment === 'positive' ? '正面' : 
                      analysis.impact.sentiment === 'negative' ? '负面' : '中性';
    parts.push(`市场影响: ${sentiment}`);
  }
  
  // 趋势
  if (analysis.trends.direction !== 'neutral') {
    const direction = analysis.trends.direction === 'growth' ? '上升' : '下降';
    parts.push(`趋势: ${direction}`);
  }
  
  return parts.join(' | ');
}

/**
 * 批量分析文章
 */
function analyzeArticles(articles) {
  return articles.map(article => {
    const analyzed = analyzeArticle(article);
    analyzed.summary = generateSummary(analyzed.analysis);
    return analyzed;
  });
}

module.exports = {
  analyzeArticle,
  analyzeArticles,
  extractProducts,
  extractTariffInfo,
  extractImpact,
  extractTrends,
};
