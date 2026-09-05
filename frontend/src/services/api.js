const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.port === '8000') {
    return window.location.origin;
  }
  return import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';
};

export async function analyzeImage(file) {
  const baseUrl = getApiBaseUrl();
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${baseUrl}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Server error (${response.status})`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Analysis failed:', error);
    throw error;
  }
}

export async function fetchSamples() {
  const baseUrl = getApiBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/samples`);
    if (!response.ok) {
      throw new Error('Failed to load sample parottas');
    }
    const samples = await response.json();
    return samples.map(s => ({
      ...s,
      full_image_url: s.image_url.startsWith('http') ? s.image_url : `${baseUrl}${s.image_url}`
    }));
  } catch (error) {
    console.warn('Could not fetch remote samples:', error);
    return [];
  }
}

export async function fetchSampleBlob(imageUrl) {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error('Failed to download sample file');
  const blob = await response.blob();
  const filename = imageUrl.split('/').pop() || 'sample_parotta.jpg';
  return new File([blob], filename, { type: blob.type || 'image/jpeg' });
}
