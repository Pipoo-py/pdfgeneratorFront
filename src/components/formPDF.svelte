<script>
  import BasicForm from "./BasicForm.svelte";
  import InvoiceForm from "./InvoiceForm.svelte";
  import {
    userOptionsStore,
    changeUserFormat,
  } from "../store/UserOptions.svelte";

  const toggleType = (e) => {
    changeUserFormat(e.target.value);
  };

  let isMobile = $state(false);

  const checkIsMobile = () => {
    let mobileRes = window.matchMedia("(max-width: 700px)").matches;
    if (!mobileRes) {
      isMobile = false;
      return;
    }
    isMobile = true;
  };

  $effect(() => {
    if (typeof window != undefined) {
      checkIsMobile();
      window
        .matchMedia("(max-width: 700px)")
        .addEventListener("change", checkIsMobile);
    }
    return () => {
      window.matchMedia().removeEventListener("change", checkIsMobile);
    };
  });
</script>

<div class="pdf-generator-container">
  <label>
    Escoge la plantilla que desees
    <select onchange={toggleType}>
      <option value="basic">Básico</option>
      <option value="invoice">Factura</option>
    </select>
  </label>
  {#if userOptionsStore.format.toLowerCase() == "basic"}
    <BasicForm bind:isMobile />
  {:else if userOptionsStore.format.toLowerCase() == "invoice"}
    <InvoiceForm bind:isMobile />
  {/if}
</div>

<style>
  .pdf-generator-container {
    container-type: inline-size;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-size: 1rem;
    color: var(--text-primary);
    margin-top: 1rem;
    width: 40%;
  }

  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    font-size: 1rem;
    color: var(--text-primary);
    background-color: var(--bg-primary);
    appearance: none;
    background-image: url('data:image/svg+xml;utf8,<svg fill="%2364748B" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1.5em;
    cursor: pointer;
  }

  select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
  }
</style>
