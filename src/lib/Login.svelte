<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  let username = '';
  let password = '';
  let loading = false;
  let error = null;

  async function handleLogin() {
    if (!username || !password) {
      error = 'Please enter both username and password';
      return;
    }

    loading = true;
    error = null;

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Login failed');
      }

      const data = await response.json();
      dispatch('login', { token: data.token, username: data.username, isAdmin: data.is_admin });
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Enter') {
      handleLogin();
    }
  }
</script>

<div class="login-container">
  <div class="login-card">
    <h1 class="logo">Scrob</h1>
    <p class="tagline">Your personal scrobble tracker</p>

    {#if error}
      <div class="error">{error}</div>
    {/if}

    <form on:submit|preventDefault={handleLogin}>
      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          type="text"
          bind:value={username}
          on:keydown={handleKeydown}
          disabled={loading}
          autocomplete="username"
          placeholder="Enter your username"
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          on:keydown={handleKeydown}
          disabled={loading}
          autocomplete="current-password"
          placeholder="Enter your password"
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-primary);
  }

  .login-card {
    background: var(--bg-secondary);
    padding: 3rem;
    border-radius: 16px;
    border: 2px solid var(--border-color);
    width: 100%;
    max-width: 25rem;
    margin: 1rem;
  }

  .logo {
    margin: 0 0 0.5rem 0;
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    color: var(--text-primary);
  }

  .logo .icon {
    color: var(--accent-blue);
  }

  .tagline {
    margin: 0 0 2rem 0;
    text-align: center;
    color: var(--text-secondary);
    font-size: 0.95rem;
  }

  .error {
    background: var(--error-bg);
    color: var(--error-text);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--text-primary);
  }

  input {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    background: var(--bg-primary);
    color: var(--text-primary);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: #667eea;
  }

  input:disabled {
    background: var(--bg-tertiary);
    cursor: not-allowed;
  }

  button {
    padding: 0.875rem 1rem;
    font-size: 1rem;
    font-weight: 600;
    background: var(--bg-tertiary);
    color: var(--text-primary);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  button:hover:not(:disabled) {
    background: var(--bg-hover);
  }

  button:active:not(:disabled) {
    transform: translateY(1px);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
