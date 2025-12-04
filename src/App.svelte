<script>
  import RecentScrobbles from './lib/RecentScrobbles.svelte';
  import TopStats from './lib/TopStats.svelte';

  let currentView = 'recent'; // 'recent' or 'stats'
</script>

<main>
  <header>
    <h1>🎵 Scrob</h1>
    <p class="tagline">Your personal scrobble tracker</p>

    <nav>
      <button
        class:active={currentView === 'recent'}
        on:click={() => currentView = 'recent'}
      >
        Recent
      </button>
      <button
        class:active={currentView === 'stats'}
        on:click={() => currentView = 'stats'}
      >
        Stats
      </button>
    </nav>
  </header>

  <div class="content">
    {#if currentView === 'recent'}
      <RecentScrobbles />
    {:else}
      <TopStats />
    {/if}
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #fafafa;
  }

  main {
    min-height: 100vh;
  }

  header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
  }

  .tagline {
    margin: 0.5rem 0 1.5rem;
    opacity: 0.9;
    font-size: 1.1rem;
  }

  nav {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1.5rem;
  }

  button {
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

  button:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }

  button.active {
    background: white;
    color: #667eea;
    border-color: white;
  }

  .content {
    padding: 2rem 1rem;
  }
</style>
