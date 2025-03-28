<script lang="ts">
    export let message: string;
    let show = true;
    
    setTimeout(() => (show = false), 3000);
  </script>
  
  {#if show}
    <div class="toast">{message}</div>
  {/if}
  
  <style>
    .toast {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: red;
      color: white;
      padding: 10px;
      border-radius: 5px;
    }
  </style>
  