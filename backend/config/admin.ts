export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', false),
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
  },
  // Fix admin URL for remote environments (Codespaces, etc.)
  url: env('ADMIN_URL', '/admin'),
  serveAdminPanel: env.bool('SERVE_ADMIN_PANEL', true),
  // Enable auto-open in development
  autoOpen: env.bool('ADMIN_AUTO_OPEN', false),
  // Security settings for remote access
  rateLimit: {
    enabled: true,
    interval: 60000, // Time window in milliseconds
    max: 5, // Max number of requests during the time window
  },
});
