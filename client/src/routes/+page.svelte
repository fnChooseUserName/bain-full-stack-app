<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { Toast } from '$lib';
  import { getDistance } from '$lib/api';
  import { calculateMiles } from '$lib/utils';

  let distUnits = [ 'Kilometers', 'Miles', 'Both'];

  let address1 = '';
  let address2 = '';
  let distanceKm = '';
  let distanceMi = '';
  let distance = '';
  let unit = 'Both'; // default to 'both'

  let showToast = false;
  let toastMessage = '';

  // Validate input and call the API
  const calculateDistance = async () => {
    if (!address1 || !address2) {
      toastMessage = 'Please enter both addresses.';
      showToast = true;
      return;
    }

    try {
      const data = await getDistance(address1, address2);

      // Calculate and cache distance conversions on response
      // Radio-group options only handle display. 
      // Prevents re-calculating every time you select an option
      const distance_in_km = data.distance_km.toFixed(2);
      const distance_in_mi = calculateMiles(data.distance_km).toFixed(2);

      distanceKm = `${distance_in_km} km`;
      distanceMi = `${distance_in_mi} mi`;

      // Handle rendering of the distance values immediately
      updateDisplayedDistance();      

    } catch (error) {
      toastMessage = 'Failed to calculate distance. Please try again.';
      showToast = true;
      console.error(error);
    }
  };

  // Update the displayed distance in the selected unit(s)
  const updateDisplayedDistance = () => {
    if(unit === 'Both') {
      distance = `${distanceKm} | ${distanceMi}`;
    } else if(unit === 'Miles') {
      distance = distanceMi;
    } else {
      distance = distanceKm;
    }
  };

  // Hide the toast message
  const closeToast = () => {
    showToast = false;
  };
</script>

<div class="container">
  <!-- Header -->
  <div class="header">
    <div>
      <h1>Distance Calculator</h1>
      <p>Prototype web application for calculating the distance between addresses.</p>
    </div>
    
    <a href="/history" class="history-btn">
      <button>
        <span>View Historical Queries</span>
        <i class="fas fa-history"></i> <!-- History icon -->
      </button>
    </a>
  </div>

  <!-- Form -->
  <div class="form">
    <input 
      type="text" 
      placeholder="Source Address" 
      bind:value={address1} 
    />

    <input 
      type="text" 
      placeholder="Destination Address" 
      bind:value={address2} 
    />

    <!-- Unit selection -->
     <div>
      {#each distUnits as value}
        <!-- NOTE: Order of binding matters here! bind:group before on:change before value
                    in order to have reactive element that updates the DOM on:change
                    bind:group first so that on:change reflects the value set by bind:group
        -->
        <label><input type="radio" bind:group={unit} on:change={updateDisplayedDistance} {value} > {value}</label>
      {/each}
     </div>

    <!-- Submit Button -->
    <button
      class="submit-btn"
      on:click={calculateDistance}
      class:disabled-btn={!address1 || !address2}
      disabled={!address1 || !address2}
    >
      <span>Calculate Distance</span>
      <i class="fas fa-calculator"></i> <!-- Calculator icon -->
    </button>
  </div>

  <!-- Distance Display -->
  <div class="result">Distance: {distance || ''}</div>

  <!-- Toast Notification -->
  {#if showToast}
    <Toast message={toastMessage} on:close={closeToast} />
  {/if}
</div>
