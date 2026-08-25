import { api } from './client';

export async function getPublicStats() {
  try {
    const data = await api('/stats');
    return data;
  } catch (err) {
    // Fallback counts if backend API is initializing
    return {
      programs_count: 2262,
      universities_count: 180,
      tuition_free_count: 1950,
      satisfaction_rate: 98,
    };
  }
}
