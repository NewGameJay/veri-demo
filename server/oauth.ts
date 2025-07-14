/**
 * Veri MVP - OAuth Server Implementation
 * Priority 4: Real Twitter OAuth integration
 */

import { Request, Response } from 'express';
import { storage } from './storage';
import { AuthenticatedRequest } from './auth';

// Twitter OAuth configuration
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID;
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET;
const TWITTER_REDIRECT_URI = process.env.TWITTER_REDIRECT_URI || `${process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000'}/api/auth/twitter/callback`;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5000';

// Twitter OAuth URLs
const TWITTER_OAUTH_BASE_URL = 'https://api.twitter.com/2/oauth2/authorize';
const TWITTER_TOKEN_URL = 'https://api.twitter.com/2/oauth2/token';
const TWITTER_USER_URL = 'https://api.twitter.com/2/users/me';

// Store OAuth state temporarily (in production, use Redis or database)
const oauthStates = new Map<string, { userId: number; timestamp: number }>();

// Clean up expired states (older than 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [state, data] of oauthStates.entries()) {
    if (now - data.timestamp > 10 * 60 * 1000) {
      oauthStates.delete(state);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

function generateRandomState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function initiateTwitterLogin(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!TWITTER_CLIENT_ID || !TWITTER_CLIENT_SECRET) {
      return res.status(500).json({ error: 'Twitter OAuth not configured' });
    }

    // Generate state parameter for security
    const state = generateRandomState();
    oauthStates.set(state, { userId, timestamp: Date.now() });

    // Create Twitter OAuth URL with proper configuration
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: TWITTER_CLIENT_ID,
      redirect_uri: TWITTER_REDIRECT_URI,
      scope: 'users.read tweet.read offline.access',
      state: state,
      code_challenge: 'challenge',
      code_challenge_method: 'plain'
    });

    const authUrl = `${TWITTER_OAUTH_BASE_URL}?${params.toString()}`;
    
    res.json({ authUrl });
  } catch (error) {
    console.error('Twitter OAuth initiation failed:', error);
    res.status(500).json({ error: 'Failed to initiate Twitter OAuth' });
  }
}

export async function handleTwitterCallback(req: Request, res: Response) {
  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.redirect(`${FRONTEND_URL}?error=oauth_denied`);
    }

    if (!code || !state) {
      return res.redirect(`${FRONTEND_URL}?error=invalid_callback`);
    }

    // Validate state
    const stateData = oauthStates.get(state as string);
    if (!stateData) {
      return res.redirect(`${FRONTEND_URL}?error=invalid_state`);
    }

    const { userId } = stateData;
    oauthStates.delete(state as string);

    if (!TWITTER_CLIENT_ID || !TWITTER_CLIENT_SECRET) {
      return res.redirect(`${FRONTEND_URL}?error=oauth_callback_failed`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch(TWITTER_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: TWITTER_REDIRECT_URI,
        code_verifier: 'challenge'
      })
    });

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text());
      return res.redirect(`${FRONTEND_URL}?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Get user data from Twitter
    const userResponse = await fetch(`${TWITTER_USER_URL}?user.fields=public_metrics,profile_image_url`, {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    if (!userResponse.ok) {
      console.error('User fetch failed:', await userResponse.text());
      return res.redirect(`${FRONTEND_URL}?error=user_fetch_failed`);
    }

    const userData = await userResponse.json();
    const twitterUser = userData.data;

    // Calculate token expiration
    const expiresAt = new Date(Date.now() + (expires_in * 1000));

    // Store/update social connection
    await storage.updateUserSocialConnection(userId, {
      platform: 'twitter',
      platformId: twitterUser.id,
      platformUsername: twitterUser.username,
      displayName: twitterUser.name,
      followerCount: twitterUser.public_metrics?.followers_count || 0,
      profileImageUrl: twitterUser.profile_image_url,
      isConnected: true,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt
    });

    // Redirect back to frontend with success
    res.redirect(`${FRONTEND_URL}?success=twitter_connected`);
  } catch (error) {
    console.error('Twitter OAuth callback failed:', error);
    res.redirect(`${FRONTEND_URL}?error=oauth_callback_failed`);
  }
}

export async function disconnectTwitter(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Remove the Twitter connection
    await storage.removeSocialConnection(userId, 'twitter');

    res.json({ message: 'Twitter account disconnected successfully' });
  } catch (error) {
    console.error('Twitter disconnect failed:', error);
    res.status(500).json({ error: 'Failed to disconnect Twitter account' });
  }
}

// Function to refresh expired Twitter tokens
export async function refreshTwitterToken(userId: number): Promise<boolean> {
  try {
    const connection = await storage.getUserSocialConnection(userId, 'twitter');
    if (!connection || !connection.refreshToken) {
      return false;
    }

    const tokenResponse = await fetch(TWITTER_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: connection.refreshToken
      })
    });

    if (!tokenResponse.ok) {
      console.error('Token refresh failed:', await tokenResponse.text());
      return false;
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Update connection with new tokens
    const expiresAt = new Date(Date.now() + (expires_in * 1000));
    await storage.updateSocialConnection(connection.id, {
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt
    });

    return true;
  } catch (error) {
    console.error('Twitter token refresh failed:', error);
    return false;
  }
}