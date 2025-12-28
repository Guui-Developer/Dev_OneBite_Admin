export const API_STAGE = (import.meta.env.VITE_API_STAGE || "dev") as "dev" | "prod";
export const PUBLIC_API_BASE_URL = `${import.meta.env.VITE_PUBLIC_API_URL || "https://api.devonebite.xyz"}/${API_STAGE}`;
export const ADMIN_API_BASE_URL = `${import.meta.env.VITE_ADMIN_API_URL || "https://admin-api.devonebite.xyz"}/${API_STAGE}`;
export const SHOULD_LOG = (typeof import.meta !== "undefined" && import.meta.env.VITE_MODE !== "production");
export const IS_DEV = import.meta.env.VITE_MODE === "development";
export const API_TIMEOUT_MS = 15000;
