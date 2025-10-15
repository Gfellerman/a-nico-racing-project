module.exports = [
  'strapi::logger',
  'strapi::errors', 
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [
<<<<<<< HEAD
        'https://organic-space-garbanzo-r4xwr7q449gv35474-5173.app.github.dev'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
=======
        'http://localhost:5173',
        'http://localhost:3000', 
        'https://organic-space-garbanzo-r4xwr7q449gv35474-5173.app.github.dev',
        'https://gfellerman.github.io'
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
>>>>>>> a165eac442ef3cc9c2e8f91c11b68f6bce1e13d0
      keepHeaderOnError: true,
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];