/**
 * Veri MVP - OAuth Demo Implementation
 * Priority 4: OAuth demo setup for testing without Twitter credentials
 */

import { Request, Response } from 'express';
import { storage } from './storage';
import { AuthenticatedRequest } from './auth';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5000';

// Demo OAuth handlers that simulate real Twitter OAuth flow
export async function demoTwitterLogin(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Simulate OAuth URL generation
    const demoAuthUrl = `${FRONTEND_URL}/oauth-demo?platform=twitter&userId=${userId}`;
    
    res.json({ authUrl: demoAuthUrl });
  } catch (error) {
    console.error('Demo Twitter OAuth initiation failed:', error);
    res.status(500).json({ error: 'Failed to initiate demo Twitter OAuth' });
  }
}

export async function demoTwitterCallback(req: Request, res: Response) {
  try {
    const { userId, success } = req.query;

    if (!userId || !success) {
      return res.redirect(`${FRONTEND_URL}?error=invalid_demo_callback`);
    }

    // Simulate successful Twitter connection
    await storage.updateUserSocialConnection(Number(userId), {
      platform: 'twitter',
      platformId: 'demo_twitter_id',
      platformUsername: 'demo_user',
      displayName: 'Demo User',
      followerCount: 1250,
      profileImageUrl: 'https://pbs.twimg.com/profile_images/demo.jpg',
      isConnected: true,
      accessToken: 'demo_access_token',
      refreshToken: 'demo_refresh_token',
      expiresAt: new Date(Date.now() + 3600000) // 1 hour from now
    });

    res.redirect(`${FRONTEND_URL}?success=twitter_connected`);
  } catch (error) {
    console.error('Demo Twitter OAuth callback failed:', error);
    res.redirect(`${FRONTEND_URL}?error=demo_callback_failed`);
  }
}

export async function demoTwitterDisconnect(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    await storage.removeSocialConnection(userId, 'twitter');

    res.json({ message: 'Demo Twitter account disconnected successfully' });
  } catch (error) {
    console.error('Demo Twitter disconnect failed:', error);
    res.status(500).json({ error: 'Failed to disconnect demo Twitter account' });
  }
}