from typing import Dict, Any
from datetime import datetime
import asyncio
from loguru import logger

class SocialProcessor:
    """Process and enrich social media data"""
    
    def __init__(self):
        self.platform_handlers = {
            'twitter': self._process_twitter,
            'youtube': self._process_youtube,
            'instagram': self._process_instagram,
            'tiktok': self._process_tiktok
        }
    
    async def process(self, event: Dict[str, Any]) -> Dict[str, Any]:
        """Process social event based on platform"""
        platform = event.get('platform')
        handler = self.platform_handlers.get(platform)
        
        if not handler:
            logger.warning(f"Unknown platform: {platform}")
            return event
        
        try:
            enriched = await handler(event)
            enriched['processed_at'] = datetime.utcnow().isoformat()
            return enriched
        except Exception as e:
            logger.error(f"Error processing {platform} event: {e}")
            return event
    
    async def _process_twitter(self, event: Dict[str, Any]) -> Dict[str, Any]:
        """Process Twitter-specific data"""
        data = event.get('data', {})
        
        # Extract engagement metrics
        engagement = {
            'likes': data.get('favorite_count', 0),
            'retweets': data.get('retweet_count', 0),
            'replies': data.get('reply_count', 0),
            'quotes': data.get('quote_count', 0),
            'impressions': data.get('impression_count', 0)
        }
        
        # Calculate engagement rate
        total_impressions = engagement['impressions']
        if total_impressions > 0:
            engagement_rate = sum([
                engagement['likes'],
                engagement['retweets'],
                engagement['replies'],
                engagement['quotes']
            ]) / total_impressions * 100
        else:
            engagement_rate = 0
        
        return {
            **event,
            'engagement': engagement,
            'engagement_rate': engagement_rate,
            'content': data.get('text', ''),
            'media_type': self._detect_media_type(data),
            'hashtags': self._extract_hashtags(data.get('text', ''))
        }
    
    async def _process_youtube(self, event: Dict[str, Any]) -> Dict[str, Any]:
        """Process YouTube-specific data"""
        data = event.get('data', {})
        
        # Extract video metrics
        metrics = {
            'views': data.get('view_count', 0),
            'likes': data.get('like_count', 0),
            'comments': data.get('comment_count', 0),
            'duration': data.get('duration', 0)
        }
        
        # Calculate watch time estimate
        avg_watch_percentage = 0.4  # Industry average
        estimated_watch_time = metrics['views'] * metrics['duration'] * avg_watch_percentage
        
        return {
            **event,
            'metrics': metrics,
            'estimated_watch_time': estimated_watch_time,
            'content': data.get('title', ''),
            'description': data.get('description', ''),
            'tags': data.get('tags', [])
        }
    
    async def _process_instagram(self, event: Dict[str, Any]) -> Dict[str, Any]:
        """Process Instagram-specific data"""
        data = event.get('data', {})
        
        # Extract post metrics
        metrics = {
            'likes': data.get('like_count', 0),
            'comments': data.get('comment_count', 0),
            'saves': data.get('saved_count', 0),
            'shares': data.get('share_count', 0),
            'reach': data.get('reach', 0)
        }
        
        return {
            **event,
            'metrics': metrics,
            'content': data.get('caption', ''),
            'media_type': data.get('media_type', 'photo'),
            'hashtags': self._extract_hashtags(data.get('caption', ''))
        }
    
    async def _process_tiktok(self, event: Dict[str, Any]) -> Dict[str, Any]:
        """Process TikTok-specific data"""
        data = event.get('data', {})
        
        # Extract video metrics
        metrics = {
            'views': data.get('play_count', 0),
            'likes': data.get('digg_count', 0),
            'shares': data.get('share_count', 0),
            'comments': data.get('comment_count', 0)
        }
        
        return {
            **event,
            'metrics': metrics,
            'content': data.get('desc', ''),
            'music': data.get('music', {}),
            'hashtags': self._extract_hashtags(data.get('desc', ''))
        }
    
    def _detect_media_type(self, data: Dict[str, Any]) -> str:
        """Detect media type from post data"""
        if data.get('video'):
            return 'video'
        elif data.get('photos') or data.get('media'):
            return 'photo'
        return 'text'
    
    def _extract_hashtags(self, text: str) -> list:
        """Extract hashtags from text"""
        import re
        return re.findall(r'#\w+', text)