<script>
  import { onMount } from 'svelte';
  import { getTopArtists, getTopTracks } from './api.js';

  let topArtists = [];
  let topTracks = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      [topArtists, topTracks] = await Promise.all([
        getTopArtists(10),
        getTopTracks(10)
      ]);
      loading = false;
    } catch (e) {
      error = e.message;
      loading = false;
    }
  });
</script>

<div class="top-stats">
  {#if loading}
    <p class="loading">Loading stats...</p>
  {:else if error}
    <p class="error">Error: {error}</p>
  {:else}
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Top Artists</h3>
        <div class="stat-list">
          {#each topArtists as artist, index}
            <div class="stat-item">
              <span class="rank">{index + 1}</span>
              <span class="name">{artist.name}</span>
              <span class="count">{artist.count} plays</span>
            </div>
          {/each}
        </div>
      </div>

      <div class="stat-card">
        <h3>Top Tracks</h3>
        <div class="stat-list">
          {#each topTracks as track, index}
            <div class="stat-item">
              <span class="rank">{index + 1}</span>
              <div class="track-details">
                <div class="name">{track.track}</div>
                <div class="artist">{track.artist}</div>
              </div>
              <span class="count">{track.count} plays</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .top-stats {
    max-width: 100rem;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .loading, .error {
    padding: 2rem;
    text-align: center;
    color: #666;
  }

  .error {
    color: #d32f2f;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
    gap: 2rem;
  }

  .stat-card {
    background: #f5f5f5;
    border-radius: 12px;
    padding: 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
    margin: 0 0 1rem 0;
    color: #333;
  }

  .stat-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: white;
    border-radius: 6px;
  }

  .rank {
    font-weight: 700;
    font-size: 1.25rem;
    color: #999;
    min-width: 2rem;
    text-align: center;
  }

  .name {
    flex: 1;
    font-weight: 500;
    color: #222;
  }

  .track-details {
    flex: 1;
  }

  .track-details .name {
    font-size: 0.95rem;
    margin-bottom: 0.125rem;
  }

  .track-details .artist {
    font-size: 0.8rem;
    color: #666;
  }

  .count {
    font-size: 0.875rem;
    color: #666;
    white-space: nowrap;
  }
</style>
