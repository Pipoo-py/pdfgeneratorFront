<script>
  import { fetchPDF } from "../scripts/requests.js";
  let { isMobile = $bindable() } = $props();
  let title = $state("");
  let content = $state("");
  let options = $state({
    font: "arial",
    margin: 20,
  });
  let pdfUrlDownload = $state("");
  let pdfUrl = $state("");

  const getPDFBlob = async (e) => {
    e.preventDefault();
    const pdfBlob = await fetchPDF({ title, content, options });
    pdfUrl = URL.createObjectURL(pdfBlob);
    pdfUrlDownload = URL.createObjectURL(pdfBlob);
  };
</script>

<div
  style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: auto;"
>
  <form onsubmit={getPDFBlob} class="pdf-form">
    <input
      type="text"
      placeholder="Escriba el titulo"
      required
      bind:value={title}
    />
    <textarea placeholder="Escribe aqui el contenido" bind:value={content}
    ></textarea>
    <label for="margin">Márgenes</label>
    <select bind:value={options.margin} id="margin">
      <option value="05">5mm - 0.5cm</option>
      <option value="10">10mm - 1cm </option>
      <option value="20">20mm - 2cm</option>
      <option value="30">30mm - 3cm</option>
      <option value="40">40mm - 4cm</option>
    </select>
    <label for="fonts">Fuente</label>
    <select bind:value={options.font} id="fonts">
      <option value="arial">Arial</option>
      <option value="times">Times New Roman</option>
    </select>
    <button type="submit">Generar PDF</button>
    {#if pdfUrl != "" && isMobile}
      <button class="download-button">
        <a
          href={pdfUrlDownload}
          download="documento.pdf"
          class="download-button"
        >
          Descargar PDF
        </a>
      </button>
    {/if}
  </form>
  {#if pdfUrl != "" && !isMobile}
    <div class="pdf-modal-overlay">
      <div class="pdf-modal-content">
        <iframe src={pdfUrl} title="Vista previa del pdf"></iframe>
        <button class="close-modal-button" onclick={() => (pdfUrl = "")}
          >Cerrar</button
        >
      </div>
    </div>
  {/if}
</div>

<style>
  .pdf-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    width: clamp(200px, 50dvw, 500px);
    margin: 2rem auto;
    background-color: var(--bg-secondary);
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border);
  }

  input[type="text"],
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    font-size: 1rem;
    color: var(--text-primary);
    background-color: var(--bg-primary);
    box-sizing: border-box;
  }

  input[type="text"]::placeholder,
  textarea::placeholder {
    color: var(--text-secondary);
  }

  input[type="text"]:focus,
  textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
  }

  textarea {
    min-height: 150px;
    resize: vertical;
  }

  button[type="submit"],
  .download-button {
    padding: 0.75rem 1.5rem;
    background-color: var(--color-primary);
    color: var(--bg-primary);
    border: none;
    border-radius: 0.375rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }

  button[type="submit"]:hover {
    background-color: var(--color-secondary);
  }

  .pdf-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .pdf-modal-content {
    background-color: var(--bg-primary);
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 90%;
    height: 90%;
  }

  .pdf-modal-content iframe {
    width: 100%;
    flex-grow: 1;
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    height: 100%;
  }

  .close-modal-button {
    align-self: flex-end;
    padding: 0.5rem 1rem;
    background-color: var(--error);
    color: var(--bg-primary);
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }

  .close-modal-button:hover {
    background-color: #d63031;
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

  @container (max-width: 600px) {
    .pdf-form {
      padding: 1rem;
      margin: 1rem auto;
    }

    input[type="text"],
    textarea,
    button[type="submit"] {
      font-size: 0.9rem;
      padding: 0.6rem;
    }

    .pdf-modal-content {
      padding: 1rem;
      max-width: 95%;
      max-height: 95%;
    }
  }

  @container (min-width: 601px) and (max-width: 900px) {
    .pdf-modal-content {
      max-width: 80%;
      max-height: 80%;
    }
  }

  @container (min-width: 901px) {
    .pdf-modal-content {
      max-width: 70%;
      max-height: 70%;
    }
  }

  a {
    text-decoration: none;
  }
</style>
