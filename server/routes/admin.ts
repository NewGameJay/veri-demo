import { Router } from 'express';
import { ApiCostTracker } from '../services/apiCostTracker';

const router = Router();
const tracker = ApiCostTracker.getInstance();

// Simple auth check for admin endpoints (internal use only)
const requireAdmin = (req: any, res: any, next: any) => {
  // For now, just check if user is authenticated - can be enhanced later
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// These endpoints are for internal monitoring only - NO UI
router.get('/api/admin/usage/summary', requireAdmin, async (req, res) => {
  try {
    const services = ['openai', 'anthropic', 'chroma'];
    const summary: any = {};
    
    for (const service of services) {
      summary[service] = await tracker.getTodaysCost(service);
    }
    
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get usage summary' });
  }
});

router.get('/api/admin/usage/user/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;
    
    const usage = await tracker.getUserUsage(userId, Number(days));
    res.json({ success: true, data: usage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user usage' });
  }
});

export default router;