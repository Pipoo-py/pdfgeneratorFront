<script>
  import { fetchInvoicePDF } from "../scripts/requests.js";
  let { isMobile = $bindable() } = $props();
  let pdfUrl = $state("");
  let pdfUrlDownload = $state("");

  let company = $state("");
  let rif = $state("");
  let direction = $state("");
  let state = $state("");
  let invoiceNr = $state(0);
  let date = $state(new Date().toISOString().split("T")[0]);
  let rifClient = $state("");
  let companyClient = $state("");
  let directionClient = $state("");
  let currency = $state("$");
  let iva = $state(0);

  let products = $state([
    {
      id: crypto.randomUUID(),
      code: 1,
      description: "",
      quantity: 1,
      priceEachUnit: 0.0,
      discount: 0,
    },
  ]);

  let showNewProductMessage = $state(false);

  const addProduct = () => {
    products.push({
      id: crypto.randomUUID(),
      code: products.length + 1,
      description: "",
      quantity: 1,
      priceEachUnit: 0.0,
      discount: 0,
    });
    showNewProductMessage = true;
    setTimeout(() => {
      showNewProductMessage = false;
    }, 3000);
  };

  const removeProduct = (id) => {
    products = products.filter((product) => product.id !== id);
  };

  const getInvoicePDFBlob = async (e) => {
    e.preventDefault();

    const invoiceInputData = {
      company,
      rif,
      direction,
      state,
      invoiceNr: Number(invoiceNr),
      date,
      rifClient,
      companyClient,
      directionClient,
      products: products.map((p) => ({
        code: Number(p.code),
        description: p.description,
        quantity: Number(p.quantity),
        priceEachUnit: Number(p.priceEachUnit),
        discount: Number(p.discount),
      })),
      currency,
      iva,
    };

    try {
      const pdfBlob = await fetchInvoicePDF(invoiceInputData);
      pdfUrl = URL.createObjectURL(pdfBlob);
      pdfUrlDownload = URL.createObjectURL(pdfBlob);
    } catch (error) {
      console.log(error.message);
      alert("Error al generar el PDF. Revisa la consola para más detalles.");
    }
  };
</script>

<div>
  <form onsubmit={getInvoicePDFBlob} class="invoice-form">
    <h2>Datos de la Empresa Emisora</h2>
    <div class="form-section">
      <label>
        Nombre de la Empresa:
        <input type="text" required bind:value={company} />
      </label>
      <label>
        RIF de la Empresa:
        <input type="text" required bind:value={rif} />
      </label>
      <label>
        Dirección de la Empresa:
        <input type="text" required bind:value={direction} />
      </label>
      <label>
        Estado de la Empresa:
        <input type="text" required bind:value={state} />
      </label>
      <label>
        Número de Factura:
        <input type="number" required bind:value={invoiceNr} />
      </label>
      <label>
        Fecha de Factura:
        <input type="date" required bind:value={date} />
      </label>
    </div>

    <h2>Datos del Cliente</h2>
    <div class="form-section">
      <label>
        RIF del Cliente:
        <input type="text" required bind:value={rifClient} />
      </label>
      <label>
        Nombre del Cliente (Empresa/Persona):
        <input type="text" required bind:value={companyClient} />
      </label>
      <label>
        Dirección del Cliente:
        <input type="text" required bind:value={directionClient} />
      </label>
    </div>

    <h2>Productos</h2>
    <label>
      Moneda
      <select bind:value={currency}>
        <option value="$">Dólar</option>
        <option value="€">Euro</option>
        <option value="Bs">Bolívares</option>
      </select>
    </label>
    <label>
      % IVA
      <input type="number" required bind:value={iva} min="1" max="100" />
    </label>
    <div class="products-section">
      {#each products as product (product.id)}
        <div class="product-item">
          <label>
            Código:
            <input type="number" required bind:value={product.code} />
          </label>
          <label>
            Cantidad:
            <input
              type="number"
              required
              bind:value={product.quantity}
              min="1"
            />
          </label>
          <label>
            Precio Unitario ({currency}):
            <input
              type="number"
              required
              bind:value={product.priceEachUnit}
              step="0.01"
              min="0"
            />
          </label>
          <label>
            Descuento (%):
            <input
              type="number"
              required
              bind:value={product.discount}
              min="0"
              max="100"
            />
          </label>
          <label class="description-label">
            Descripción:
            <textarea required bind:value={product.description}></textarea>
          </label>
          <button
            type="button"
            onclick={() => removeProduct(product.id)}
            class="remove-button"
          >
            Eliminar Producto
          </button>
        </div>
      {/each}
      <div class="add-product-controls">
        <button type="button" onclick={addProduct} class="add-product-button">
          Añadir Otro Producto
        </button>
        {#if showNewProductMessage}
          <span class="new-product-indicator">
            Inserte los datos del producto nuevo
          </span>
        {/if}
      </div>
    </div>

    <button type="submit" class="submit-button">Generar Factura PDF</button>

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
  .invoice-form {
    display: grid;
    gap: 1.5rem;
    padding: 1.5rem;
    width: 90%;
    max-width: 800px;
    margin: 1rem auto;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: var(--bg-secondary);
    box-sizing: border-box;
  }

  h2 {
    color: var(--text-primary);
    border-bottom: 1px solid var(--border);
    padding-bottom: 0.5rem;
    margin-top: 0;
    font-size: 1.25rem;
    grid-column: 1 / -1;
  }

  .form-section {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  label {
    font-weight: 600;
    color: var(--text-primary);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  input[type="text"],
  input[type="number"],
  input[type="date"],
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 0.375rem;
    box-sizing: border-box;
    font-size: 1rem;
    color: var(--text-primary);
    background-color: var(--bg-primary);
    transition:
      border-color 0.2s,
      box-shadow 0.2s;
  }

  input[type="text"]:focus,
  input[type="number"]:focus,
  input[type="date"]:focus,
  textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }

  .products-section {
    border: 1px solid var(--border);
    padding: 1.5rem;
    border-radius: 0.5rem;
    background-color: var(--bg-primary);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .product-item {
    display: grid;
    gap: 0.8rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
    grid-template-columns: 1fr;
  }

  .product-item:last-of-type {
    border-bottom: none;
    padding-bottom: 0;
  }

  .description-label {
    grid-column: unset;
  }

  button {
    width: 100%;
    padding: 0.8rem;
    box-sizing: border-box;
    border: none;
    color: #fff;
    border-radius: 0.375rem;
  }
  button:hover {
    filter: brightness(95%);
  }

  .add-product-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .new-product-indicator {
    background-color: var(--dark-bg-secondary);
    color: var(--dark-text-primary);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.9rem;
    animation: fadeIn 0.5s ease-out;
  }

  .add-product-button {
    background-color: var(--success);
    align-self: flex-start;
  }

  .add-product-button:hover {
    background-color: #0f9971;
  }

  .remove-button {
    background-color: var(--error);
    grid-column: 1 / -1;
    justify-self: end;
    width: fit-content;
  }

  .remove-button:hover {
    background-color: #d63031;
  }

  .submit-button {
    background-color: var(--color-primary);
    font-size: 1.1rem;
    padding: 0.8rem 1.8rem;
    margin-top: 1rem;
  }

  .submit-button:hover {
    background-color: var(--color-secondary);
    filter: none;
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

  @media (min-width: 768px) {
    .invoice-form {
      width: clamp(300px, 70dvw, 800px);
      padding: 2rem;
      margin: 2rem auto;
      gap: 2rem;
    }

    .product-item {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem 1.5rem;
    }

    .description-label {
      grid-column: 1 / -1;
    }

    .add-product-controls {
      flex-direction: row;
      align-items: center;
    }

    button {
      width: auto;
      padding: 0.75rem 1.5rem;
    }
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

  a {
    text-decoration: none;
  }
</style>
