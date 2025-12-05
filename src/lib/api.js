import { get } from 'svelte/store';
import { auth } from './auth.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function fetchAPI(endpoint, options = {}) {
  const { token } = get(auth);

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function getRecentScrobbles(limit = 20) {
  return fetchAPI(`/recent?limit=${limit}`);
}

export async function getTopArtists(limit = 10) {
  return fetchAPI(`/top/artists?limit=${limit}`);
}

export async function getTopTracks(limit = 10) {
  return fetchAPI(`/top/tracks?limit=${limit}`);
}
