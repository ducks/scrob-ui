<script>
  import { onMount } from 'svelte';
  import Login from './lib/Login.svelte';
  import PublicProfile from './lib/PublicProfile.svelte';
  import RecentScrobbles from './lib/RecentScrobbles.svelte';
  import TopStats from './lib/TopStats.svelte';
  import { auth } from './lib/auth.js';

  let currentView = 'recent';
  let route = { type: 'home' };

  onMount(() => {
    updateRoute();
    // Listen for navigation events
    window.addEventListener('popstate', updateRoute);
    return () => window.removeEventListener('popstate', updateRoute);
  });

  function updateRoute() {
    const path = window.location.pathname;

    // Check if viewing a public profile (/username or /users/username)
    const match = path.match(/^\/(?:users\/)?([^\/]+)$/);
    if (match && match[1] !== '') {
      route = { type: 'profile', username: match[1] };
    } else {
      route = { type: 'home' };
    }
  }

  function handleLogin(event) {
    const { token, username } = event.detail;
    auth.login(token, username);
    // Navigate to home after login
    window.history.pushState({}, '', '/');
    updateRoute();
  }

  function handleLogout() {
    auth.logout();
    window.history.pushState({}, '', '/');
    updateRoute();
  }
</script>

{#if route.type === 'profile'}
  <PublicProfile username={route.username} />
{:else if $auth.isAuthenticated}
  <main>
    <header>
      <div class="header-content">
        <div>
          <h1>🎵 Scrob</h1>
          <p class="tagline">Your personal scrobble tracker</p>
        </div>
        <div class="user-info">
          <span class="username">{$auth.username}</span>
          <button class="logout-btn" on:click={handleLogout}>Log Out</button>
        </div>
      </div>

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
{:else}
  <Login on:login={handleLogin} />
{/if}

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

  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .username {
    font-weight: 500;
    font-size: 1rem;
  }

  .logout-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .logout-btn:hover {
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
  }
</style>
