const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

/**
 * Sends validated contract payload to the FastAPI backend and receives dynamic PDF blob response.
 * @param {Object} contractData - Full nested contract, client, and provider payload
 * @returns {Promise<Blob>} Raw binary PDF Blob
 */
export async function generateContractPDF(contractData) {
  const response = await fetch(`${API_BASE_URL}/contracts/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contractData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || `Server returned error status ${response.status}`;
    throw new Error(errorMessage);
  }

  return await response.blob();
}