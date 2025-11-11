interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key: string) {
  const item = cache.get(key);
  if (item && Date.now() - item.timestamp < CACHE_TTL) {
    return item.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
  
  // Clean old entries
  if (cache.size > 1000) {
    const entries = Array.from(cache.entries());
    entries.slice(0, 100).forEach(([k]) => cache.delete(k));
  }
}

function clearCache(pattern?: string) {
  if (pattern) {
    Array.from(cache.keys()).forEach(key => {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    });
  } else {
    cache.clear();
  }
}

class ApiClient {
  private baseUrl = '/api';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache = false,
    retries = 3
  ): Promise<ApiResponse<T>> {
    const cacheKey = `${options.method || 'GET'}:${endpoint}`;
    
    if (useCache && (!options.method || options.method === 'GET')) {
      const cached = getCached(cacheKey);
      if (cached) return { data: cached };
    }

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          signal: controller.signal,
          ...options,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status >= 500 && attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            continue;
          }
          return { error: errorData.error || `Request failed (${response.status})` };
        }

        const data = await response.json();

        if (useCache && (!options.method || options.method === 'GET')) {
          setCache(cacheKey, data);
        }

        if (options.method && options.method !== 'GET') {
          const resource = endpoint.split('/')[1];
          clearCache(resource);
        }

        return { data };
      } catch (error: any) {
        if (error.name === 'AbortError') {
          if (attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          return { error: 'Request timeout' };
        }
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
          continue;
        }
        return { error: 'Network error' };
      }
    }
    return { error: 'Max retries exceeded' };
  }

  // Tricks API
  async getTricks(filters?: { country?: string; search?: string; difficulty?: string }) {
    const params = new URLSearchParams();
    if (filters?.country) params.append('country', filters.country);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    
    return this.request(`/tricks?${params}`, {}, true);
  }

  async getTrick(id: string) {
    return this.request(`/tricks/${id}`, {}, true);
  }

  async createTrick(trick: any) {
    return this.request('/tricks', {
      method: 'POST',
      body: JSON.stringify(trick),
    });
  }

  // Kudos API
  async giveKudos(trickId: string, userEmail: string) {
    return this.request(`/tricks/${trickId}/kudos`, {
      method: 'POST',
      body: JSON.stringify({ userEmail }),
    });
  }

  async removeKudos(trickId: string, userEmail: string) {
    return this.request(`/tricks/${trickId}/kudos`, {
      method: 'DELETE',
      body: JSON.stringify({ userEmail }),
    });
  }

  async getUserKudos(userEmail: string) {
    return this.request(`/user/kudos?userEmail=${encodeURIComponent(userEmail)}`, {}, true);
  }

  // Comments API
  async getComments(trickId: string) {
    return this.request(`/tricks/${trickId}/comments`, {}, true);
  }

  async addComment(trickId: string, comment: { text: string; authorName: string; authorEmail: string }) {
    return this.request(`/tricks/${trickId}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }

  // Views API
  async incrementView(trickId: string, userEmail?: string) {
    return this.request(`/tricks/${trickId}/view`, {
      method: 'POST',
      body: JSON.stringify({ userEmail }),
    });
  }

  // User API
  async getUserStats(userEmail: string) {
    return this.request(`/user/stats?userEmail=${encodeURIComponent(userEmail)}`, {}, true);
  }

  async getLeaderboard() {
    return this.request('/leaderboard', {}, true);
  }

  async getTopTricks() {
    return this.request('/tricks/top', {}, true);
  }
}

export const apiClient = new ApiClient();
