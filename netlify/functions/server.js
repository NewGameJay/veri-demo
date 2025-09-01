import serverless from 'serverless-http';

// Cache the serverless handler
let cachedHandler;

export const handler = async (event, context) => {
  // Set demo mode for Netlify deployment
  process.env.DEMO_MODE = 'true';
  process.env.NODE_ENV = 'production';
  
  if (!cachedHandler) {
    try {
      // Import the Express app creator
      const { createApp } = await import('../../dist/index.js');
      
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