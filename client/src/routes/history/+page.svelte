<script lang="ts">
    import { onMount } from 'svelte';
    import { Toast } from '$lib';
    import { getHistory } from '$lib/api';
    import type { Query } from '$lib/types';
    import { calculateMiles } from '$lib/utils';
  
    let queries: Query[] = [];
    let showToast = false;
    let toastMessage = '';
  
    // Fetch history on component mount
    const fetchHistory = async () => {
      try {
        queries = await getHistory();
      } catch (error) {
        console.error('Error fetching history:', error);
        toastMessage = 'Failed to load historical queries. Please try again.';
        showToast = true;
      }
    };
  
    // Refresh history
    const refreshHistory = () => {
      fetchHistory();
    };
  
    // Close toast
    const closeToast = () => {
      showToast = false;
    };
  
    // Fetch history on page load
    onMount(fetchHistory);
  </script>
  
  <div class="container">
    <!-- Header Section -->
    <div class="header">
      <h1>Historical Queries</h1>
      <h2>History of the user's queries</h2>
  
      <div class="actions">
        <button on:click={refreshHistory} class="refresh-btn">
          <i class="fas fa-sync-alt"></i> Refresh
        </button>
  
        <a href="/" class="back-btn">
          <button>
            <i class="fa-solid fa-calculator"></i> Back to Calculator
          </button>
        </a>
      </div>
    </div>
  
    <!-- Table Display -->
    {#if queries.length > 0}
      <table>
        <thead>
          <tr>
            <th>Source Address</th>
            <th>Destination Address</th>
            <th>Distance (Kilometers)</th>
            <th>Distance (Miles)</th>
            <th>Date Queried</th>
          </tr>
        </thead>
        <tbody>
          {#each queries as query}
          <tr>
            <td>{query.address1}</td>
            <td>{query.address2}</td>
            <td>{query.distance_km.toFixed(2)} km</td>
            <td>{calculateMiles(query.distance_km).toFixed(2)} mi</td>
            <td>{new Date(query.created_at).toLocaleString()}</td>
          </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p>No historical queries found.</p>
    {/if}
  
    <!-- Toast Notification -->
    {#if showToast}
      <Toast message={toastMessage} on:close={closeToast} />
    {/if}
  </div>
  