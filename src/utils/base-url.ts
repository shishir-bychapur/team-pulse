export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Browser / CSR
    return "";
  }

  // Server / SSR
  return process.env.URL;
};
