<script lang="ts">
    import { onMount } from 'svelte';
    let message: string = '';
  
    onMount(async () => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL);
        const data = await res.json();
        message = data.message || 'No message received';
      } catch (error) {
        console.error('Failed to fetch:', error);
        message = 'Failed to connect to API';
      }
    });
  </script>
  
  <main>
    <h1>Bain Full-Stack App [Svelte]</h1>
    <p>{message}</p>
  </main>
  