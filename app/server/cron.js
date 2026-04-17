/**
 * 定时抓取任务
 * 每天自动抓取新闻
 */

const { scrapeAll } = require('./scraper');

// 抓取间隔（毫秒）
const SCRAPE_INTERVAL = 6 * 60 * 60 * 1000; // 每6小时

/**
 * 运行抓取任务
 */
async function runScrape() {
  console.log('\n========================================');
  console.log('定时抓取任务开始');
  console.log(`时间: ${new Date().toLocaleString()}`);
  console.log('========================================\n');
  
  try {
    const result = await scrapeAll();
    console.log('\n========================================');
    console.log('定时抓取任务完成');
    console.log(`新增: ${result.summary.added} 篇`);
    console.log(`更新: ${result.summary.updated} 篇`);
    console.log(`总计: ${result.summary.total} 篇`);
    console.log('========================================\n');
    return result;
  } catch (error) {
    console.error('定时抓取任务失败:', error);
    throw error;
  }
}

/**
 * 启动定时任务
 */
function startCron() {
  console.log('启动定时抓取服务...');
  console.log(`抓取间隔: ${SCRAPE_INTERVAL / 1000 / 60} 分钟`);
  
  // 立即执行一次
  runScrape().catch(console.error);
  
  // 设置定时任务
  setInterval(() => {
    runScrape().catch(console.error);
  }, SCRAPE_INTERVAL);
  
  console.log('定时抓取服务已启动');
}

// 如果直接运行此文件
if (require.main === module) {
  startCron();
}

module.exports = { startCron, runScrape };
