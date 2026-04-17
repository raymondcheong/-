/**
 * 高级分析器 - 专为香港B端冻肉门店、贸易商优化
 * 提取：价格变化、影响程度、关键信息
 */

// 产品词典 - 扩展版本
const PRODUCT_DICTIONARY = {
  // 牛肉类
  beef: {
    keywords: ['beef', 'cattle', 'steer', 'heifer', 'cow', 'bull', 'wagyu', 'angus', 'hereford', 'brahman'],
    cn: '牛肉',
    variants: {
      'frozen beef': '冻牛肉',
      'fresh beef': '鲜牛肉',
      'beef cuts': '牛肉切块',
      'beef offal': '牛内脏',
      'beef tripe': '牛肚',
      'beef tongue': '牛舌',
      'beef liver': '牛肝',
      'oxtail': '牛尾',
    },
  },
  // 猪肉类
  pork: {
    keywords: ['pork', 'hog', 'swine', 'pig', 'bacon', 'ham'],
    cn: '猪肉',
    variants: {
      'frozen pork': '冻猪肉',
      'pork belly': '五花肉',
      'pork chop': '猪排',
      'pork loin': '猪里脊',
      'pork offal': '猪内脏',
    },
  },
  // 鸡肉类
  chicken: {
    keywords: ['chicken', 'poultry', 'broiler', 'hen', 'rooster'],
    cn: '鸡肉',
    variants: {
      'frozen chicken': '冻鸡肉',
      'chicken breast': '鸡胸肉',
      'chicken wing': '鸡翅',
      'chicken feet': '鸡爪',
    },
  },
  // 羊肉类
  lamb: {
    keywords: ['lamb', 'sheep', 'mutton', 'goat'],
    cn: '羊肉',
    variants: {
      'frozen lamb': '冻羊肉',
      'lamb chop': '羊排',
    },
  },
  // 海鲜类
  salmon: {
    keywords: ['salmon', 'atlantic salmon', 'pacific salmon'],
    cn: '三文鱼',
    variants: {
      'frozen salmon': '冻三文鱼',
      'salmon fillet': '三文鱼柳',
      'smoked salmon': '烟熏三文鱼',
    },
  },
  shrimp: {
    keywords: ['shrimp', 'prawn', 'krill'],
    cn: '虾',
    variants: {
      'frozen shrimp': '冻虾',
      'white shrimp': '白虾',
      'tiger shrimp': '虎虾',
      'vannamei': '南美白虾',
    },
  },
  crab: {
    keywords: ['crab', 'snow crab', 'king crab', 'dungeness', 'blue crab'],
    cn: '蟹',
    variants: {
      'frozen crab': '冻蟹',
      'crab meat': '蟹肉',
      'king crab': '帝王蟹',
      'snow crab': '雪蟹',
    },
  },
  lobster: {
    keywords: ['lobster', 'rock lobster', 'spiny lobster'],
    cn: '龙虾',
    variants: {
      'frozen lobster': '冻龙虾',
      'lobster tail': '龙虾尾',
    },
  },
  tuna: {
    keywords: ['tuna', 'bluefin', 'yellowfin', 'skipjack', 'bigeye'],
    cn: '金枪鱼',
    variants: {
      'frozen tuna': '冻金枪鱼',
      'tuna loin': '金枪鱼柳',
    },
  },
  cod: {
    keywords: ['cod', 'atlantic cod', 'pacific cod'],
    cn: '鳕鱼',
    variants: {
      'frozen cod': '冻鳕鱼',
      'cod fillet': '鳕鱼柳',
    },
  },
  pollock: {
    keywords: ['pollock', 'alaska pollock'],
    cn: '狭鳕',
    variants: {
      'frozen pollock': '冻狭鳕',
    },
  },
  scallop: {
    keywords: ['scallop', 'bay scallop', 'sea scallop'],
    cn: '扇贝',
    variants: {
      'frozen scallop': '冻扇贝',
    },
  },
  squid: {
    keywords: ['squid', 'calamari', 'illex'],
    cn: '鱿鱼',
    variants: {
      'frozen squid': '冻鱿鱼',
    },
  },
};

// 地区词典
const REGION_DICTIONARY = {
  // 主要出口国
  australia: { en: 'Australia', cn: '澳洲', type: 'exporter' },
  brazil: { en: 'Brazil', cn: '巴西', type: 'exporter' },
  argentina: { en: 'Argentina', cn: '阿根廷', type: 'exporter' },
  'new zealand': { en: 'New Zealand', cn: '新西兰', type: 'exporter' },
  usa: { en: 'USA', cn: '美国', type: 'exporter' },
  canada: { en: 'Canada', cn: '加拿大', type: 'exporter' },
  norway: { en: 'Norway', cn: '挪威', type: 'exporter' },
  chile: { en: 'Chile', cn: '智利', type: 'exporter' },
  // 主要进口国/市场
  china: { en: 'China', cn: '中国', type: 'importer' },
  japan: { en: 'Japan', cn: '日本', type: 'importer' },
  'south korea': { en: 'South Korea', cn: '韩国', type: 'importer' },
  'hong kong': { en: 'Hong Kong', cn: '香港', type: 'importer' },
  eu: { en: 'EU', cn: '欧盟', type: 'importer' },
  'united kingdom': { en: 'UK', cn: '英国', type: 'importer' },
  germany: { en: 'Germany', cn: '德国', type: 'importer' },
  // 其他地区
  india: { en: 'India', cn: '印度', type: 'other' },
  vietnam: { en: 'Vietnam', cn: '越南', type: 'other' },
  thailand: { en: 'Thailand', cn: '泰国', type: 'other' },
  indonesia: { en: 'Indonesia', cn: '印尼', type: 'other' },
  russia: { en: 'Russia', cn: '俄罗斯', type: 'other' },
};

// 价格单位
const PRICE_UNITS = ['kg', 'kilo', 'kilogram', 'ton', 'tonne', 'lb', 'pound', 'unit', 'carton', 'box'];

// 货币
const CURRENCIES = {
  usd: { symbol: '$', name: 'USD' },
  eur: { symbol: '€', name: 'EUR' },
  gbp: { symbol: '£', name: 'GBP' },
  aud: { symbol: 'A$', name: 'AUD' },
  hkd: { symbol: 'HK$', name: 'HKD' },
  cny: { symbol: '¥', name: 'CNY' },
  jpy: { symbol: '¥', name: 'JPY' },
};

/**
 * 提取价格信息
 * 支持格式: $10/kg, USD 100 per ton, from $8 to $12 per kg
 */
function extractPriceInfo(text) {
  const prices = [];
  const lowerText = text.toLowerCase();
  
  // 价格变化模式
  const pricePatterns = [
    // from $X to $Y per kg
    /from\s+\$?(\d+(?:\.\d+)?)\s*(?:to|and)\s+\$?(\d+(?:\.\d+)?)\s*(?:per\s+)?(kg|kilo|kilogram|ton|tonne|lb|pound)/gi,
    // $X-$Y/kg
    /\$?(\d+(?:\.\d+)?)\s*[-–]\s*\$?(\d+(?:\.\d+)?)\s*\/(kg|kilo|kilogram|ton|tonne|lb|pound)/gi,
    // increased/decreased by $X per kg
    /(increase|decrease|rise|fall|drop|gain|up|down)\s+(?:by\s+)?\$?(\d+(?:\.\d+)?)\s*(?:per\s+)?(kg|kilo|kilogram|ton|tonne|lb|pound)/gi,
    // $X per kg
    /\$?(\d+(?:\.\d+)?)\s*(?:per\s+|\/)(kg|kilo|kilogram|ton|tonne|lb|pound)/gi,
  ];
  
  for (const pattern of pricePatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const priceInfo = {
        raw: match[0],
        type: 'single',
        unit: match[match.length - 1],
      };
      
      // 判断是否为价格区间
      if (match[1] && match[2] && !isNaN(parseFloat(match[1]))) {
        priceInfo.type = 'range';
        priceInfo.from = parseFloat(match[1]);
        priceInfo.to = parseFloat(match[2]);
        priceInfo.change = priceInfo.to - priceInfo.from;
        priceInfo.changePercent = ((priceInfo.change / priceInfo.from) * 100).toFixed(1);
      } else if (match[2]) {
        // 变化幅度
        const changeType = match[1]?.toLowerCase() || '';
        priceInfo.changeAmount = parseFloat(match[2]);
        priceInfo.changeDirection = ['increase', 'rise', 'gain', 'up'].includes(changeType) ? 'up' : 'down';
      } else {
        priceInfo.value = parseFloat(match[1]);
      }
      
      prices.push(priceInfo);
    }
  }
  
  return prices;
}

/**
 * 提取百分比变化
 */
function extractPercentChange(text) {
  const changes = [];
  
  const patterns = [
    // increased/decreased by X%
    /(increase|decrease|rise|fall|drop|gain|up|down)\s+(?:by\s+)?(\d+(?:\.\d+)?)\s*%/gi,
    // X% increase/decrease
    /(\d+(?:\.\d+)?)\s*%\s*(increase|decrease|rise|fall|drop|gain)/gi,
    // up/down X%
    /(?:up|down)\s+(\d+(?:\.\d+)?)\s*%/gi,
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const direction = match[1]?.toLowerCase();
      const percent = parseFloat(match[2] || match[1]);
      
      changes.push({
        raw: match[0],
        percent,
        direction: ['increase', 'rise', 'gain', 'up'].includes(direction) ? 'up' : 'down',
      });
    }
  }
  
  return changes;
}

/**
 * 提取产品信息
 */
function extractProducts(text) {
  const products = [];
  const lowerText = text.toLowerCase();
  
  for (const [key, data] of Object.entries(PRODUCT_DICTIONARY)) {
    for (const keyword of data.keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        // 检查变体
        let variant = null;
        for (const [vKey, vName] of Object.entries(data.variants)) {
          if (lowerText.includes(vKey.toLowerCase())) {
            variant = vName;
            break;
          }
        }
        
        products.push({
          key,
          en: variant || data.cn,
          cn: variant || data.cn,
          confidence: variant ? 'high' : 'medium',
        });
        break;
      }
    }
  }
  
  // 去重
  const seen = new Set();
  return products.filter(p => {
    if (seen.has(p.cn)) return false;
    seen.add(p.cn);
    return true;
  });
}

/**
 * 提取地区信息
 */
function extractRegions(text) {
  const regions = [];
  const lowerText = text.toLowerCase();
  
  for (const [key, data] of Object.entries(REGION_DICTIONARY)) {
    if (lowerText.includes(key.toLowerCase()) || lowerText.includes(data.en.toLowerCase())) {
      regions.push({
        key,
        en: data.en,
        cn: data.cn,
        type: data.type,
      });
    }
  }
  
  return regions;
}

/**
 * 提取关税/贸易政策信息
 */
function extractTariffInfo(text) {
  const info = {
    hasTariff: false,
    keywords: [],
    details: [],
    countries: [],
  };
  
  const lowerText = text.toLowerCase();
  
  const tariffKeywords = [
    { en: 'tariff', cn: '关税', severity: 'high' },
    { en: 'duty', cn: '关税', severity: 'high' },
    { en: 'import tax', cn: '进口税', severity: 'high' },
    { en: 'trade war', cn: '贸易战', severity: 'high' },
    { en: 'trade barrier', cn: '贸易壁垒', severity: 'medium' },
    { en: 'quota', cn: '配额', severity: 'medium' },
    { en: 'ban', cn: '禁令', severity: 'high' },
    { en: 'restriction', cn: '限制', severity: 'medium' },
    { en: 'anti-dumping', cn: '反倾销', severity: 'high' },
    { en: 'sanction', cn: '制裁', severity: 'high' },
    { en: 'embargo', cn: '禁运', severity: 'high' },
    { en: 'customs duty', cn: '海关关税', severity: 'high' },
    { en: 'free trade agreement', cn: '自贸协定', severity: 'low' },
    { en: 'bilateral trade', cn: '双边贸易', severity: 'low' },
    { en: 'export subsidy', cn: '出口补贴', severity: 'medium' },
    { en: 'import license', cn: '进口许可证', severity: 'medium' },
    { en: 'phytosanitary', cn: '植物检疫', severity: 'medium' },
  ];
  
  for (const kw of tariffKeywords) {
    if (lowerText.includes(kw.en.toLowerCase())) {
      info.hasTariff = true;
      info.keywords.push(kw);
    }
  }
  
  // 提取涉及国家
  info.countries = extractRegions(text);
  
  return info;
}

/**
 * 评估影响程度
 */
function assessImpactLevel(text, priceChanges, percentChanges) {
  let level = 'low'; // low, medium, high
  const lowerText = text.toLowerCase();
  
  // 根据价格变化幅度判断
  const maxPercent = Math.max(...percentChanges.map(p => p.percent), 0);
  if (maxPercent > 20) level = 'high';
  else if (maxPercent > 10) level = 'medium';
  
  // 根据关键词判断
  const highImpactWords = ['crisis', 'surge', 'plunge', 'collapse', 'ban', 'embargo', 'shortage', 'disruption'];
  const mediumImpactWords = ['increase', 'decrease', 'rise', 'fall', 'concern', 'pressure'];
  
  for (const word of highImpactWords) {
    if (lowerText.includes(word)) {
      level = 'high';
      break;
    }
  }
  
  if (level === 'low') {
    for (const word of mediumImpactWords) {
      if (lowerText.includes(word)) {
        level = 'medium';
        break;
      }
    }
  }
  
  return {
    level,
    maxPercentChange: maxPercent,
  };
}

/**
 * 提取未来预期
 */
function extractFutureOutlook(text) {
  const outlook = {
    direction: 'neutral', // bullish, bearish, neutral
    keywords: [],
    forecasts: [],
  };
  
  const lowerText = text.toLowerCase();
  
  // 看涨关键词
  const bullishWords = [
    { en: 'expected to grow', cn: '预计增长' },
    { en: 'forecast increase', cn: '预测上涨' },
    { en: 'outlook positive', cn: '前景乐观' },
    { en: 'bullish', cn: '看涨' },
    { en: 'market expansion', cn: '市场扩张' },
    { en: 'demand growth', cn: '需求增长' },
    { en: 'strong demand', cn: '需求强劲' },
  ];
  
  // 看跌关键词
  const bearishWords = [
    { en: 'expected to decline', cn: '预计下降' },
    { en: 'forecast decrease', cn: '预测下跌' },
    { en: 'outlook negative', cn: '前景悲观' },
    { en: 'bearish', cn: '看跌' },
    { en: 'market contraction', cn: '市场收缩' },
    { en: 'demand decline', cn: '需求下降' },
    { en: 'weak demand', cn: '需求疲软' },
  ];
  
  let bullishCount = 0;
  let bearishCount = 0;
  
  for (const word of bullishWords) {
    if (lowerText.includes(word.en.toLowerCase())) {
      bullishCount++;
      outlook.keywords.push(word);
    }
  }
  
  for (const word of bearishWords) {
    if (lowerText.includes(word.en.toLowerCase())) {
      bearishCount++;
      outlook.keywords.push(word);
    }
  }
  
  if (bullishCount > bearishCount) outlook.direction = 'bullish';
  else if (bearishCount > bullishCount) outlook.direction = 'bearish';
  
  return outlook;
}

/**
 * 生成简要原因
 */
function generateBriefReason(text, analysis) {
  const reasons = [];
  const lowerText = text.toLowerCase();
  
  // 关税原因
  if (analysis.tariff.hasTariff) {
    reasons.push('贸易政策变动');
  }
  
  // 供需原因
  if (lowerText.includes('shortage') || lowerText.includes('supply')) {
    reasons.push('供应变化');
  }
  if (lowerText.includes('demand')) {
    reasons.push('需求变化');
  }
  
  // 季节性
  if (lowerText.includes('seasonal') || lowerText.includes('season')) {
    reasons.push('季节性因素');
  }
  
  // 汇率
  if (lowerText.includes('currency') || lowerText.includes('exchange rate')) {
    reasons.push('汇率波动');
  }
  
  // 物流
  if (lowerText.includes('shipping') || lowerText.includes('freight') || lowerText.includes('logistics')) {
    reasons.push('物流成本');
  }
  
  // 疫情/健康
  if (lowerText.includes('disease') || lowerText.includes('outbreak') || lowerText.includes('covid')) {
    reasons.push('疫情/疾病影响');
  }
  
  return reasons.length > 0 ? reasons.join('、') : '市场因素';
}

/**
 * 分析单篇文章 - 高级版
 */
function analyzeArticleAdvanced(article) {
  const text = `${article.title} ${article.excerpt}`;
  
  // 提取各类信息
  const products = extractProducts(text);
  const regions = extractRegions(text);
  const priceChanges = extractPriceInfo(text);
  const percentChanges = extractPercentChange(text);
  const tariffInfo = extractTariffInfo(text);
  const impactLevel = assessImpactLevel(text, priceChanges, percentChanges);
  const futureOutlook = extractFutureOutlook(text);
  const briefReason = generateBriefReason(text, { tariff: tariffInfo });
  
  return {
    ...article,
    analysis: {
      // 1. 产品
      products,
      
      // 2. 地区
      regions,
      
      // 3. 价格变化
      priceChanges,
      percentChanges,
      
      // 4. 影响程度
      impact: {
        level: impactLevel.level,
        maxPercentChange: impactLevel.maxPercentChange,
        description: impactLevel.level === 'high' ? '重大影响' : 
                     impactLevel.level === 'medium' ? '中等影响' : '轻微影响',
      },
      
      // 5. 关税/贸易政策
      tariff: tariffInfo,
      
      // 6. 未来预期
      futureOutlook,
      
      // 7. 简要原因
      briefReason,
      
      // 分析时间
      analyzedAt: new Date().toISOString(),
    },
  };
}

/**
 * 批量分析
 */
function analyzeArticlesAdvanced(articles) {
  return articles.map(analyzeArticleAdvanced);
}

/**
 * 生成B端展示板数据
 */
function generateDashboardData(analyzedArticles) {
  // 按影响程度排序
  const highImpact = analyzedArticles.filter(a => a.analysis.impact.level === 'high');
  const priceChanged = analyzedArticles.filter(a => a.analysis.priceChanges.length > 0 || a.analysis.percentChanges.length > 0);
  const tariffRelated = analyzedArticles.filter(a => a.analysis.tariff.hasTariff);
  
  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalArticles: analyzedArticles.length,
      highImpactCount: highImpact.length,
      priceChangeCount: priceChanged.length,
      tariffRelatedCount: tariffRelated.length,
    },
    // 重点关注的文章（高影响 + 有价格变化）
    priorityArticles: analyzedArticles
      .filter(a => a.analysis.impact.level === 'high' || a.analysis.priceChanges.length > 0)
      .slice(0, 10)
      .map(a => ({
        id: a.id,
        title: a.title,
        source: a.sourceName,
        sourceUrl: a.sourceUrl,
        category: a.category,
        // 关键信息摘要
        keyInfo: {
          products: a.analysis.products.slice(0, 3).map(p => p.cn),
          regions: a.analysis.regions.slice(0, 2).map(r => r.cn),
          impactLevel: a.analysis.impact.level,
          impactDesc: a.analysis.impact.description,
          priceChanges: a.analysis.priceChanges.slice(0, 2),
          percentChanges: a.analysis.percentChanges.slice(0, 2),
          futureOutlook: a.analysis.futureOutlook.direction,
          briefReason: a.analysis.briefReason,
          hasTariff: a.analysis.tariff.hasTariff,
        },
        publishDate: a.publishDate,
      })),
    // 价格变动列表
    priceUpdates: priceChanged.slice(0, 10).map(a => ({
      id: a.id,
      title: a.title,
      products: a.analysis.products.map(p => p.cn),
      priceChanges: a.analysis.priceChanges,
      percentChanges: a.analysis.percentChanges,
      source: a.sourceName,
      sourceUrl: a.sourceUrl,
    })),
    // 关税相关
    tariffUpdates: tariffRelated.slice(0, 10).map(a => ({
      id: a.id,
      title: a.title,
      tariffKeywords: a.analysis.tariff.keywords,
      countries: a.analysis.tariff.countries.map(c => c.cn),
      source: a.sourceName,
      sourceUrl: a.sourceUrl,
    })),
  };
}

module.exports = {
  analyzeArticleAdvanced,
  analyzeArticlesAdvanced,
  generateDashboardData,
  extractPriceInfo,
  extractProducts,
  extractRegions,
  extractTariffInfo,
};
