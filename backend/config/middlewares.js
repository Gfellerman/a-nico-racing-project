module.exports = [
  'strapi::logger',
  'strapi::errors', 
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'https://organic-space-garbanzo-r4xwr7q449gv35474-5173.app.github.dev'
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
