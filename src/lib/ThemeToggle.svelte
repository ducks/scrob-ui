<script>
  import { theme } from './theme.js';
</script>

<button class="theme-toggle" on:click={theme.toggle} aria-label="Toggle theme">
  {#if $theme === 'dark'}
    <!-- Sun icon -->
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="4" fill="currentColor"/>
      <line x1="10" y1="2" x2="10" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="10" y1="16" x2="10" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="18" y1="10" x2="16" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="4" y1="10" x2="2" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="15.66" y1="4.34" x2="14.24" y2="5.76" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="5.76" y1="14.24" x2="4.34" y2="15.66" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="15.66" y1="15.66" x2="14.24" y2="14.24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <line x1="5.76" y1="5.76" x2="4.34" y2="4.34" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  {:else}
    <!-- Moon icon -->
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
    </svg>
  {/if}
</button>

<style>
  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    background: rgba(251, 241, 199, 0.1);
    color: var(--header-text);
    border: 1px solid rgba(251, 241, 199, 0.3);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .theme-toggle:hover {
    background: rgba(251, 241, 199, 0.2);
    border-color: rgba(251, 241, 199, 0.5);
  }
</style>
