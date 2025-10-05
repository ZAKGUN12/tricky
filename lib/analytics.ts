// Analytics and Performance Tracking

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId: string;
}

class Analytics {
  private sessionId: string;
  private userId?: string;
  private events: AnalyticsEvent[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadFromStorage();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('trickshare_analytics');
      if (stored) {
        try {
          this.events = JSON.parse(stored);
        } catch (e) {
          console.warn('Failed to load analytics from storage');
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      // Keep only last 100 events to prevent storage bloat
      const recentEvents = this.events.slice(-100);
      localStorage.setItem('trickshare_analytics', JSON.stringify(recentEvents));
    }
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      sessionId: this.sessionId
    };

    this.events.push(analyticsEvent);
    this.saveToStorage();

    // In production, send to analytics service
    console.log('Analytics Event:', analyticsEvent);
  }

  // Specific tracking methods
  trackPageView(page: string, title?: string) {
    this.track('page_view', { page, title });
  }

  trackTrickView(trickId: string, title: string) {
    this.track('trick_view', { trickId, title });
  }

  trackTrickKudos(trickId: string, title: string) {
    this.track('trick_kudos', { trickId, title });
  }

  trackTrickFavorite(trickId: string, title: string) {
    this.track('trick_favorite', { trickId, title });
  }

  trackTrickShare(trickId: string, platform: string) {
    this.track('trick_share', { trickId, platform });
  }

  trackSearch(query: string, resultsCount: number) {
    this.track('search', { query, resultsCount });
  }

  trackFilter(filterType: string, filterValue: string) {
    this.track('filter_applied', { filterType, filterValue });
  }

  trackTrickSubmit(trickData: any) {
    this.track('trick_submit', {
      category: trickData.category,
      difficulty: trickData.difficulty,
      hasSteps: trickData.steps?.length > 0,
      stepCount: trickData.steps?.length || 0,
      tagCount: trickData.tags?.length || 0
    });
  }

  // Get analytics insights
  getTopTricks(): Array<{trickId: string, views: number}> {
    const trickViews = this.events
      .filter(e => e.event === 'trick_view')
      .reduce((acc, event) => {
        const trickId = event.properties?.trickId;
        if (trickId) {
          acc[trickId] = (acc[trickId] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(trickViews)
      .map(([trickId, views]) => ({ trickId, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }

  getSearchTerms(): Array<{query: string, count: number}> {
    const searches = this.events
      .filter(e => e.event === 'search')
      .reduce((acc, event) => {
        const query = event.properties?.query?.toLowerCase();
        if (query) {
          acc[query] = (acc[query] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(searches)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  getSessionStats() {
    const sessionEvents = this.events.filter(e => e.sessionId === this.sessionId);
    const pageViews = sessionEvents.filter(e => e.event === 'page_view').length;
    const trickViews = sessionEvents.filter(e => e.event === 'trick_view').length;
    const interactions = sessionEvents.filter(e => 
      ['trick_kudos', 'trick_favorite', 'trick_share'].includes(e.event)
    ).length;

    return {
      pageViews,
      trickViews,
      interactions,
      sessionDuration: sessionEvents.length > 0 ? 
        new Date().getTime() - new Date(sessionEvents[0].timestamp).getTime() : 0
    };
  }
}

// Performance monitoring
class PerformanceMonitor {
  private metrics: Record<string, number> = {};

  startTiming(label: string) {
    this.metrics[`${label}_start`] = performance.now();
  }

  endTiming(label: string) {
    const startTime = this.metrics[`${label}_start`];
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics[label] = duration;
      console.log(`Performance: ${label} took ${duration.toFixed(2)}ms`);
      return duration;
    }
    return 0;
  }

  measurePageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    }
    return null;
  }

  getMetrics() {
    return { ...this.metrics };
  }
}

// Export singleton instances
export const analytics = new Analytics();
export const performanceMonitor = new PerformanceMonitor();

// SEO utilities
export const seoUtils = {
  generateMetaTags: (trick: any) => ({
    title: `${trick.title} | TrickShare`,
    description: trick.description.substring(0, 160),
    keywords: trick.tags.join(', '),
    ogTitle: trick.title,
    ogDescription: trick.description,
    ogType: 'article',
    twitterCard: 'summary_large_image'
  }),

  generateStructuredData: (trick: any) => ({
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": trick.title,
    "description": trick.description,
    "totalTime": trick.timeEstimate,
    "supply": trick.tags.map((tag: string) => ({ "@type": "HowToSupply", "name": tag })),
    "step": trick.steps.map((step: string, index: number) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "text": step
    })),
    "author": {
      "@type": "Person",
      "name": trick.authorName
    }
  })
};
