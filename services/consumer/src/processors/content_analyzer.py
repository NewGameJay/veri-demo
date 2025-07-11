from typing import Dict, Any, List
import asyncio
from loguru import logger
import re
from collections import Counter

class ContentAnalyzer:
    """Analyze content for insights and signals"""
    
    def __init__(self):
        self.sentiment_keywords = {
            'positive': ['amazing', 'love', 'great', 'awesome', 'excellent', 'fantastic', 'wonderful', 'brilliant'],
            'negative': ['bad', 'hate', 'terrible', 'awful', 'horrible', 'worst', 'disappointed', 'poor'],
            'neutral': ['okay', 'fine', 'average', 'normal', 'decent', 'fair', 'moderate']
        }
    
    async def analyze(self, content: str) -> Dict[str, Any]:
        """Analyze content for various signals"""
        if not content:
            return {}
        
        # Run analyses concurrently
        results = await asyncio.gather(
            self._analyze_sentiment(content),
            self._analyze_topics(content),
            self._analyze_entities(content),
            self._analyze_engagement_potential(content)
        )
        
        return {
            'sentiment': results[0],
            'topics': results[1],
            'entities': results[2],
            'engagement_potential': results[3],
            'content_length': len(content),
            'word_count': len(content.split())
        }
    
    async def _analyze_sentiment(self, content: str) -> Dict[str, Any]:
        """Basic sentiment analysis"""
        content_lower = content.lower()
        
        scores = {
            'positive': 0,
            'negative': 0,
            'neutral': 0
        }
        
        # Count sentiment keywords
        for sentiment, keywords in self.sentiment_keywords.items():
            for keyword in keywords:
                scores[sentiment] += content_lower.count(keyword)
        
        # Determine overall sentiment
        total_score = sum(scores.values())
        if total_score == 0:
            sentiment = 'neutral'
            confidence = 0.5
        else:
            sentiment = max(scores.items(), key=lambda x: x[1])[0]
            confidence = scores[sentiment] / total_score
        
        return {
            'sentiment': sentiment,
            'confidence': confidence,
            'scores': scores
        }
    
    async def _analyze_topics(self, content: str) -> List[str]:
        """Extract main topics from content"""
        # Simple topic extraction based on capitalized words and hashtags
        topics = []
        
        # Extract hashtags
        hashtags = re.findall(r'#\w+', content)
        topics.extend([tag[1:].lower() for tag in hashtags])
        
        # Extract capitalized phrases (potential topics)
        capitalized = re.findall(r'\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b', content)
        topics.extend([phrase.lower() for phrase in capitalized if len(phrase) > 3])
        
        # Count frequency and return top topics
        topic_counts = Counter(topics)
        return [topic for topic, _ in topic_counts.most_common(5)]
    
    async def _analyze_entities(self, content: str) -> Dict[str, List[str]]:
        """Extract entities from content"""
        entities = {
            'mentions': [],
            'links': [],
            'brands': []
        }
        
        # Extract mentions
        mentions = re.findall(r'@\w+', content)
        entities['mentions'] = list(set(mentions))
        
        # Extract links
        links = re.findall(r'https?://[^\s]+', content)
        entities['links'] = list(set(links))
        
        # Simple brand detection (would use NER in production)
        known_brands = ['nike', 'apple', 'google', 'amazon', 'microsoft', 'coca-cola', 'pepsi']
        content_lower = content.lower()
        for brand in known_brands:
            if brand in content_lower:
                entities['brands'].append(brand)
        
        return entities
    
    async def _analyze_engagement_potential(self, content: str) -> Dict[str, Any]:
        """Estimate engagement potential"""
        score = 0
        factors = []
        
        # Questions tend to get more engagement
        if '?' in content:
            score += 20
            factors.append('contains_question')
        
        # Emojis increase engagement
        emoji_count = len(re.findall(r'[\U0001F600-\U0001F64F]', content))
        if emoji_count > 0:
            score += min(emoji_count * 5, 25)
            factors.append('contains_emojis')
        
        # Call to action
        cta_phrases = ['click', 'share', 'comment', 'like', 'follow', 'subscribe']
        if any(phrase in content.lower() for phrase in cta_phrases):
            score += 15
            factors.append('has_cta')
        
        # Optimal length (not too short, not too long)
        word_count = len(content.split())
        if 10 <= word_count <= 50:
            score += 10
            factors.append('optimal_length')
        
        # Normalize score
        engagement_score = min(score / 100, 1.0)
        
        return {
            'score': engagement_score,
            'factors': factors,
            'recommendation': self._get_engagement_recommendation(engagement_score)
        }
    
    def _get_engagement_recommendation(self, score: float) -> str:
        """Get recommendation based on engagement score"""
        if score >= 0.7:
            return "High engagement potential"
        elif score >= 0.4:
            return "Moderate engagement potential"
        else:
            return "Consider adding questions or CTAs"