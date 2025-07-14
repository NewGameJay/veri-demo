/**
 * Veri MVP - OAuth Client Integration
 * Priority 4: Real Twitter OAuth implementation
 */

import { apiRequest } from './queryClient';

export interface OAuthResponse {
  authUrl: string;
}

export interface SocialConnection {
  id: number;
  platform: string;
  platformId?: string;
  platformUsername: string;
  displayName?: string;
  followerCount?: number;
  profileImageUrl?: string;
  isConnected: boolean;
  createdAt: string;
  updatedAt: string;
}

// Twitter OAuth Functions
export async function initiateTwitterLogin(): Promise<string> {
  try {
    const response = await apiRequest<OAuthResponse>('/api/auth/twitter/login', {
      method: 'GET',
    });
    
    return response.authUrl;
  } catch (error) {
    console.error('Failed to initiate Twitter login:', error);
    throw new Error('Failed to initiate Twitter login');
  }
}

export async function disconnectTwitter(): Promise<void> {
  try {
    await apiRequest('/api/auth/twitter/disconnect', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Failed to disconnect Twitter:', error);
    throw new Error('Failed to disconnect Twitter');
  }
}

// Generic OAuth handler
export async function handleOAuthConnection(platform: string) {
  try {
    let authUrl: string;
    
    switch (platform) {
      case 'twitter':
        authUrl = await initiateTwitterLogin();
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
    
    // Redirect to OAuth provider
    window.location.href = authUrl;
  } catch (error) {
    console.error(`Failed to connect ${platform}:`, error);
    throw error;
  }
}

// OAuth callback handler
export function handleOAuthCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');
  const error = urlParams.get('error');
  
  if (success) {
    return {
      type: 'success',
      message: getSuccessMessage(success),
    };
  }
  
  if (error) {
    return {
      type: 'error',
      message: getErrorMessage(error),
    };
  }
  
  return null;
}

function getSuccessMessage(success: string): string {
  switch (success) {
    case 'twitter_connected':
      return 'Twitter account connected successfully!';
    default:
      return 'Account connected successfully!';
  }
}

function getErrorMessage(error: string): string {
  switch (error) {
    case 'oauth_denied':
      return 'OAuth authorization was denied. Please try again.';
    case 'invalid_callback':
      return 'Invalid OAuth callback. Please try again.';
    case 'invalid_state':
      return 'Invalid OAuth state. Please try again.';
    case 'token_exchange_failed':
      return 'Failed to exchange OAuth token. Please try again.';
    case 'user_fetch_failed':
      return 'Failed to fetch user data. Please try again.';
    case 'oauth_callback_failed':
      return 'OAuth callback failed. Please try again.';
    default:
      return 'An error occurred during OAuth. Please try again.';
  }
}

// Social connection utilities
export function getSocialPlatformIcon(platform: string): string {
  switch (platform) {
    case 'twitter':
      return '🐦';
    case 'instagram':
      return '📷';
    case 'youtube':
      return '🎥';
    case 'linkedin':
      return '💼';
    case 'tiktok':
      return '🎵';
    default:
      return '🔗';
  }
}

export function formatFollowerCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  } else {
    return count.toString();
  }
}