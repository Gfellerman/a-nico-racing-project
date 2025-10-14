module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', ''),
  app: {
    keys: env.array('APP_KEYS', ['key1', 'key2']),
  },
  cors: {
    enabled: true,
    headers: '*',
    origin: [
      'http://localhost:5173',
      'https://organic-space-garbanzo-r4xwr7q449gv35474-5173.app.github.dev'
    ],
    methods: ['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS'],
    keepHeaderOnError: true,
  },
});
