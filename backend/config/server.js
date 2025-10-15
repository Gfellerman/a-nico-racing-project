<<<<<<< HEAD
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
=======
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', ''),
  app: {
    keys: env.array('APP_KEYS', ['key1', 'key2']),
  },
});
>>>>>>> a165eac442ef3cc9c2e8f91c11b68f6bce1e13d0
