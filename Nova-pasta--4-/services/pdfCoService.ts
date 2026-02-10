
export const sendToWebhook = async (url: string, payload: any): Promise<void> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Falha ao enviar dados para o webhook');
    }
  } catch (error) {
    console.error("Webhook Error:", error);
    throw error;
  }
};
