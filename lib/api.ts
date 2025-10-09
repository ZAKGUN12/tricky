// API client for TrickShare backend
const API_BASE = '/api';

export class TrickShareAPI {
  // Tricks
  static async getTricks(filters?: { country?: string; search?: string; difficulty?: string }) {
    const params = new URLSearchParams();
    if (filters?.country) params.append('country', filters.country);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    
    const response = await fetch(`${API_BASE}/tricks?${params}`);
    return response.json();
  }

  static async getTrick(id: string) {
    const response = await fetch(`${API_BASE}/tricks/${id}`);
    return response.json();
  }

  static async createTrick(trick: any) {
    const response = await fetch(`${API_BASE}/tricks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trick)
    });
    return response.json();
  }

  static async updateTrick(id: string, updates: any) {
    const response = await fetch(`${API_BASE}/tricks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  }

  // Interactions
  static async giveKudos(trickId: string, userEmail: string) {
    const response = await fetch(`${API_BASE}/tricks/${trickId}/kudos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail })
    });
    return response.json();
  }

  static async getUserKudos(userEmail: string) {
    const response = await fetch(`${API_BASE}/user/kudos?userEmail=${encodeURIComponent(userEmail)}`);
    return response.json();
  }

  // Comments
  static async getComments(trickId: string) {
    const response = await fetch(`${API_BASE}/tricks/${trickId}/comments`);
    return response.json();
  }

  static async addComment(trickId: string, comment: { text: string; authorName: string }) {
    const response = await fetch(`${API_BASE}/tricks/${trickId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment)
    });
    return response.json();
  }

  // Users
  static async getUserStats() {
    const response = await fetch(`${API_BASE}/users/stats`);
    return response.json();
  }
}
