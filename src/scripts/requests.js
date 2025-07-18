const API_URL = import.meta.env.API_URL

export const fetchPDF = async ({ title, content, options }) => {
  let parsedOptions = {
    font: options.font,
    margin: parseInt(options.margin)
  }
  try {
    let request = await fetch(`${API_URL}/generate-simple`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content, options: parsedOptions }),
    });

    let data = await request.blob();
    return data;

  } catch (err) {
    console.log(err);
    return err;
  }
};

export const fetchInvoicePDF = async (invoiceData) => {
  console.log({ ...invoiceData });
  try {
    const response = await fetch(`${API_URL}/generate-invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...invoiceData }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
    }

    return await response.blob();
  } catch (error) {
    throw error;
  }
}

