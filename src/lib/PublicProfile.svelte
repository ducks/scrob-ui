<script>
  import { onMount } from 'svelte';
  import { getPublicRecentScrobbles, getPublicTopArtists, getPublicTopTracks, getPublicTopAlbums } from './api.js';
  import { formatTimestamp } from './utils.js';
  import ThemeToggle from './ThemeToggle.svelte';
  import { theme } from './theme.js';

  export let username;

  let currentView = 'recent';
  let recentScrobbles = [];
  let topArtists = [];
  let topTracks = [];
  let topAlbums = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    theme.init();
    await loadData();
  });

  async function loadData() {
    loading = true;
    error = null;
    try {
      if (currentView === 'recent') {
        recentScrobbles = await getPublicRecentScrobbles(username);
      } else {
        [topArtists, topTracks, topAlbums] = await Promise.all([
          getPublicTopArtists(username),
          getPublicTopTracks(username),
          getPublicTopAlbums(username)
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
        <h1>{username}</h1>
        <p class="tagline">Public scrobble profile</p>
      </div>
      <div class="header-buttons">
        <ThemeToggle />
        <a href="/" class="home-btn">Home</a>
      </div>
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

        <section class="stats-section">
          <h2>Top Albums</h2>
          {#if topAlbums.length === 0}
            <p class="no-data">No data yet</p>
          {:else}
            <ol class="stats-list">
              {#each topAlbums as album}
                <li>
                  <div class="track-info">
                    <span class="stats-name">{album.album}</span>
                    <span class="stats-artist">{album.artist}</span>
                  </div>
                  <span class="stats-count">{album.count} plays</span>
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
    background: var(--header-bg);
    color: var(--header-text);
    padding: 2rem;
    border-bottom: 2px solid var(--border-color);
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
    color: var(--header-text);
  }

  h1 .icon {
    color: var(--accent-blue);
  }

  .tagline {
    margin: 0.5rem 0 0;
    opacity: 0.9;
    font-size: 1.1rem;
    color: var(--header-text);
  }

  .header-buttons {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .home-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    background: rgba(251, 241, 199, 0.1);
    color: var(--header-text);
    border: 1px solid rgba(251, 241, 199, 0.3);
    border-radius: 6px;
    text-decoration: none;
    transition: all 0.2s;
  }

  .home-btn:hover {
    background: rgba(251, 241, 199, 0.2);
    border-color: rgba(251, 241, 199, 0.5);
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
    border: 2px solid rgba(251, 241, 199, 0.3);
    background: rgba(251, 241, 199, 0.1);
    color: var(--header-text);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  nav button:hover {
    background: rgba(251, 241, 199, 0.2);
    border-color: rgba(251, 241, 199, 0.5);
  }

  nav button.active {
    background: var(--header-text);
    color: var(--header-bg);
    border-color: var(--header-text);
  }

  .content {
    padding: 3rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .loading {
    text-align: center;
    padding: 3rem;
    color: var(--text-secondary);
    font-size: 1.125rem;
  }

  .error {
    text-align: center;
    padding: 3rem;
    color: var(--error-text);
    background: var(--error-bg);
    border-radius: 8px;
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
    color: var(--text-primary);
  }

  .scrobbles-list {
    display: grid;
    gap: 1rem;
  }

  .scrobble-card {
    background: var(--bg-tertiary);
    border-radius: 8px;
    padding: 1.25rem;
    transition: background 0.2s;
  }

  .scrobble-card:hover {
    background: var(--bg-hover);
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
    color: var(--text-primary);
  }

  .artist-name {
    font-size: 1rem;
    color: var(--text-secondary);
  }

  .album-name {
    font-size: 0.875rem;
    color: var(--text-tertiary);
  }

  .scrobble-time {
    font-size: 0.875rem;
    color: var(--text-tertiary);
    white-space: nowrap;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }

  .stats-section {
    background: var(--bg-tertiary);
    border-radius: 8px;
    padding: 1.5rem;
  }

  .stats-section h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
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
    border-bottom: 1px solid var(--border-color);
  }

  .stats-list li:last-child {
    border-bottom: none;
  }

  .track-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    text-align: left;
  }

  .stats-name {
    font-weight: 500;
    color: var(--text-primary);
    text-align: left;
  }

  .stats-artist {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .stats-count {
    font-size: 0.875rem;
    color: var(--text-tertiary);
    font-weight: 500;
  }

  .no-data {
    text-align: center;
    color: var(--text-tertiary);
    padding: 2rem;
    font-style: italic;
  }
</style>
