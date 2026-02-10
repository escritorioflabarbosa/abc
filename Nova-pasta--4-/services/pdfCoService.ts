import { API_KEY, PDF_CONFIG } from '../constants';

export const generatePdfFromHtml = async (html: string, outputName: string): Promise<string> => {
  const url = 'https://api.pdf.co/v1/pdf/convert/from/html';
  
  const payload = {
    html: html,
    name: outputName,
    margins: PDF_CONFIG.margins,
    paperSize: PDF_CONFIG.paperSize,
    orientation: PDF_CONFIG.orientation
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error generating PDF');
    }

    const data = await response.json();
    
    if (data.error) {
        throw new Error(data.message);
    }

    return data.url;
  } catch (error) {
    console.error("PDF.co Error:", error);
    throw error;
  }
};