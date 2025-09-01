import jwt from "jsonwebtoken";
import { type Request, type Response, type NextFunction } from "express";
import { storage } from "./storage";

const JWT_SECRET = process.env.JWT_SECRET || "veri-mvp-jwt-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "veri-mvp-refresh-secret-key";

export interface JWTPayload {
  userId: number;
  email: string;
  type: 'access' | 'refresh';
}

export interface AuthenticatedRequest extends Request {
  userId?: number;
  user?: any;
}

export function generateTokens(userId: number, email: string) {
  const accessToken = jwt.sign(
    { userId, email, type: 'access' },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, email, type: 'refresh' },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return payload.type === 'access' ? payload : null;
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    const payload = jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
    return payload.type === 'refresh' ? payload : null;
  } catch (error) {
    return null;
  }
}

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  // Set access token (15 minutes)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 minutes
  });

  // Set refresh token (7 days)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Note: In demo mode, we still require actual authentication tokens
  // Users must go through signup/login first, even in demo mode

  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // First, try to validate access token
  if (accessToken) {
    const payload = verifyAccessToken(accessToken);
    if (payload) {
      req.userId = payload.userId;
      req.user = payload;
      return next();
    }
  }

  // If access token is invalid/expired, try refresh token
  if (refreshToken) {
    const payload = verifyRefreshToken(refreshToken);
    if (payload) {
      try {
        // Verify user still exists
        const user = await storage.getUser(payload.userId);
        if (user) {
          // Generate new tokens
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.email);
          
          // Set new cookies
          setAuthCookies(res, newAccessToken, newRefreshToken);
          
          req.userId = user.id;
          req.user = { userId: user.id, email: user.email };
          return next();
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }
  }

  // No valid tokens found
  return res.status(401).json({ error: 'Not authenticated' });
}

export async function optionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Check for demo mode
  try {
    const { isDemoMode } = await import('./demo-config');
    if (isDemoMode()) {
      // In demo mode, automatically authenticate as demo user
      req.userId = 1; // Demo user ID
      req.user = { userId: 1, email: 'demo@veri.club', type: 'access' as const };
      return next();
    }
  } catch (error) {
    console.error('Error checking demo mode:', error);
  }

  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // Try to authenticate, but don't fail if no tokens
  if (accessToken) {
    const payload = verifyAccessToken(accessToken);
    if (payload) {
      req.userId = payload.userId;
      req.user = payload;
      return next();
    }
  }

  // Try refresh token if access token failed
  if (refreshToken) {
    const payload = verifyRefreshToken(refreshToken);
    if (payload) {
      try {
        const user = await storage.getUser(payload.userId);
        if (user) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.email);
          setAuthCookies(res, newAccessToken, newRefreshToken);
          req.userId = user.id;
          req.user = { userId: user.id, email: user.email };
          return next();
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    }
  }

  // No authentication, but that's okay for optional routes
  next();
}