/**
 * Seafood News Scraper
 * 抓取 seafoodnews.com 的新闻资讯
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/news.json');
const CONFIG_FILE = path.join(__dirname, '../data/config.json');

// 新闻源配置
const SOURCES = {
  seafoodnews: {
    name: 'Seafood News',
    baseUrl: 'https://seafoodnews.com',
    homepage: 'https://seafoodnews.com/',
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
 * 读取现有新闻数据
 */
async function loadExistingNews() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { news: [], lastUpdate: null, stats: {} };
  }
}

/**
 * 保存新闻数据
 */
async function saveNews(data) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * 提取关键词
 */
function extractKeywords(title, excerpt) {
  const text = `${title} ${excerpt}`.toLowerCase();
  const keywords = [];
  
  // 水产品关键词
  const seafoodKeywords = {
    'crab': '蟹类',
    'shrimp': '虾类',
    'lobster': '龙虾',
    'salmon': '三文鱼',
    'tuna': '金枪鱼',
    'cod': '鳕鱼',
    'scallop': '扇贝',
    'pollock': '狭鳕',
    'squid': '鱿鱼',
    'tilapia': '罗非鱼',
    'catfish': '鲶鱼',
    'fish': '鱼类',
    'seafood': '海鲜',
  };
  
  // 肉类关键词
  const meatKeywords = {
    'beef': '牛肉',
    'pork': '猪肉',
    'chicken': '鸡肉',
    'lamb': '羊肉',
    'meat': '肉类',
  };
  
  // 检查水产品
  for (const [en, cn] of Object.entries(seafoodKeywords)) {
    if (text.includes(en)) {
      keywords.push({ en, cn, category: 'seafood' });
    }
  }
  
  // 检查肉类
  for (const [en, cn] of Object.entries(meatKeywords)) {
    if (text.includes(en)) {
      keywords.push({ en, cn, category: 'meat' });
    }
  }
  
  return keywords;
}

/**
 * 分析文章类型
 */
function analyzeArticleType(title) {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('analysis') || lowerTitle.includes('分析')) {
    return 'analysis';
  }
  if (lowerTitle.includes('price') || lowerTitle.includes('价格')) {
    return 'price';
  }
  if (lowerTitle.includes('market') || lowerTitle.includes('市场')) {
    return 'market';
  }
  if (lowerTitle.includes('trade') || lowerTitle.includes('贸易')) {
    return 'trade';
  }
  if (lowerTitle.includes('policy') || lowerTitle.includes('政策') || lowerTitle.includes('ban')) {
    return 'policy';
  }
  return 'news';
}

/**
 * 抓取 Seafood News 首页新闻
 */
async function scrapeSeafoodNews() {
  try {
    console.log('开始抓取 Seafood News...');
    
    const response = await axios.get(SOURCES.seafoodnews.homepage, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 30000,
    });
    
    const $ = cheerio.load(response.data);
    const articles = [];
    
    // 抓取新闻列表
    $('a[href^="/Story/"]').each((i, elem) => {
      const $link = $(elem);
      const href = $link.attr('href');
      const title = $link.text().trim();
      
      if (!href || !title || title.length < 10) return;
      
      const storyId = href.match(/\/Story\/(\d+)/)?.[1];
      if (!storyId) return;
      
      // 查找对应的内容摘要
      let excerpt = '';
      const $parent = $link.closest('div, p, article');
      if ($parent.length) {
        // 尝试找到相邻的文本内容
        const nextText = $parent.find('p').first().text().trim();
        if (nextText && nextText !== title) {
          excerpt = nextText.substring(0, 300);
        }
      }
      
      // 如果没有找到摘要，尝试从页面其他位置获取
      if (!excerpt) {
        // 查找包含这个故事ID的段落
        $('p, div').each((j, pElem) => {
          const $p = $(pElem);
          const text = $p.text().trim();
          if (text.length > 50 && text.length < 500 && !text.includes(title)) {
            const prevLink = $p.prev().find(`a[href="${href}"]`).length;
            if (prevLink && !excerpt) {
              excerpt = text.substring(0, 300);
            }
          }
        });
      }
      
      const keywords = extractKeywords(title, excerpt);
      const articleType = analyzeArticleType(title);
      
      articles.push({
        id: `sn_${storyId}`,
        source: 'seafoodnews',
        sourceName: 'Seafood News',
        sourceUrl: `${SOURCES.seafoodnews.baseUrl}${href}`,
        title,
        excerpt: excerpt || title,
        keywords,
        articleType,
        scrapedAt: new Date().toISOString(),
        publishDate: null, // 需要进一步解析
      });
    });
    
    // 去重
    const uniqueArticles = [];
    const seenIds = new Set();
    
    for (const article of articles) {
      if (!seenIds.has(article.id)) {
        seenIds.add(article.id);
        uniqueArticles.push(article);
      }
    }
    
    console.log(`抓取完成，共 ${uniqueArticles.length} 篇文章`);
    return uniqueArticles;
    
  } catch (error) {
    console.error('抓取失败:', error.message);
    throw error;
  }
}

/**
 * 抓取单篇文章详情
 */
async function scrapeArticleDetail(storyId) {
  try {
    const url = `${SOURCES.seafoodnews.baseUrl}/Story/${storyId}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 30000,
    });
    
    const $ = cheerio.load(response.data);
    
    // 提取发布日期
    let publishDate = null;
    const dateText = $('body').text().match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\.\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}\s+\d{4}/);
    if (dateText) {
      publishDate = new Date(dateText[0]).toISOString();
    }
    
    // 提取完整内容
    let content = '';
    $('p').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text.length > 50) {
        content += text + '\n\n';
      }
    });
    
    return {
      publishDate,
      content: content.substring(0, 2000),
    };
    
  } catch (error) {
    console.error(`抓取文章详情失败 ${storyId}:`, error.message);
    return null;
  }
}

/**
 * 生成统计数据
 */
function generateStats(news) {
  const stats = {
    totalArticles: news.length,
    bySource: {},
    byType: {},
    byKeyword: {},
    byDate: {},
    seafoodCount: 0,
    meatCount: 0,
    last7Days: 0,
    last30Days: 0,
  };
  
  const now = new Date();
  const last7Days = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now - 30 * 24 * 60 * 60 * 1000);
  
  for (const article of news) {
    // 按来源统计
    stats.bySource[article.source] = (stats.bySource[article.source] || 0) + 1;
    
    // 按类型统计
    stats.byType[article.articleType] = (stats.byType[article.articleType] || 0) + 1;
    
    // 按关键词统计
    for (const kw of article.keywords) {
      const key = `${kw.cn}(${kw.en})`;
      stats.byKeyword[key] = (stats.byKeyword[key] || 0) + 1;
      
      if (kw.category === 'seafood') {
        stats.seafoodCount++;
      } else if (kw.category === 'meat') {
        stats.meatCount++;
      }
    }
    
    // 按日期统计
    const date = article.publishDate || article.scrapedAt;
    if (date) {
      const dateKey = date.substring(0, 10);
      stats.byDate[dateKey] = (stats.byDate[dateKey] || 0) + 1;
      
      const articleDate = new Date(date);
      if (articleDate >= last7Days) {
        stats.last7Days++;
      }
      if (articleDate >= last30Days) {
        stats.last30Days++;
      }
    }
  }
  
  // 排序关键词
  stats.topKeywords = Object.entries(stats.byKeyword)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  return stats;
}

/**
 * 主抓取函数
 */
async function scrapeAll() {
  try {
    console.log('=== 开始新闻抓取任务 ===');
    console.log(`时间: ${new Date().toLocaleString()}`);
    
    // 加载现有数据
    const existingData = await loadExistingNews();
    const existingIds = new Set(existingData.news.map(n => n.id));
    
    // 抓取新文章
    const newArticles = await scrapeSeafoodNews();
    
    // 合并数据（保留新文章，更新旧文章）
    let mergedNews = [...existingData.news];
    let addedCount = 0;
    let updatedCount = 0;
    
    for (const article of newArticles) {
      const existingIndex = mergedNews.findIndex(n => n.id === article.id);
      
      if (existingIndex === -1) {
        // 新文章
        mergedNews.push(article);
        addedCount++;
      } else {
        // 更新现有文章（保留原有数据，更新抓取时间）
        mergedNews[existingIndex] = {
          ...mergedNews[existingIndex],
          ...article,
          firstScrapedAt: mergedNews[existingIndex].firstScrapedAt || mergedNews[existingIndex].scrapedAt,
        };
        updatedCount++;
      }
    }
    
    // 按日期排序
    mergedNews.sort((a, b) => {
      const dateA = a.publishDate || a.scrapedAt;
      const dateB = b.publishDate || b.scrapedAt;
      return new Date(dateB) - new Date(dateA);
    });
    
    // 生成统计
    const stats = generateStats(mergedNews);
    
    // 保存数据
    const data = {
      news: mergedNews,
      lastUpdate: new Date().toISOString(),
      stats,
      summary: {
        total: mergedNews.length,
        added: addedCount,
        updated: updatedCount,
        seafoodCount: stats.seafoodCount,
        meatCount: stats.meatCount,
      },
    };
    
    await saveNews(data);
    
    console.log('=== 抓取任务完成 ===');
    console.log(`新增: ${addedCount} 篇`);
    console.log(`更新: ${updatedCount} 篇`);
    console.log(`总计: ${mergedNews.length} 篇`);
    
    return data;
    
  } catch (error) {
    console.error('抓取任务失败:', error);
    throw error;
  }
}

/**
 * 获取新闻列表（带筛选）
 */
async function getNews(filters = {}) {
  const data = await loadExistingNews();
  let news = data.news;
  
  // 按关键词筛选
  if (filters.keyword) {
    news = news.filter(n => 
      n.keywords.some(k => 
        k.en.toLowerCase().includes(filters.keyword.toLowerCase()) ||
        k.cn.includes(filters.keyword)
      )
    );
  }
  
  // 按类型筛选
  if (filters.type) {
    news = news.filter(n => n.articleType === filters.type);
  }
  
  // 按来源筛选
  if (filters.source) {
    news = news.filter(n => n.source === filters.source);
  }
  
  // 按分类筛选（海鲜/肉类）
  if (filters.category) {
    news = news.filter(n => 
      n.keywords.some(k => k.category === filters.category)
    );
  }
  
  // 分页
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 20;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    news: news.slice(start, end),
    pagination: {
      page,
      limit,
      total: news.length,
      totalPages: Math.ceil(news.length / limit),
    },
    stats: data.stats,
  };
}

/**
 * 获取单篇新闻
 */
async function getNewsById(id) {
  const data = await loadExistingNews();
  return data.news.find(n => n.id === id) || null;
}

/**
 * 获取统计数据
 */
async function getStats() {
  const data = await loadExistingNews();
  return {
    ...data.stats,
    lastUpdate: data.lastUpdate,
  };
}

module.exports = {
  scrapeAll,
  getNews,
  getNewsById,
  getStats,
  scrapeSeafoodNews,
};

// 如果直接运行此文件
if (require.main === module) {
  scrapeAll().catch(console.error);
}
