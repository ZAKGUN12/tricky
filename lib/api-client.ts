interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl = '/api';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Request failed' };
      }

      return { data };
    } catch (error) {
      return { error: 'Network error' };
    }
  }

  // Tricks API
  async getTricks(filters?: { country?: string; search?: string; difficulty?: string }) {
    const params = new URLSearchParams();
    if (filters?.country) params.append('country', filters.country);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    
    return this.request(`/tricks?${params}`);
  }

  async getTrick(id: string) {
    return this.request(`/tricks/${id}`);
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
    return this.request(`/user/kudos?userEmail=${encodeURIComponent(userEmail)}`);
  }

  // Comments API
  async getComments(trickId: string) {
    return this.request(`/tricks/${trickId}/comments`);
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
    return this.request(`/user/stats?userEmail=${encodeURIComponent(userEmail)}`);
  }

  async getLeaderboard() {
    return this.request('/leaderboard');
  }

  async getTopTricks() {
    return this.request('/tricks/top');
  }
}

export const apiClient = new ApiClient();
