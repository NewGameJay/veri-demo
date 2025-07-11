from typing import Dict, Any, List
import asyncio
from datetime import datetime
from loguru import logger

class SignalExtractor:
    """Extract actionable signals from enriched data"""
    
    def __init__(self):
        self.signal_thresholds = {
            'viral_potential': 0.7,
            'brand_safety': 0.8,
            'engagement_quality': 0.6,
            'creator_consistency': 0.75
        }
    
    async def extract(self, enriched_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract signals from enriched social data"""
        signals = {}
        
        # Extract different signal types
        signals['engagement_signals'] = await self._extract_engagement_signals(enriched_data)
        signals['content_signals'] = await self._extract_content_signals(enriched_data)
        signals['audience_signals'] = await self._extract_audience_signals(enriched_data)
        signals['trend_signals'] = await self._extract_trend_signals(enriched_data)
        
        # Calculate composite scores
        signals['scores'] = self._calculate_scores(signals)
        
        # Generate recommendations
        signals['recommendations'] = self._generate_recommendations(signals)
        
        return signals
    
    async def _extract_engagement_signals(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract engagement-related signals"""
        engagement = data.get('engagement', {})
        metrics = data.get('metrics', {})
        
        # Combine engagement and metrics
        all_metrics = {**engagement, **metrics}
        
        # Calculate engagement velocity (engagement per hour since post)
        timestamp = data.get('timestamp')
        if timestamp:
            hours_since_post = (datetime.utcnow() - datetime.fromisoformat(timestamp)).total_seconds() / 3600
            if hours_since_post > 0:
                engagement_velocity = sum([
                    all_metrics.get('likes', 0),
                    all_metrics.get('comments', 0),
                    all_metrics.get('shares', 0),
                    all_metrics.get('retweets', 0)
                ]) / hours_since_post
            else:
                engagement_velocity = 0
        else:
            engagement_velocity = 0
        
        return {
            'total_engagement': sum(all_metrics.values()),
            'engagement_rate': data.get('engagement_rate', 0),
            'engagement_velocity': engagement_velocity,
            'viral_coefficient': self._calculate_viral_coefficient(all_metrics),
            'engagement_quality': self._calculate_engagement_quality(all_metrics)
        }
    
    async def _extract_content_signals(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract content-related signals"""
        analysis = data.get('analysis', {})
        
        return {
            'sentiment': analysis.get('sentiment', {}).get('sentiment', 'neutral'),
            'sentiment_confidence': analysis.get('sentiment', {}).get('confidence', 0),
            'topics': analysis.get('topics', []),
            'entities': analysis.get('entities', {}),
            'content_type': data.get('media_type', 'text'),
            'hashtag_count': len(data.get('hashtags', [])),
            'engagement_potential': analysis.get('engagement_potential', {}).get('score', 0)
        }
    
    async def _extract_audience_signals(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract audience-related signals"""
        # In production, this would analyze audience demographics
        return {
            'audience_size': data.get('metrics', {}).get('reach', 0) or data.get('engagement', {}).get('impressions', 0),
            'audience_growth_rate': 0,  # Would calculate from historical data
            'audience_quality_score': 0.7,  # Placeholder
            'audience_overlap': []  # Brands with similar audiences
        }
    
    async def _extract_trend_signals(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract trend-related signals"""
        hashtags = data.get('hashtags', [])
        topics = data.get('analysis', {}).get('topics', [])
        
        return {
            'trending_hashtags': [tag for tag in hashtags if self._is_trending(tag)],
            'trending_topics': [topic for topic in topics if self._is_trending(topic)],
            'trend_alignment_score': self._calculate_trend_alignment(hashtags, topics),
            'seasonality_match': self._check_seasonality(data)
        }
    
    def _calculate_viral_coefficient(self, metrics: Dict[str, Any]) -> float:
        """Calculate viral coefficient (K-factor)"""
        shares = metrics.get('shares', 0) + metrics.get('retweets', 0)
        views = metrics.get('views', 0) + metrics.get('impressions', 0)
        
        if views > 0:
            return min(shares / views * 10, 1.0)  # Normalized to 0-1
        return 0
    
    def _calculate_engagement_quality(self, metrics: Dict[str, Any]) -> float:
        """Calculate quality of engagement (comments > shares > likes)"""
        weights = {
            'comments': 3,
            'shares': 2,
            'retweets': 2,
            'likes': 1,
            'saves': 2.5
        }
        
        weighted_sum = sum(metrics.get(key, 0) * weight for key, weight in weights.items())
        total_engagement = sum(metrics.get(key, 0) for key in weights.keys())
        
        if total_engagement > 0:
            max_possible = total_engagement * 3  # If all were comments
            return weighted_sum / max_possible
        return 0
    
    def _is_trending(self, term: str) -> bool:
        """Check if a term is trending (simplified)"""
        # In production, would check against real-time trend data
        trending_terms = ['ai', 'tech', 'sustainability', 'wellness', 'crypto']
        return term.lower() in trending_terms
    
    def _calculate_trend_alignment(self, hashtags: List[str], topics: List[str]) -> float:
        """Calculate how well content aligns with trends"""
        all_terms = [tag.lower() for tag in hashtags] + [topic.lower() for topic in topics]
        if not all_terms:
            return 0
        
        trending_count = sum(1 for term in all_terms if self._is_trending(term))
        return trending_count / len(all_terms)
    
    def _check_seasonality(self, data: Dict[str, Any]) -> bool:
        """Check if content matches seasonal trends"""
        # Simplified seasonality check
        current_month = datetime.utcnow().month
        seasonal_keywords = {
            1: ['new year', 'resolution', 'fresh start'],
            2: ['valentine', 'love'],
            12: ['christmas', 'holiday', 'gift']
        }
        
        content = data.get('content', '').lower()
        month_keywords = seasonal_keywords.get(current_month, [])
        
        return any(keyword in content for keyword in month_keywords)
    
    def _calculate_scores(self, signals: Dict[str, Any]) -> Dict[str, float]:
        """Calculate composite scores from signals"""
        engagement = signals.get('engagement_signals', {})
        content = signals.get('content_signals', {})
        audience = signals.get('audience_signals', {})
        trends = signals.get('trend_signals', {})
        
        return {
            'viral_potential': min(
                engagement.get('viral_coefficient', 0) * 0.4 +
                engagement.get('engagement_velocity', 0) / 1000 * 0.3 +
                trends.get('trend_alignment_score', 0) * 0.3,
                1.0
            ),
            'brand_safety': min(
                (1 if content.get('sentiment') != 'negative' else 0) * 0.5 +
                content.get('sentiment_confidence', 0) * 0.3 +
                0.2,  # Base safety score
                1.0
            ),
            'engagement_quality': engagement.get('engagement_quality', 0),
            'creator_value': min(
                audience.get('audience_quality_score', 0) * 0.5 +
                engagement.get('engagement_rate', 0) / 10 * 0.5,
                1.0
            )
        }
    
    def _generate_recommendations(self, signals: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate actionable recommendations"""
        recommendations = []
        scores = signals.get('scores', {})
        
        # Viral potential recommendation
        if scores.get('viral_potential', 0) >= self.signal_thresholds['viral_potential']:
            recommendations.append({
                'type': 'amplify',
                'priority': 'high',
                'action': 'Boost this content with paid promotion',
                'reason': 'High viral potential detected'
            })
        
        # Engagement quality recommendation
        if scores.get('engagement_quality', 0) < self.signal_thresholds['engagement_quality']:
            recommendations.append({
                'type': 'improve',
                'priority': 'medium',
                'action': 'Focus on creating more discussion-worthy content',
                'reason': 'Low engagement quality (too many passive likes)'
            })
        
        # Brand safety alert
        if scores.get('brand_safety', 0) < self.signal_thresholds['brand_safety']:
            recommendations.append({
                'type': 'alert',
                'priority': 'high',
                'action': 'Review content for brand alignment',
                'reason': 'Potential brand safety concern detected'
            })
        
        return recommendations