/**
 * News API Service
 * 前端新闻数据服务
 */

import newsData from '../../data/news.json';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// 是否使用本地数据（开发模式）
const USE_LOCAL_DATA = true;

export interface NewsArticle {
  id: string;
  source: string;
  sourceName: string;
  sourceUrl: string;
  title: string;
  excerpt: string;
  keywords: {
    en: string;
    cn: string;
    category: 'seafood' | 'meat';
  }[];
  articleType: 'news' | 'analysis' | 'price' | 'market' | 'trade' | 'policy';
  scrapedAt: string;
  publishDate: string | null;
  firstScrapedAt?: string;
}

export interface NewsStats {
  totalArticles: number;
  bySource: Record<string, number>;
  byType: Record<string, number>;
  byKeyword: Record<string, number>;
  byDate: Record<string, number>;
  seafoodCount: number;
  meatCount: number;
  last7Days: number;
  last30Days: number;
  topKeywords: [string, number][];
  lastUpdate: string;
}

export interface NewsListResponse {
  news: NewsArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: NewsStats;
}

/**
 * 获取新闻列表
 */
export async function getNews(filters: {
  keyword?: string;
  type?: string;
  source?: string;
  category?: string;
  page?: number;
  limit?: number;
} = {}): Promise<NewsListResponse> {
  // 使用本地数据
  if (USE_LOCAL_DATA) {
    let news = (newsData as any).news || [];
    
    // 筛选
    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      news = news.filter((n: NewsArticle) => 
        n.title.toLowerCase().includes(kw) ||
        n.excerpt.toLowerCase().includes(kw) ||
        n.keywords.some(k => 
          k.en.toLowerCase().includes(kw) || 
          k.cn.includes(filters.keyword!)
        )
      );
    }
    
    if (filters.type) {
      news = news.filter((n: NewsArticle) => n.articleType === filters.type);
    }
    
    if (filters.category) {
      news = news.filter((n: NewsArticle) => 
        n.keywords.some(k => k.category === filters.category)
      );
    }
    
    // 分页
    const page = filters.page || 1;
    const limit = filters.limit || 12;
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
      stats: (newsData as any).stats || {},
    };
  }
  
  // 使用 API
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, String(value));
    }
  });
  
  const response = await fetch(`${API_BASE_URL}/api/news?${params}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error);
  }
  
  return data.data;
}

/**
 * 获取单篇新闻
 */
export async function getNewsById(id: string): Promise<NewsArticle | null> {
  if (USE_LOCAL_DATA) {
    const news = (newsData as any).news || [];
    return news.find((n: NewsArticle) => n.id === id) || null;
  }
  
  const response = await fetch(`${API_BASE_URL}/api/news/${id}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error);
  }
  
  return data.data;
}

/**
 * 获取统计数据
 */
export async function getStats(): Promise<NewsStats> {
  if (USE_LOCAL_DATA) {
    return (newsData as any).stats || {};
  }
  
  const response = await fetch(`${API_BASE_URL}/api/stats`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error);
  }
  
  return data.data;
}

/**
 * 获取仪表盘数据
 */
export async function getDashboard(): Promise<{
  latestNews: NewsArticle[];
  stats: NewsStats;
  summary: {
    totalArticles: number;
    seafoodCount: number;
    meatCount: number;
    last7Days: number;
    last30Days: number;
    topKeywords: [string, number][];
  };
}> {
  if (USE_LOCAL_DATA) {
    const news = (newsData as any).news || [];
    const stats = (newsData as any).stats || {};
    
    return {
      latestNews: news.slice(0, 10),
      stats,
      summary: {
        totalArticles: stats.totalArticles || 0,
        seafoodCount: stats.seafoodCount || 0,
        meatCount: stats.meatCount || 0,
        last7Days: stats.last7Days || 0,
        last30Days: stats.last30Days || 0,
        topKeywords: stats.topKeywords?.slice(0, 5) || [],
      },
    };
  }
  
  const response = await fetch(`${API_BASE_URL}/api/dashboard`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error);
  }
  
  return data.data;
}

/**
 * 手动触发抓取
 */
export async function triggerScrape(): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/api/scrape`, {
    method: 'POST',
  });
  return response.json();
}

/**
 * 获取文章类型标签
 */
export function getArticleTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    news: '新闻',
    analysis: '分析',
    price: '价格',
    market: '市场',
    trade: '贸易',
    policy: '政策',
  };
  return labels[type] || type;
}

/**
 * 获取文章类型颜色
 */
export function getArticleTypeColor(type: string): string {
  const colors: Record<string, string> = {
    news: '#2997FF',
    analysis: '#10B981',
    price: '#F59E0B',
    market: '#8B5CF6',
    trade: '#EC4899',
    policy: '#EF4444',
  };
  return colors[type] || '#2997FF';
}
