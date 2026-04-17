/**
 * Multi-Source News Scraper v3
 * 支持: beefcentral.com, seafoodsource.com, seafoodnews.com, globalmeatnews.com
 * 专为香港B端冻肉门店、贸易商优化
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/news-v3.json');

// 新闻源配置
const SOURCES = {
  beefcentral: {
    name: 'Beef Central',
    baseUrl: 'https://www.beefcentral.com',
    homepage: 'https://www.beefcentral.com/',
    category: 'meat',
    region: 'Australia',
  },
  seafoodsource: {
    name: 'SeafoodSource',
    baseUrl: 'https://www.seafoodsource.com',
    homepage: 'https://www.seafoodsource.com/',
    category: 'seafood',
    region: 'Global',
  },
  seafoodnews: {
    name: 'Seafood News',
    baseUrl: 'https://seafoodnews.com',
    homepage: 'https://seafoodnews.com/',
    category: 'seafood',
    region: 'USA',
  },
  globalmeatnews: {
    name: 'Global Meat News',
    baseUrl: 'https://www.globalmeatnews.com',
    homepage: 'https://www.globalmeatnews.com/',
    category: 'meat',
    region: 'Global',
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
 * 通用抓取函数
 */
async function scrapeWebsite(sourceKey, config) {
  console.log(`抓取 ${config.name}...`);
  const articles = [];
  
  try {
    const response = await axios.get(config.homepage, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 30000,
    });
    
    const $ = cheerio.load(response.data);
    
    // 根据网站结构选择不同的抓取策略
    switch (sourceKey) {
      case 'beefcentral':
        return scrapeBeefCentral($, config);
      case 'seafoodsource':
        return scrapeSeafoodSource($, config);
      case 'seafoodnews':
        return scrapeSeafoodNews($, config);
      case 'globalmeatnews':
        return scrapeGlobalMeatNews($, config);
      default:
        return [];
    }
    
  } catch (error) {
    console.error(`${config.name} 抓取失败:`, error.message);
    return [];
  }
}

/**
 * 抓取 Beef Central
 */
function scrapeBeefCentral($, config) {
  const articles = [];
  
  $('a[href*="/news/"], a[href*="/property/"], a[href*="/processing/"]').each((i, elem) => {
    const $link = $(elem);
    const href = $link.attr('href');
    const title = $link.text().trim();
    
    if (!href || !title || title.length < 15) return;
    if (title.includes('Read More') || title.includes('Continue')) return;
    
    const $parent = $link.closest('article, div[class*="post"], div[class*="news"]');
    const excerpt = $parent.find('p').first().text().trim() || '';
    
    // 提取日期
    let date = null;
    const dateMatch = title.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (dateMatch) {
      date = `${dateMatch[3]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[1].padStart(2, '0')}`;
    }
    
    articles.push({
      id: `bc_${Buffer.from(href).toString('base64').substring(0, 12)}`,
      source: 'beefcentral',
      sourceName: config.name,
      sourceUrl: href.startsWith('http') ? href : `${config.baseUrl}${href}`,
      title,
      excerpt,
      category: 'meat',
      region: config.region,
      scrapedAt: new Date().toISOString(),
      publishDate: date,
    });
  });
  
  return articles;
}

/**
 * 抓取 SeafoodSource
 */
function scrapeSeafoodSource($, config) {
  const articles = [];
  
  $('article h3 a, article h2 a, .article-title a').each((i, elem) => {
    const $link = $(elem);
    const href = $link.attr('href');
    const title = $link.text().trim();
    
    if (!href || !title || title.length < 10) return;
    
    const $article = $link.closest('article');
    const excerpt = $article.find('.article-summary, .excerpt, p').first().text().trim() || '';
    
    // 提取日期
    const dateText = $article.find('time, .article-date').text().trim();
    let date = null;
    if (dateText) {
      const parsed = new Date(dateText);
      if (!isNaN(parsed)) {
        date = parsed.toISOString().split('T')[0];
      }
    }
    
    articles.push({
      id: `ss_${Buffer.from(href).toString('base64').substring(0, 12)}`,
      source: 'seafoodsource',
      sourceName: config.name,
      sourceUrl: href.startsWith('http') ? href : `${config.baseUrl}${href}`,
      title,
      excerpt,
      category: 'seafood',
      region: config.region,
      scrapedAt: new Date().toISOString(),
      publishDate: date,
    });
  });
  
  return articles;
}

/**
 * 抓取 SeafoodNews
 */
function scrapeSeafoodNews($, config) {
  const articles = [];
  
  $('a[href^="/Story/"]').each((i, elem) => {
    const $link = $(elem);
    const href = $link.attr('href');
    const title = $link.text().trim();
    
    if (!href || !title || title.length < 10) return;
    
    const storyId = href.match(/\/Story\/(\d+)/)?.[1];
    if (!storyId) return;
    
    // 查找摘要
    let excerpt = '';
    const $parent = $link.closest('div, p, article');
    if ($parent.length) {
      excerpt = $parent.find('p').first().text().trim();
    }
    
    articles.push({
      id: `sn_${storyId}`,
      source: 'seafoodnews',
      sourceName: config.name,
      sourceUrl: `${config.baseUrl}${href}`,
      title,
      excerpt: excerpt || title,
      category: 'seafood',
      region: config.region,
      scrapedAt: new Date().toISOString(),
      publishDate: null,
    });
  });
  
  return articles;
}

/**
 * 抓取 Global Meat News
 */
function scrapeGlobalMeatNews($, config) {
  const articles = [];
  
  // 抓取文章链接
  $('a[href*="/Article/"], a[href*="/news/"]').each((i, elem) => {
    const $link = $(elem);
    const href = $link.attr('href');
    const title = $link.text().trim();
    
    if (!href || !title || title.length < 15) return;
    if (title.includes('More') || title.includes('→')) return;
    
    // 获取父元素
    const $parent = $link.closest('article, div[class*="article"], li');
    let excerpt = '';
    
    // 尝试多种方式获取摘要
    if ($parent.length) {
      excerpt = $parent.find('p').first().text().trim();
    }
    
    // 提取日期
    let date = null;
    const dateEl = $parent.find('time, .date, [class*="date"]').first();
    if (dateEl.length) {
      const dateText = dateEl.text().trim();
      const parsed = new Date(dateText);
      if (!isNaN(parsed)) {
        date = parsed.toISOString().split('T')[0];
      }
    }
    
    // 从标题中提取日期
    if (!date) {
      const dateMatch = title.match(/(\d{1,2})[-/]([A-Za-z]+|\d{1,2})[-/](\d{4})/);
      if (dateMatch) {
        const parsed = new Date(dateMatch[0]);
        if (!isNaN(parsed)) {
          date = parsed.toISOString().split('T')[0];
        }
      }
    }
    
    articles.push({
      id: `gmn_${Buffer.from(href).toString('base64').substring(0, 12)}`,
      source: 'globalmeatnews',
      sourceName: config.name,
      sourceUrl: href.startsWith('http') ? href : `${config.baseUrl}${href}`,
      title,
      excerpt,
      category: 'meat',
      region: config.region,
      scrapedAt: new Date().toISOString(),
      publishDate: date,
    });
  });
  
  return articles;
}

/**
 * 主抓取函数
 */
async function scrapeAll() {
  console.log('=== 开始多源新闻抓取 v3 ===');
  console.log(`时间: ${new Date().toLocaleString()}`);
  
  const existingData = await loadData();
  const allNewArticles = [];
  
  // 顺序抓取所有源
  for (const [key, config] of Object.entries(SOURCES)) {
    const articles = await scrapeWebsite(key, config);
    allNewArticles.push(...articles);
    console.log(`${config.name}: ${articles.length} 篇文章`);
  }
  
  // 去重并合并
  const articleMap = new Map();
  
  for (const article of existingData.news) {
    articleMap.set(article.id, article);
  }
  
  let added = 0;
  let updated = 0;
  
  for (const article of allNewArticles) {
    if (articleMap.has(article.id)) {
      const existing = articleMap.get(article.id);
      articleMap.set(article.id, {
        ...existing,
        ...article,
        firstScrapedAt: existing.firstScrapedAt || existing.scrapedAt,
      });
      updated++;
    } else {
      articleMap.set(article.id, article);
      added++;
    }
  }
  
  const mergedNews = Array.from(articleMap.values())
    .sort((a, b) => new Date(b.scrapedAt) - new Date(a.scrapedAt));
  
  const data = {
    news: mergedNews,
    lastUpdate: new Date().toISOString(),
    summary: {
      total: mergedNews.length,
      added,
      updated,
      bySource: {
        beefcentral: mergedNews.filter(n => n.source === 'beefcentral').length,
        seafoodsource: mergedNews.filter(n => n.source === 'seafoodsource').length,
        seafoodnews: mergedNews.filter(n => n.source === 'seafoodnews').length,
        globalmeatnews: mergedNews.filter(n => n.source === 'globalmeatnews').length,
      },
    },
  };
  
  await saveData(data);
  
  console.log('=== 抓取完成 ===');
  console.log(`新增: ${added} 篇`);
  console.log(`更新: ${updated} 篇`);
  console.log(`总计: ${mergedNews.length} 篇`);
  
  return data;
}

/**
 * 获取新闻列表
 */
async function getNews(filters = {}) {
  const data = await loadData();
  let news = data.news;
  
  if (filters.category) {
    news = news.filter(n => n.category === filters.category);
  }
  
  if (filters.source) {
    news = news.filter(n => n.source === filters.source);
  }
  
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

module.exports = {
  scrapeAll,
  getNews,
  SOURCES,
};

// 直接运行
if (require.main === module) {
  scrapeAll().catch(console.error);
}
