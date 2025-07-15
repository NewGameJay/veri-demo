/**
 * Brightmatter AI API Routes
 * Handles AI-powered content analysis, optimization, and insights
 */

import { Router } from 'express';
import { brightmatterAI, BrightmatterAnalysisRequest } from '../brightmatter/index';
import { aiContentOptimizer } from '../brightmatter/aiContentOptimizer';
import { veriScoreCalculator } from '../brightmatter/veriScoreCalculator';
import { signalEngine } from '../brightmatter/signalEngine';

const router = Router();

/**
 * POST /api/brightmatter/analyze
 * Comprehensive content analysis
 */
router.post('/analyze', async (req, res) => {
  try {
    const request: BrightmatterAnalysisRequest = req.body;
    
    // Validate required fields
    if (!request.userId || !request.content || !request.userProfile) {
      return res.status(400).json({
        error: 'Missing required fields: userId, content, userProfile'
      });
    }

    const result = await brightmatterAI.analyzeContent(request);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in content analysis:', error);
    res.status(500).json({
      error: 'Failed to analyze content',
      details: error.message
    });
  }
});

/**
 * POST /api/brightmatter/optimize
 * Content optimization
 */
router.post('/optimize', async (req, res) => {
  try {
    const { content, userId, targetAudience, optimizationGoals } = req.body;
    
    if (!content || !userId) {
      return res.status(400).json({
        error: 'Missing required fields: content, userId'
      });
    }

    const result = await aiContentOptimizer.optimizeContent({
      content,
      userId,
      targetAudience,
      optimizationGoals
    });
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in content optimization:', error);
    res.status(500).json({
      error: 'Failed to optimize content',
      details: error.message
    });
  }
});

/**
 * GET /api/brightmatter/viral-analysis/:platform
 * Viral potential analysis
 */
router.post('/viral-analysis', async (req, res) => {
  try {
    const { content, platform } = req.body;
    
    if (!content || !platform) {
      return res.status(400).json({
        error: 'Missing required fields: content, platform'
      });
    }

    const result = await aiContentOptimizer.analyzeViralPotential(content, platform);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in viral analysis:', error);
    res.status(500).json({
      error: 'Failed to analyze viral potential',
      details: error.message
    });
  }
});

/**
 * GET /api/brightmatter/trends/:platform
 * Get trending insights
 */
router.get('/trends/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const { category } = req.query;
    
    const result = await aiContentOptimizer.getTrendAnalysis(platform, category as string);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error getting trend analysis:', error);
    res.status(500).json({
      error: 'Failed to get trend analysis',
      details: error.message
    });
  }
});

/**
 * GET /api/brightmatter/content-ideas
 * Generate content ideas
 */
router.get('/content-ideas', async (req, res) => {
  try {
    const { userId, platform, contentType } = req.query;
    
    if (!userId || !platform || !contentType) {
      return res.status(400).json({
        error: 'Missing required parameters: userId, platform, contentType'
      });
    }

    const result = await aiContentOptimizer.generateContentSuggestions(
      parseInt(userId as string),
      platform as string,
      contentType as string
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error generating content ideas:', error);
    res.status(500).json({
      error: 'Failed to generate content ideas',
      details: error.message
    });
  }
});

/**
 * GET /api/brightmatter/user-insights/:userId
 * Get user performance insights
 */
router.get('/user-insights/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { timeRange } = req.query;
    
    const result = await brightmatterAI.getUserInsights(
      parseInt(userId),
      timeRange ? parseInt(timeRange as string) : 30
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error getting user insights:', error);
    res.status(500).json({
      error: 'Failed to get user insights',
      details: error.message
    });
  }
});

/**
 * GET /api/brightmatter/trending-insights/:platform
 * Get trending insights for platform
 */
router.get('/trending-insights/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const { category } = req.query;
    
    const result = await brightmatterAI.getTrendingInsights(platform, category as string);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error getting trending insights:', error);
    res.status(500).json({
      error: 'Failed to get trending insights',
      details: error.message
    });
  }
});

/**
 * POST /api/brightmatter/veriscore/calculate
 * Calculate VeriScore for user
 */
router.post('/veriscore/calculate', async (req, res) => {
  try {
    const { userId, userProfile, recentSignals, customWeights } = req.body;
    
    if (!userId || !userProfile) {
      return res.status(400).json({
        error: 'Missing required fields: userId, userProfile'
      });
    }

    const result = await veriScoreCalculator.calculateVeriScore(
      userId,
      userProfile,
      recentSignals || [],
      customWeights
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error calculating VeriScore:', error);
    res.status(500).json({
      error: 'Failed to calculate VeriScore',
      details: error.message
    });
  }
});

/**
 * GET /api/brightmatter/veriscore/explanation
 * Get VeriScore explanation
 */
router.post('/veriscore/explanation', async (req, res) => {
  try {
    const { breakdown } = req.body;
    
    if (!breakdown) {
      return res.status(400).json({
        error: 'Missing required field: breakdown'
      });
    }

    const result = veriScoreCalculator.getScoreExplanation(breakdown);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error getting VeriScore explanation:', error);
    res.status(500).json({
      error: 'Failed to get VeriScore explanation',
      details: error.message
    });
  }
});

/**
 * GET /api/brightmatter/veriscore/predict/:userId
 * Predict VeriScore trajectory
 */
router.get('/veriscore/predict/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { timeframe } = req.query;
    
    const result = veriScoreCalculator.predictScoreTrajectory(
      parseInt(userId),
      timeframe ? parseInt(timeframe as string) : 30
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error predicting VeriScore trajectory:', error);
    res.status(500).json({
      error: 'Failed to predict VeriScore trajectory',
      details: error.message
    });
  }
});

/**
 * POST /api/brightmatter/signals/process
 * Process content signals
 */
router.post('/signals/process', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        error: 'Missing required field: content'
      });
    }

    const result = await signalEngine.processContent(content);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error processing content signals:', error);
    res.status(500).json({
      error: 'Failed to process content signals',
      details: error.message
    });
  }
});

/**
 * GET /api/brightmatter/signals/analyze/:contentId
 * Analyze content signals
 */
router.get('/signals/analyze/:contentId', async (req, res) => {
  try {
    const { contentId } = req.params;
    const { customWeights } = req.query;
    
    const result = await signalEngine.analyzeSignals(
      contentId,
      customWeights ? JSON.parse(customWeights as string) : undefined
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error analyzing content signals:', error);
    res.status(500).json({
      error: 'Failed to analyze content signals',
      details: error.message
    });
  }
});

/**
 * GET /api/brightmatter/signals/trends/:contentId
 * Get signal trends
 */
router.get('/signals/trends/:contentId', async (req, res) => {
  try {
    const { contentId } = req.params;
    const { timeRange } = req.query;
    
    const result = signalEngine.getSignalTrends(
      contentId,
      timeRange ? parseInt(timeRange as string) : 86400000
    );
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error getting signal trends:', error);
    res.status(500).json({
      error: 'Failed to get signal trends',
      details: error.message
    });
  }
});

/**
 * GET /api/brightmatter/status
 * Get Brightmatter AI status
 */
router.get('/status', async (req, res) => {
  try {
    const cacheStats = brightmatterAI.getCacheStats();
    
    res.json({
      success: true,
      data: {
        enabled: cacheStats.enabled,
        version: '1.0.0',
        modules: {
          signalEngine: 'active',
          veriScoreCalculator: 'active',
          aiContentOptimizer: 'active'
        },
        cache: cacheStats,
        capabilities: [
          'Content Analysis',
          'VeriScore Calculation',
          'Content Optimization',
          'Viral Potential Analysis',
          'Trend Analysis',
          'User Insights'
        ]
      }
    });
  } catch (error) {
    console.error('Error getting Brightmatter status:', error);
    res.status(500).json({
      error: 'Failed to get Brightmatter status',
      details: error.message
    });
  }
});

/**
 * DELETE /api/brightmatter/cache
 * Clear Brightmatter cache
 */
router.delete('/cache', async (req, res) => {
  try {
    brightmatterAI.clearCache();
    
    res.json({
      success: true,
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({
      error: 'Failed to clear cache',
      details: error.message
    });
  }
});

export default router;