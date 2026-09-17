export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  isDevelopment: process.env.NEXT_PUBLIC_APP_ENV === 'development',
};

// Strict check to ensure critical variables are present
if (!process.env.NEXT_PUBLIC_API_URL && typeof window !== 'undefined') {
  console.warn("NEXT_PUBLIC_API_URL is missing. Using default fallback.");
}
