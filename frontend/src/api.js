const API_BASE = 'http://localhost:5000/api';

export const api = {
  uploadVideo: async (file) => {
    const formData = new FormData();
    formData.append('video', file);
    
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },

  getResults: async (videoId) => {
    const res = await fetch(`${API_BASE}/results/${videoId}`);
    if (!res.ok) throw new Error('Failed to fetch results');
    return res.json();
  },

  getHistory: async () => {
    const res = await fetch(`${API_BASE}/history`);
    if (!res.ok) throw new Error('Failed to fetch history');
    return res.json();
  },

  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  saveSettings: async (settings) => {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to save settings');
    return res.json();
  }
};
