/**
 * News API Server
 * 提供新闻数据的 REST API 接口
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { scrapeAll, getNews, getNewsById, getStats } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务（数据文件）
app.use('/data', express.static(path.join(__dirname, '../data')));

/**
 * GET /api/news
 * 获取新闻列表
 * 查询参数:
 *   - keyword: 关键词筛选
 *   - type: 文章类型 (news, analysis, price, market, trade, policy)
 *   - source: 新闻来源
 *   - category: 分类 (seafood, meat)
 *   - page: 页码 (默认 1)
 *   - limit: 每页数量 (默认 20)
 */
app.get('/api/news', async (req, res) => {
  try {
    const result = await getNews(req.query);
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('获取新闻列表失败:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/news/:id
 * 获取单篇新闻详情
 */
app.get('/api/news/:id', async (req, res) => {
  try {
    const article = await getNewsById(req.params.id);
    if (!article) {
      return res.status(404).json({
        success: false,
        error: '新闻未找到',
      });
    }
    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('获取新闻详情失败:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/stats
 * 获取统计数据
 */
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/scrape
 * 手动触发抓取任务
 */
app.post('/api/scrape', async (req, res) => {
  try {
    console.log('手动触发抓取任务...');
    const result = await scrapeAll();
    res.json({
      success: true,
      message: '抓取任务完成',
      data: result.summary,
    });
  } catch (error) {
    console.error('抓取任务失败:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/keywords
 * 获取热门关键词
 */
app.get('/api/keywords', async (req, res) => {
  try {
    const { getNews } = require('./scraper');
    const result = await getNews({ limit: 1000 });
    
    // 统计关键词
    const keywordCount = {};
    for (const article of result.news) {
      for (const kw of article.keywords) {
        const key = `${kw.cn}|${kw.en}|${kw.category}`;
        if (!keywordCount[key]) {
          keywordCount[key] = { cn: kw.cn, en: kw.en, category: kw.category, count: 0 };
        }
        keywordCount[key].count++;
      }
    }
    
    // 排序并返回前20
    const topKeywords = Object.values(keywordCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
    
    res.json({
      success: true,
      data: topKeywords,
    });
  } catch (error) {
    console.error('获取关键词失败:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/dashboard
 * 获取仪表盘数据
 */
app.get('/api/dashboard', async (req, res) => {
  try {
    const { getNews } = require('./scraper');
    const [newsResult, stats] = await Promise.all([
      getNews({ limit: 10 }),
      getStats(),
    ]);
    
    res.json({
      success: true,
      data: {
        latestNews: newsResult.news,
        stats,
        summary: {
          totalArticles: stats.totalArticles,
          seafoodCount: stats.seafoodCount,
          meatCount: stats.meatCount,
          last7Days: stats.last7Days,
          last30Days: stats.last30Days,
          topKeywords: stats.topKeywords?.slice(0, 5) || [],
        },
      },
    });
  } catch (error) {
    console.error('获取仪表盘数据失败:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API 服务运行正常',
    timestamp: new Date().toISOString(),
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`新闻 API 服务器已启动`);
  console.log(`端口: ${PORT}`);
  console.log(`API 地址: http://localhost:${PORT}/api`);
});

module.exports = app;
