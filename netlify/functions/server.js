// Simple demo API for Netlify deployment
exports.handler = async (event, context) => {
  // Set demo mode environment
  process.env.DEMO_MODE = 'true';
  process.env.NODE_ENV = 'production';
  
  const { path, httpMethod, body: rawBody, queryStringParameters } = event;
  
  // Parse body if present
  let body;
  try {
    body = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    body = {};
  }
  
  console.log(`${httpMethod} ${path}`, { body, query: queryStringParameters });
  
  // Demo user data
  const demoUser = {
    id: 1,
    username: "DemoCreator",
    email: "demo@veri.club",
    veriScore: 85,
    xp: 2750,
    level: 5,
    isVerified: true,
    tier: "gold",
    createdAt: new Date('2024-01-01').toISOString()
  };
  
  // Route handling
  try {
    if (path === '/api/auth/signup' && httpMethod === 'POST') {
      return {
        statusCode: 201,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoUser)
      };
    }
    
    if (path === '/api/auth/login' && httpMethod === 'POST') {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoUser)
      };
    }
    
    if (path === '/api/auth/me' && httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoUser)
      };
    }
    
    if (path === '/api/users/1' && httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoUser)
      };
    }
    
    if (path === '/api/tasks/1' && httpMethod === 'GET') {
      const demoTasks = [
        {
          id: 1,
          userId: 1,
          title: "Connect Your Social Media",
          description: "Link your Twitter, Instagram, or TikTok account to start earning",
          xpReward: 100,
          status: "pending",
          category: "social"
        },
        {
          id: 2,
          userId: 1,
          title: "Complete Your Profile",
          description: "Add your bio, photo, and interests to unlock more opportunities",
          xpReward: 150,
          status: "pending",
          category: "profile"
        }
      ];
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoTasks)
      };
    }
    
    if (path === '/api/social-connections/1' && httpMethod === 'GET') {
      const demoConnections = [
        {
          id: 1,
          userId: 1,
          platform: "twitter",
          username: "@democreator",
          isConnected: true,
          followers: 5420,
          verified: true
        }
      ];
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoConnections)
      };
    }
    
    if (path === '/api/leaderboard' && httpMethod === 'GET') {
      const demoLeaderboard = {
        users: [
          { id: 1, rank: 1, name: "Alex Chen", username: "@alexcreates", veriScore: 95, xp: 12500, tier: "platinum" },
          { id: 2, rank: 2, name: "Sarah Kim", username: "@sarahstyle", veriScore: 92, xp: 11200, tier: "gold" },
          { id: 3, rank: 3, name: "Mike Torres", username: "@miketech", veriScore: 89, xp: 10800, tier: "gold" },
          { id: 4, rank: 4, name: "Emma Wilson", username: "@emmacooks", veriScore: 87, xp: 10200, tier: "gold" },
          { id: 5, rank: 5, name: "DemoCreator", username: "@democreator", veriScore: 85, xp: 2750, tier: "gold" }
        ]
      };
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoLeaderboard)
      };
    }
    
    // Handle onboarding completion (save demo profile preferences)
    if (path === '/api/users/1/onboarding' && httpMethod === 'POST') {
      // In demo mode, we'll accept the onboarding data and return success
      // The preferences are saved for the session (in a real app this would persist)
      console.log('Demo onboarding data received:', body);
      
      // Return updated demo user with any preferences applied
      const updatedDemoUser = {
        ...demoUser,
        // Apply any onboarding preferences from the body
        ...body,
        onboardingCompleted: true,
        updatedAt: new Date().toISOString()
      };
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDemoUser)
      };
    }
    
    // Handle other user updates 
    if (path.startsWith('/api/users/1') && httpMethod === 'PATCH') {
      console.log('Demo user update received:', body);
      
      // Return updated demo user 
      const updatedDemoUser = {
        ...demoUser,
        ...body,
        updatedAt: new Date().toISOString()
      };
      
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDemoUser)
      };
    }
    
    // Default response for unhandled routes
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Route not found' })
    };
    
  } catch (error) {
    console.error('API Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};