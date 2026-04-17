/**
 * CME Group 肉類價格指數爬蟲
 * 獲取 Livestock Commodity Index Prices
 */

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/cme-prices.json');

// CME 產品配置
const CME_PRODUCTS = {
  // 期貨
  feederCattle: {
    code: 'GF',
    name: '活牛期貨',
    nameEn: 'Feeder Cattle Futures',
    unit: '美元/英擔',
    unitEn: 'USD/cwt',
    category: 'cattle',
  },
  leanHogs: {
    code: 'HE',
    name: '瘦肉豬期貨',
    nameEn: 'Lean Hog Futures',
    unit: '美元/英擔',
    unitEn: 'USD/cwt',
    category: 'pork',
  },
  porkCutout: {
    code: 'PRK',
    name: '豬肉切塊期貨',
    nameEn: 'Pork Cutout Futures',
    unit: '美元/英擔',
    unitEn: 'USD/cwt',
    category: 'pork',
  },
  // 指數
  boxedBeef: {
    code: 'BOX',
    name: '盒裝牛肉指數',
    nameEn: 'Boxed Beef Index',
    unit: '美元/英擔',
    unitEn: 'USD/cwt',
    category: 'beef',
  },
  freshBacon: {
    code: 'BAC',
    name: '新鮮培根指數',
    nameEn: 'Fresh Bacon Index',
    unit: '美元/英擔',
    unitEn: 'USD/cwt',
    category: 'pork',
  },
  leanHogsIndex: {
    code: 'LHI',
    name: '瘦肉豬指數',
    nameEn: 'Lean Hog Index',
    unit: '美元/英擔',
    unitEn: 'USD/cwt',
    category: 'pork',
  },
  feederCattleIndex: {
    code: 'FCI',
    name: '活牛指數',
    nameEn: 'Feeder Cattle Index',
    unit: '美元/英擔',
    unitEn: 'USD/cwt',
    category: 'cattle',
  },
  porkCutoutIndex: {
    code: 'PCI',
    name: '豬肉切塊指數',
    nameEn: 'Pork Cutout Index',
    unit: '美元/英擔',
    unitEn: 'USD/cwt',
    category: 'pork',
  },
};

/**
 * 確保數據目錄存在
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
 * 讀取現有數據
 */
async function loadData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { prices: [], lastUpdate: null };
  }
}

/**
 * 保存數據
 */
async function saveData(data) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * 抓取 CME 肉類價格數據
 */
async function scrapeCMEPrices() {
  console.log('開始抓取 CME Group 肉類價格指數...');
  
  const url = 'https://www.cmegroup.com/market-data/browse-data/commodity-index-prices.html';
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 30000,
    });
    
    const $ = cheerio.load(response.data);
    const prices = [];
    const timestamp = new Date().toISOString();
    
    // 抓取期貨報價卡片
    const futuresCards = [];
    
    // 查找所有報價卡片
    $('div').each((i, elem) => {
      const $div = $(elem);
      const text = $div.text();
      
      // 提取 Last Price
      if (text.includes('Last Price') && text.includes('Change') && text.includes('% Change')) {
        const $card = $div.closest('div[class*="quote"], div[class*="product"]').parent();
        
        // 嘗試提取產品名稱
        let productName = '';
        const $productName = $card.find('div[class*="name"], div[class*="title"]').first();
        if ($productName.length) {
          productName = $productName.text().trim();
        }
        
        // 提取價格數據
        const lastPriceMatch = text.match(/Last Price\s+([\d.,-]+)/);
        const changeMatch = text.match(/Change\s+([\d.,-]+)/);
        const percentChangeMatch = text.match(/% Change\s+([\d.,-]+)%/);
        const volumeMatch = text.match(/Volume\s+([\d,]+)/);
        
        if (lastPriceMatch && productName) {
          const lastPrice = parseFloat(lastPriceMatch[1].replace(',', ''));
          const change = changeMatch ? parseFloat(changeMatch[1].replace(',', '')) : 0;
          const percentChange = percentChangeMatch ? parseFloat(percentChangeMatch[1]) : 0;
          const volume = volumeMatch ? parseInt(volumeMatch[1].replace(',', '')) : 0;
          
          futuresCards.push({
            productName,
            lastPrice,
            change,
            percentChange,
            volume,
          });
        }
      }
    });
    
    // 抓取指數歷史數據
    const indexData = {};
    
    // 查找各指數區塊
    const indexSections = [
      { key: 'freshBacon', name: 'Fresh Bacon' },
      { key: 'leanHogsIndex', name: 'Lean Hogs' },
      { key: 'porkCutoutIndex', name: 'Pork Cutout' },
      { key: 'boxedBeef', name: 'Boxed Beef' },
      { key: 'feederCattleIndex', name: 'Feeder Cattle' },
    ];
    
    for (const section of indexSections) {
      const $section = $(`div:contains("${section.name}")`).filter(function() {
        return $(this).text().trim().startsWith(section.name);
      });
      
      if ($section.length) {
        const $data = $section.next('div, table');
        const dates = [];
        const priceValues = [];
        
        // 提取日期和價格
        $data.find('div, td, tr').each((i, elem) => {
          const text = $(elem).text().trim();
          
          // 匹配日期格式
          const dateMatch = text.match(/([A-Za-z]{3})\s+(\d{1,2})\s+(\d{4})/);
          if (dateMatch) {
            dates.push(text);
          }
          
          // 匹配價格
          const priceMatch = text.match(/^(\d+\.\d{2})$/);
          if (priceMatch && dates.length > priceValues.length) {
            priceValues.push(parseFloat(priceMatch[1]));
          }
        });
        
        if (dates.length > 0 && priceValues.length > 0) {
          indexData[section.key] = {
            latest: {
              date: dates[0],
              price: priceValues[0],
            },
            previous: dates.length > 1 ? {
              date: dates[1],
              price: priceValues[1],
            } : null,
            history: dates.map((date, i) => ({
              date,
              price: priceValues[i],
            })).filter(item => item.price !== undefined),
          };
        }
      }
    }
    
    // 整理數據
    const scrapedData = {
      timestamp,
      futures: futuresCards,
      indices: indexData,
    };
    
    console.log('CME 數據抓取完成');
    console.log(`期貨數據: ${futuresCards.length} 條`);
    console.log(`指數數據: ${Object.keys(indexData).length} 條`);
    
    return scrapedData;
    
  } catch (error) {
    console.error('CME 數據抓取失敗:', error.message);
    return null;
  }
}

/**
 * 轉換為市場數據格式
 */
function convertToMarketData(scrapedData) {
  const marketData = [];
  
  if (!scrapedData) return marketData;
  
  // 處理期貨數據
  for (const future of scrapedData.futures || []) {
    let productKey = null;
    
    // 識別產品
    if (future.productName.includes('Feeder Cattle')) {
      productKey = 'feederCattle';
    } else if (future.productName.includes('Lean Hog')) {
      productKey = 'leanHogs';
    } else if (future.productName.includes('Pork Cutout')) {
      productKey = 'porkCutout';
    }
    
    if (productKey && CME_PRODUCTS[productKey]) {
      const product = CME_PRODUCTS[productKey];
      marketData.push({
        id: product.code,
        name: product.name,
        nameEn: product.nameEn,
        category: product.category,
        price: future.lastPrice,
        unit: product.unit,
        unitEn: product.unitEn,
        change: future.change,
        changePercent: future.percentChange,
        volume: future.volume,
        source: 'CME Group',
        type: 'futures',
        updatedAt: scrapedData.timestamp,
      });
    }
  }
  
  // 處理指數數據
  for (const [key, data] of Object.entries(scrapedData.indices || {})) {
    if (CME_PRODUCTS[key] && data.latest) {
      const product = CME_PRODUCTS[key];
      const change = data.previous ? data.latest.price - data.previous.price : 0;
      const changePercent = data.previous ? (change / data.previous.price) * 100 : 0;
      
      marketData.push({
        id: product.code,
        name: product.name,
        nameEn: product.nameEn,
        category: product.category,
        price: data.latest.price,
        unit: product.unit,
        unitEn: product.unitEn,
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        volume: 0,
        source: 'CME Group',
        type: 'index',
        updatedAt: scrapedData.timestamp,
        history: data.history,
      });
    }
  }
  
  return marketData;
}

/**
 * 主函數
 */
async function scrapeCME() {
  console.log('=== 開始抓取 CME Group 數據 ===');
  console.log(`時間: ${new Date().toLocaleString()}`);
  
  const scrapedData = await scrapeCMEPrices();
  
  if (scrapedData) {
    const marketData = convertToMarketData(scrapedData);
    
    const data = {
      prices: marketData,
      lastUpdate: new Date().toISOString(),
      rawData: scrapedData,
    };
    
    await saveData(data);
    
    console.log('=== CME 數據保存完成 ===');
    console.log(`共 ${marketData.length} 條價格數據`);
    
    return data;
  }
  
  return null;
}

/**
 * 獲取最新價格
 */
async function getLatestPrices() {
  const data = await loadData();
  return data.prices || [];
}

module.exports = {
  scrapeCME,
  getLatestPrices,
  CME_PRODUCTS,
};

// 直接運行
if (require.main === module) {
  scrapeCME().catch(console.error);
}
