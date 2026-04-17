/**
 * Multi-Source News Scraper v2
 * 支持 beefcentral.com 和 seafoodsource.com
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/news-v2.json');
const ANALYSIS_FILE = path.join(__dirname, '../data/analysis.json');

// 新闻源配置
const SOURCES = {
  beefcentral: {
    name: 'Beef Central',
    baseUrl: 'https://www.beefcentral.com',
    homepage: 'https://www.beefcentral.com/',
    category: 'meat',
    selectors: {
      articles: 'article, .post, .news-item',
      title: 'h2 a, h3 a, .entry-title a',
      excerpt: '.entry-summary p, .excerpt, p',
      date: '.entry-date, time, .date',
      link: 'a[href*="/news/"], a[href*="/property/"], a[href*="/processing/"]',
    },
  },
  seafoodsource: {
    name: 'SeafoodSource',
    baseUrl: 'https://www.seafoodsource.com',
    homepage: 'https://www.seafoodsource.com/',
    category: 'seafood',
    selectors: {
      articles: 'article, .article-card, .news-item',
      title: 'h3 a, h2 a, .article-title',
      excerpt: '.article-summary, .excerpt, p',
      date: '.article-date, time, .date',
      link: 'a[href*="/news/"]',
    },
  },
};

/**
 * 确保数据目录存在
 */
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

/**
 * 读取现有数据
 */
async function loadData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { news: [], lastUpdate: null };
  }
}

/**
 * 保存数据
 */
async function saveData(data) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * 保存分析报告
 */
async function saveAnalysis(analysis) {
  await ensureDataDir();
  await fs.writeFile(ANALYSIS_FILE, JSON.stringify(analysis, null, 2), 'utf-8');
}

/**
 * 抓取 Beef Central
 */
async function scrapeBeefCentral() {
  console.log('抓取 Beef Central...');
  const articles = [];
  
  try {
    const response = await axios.get(SOURCES.beefcentral.homepage, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 30000,
    });
    
    const $ = cheerio.load(response.data);
    
    // 抓取文章链接
    $('a[href*="/news/"], a[href*="/property/"], a[href*="/processing/"]').each((i, elem) => {
      const $link = $(elem);
      const href = $link.attr('href');
      const title = $link.text().trim();
      
      if (!href || !title || title.length < 15) return;
      if (title.includes('Read More') || title.includes('Continue')) return;
      
      // 获取父元素中的摘要
      let excerpt = '';
      const $parent = $link.closest('article, div[class*="post"], div[class*="news"]');
      if ($parent.length) {
        excerpt = $parent.find('p').first().text().trim();
      }
      
      // 获取日期
      let date = null;
      const dateMatch = title.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
      if (dateMatch) {
        const [d, m, y] = dateMatch[1].split('/');
        date = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
      }
      
      articles.push({
        id: `bc_${Buffer.from(href).toString('base64').substring(0, 12)}`,
        source: 'beefcentral',
        sourceName: 'Beef Central',
        sourceUrl: href.startsWith('http') ? href : `${SOURCES.beefcentral.baseUrl}${href}`,
        title,
        excerpt: excerpt || title,
        category: 'meat',
        scrapedAt: new Date().toISOString(),
        publishDate: date,
      });
    });
    
    console.log(`Beef Central: ${articles.length} 篇文章`);
    return articles;
    
  } catch (error) {
    console.error('Beef Central 抓取失败:', error.message);
    return [];
  }
}

/**
 * 抓取 SeafoodSource
 */
async function scrapeSeafoodSource() {
  console.log('抓取 SeafoodSource...');
  const articles = [];
  
  try {
    const response = await axios.get(SOURCES.seafoodsource.homepage, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 30000,
    });
    
    const $ = cheerio.load(response.data);
    
    // 抓取文章
    $('a[href*="/news/"]').each((i, elem) => {
      const $link = $(elem);
      const href = $link.attr('href');
      const title = $link.text().trim();
      
      if (!href || !title || title.length < 15) return;
      if (title.includes('More') || title.includes('›')) return;
      
      // 获取摘要
      let excerpt = '';
      const $parent = $link.closest('article, div, li');
      if ($parent.length) {
        excerpt = $parent.find('p').first().text().trim();
      }
      
      articles.push({
        id: `ss_${Buffer.from(href).toString('base64').substring(0, 12)}`,
        source: 'seafoodsource',
        sourceName: 'SeafoodSource',
        sourceUrl: href.startsWith('http') ? href : `${SOURCES.seafoodsource.baseUrl}${href}`,
        title,
        excerpt: excerpt || title,
        category: 'seafood',
        scrapedAt: new Date().toISOString(),
        publishDate: null,
      });
    });
    
    console.log(`SeafoodSource: ${articles.length} 篇文章`);
    return articles;
    
  } catch (error) {
    console.error('SeafoodSource 抓取失败:', error.message);
    return [];
  }
}

/**
 * 提取数字信息
 */
function extractNumbers(text) {
  const numbers = [];
  
  // 价格模式: $100, $1.50/kg, USD 100 million
  const pricePattern = /\$[\d,]+(?:\.\d+)?(?:\s*(?:million|billion|kg|ton|tons))?/gi;
  const prices = text.match(pricePattern) || [];
  numbers.push(...prices.map(p => ({ type: 'price', value: p })));
  
  // 百分比: 20%, up 15%, down 5%
  const percentPattern = /(?:up|down|increase|decrease|rise|fall)?\s*[+-]?\d+(?:\.\d+)?%/gi;
  const percents = text.match(percentPattern) || [];
  numbers.push(...percents.map(p => ({ type: 'percent', value: p })));
  
  // 数量: 100,000 MT, 50 million tonnes
  const quantityPattern = /\d[\d,]*(?:\.\d+)?\s*(?:MT|tonnes?|tons?|kg|million|billion)/gi;
  const quantities = text.match(quantityPattern) || [];
  numbers.push(...quantities.map(q => ({ type: 'quantity', value: q })));
  
  return numbers;
}

/**
 * 提取产品关键词
 */
function extractProducts(text) {
  const products = [];
  const lowerText = text.toLowerCase();
  
  // 肉类产品
  const meatProducts = {
    'beef': '牛肉',
    'cattle': '活牛',
    'steer': '阉牛',
    'heifer': '小母牛',
    'cow': '母牛',
    'bull': '公牛',
    'wagyu': '和牛',
    'angus': '安格斯牛',
    'feedlot': '育肥场',
    'abattoir': '屠宰场',
    'meat': '肉类',
  };
  
  // 水产品
  const seafoodProducts = {
    'salmon': '三文鱼',
    'shrimp': '虾',
    'prawn': '对虾',
    'crab': '蟹',
    'lobster': '龙虾',
    'tuna': '金枪鱼',
    'cod': '鳕鱼',
    'scallop': '扇贝',
    'squid': '鱿鱼',
    'pollock': '狭鳕',
    'tilapia': '罗非鱼',
    'catfish': '鲶鱼',
    'seafood': '海鲜',
    'fish': '鱼类',
  };
  
  // 检查肉类
  for (const [en, cn] of Object.entries(meatProducts)) {
    if (lowerText.includes(en)) {
      products.push({ en, cn, category: 'meat' });
    }
  }
  
  // 检查海鲜
  for (const [en, cn] of Object.entries(seafoodProducts)) {
    if (lowerText.includes(en)) {
      products.push({ en, cn, category: 'seafood' });
    }
  }
  
  return products;
}

/**
 * 提取关税相关信息
 */
function extractTariffInfo(text) {
  const info = [];
  const lowerText = text.toLowerCase();
  
  // 关税关键词
  const tariffKeywords = [
    { en: 'tariff', cn: '关税' },
    { en: 'duty', cn: '关税' },
    { en: 'import tax', cn: '进口税' },
    { en: 'trade war', cn: '贸易战' },
    { en: 'trade barrier', cn: '贸易壁垒' },
    { en: 'quota', cn: '配额' },
    { en: 'ban', cn: '禁令' },
    { en: 'restriction', cn: '限制' },
    { en: 'anti-dumping', cn: '反倾销' },
  ];
  
  for (const kw of tariffKeywords) {
    if (lowerText.includes(kw.en)) {
      info.push(kw);
    }
  }
  
  return info;
}

/**
 * 提取地区/国家信息
 */
function extractRegions(text) {
  const regions = [];
  const lowerText = text.toLowerCase();
  
  const countries = [
    { en: 'china', cn: '中国' },
    { en: 'usa', cn: '美国' },
    { en: 'united states', cn: '美国' },
    { en: 'australia', cn: '澳大利亚' },
    { en: 'japan', cn: '日本' },
    { en: 'korea', cn: '韩国' },
    { en: 'eu', cn: '欧盟' },
    { en: 'europe', cn: '欧洲' },
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
  ];
  
  for (const country of countries) {
    if (lowerText.includes(country.en)) {
      regions.push(country);
    }
  }
  
  return regions;
}

/**
 * 分析文章类型
 */
function analyzeArticleType(title, excerpt) {
  const text = `${title} ${excerpt}`.toLowerCase();
  
  if (text.includes('price') || text.includes('价格') || text.includes('cost') || text.includes('$')) {
    return 'price';
  }
  if (text.includes('tariff') || text.includes('duty') || text.includes('trade war') || text.includes('ban')) {
    return 'tariff';
  }
  if (text.includes('market') || text.includes('market')) {
    return 'market';
  }
  if (text.includes('analysis') || text.includes('report') || text.includes('study')) {
    return 'analysis';
  }
  if (text.includes('export') || text.includes('import') || text.includes('trade')) {
    return 'trade';
  }
  return 'news';
}

/**
 * 分析单篇文章
 */
function analyzeArticle(article) {
  const text = `${article.title} ${article.excerpt}`;
  
  return {
    ...article,
    analysis: {
      products: extractProducts(text),
      numbers: extractNumbers(text),
      tariffInfo: extractTariffInfo(text),
      regions: extractRegions(text),
      articleType: analyzeArticleType(article.title, article.excerpt),
    },
  };
}

/**
 * 生成综合分析报告
 */
function generateAnalysisReport(news) {
  console.log('生成分析报告...');
  
  // 分析所有文章
  const analyzedNews = news.map(analyzeArticle);
  
  // 统计产品
  const productStats = {};
  const tariffArticles = [];
  const priceArticles = [];
  const regionStats = {};
  
  for (const article of analyzedNews) {
    const { analysis } = article;
    
    // 产品统计
    for (const product of analysis.products) {
      const key = `${product.cn}(${product.en})`;
      if (!productStats[key]) {
        productStats[key] = { ...product, count: 0, articles: [] };
      }
      productStats[key].count++;
      productStats[key].articles.push(article.id);
    }
    
    // 关税相关文章
    if (analysis.tariffInfo.length > 0) {
      tariffArticles.push(article);
    }
    
    // 价格相关文章
    if (analysis.articleType === 'price') {
      priceArticles.push(article);
    }
    
    // 地区统计
    for (const region of analysis.regions) {
      const key = `${region.cn}(${region.en})`;
      if (!regionStats[key]) {
        regionStats[key] = { ...region, count: 0 };
      }
      regionStats[key].count++;
    }
  }
  
  // 生成报告
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalArticles: news.length,
      meatArticles: news.filter(n => n.category === 'meat').length,
      seafoodArticles: news.filter(n => n.category === 'seafood').length,
      tariffRelated: tariffArticles.length,
      priceRelated: priceArticles.length,
    },
    products: Object.values(productStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),
    regions: Object.values(regionStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 15),
    tariffArticles: tariffArticles.slice(0, 10).map(a => ({
      id: a.id,
      title: a.title,
      source: a.sourceName,
      url: a.sourceUrl,
      tariffInfo: a.analysis.tariffInfo,
    })),
    priceArticles: priceArticles.slice(0, 10).map(a => ({
      id: a.id,
      title: a.title,
      source: a.sourceName,
      url: a.sourceUrl,
      numbers: a.analysis.numbers,
    })),
    template: generateTemplateReport(analyzedNews, productStats, regionStats),
  };
  
  return report;
}

/**
 * 生成固定模板报告
 */
function generateTemplateReport(news, productStats, regionStats) {
  // 产品分析
  const topProducts = Object.values(productStats)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // 地区分析
  const topRegions = Object.values(regionStats)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // 关税相关
  const tariffNews = news.filter(n => n.analysis.tariffInfo.length > 0);
  
  // 价格趋势
  const priceNews = news.filter(n => n.analysis.articleType === 'price');
  
  return {
    // 1. 产品分析
    products: {
      title: '产品分析',
      content: topProducts.map(p => `${p.cn}(${p.en}): ${p.count} 篇相关报道`).join('；'),
      topProducts: topProducts.map(p => ({ name: p.cn, en: p.en, count: p.count })),
      summary: `近期重点关注的产品包括: ${topProducts.slice(0, 3).map(p => p.cn).join('、')}`,
    },
    
    // 2. 影响分析
    impact: {
      title: '市场影响',
      content: tariffNews.length > 0 
        ? `关税政策相关报道 ${tariffNews.length} 篇，主要涉及: ${tariffNews.slice(0, 3).map(n => n.analysis.tariffInfo.map(t => t.cn).join('、')).join('，')}`
        : '近期关税政策相对稳定',
      tariffCount: tariffNews.length,
      keyIssues: tariffNews.flatMap(n => n.analysis.tariffInfo).slice(0, 5),
    },
    
    // 3. 未来全球趋势
    trends: {
      title: '未来全球趋势',
      content: `主要市场: ${topRegions.slice(0, 3).map(r => r.cn).join('、')}；价格相关报道 ${priceNews.length} 篇`,
      keyMarkets: topRegions.slice(0, 5).map(r => ({ name: r.cn, en: r.en, count: r.count })),
      priceTrends: priceNews.length > 0 ? '市场价格波动受到关注' : '价格相对稳定',
    },
    
    // 4. 关税分析
    tariff: {
      title: '关税与贸易政策',
      content: tariffNews.length > 0
        ? tariffNews.slice(0, 3).map(n => n.title).join('；')
        : '暂无重大关税政策变动',
      relatedArticles: tariffNews.slice(0, 5).map(n => ({
        title: n.title,
        source: n.sourceName,
        url: n.sourceUrl,
      })),
    },
  };
}

/**
 * 主抓取函数
 */
async function scrapeAll() {
  console.log('=== 开始多源新闻抓取 ===');
  console.log(`时间: ${new Date().toLocaleString()}`);
  
  // 加载现有数据
  const existingData = await loadData();
  
  // 并行抓取所有源
  const [beefArticles, seafoodArticles] = await Promise.all([
    scrapeBeefCentral(),
    scrapeSeafoodSource(),
  ]);
  
  // 合并新文章
  const newArticles = [...beefArticles, ...seafoodArticles];
  
  // 去重并合并
  const articleMap = new Map();
  
  // 先添加现有文章
  for (const article of existingData.news) {
    articleMap.set(article.id, article);
  }
  
  // 添加新文章（或更新）
  let added = 0;
  let updated = 0;
  
  for (const article of newArticles) {
    if (articleMap.has(article.id)) {
      // 更新现有文章
      const existing = articleMap.get(article.id);
      articleMap.set(article.id, {
        ...existing,
        ...article,
        firstScrapedAt: existing.firstScrapedAt || existing.scrapedAt,
      });
      updated++;
    } else {
      // 新文章
      articleMap.set(article.id, article);
      added++;
    }
  }
  
  // 转换回数组并排序
  const mergedNews = Array.from(articleMap.values())
    .sort((a, b) => new Date(b.scrapedAt) - new Date(a.scrapedAt));
  
  // 生成分析报告
  const analysisReport = generateAnalysisReport(mergedNews);
  
  // 保存数据
  const data = {
    news: mergedNews,
    lastUpdate: new Date().toISOString(),
    summary: {
      total: mergedNews.length,
      added,
      updated,
      meatCount: mergedNews.filter(n => n.category === 'meat').length,
      seafoodCount: mergedNews.filter(n => n.category === 'seafood').length,
    },
  };
  
  await saveData(data);
  await saveAnalysis(analysisReport);
  
  console.log('=== 抓取完成 ===');
  console.log(`新增: ${added} 篇`);
  console.log(`更新: ${updated} 篇`);
  console.log(`总计: ${mergedNews.length} 篇`);
  
  return { data, analysis: analysisReport };
}

/**
 * 获取新闻列表
 */
async function getNews(filters = {}) {
  const data = await loadData();
  let news = data.news;
  
  // 筛选
  if (filters.category) {
    news = news.filter(n => n.category === filters.category);
  }
  
  if (filters.source) {
    news = news.filter(n => n.source === filters.source);
  }
  
  // 分页
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 20;
  const start = (page - 1) * limit;
  
  return {
    news: news.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: news.length,
      totalPages: Math.ceil(news.length / limit),
    },
  };
}

/**
 * 获取分析报告
 */
async function getAnalysis() {
  try {
    const data = await fs.readFile(ANALYSIS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

module.exports = {
  scrapeAll,
  getNews,
  getAnalysis,
  scrapeBeefCentral,
  scrapeSeafoodSource,
};

// 直接运行
if (require.main === module) {
  scrapeAll().catch(console.error);
}
