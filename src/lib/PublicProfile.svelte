<script>
  import { onMount } from 'svelte';
  import { getPublicRecentScrobbles, getPublicTopArtists, getPublicTopTracks } from './api.js';
  import { formatTimestamp } from './utils.js';

  export let username;

  let currentView = 'recent';
  let recentScrobbles = [];
  let topArtists = [];
  let topTracks = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    loading = true;
    error = null;
    try {
      if (currentView === 'recent') {
        recentScrobbles = await getPublicRecentScrobbles(username);
      } else {
        [topArtists, topTracks] = await Promise.all([
          getPublicTopArtists(username),
          getPublicTopTracks(username)
        ]);
      }
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function switchView(view) {
    currentView = view;
    await loadData();
  }
</script>

<main>
  <header>
    <div class="header-content">
      <div>
        <h1>🎵 {username}</h1>
        <p class="tagline">Public scrobble profile</p>
      </div>
      <a href="/" class="home-btn">Home</a>
    </div>

    <nav>
      <button
        class:active={currentView === 'recent'}
        on:click={() => switchView('recent')}
      >
        Recent
      </button>
      <button
        class:active={currentView === 'stats'}
        on:click={() => switchView('stats')}
      >
        Stats
      </button>
    </nav>
  </header>

  <div class="content">
    {#if error}
      <div class="error">
        <p>{error}</p>
        <a href="/">Go back home</a>
      </div>
    {:else if loading}
      <div class="loading">Loading...</div>
    {:else if currentView === 'recent'}
      <section class="scrobbles-section">
        <h2>Recent Scrobbles</h2>
        {#if recentScrobbles.length === 0}
          <p class="no-data">No scrobbles yet</p>
        {:else}
          <div class="scrobbles-list">
            {#each recentScrobbles as scrobble (scrobble.id)}
              <div class="scrobble-card">
                <div class="scrobble-main">
                  <div class="scrobble-info">
                    <span class="track-name">{scrobble.track}</span>
                    <span class="artist-name">{scrobble.artist}</span>
                    {#if scrobble.album}
                      <span class="album-name">{scrobble.album}</span>
                    {/if}
                  </div>
                  <span class="scrobble-time">{formatTimestamp(scrobble.timestamp)}</span>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </section>
    {:else}
      <div class="stats-grid">
        <section class="stats-section">
          <h2>Top Artists</h2>
          {#if topArtists.length === 0}
            <p class="no-data">No data yet</p>
          {:else}
            <ol class="stats-list">
              {#each topArtists as artist}
                <li>
                  <span class="stats-name">{artist.name}</span>
                  <span class="stats-count">{artist.count} plays</span>
                </li>
              {/each}
            </ol>
          {/if}
        </section>

        <section class="stats-section">
          <h2>Top Tracks</h2>
          {#if topTracks.length === 0}
            <p class="no-data">No data yet</p>
          {:else}
            <ol class="stats-list">
              {#each topTracks as track}
                <li>
                  <div class="track-info">
                    <span class="stats-name">{track.track}</span>
                    <span class="stats-artist">{track.artist}</span>
                  </div>
                  <span class="stats-count">{track.count} plays</span>
                </li>
              {/each}
            </ol>
          {/if}
        </section>
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    min-height: 100vh;
  }

  header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
  }

  .tagline {
    margin: 0.5rem 0 0;
    opacity: 0.9;
    font-size: 1.1rem;
  }

  .home-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    text-decoration: none;
    transition: all 0.2s;
  }

  .home-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }

  nav {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  nav button {
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 500;
    border: 2px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  nav button:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }

  nav button.active {
    background: white;
    color: #667eea;
    border-color: white;
  }

  .content {
    padding: 3rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .loading {
    text-align: center;
    padding: 3rem;
    color: #666;
    font-size: 1.125rem;
  }

  .error {
    text-align: center;
    padding: 3rem;
    color: #d32f2f;
  }

  .error p {
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }

  .error a {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
  }

  .scrobbles-section h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #333;
  }

  .scrobbles-list {
    display: grid;
    gap: 1rem;
  }

  .scrobble-card {
    background: white;
    border-radius: 8px;
    padding: 1.25rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s;
  }

  .scrobble-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .scrobble-main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .scrobble-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }

  .track-name {
    font-size: 1.125rem;
    font-weight: 600;
    color: #333;
  }

  .artist-name {
    font-size: 1rem;
    color: #666;
  }

  .album-name {
    font-size: 0.875rem;
    color: #999;
  }

  .scrobble-time {
    font-size: 0.875rem;
    color: #999;
    white-space: nowrap;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .stats-section {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .stats-section h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: #333;
  }

  .stats-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .stats-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .stats-list li:last-child {
    border-bottom: none;
  }

  .track-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stats-name {
    font-weight: 500;
    color: #333;
  }

  .stats-artist {
    font-size: 0.875rem;
    color: #666;
  }

  .stats-count {
    font-size: 0.875rem;
    color: #999;
    font-weight: 500;
  }

  .no-data {
    text-align: center;
    color: #999;
    padding: 2rem;
    font-style: italic;
  }
</style>
