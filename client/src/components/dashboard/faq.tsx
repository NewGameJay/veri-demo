import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export function FAQ() {
  const [isExpanded, setIsExpanded] = useState(false);

  const faqItems = [
    {
      question: "How do streaks work?",
      answer: "Complete at least one task daily to maintain your streak. Longer streaks unlock higher XP multipliers and exclusive features like AI Agents."
    },
    {
      question: "What are XP multipliers?",
      answer: "Streak rewards that multiply your XP earnings: 3+ days = 1.5x, 7+ days = 2x, 10+ days = 2.5x. Higher VeriScore means better opportunities."
    },
    {
      question: "How do I unlock AI Agents?",
      answer: "Maintain a 10-day streak to unlock our AI Agent suite. These agents help optimize your content and find better brand partnerships."
    },
    {
      question: "What brands can I work with?",
      answer: "We partner with gaming brands like Hyve, Lusterlabs, and the Veri Platform. Complete your profile to access premium campaigns."
    }
  ];

  return (
    <div className="glass-effect p-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md transition-all duration-300">
      <div 
        className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold font-inter">FAQ</h3>
            <p className="text-white/60 text-sm">Get quick answers</p>
          </div>
        </div>
        <div className="text-white/60">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-4 animate-fade-in">
          {faqItems.map((item, index) => (
            <div key={index} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
              <h4 className="text-white font-semibold text-sm mb-2 font-inter">{item.question}</h4>
              <p className="text-white/70 text-xs leading-relaxed font-inter">{item.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}