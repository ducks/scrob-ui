<script>
  import { onMount } from 'svelte';
  import { getRecentScrobbles } from './api.js';
  import { formatTimestamp } from './utils.js';

  let scrobbles = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      scrobbles = await getRecentScrobbles(50);
      loading = false;
    } catch (e) {
      error = e.message;
      loading = false;
    }
  });
</script>

<div class="recent-scrobbles">
  <h2>Recent Scrobbles</h2>

  {#if loading}
    <p class="loading">Loading...</p>
  {:else if error}
    <p class="error">Error: {error}</p>
  {:else if scrobbles.length === 0}
    <p class="empty">No scrobbles yet. Start listening to some music!</p>
  {:else}
    <div class="scrobble-list">
      {#each scrobbles as scrobble}
        <div class="scrobble-item">
          <div class="track-info">
            <div class="track-name">{scrobble.track}</div>
            <div class="artist-name">{scrobble.artist}</div>
            {#if scrobble.album}
              <div class="album-name">{scrobble.album}</div>
            {/if}
          </div>
          <div class="timestamp">{formatTimestamp(scrobble.timestamp)}</div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .recent-scrobbles {
    max-width: 87.5rem;
    margin: 0 auto;
    padding: 0 2rem;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #333;
  }

  .loading, .error, .empty {
    padding: 2rem;
    text-align: center;
    color: #666;
  }

  .error {
    color: #d32f2f;
  }

  .scrobble-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .scrobble-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f5f5f5;
    border-radius: 8px;
    transition: background 0.2s;
  }

  .scrobble-item:hover {
    background: #ebebeb;
  }

  .track-info {
    flex: 1;
    text-align: left;
  }

  .track-name {
    font-weight: 600;
    font-size: 1rem;
    color: #222;
    margin-bottom: 0.25rem;
    text-align: left;
  }

  .artist-name {
    font-size: 0.875rem;
    color: #666;
    text-align: left;
  }

  .album-name {
    font-size: 0.75rem;
    color: #999;
    margin-top: 0.125rem;
    text-align: left;
  }

  .timestamp {
    font-size: 0.875rem;
    color: #999;
    white-space: nowrap;
    margin-left: 1rem;
  }
</style>
