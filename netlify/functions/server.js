const serverless = require('serverless-http');

// Cache the serverless handler
let cachedHandler;

exports.handler = async (event, context) => {
  // Set demo mode for Netlify deployment
  process.env.DEMO_MODE = 'true';
  process.env.NODE_ENV = 'production';
  
  if (!cachedHandler) {
    try {
      // Use dynamic import for ES modules
      const appModule = await import('../../dist/index.js');
      const { createApp } = appModule;
      
      // Initialize the app with routes
      const app = await createApp();
      
      // Create serverless handler
      cachedHandler = serverless(app);
    } catch (error) {
      console.error('Failed to initialize serverless handler:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          error: 'Failed to initialize application',
          message: error.message
        })
      };
    }
  }
  
  try {
    return await cachedHandler(event, context);
  } catch (error) {
    console.error('Serverless function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};