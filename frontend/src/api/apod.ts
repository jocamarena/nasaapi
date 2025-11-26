import type { ApodResponse, ApodQueryParams } from '../types/apod';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const fetchApod = async (params?: ApodQueryParams): Promise<ApodResponse[]> => {
  const queryParams = new URLSearchParams();

  if (params?.date) {
    queryParams.append('date', params.date);
  }
  if (params?.start_date) {
    queryParams.append('start_date', params.start_date);
  }
  if (params?.end_date) {
    queryParams.append('end_date', params.end_date);
  }

  const url = `${API_BASE_URL}/apod${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch APOD: ${response.statusText}`);
  }

  const data = await response.json();

  // Ensure we always return an array
  return Array.isArray(data) ? data : [data];
};
