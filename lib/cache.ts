interface CacheEntry {
  data: any;
  expiry: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry>();
  
  set(key: string, data: any, ttlSeconds: number = 300) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + (ttlSeconds * 1000)
    });
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  delete(key: string) {
    this.cache.delete(key);
  }
  
  clear() {
    this.cache.clear();
  }
  
  // Clean expired entries
  cleanup() {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const cache = new MemoryCache();

// Cleanup expired entries every 5 minutes
setInterval(() => cache.cleanup(), 5 * 60 * 1000);
