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

export async function getTopAlbums(limit = 10) {
  return fetchAPI(`/top/albums?limit=${limit}`);
}

// Public API functions (no authentication required)

async function fetchPublicAPI(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('This user\'s profile is private');
    }
    if (response.status === 404) {
      throw new Error('User not found');
    }
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function getPublicRecentScrobbles(username, limit = 20) {
  return fetchPublicAPI(`/users/${username}/recent?limit=${limit}`);
}

export async function getPublicTopArtists(username, limit = 10) {
  return fetchPublicAPI(`/users/${username}/top/artists?limit=${limit}`);
}

export async function getPublicTopTracks(username, limit = 10) {
  return fetchPublicAPI(`/users/${username}/top/tracks?limit=${limit}`);
}

export async function getPublicTopAlbums(username, limit = 10) {
  return fetchPublicAPI(`/users/${username}/top/albums?limit=${limit}`);
}
