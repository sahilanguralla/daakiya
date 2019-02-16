const application = require('./lib');

module.exports = application;

// console.log("require.main", require.main);
// if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +process.env.PORT || 32592,
      host: process.env.HOST || '0.0.0.0',
      openApiSpec: {
        // useful when used with OASGraph to locate your application
        setServersFromRequest: true,
      },
    },
  };
  application.main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
// }
