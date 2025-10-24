// backend/appInsights.js
const appInsights = require('applicationinsights');

function setupApplicationInsights() {
  const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
  
  if (connectionString) {
    appInsights.setup(connectionString)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true)
      .setUseDiskRetryCaching(true)
      .start();
    
    console.log('✅ Application Insights inicializado');
    return appInsights.defaultClient;
  } else {
    console.log('⚠️  Application Insights no configurado (falta connection string)');
    return null;
  }
}

module.exports = { setupApplicationInsights };
