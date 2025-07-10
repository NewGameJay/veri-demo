# Veri MVP Flow - Detailed Progression Guide (Earn-to-Use Model)

## **executive summary**

**this document outlines the mvp user journey through veri's creator-first monetization platform. the flow prioritizes immediate value through ai tool trials, followed by a points-based earn-to-use system where creators complete brand tasks to unlock continued tool usage. every action feeds the signal engine to improve personalized recommendations.**

---

## **1. onboarding & value delivery (steps a-o)**

### **oauth integration & welcome (a-c)**

**a → b: landing to oauth**

- **landing messaging:** "ai tools that boost your revenue" - immediate value proposition
- **oauth enhancement:** "youtube • tiktok • twitch - analyze your existing content for revenue opportunities"
- **oauth scope:** youtube analytics, tiktok business, twitch creator, discord (read permissions)
- **data collection:** channel metrics, recent video performance, audience demographics
- **technical requirement:** secure token storage, refresh token management

**b → c: welcome bonus delivery**

- **point award:** 25 points automatically credited upon successful oauth
- **enhanced messaging:** "enough for 2 tool trials • see instant results"
- **celebration ux:** animated point counter, "try any tool instantly" cta
- **psychology:** immediate gratification to prevent drop-off

### **profile setup & content analysis (d-f)**

**d: profile setup**

- **required fields:** creator name, content category (gaming, lifestyle, tech, etc.), primary platform
- **optional fields:** bio, location, collaboration interests
- **ux consideration:** <2 minute completion time to maintain momentum

**e: content import & scanning**

- **technical process:**
    - pull last 20 videos via api
    - analyze thumbnails, titles, descriptions, view counts
    - identify underperforming content (bottom 30% by views/engagement)
    - flag monetization opportunities (missing affiliate links, poor seo)
- **user experience:** "scanning your content for revenue opportunities..." progress bar
- **data storage:** content metadata, performance baselines for future optimization tracking

**f: matera score calculation**

- **algorithm inputs:**
    - average view count vs subscriber ratio
    - engagement rate consistency
    - content upload frequency
    - cross-platform presence
    - historical growth trajectory
- **score range:** 0-1000 (similar to credit scores for familiarity)
- **display:** initial score + explanation of ranking factors
- **purpose:** establishes baseline for improvement tracking, task eligibility

### **revenue tool trials - limited usage (g-o)**

**g-h: tool selection hub**

- **ui design:** four cards showing tool benefits + point costs
- **messaging:** each tool shows "see your monetization potential" with specific estimates
- **limitation clarity:** "trial usage only - earn points for more"

**i: revenue refresh trial (10 points)**

- **process:**
    1. user selects 1 underperforming video from imported content
    2. ai analyzes current thumbnail/title performance
    3. generates 3 optimized alternatives using trend data
    4. shows projected cpm/view improvement estimates
- **results display:** "+15-30% cpm increase estimated" with specific dollar projections
- **unlock tease:** "want to optimize your entire catalog?"
- **technical requirements:**
    - youtube trending data integration
    - thumbnail a/b testing framework
    - revenue projection algorithms
- **output:** downloadable optimized assets + implementation instructions

**j: affiliate scanner trial (15 points)**

- **process:**
    1. transcript analysis of selected video
    2. identify mentioned brands, products, tools
    3. match with available affiliate programs (amazon, brand-specific)
    4. generate affiliate link suggestions with placement timestamps
- **results display:** "$50-200/month passive income potential" with auto-matched programs
- **unlock tease:** "want to auto-scan all your content?"
- **technical integration:** affiliate network apis, transcript processing, brand recognition

**k: clip multiplier trial (20 points)**

- **process:**
    1. analyze video for high-engagement moments (watch time spikes, comments)
    2. extract 60-90 second clips optimized for different platforms
    3. auto-generate platform-specific titles/hashtags
    4. include monetization hooks (cta placement, brand mentions)
- **results display:** "5x content output • 3x revenue streams" with multi-platform breakdown
- **unlock tease:** "want unlimited clip generation?"
- **technical requirements:** video processing, engagement analysis, multi-platform optimization

**l: trend-hunter ideation trial (25 points)**

- **process:**
    1. real-time trend detection across platforms in creator's niche
    2. analyze trending topics for monetization potential (cpm, affiliate opportunities)
    3. generate 3 content ideas with revenue-optimized scripts/outlines
    4. include specific monetization angles (affiliate products, brand partnership opportunities)
- **results display:** "3 high-cpm content ideas + monetization scripts" with trend data
- **unlock tease:** "want trending ideas for every upload?"
- **technical requirements:**
    - multi-platform trend api integration
    - monetization opportunity database
    - script generation ai models
    - revenue prediction algorithms
- **output:** detailed content briefs with monetization strategies

**m-p: results display with unlock prompts**

- **revenue projections:** specific estimates based on creator's current metrics
- **before/after comparisons:** visual improvements in content optimization
- **unlock prompts:** each result shows "want more?" with point requirements
- **call-to-action:** "complete brand tasks to unlock continued usage"

**o: unlock gateway**

- **messaging:** "🔒 unlock more usage - complete brand tasks to earn points"
- **clear progression:** shows point costs for continued tool usage
- **no alternative paths:** must earn points through tasks to continue

---

## **2. p2p engagement system - points economy (steps p-x)**

### **brand task introduction (p-q)**

**p: brand task feed**

- **messaging:** "earn points to unlock tool usage"
- **task sources:**
    - verified studio partners (gaming studios, web3 projects)
    - content amplification opportunities
    - social engagement campaigns
- **filtering:** tasks matched to creator's content category and audience
- **real-time updates:** new tasks appear as studios fund them

**q: task hub**

- **messaging:** "studio engagement tasks - complete tasks to earn points"
- **task categories clearly defined**
- **point values transparent**
- **estimated time commitments shown**

### **task types for mvp (r-u)**

**r: task selection hub**

- **three core task types:**
    - **social engagement (+25 pts):** low effort, quick completion
    - **content amplification (+35 pts):** leverage existing audience
    - **clip creation (+50 pts):** use veri tools, demonstrate value

**s: social engagement tasks (+25 points)**

- **requirements:** follow studio social accounts, engage with specific posts, join discord servers
- **verification:** social api confirmation of completed actions
- **time to complete:** <5 minutes
- **creator protection:** guidelines prevent spam, maintain authenticity

**t: content amplification (+35 points)**

- **requirements:** share studio content to creator's platforms with authentic caption
- **verification:** post url submission + engagement tracking
- **creator guidelines:** maintain authentic voice, no copy-paste captions
- **performance tracking:** engagement metrics for future task matching

**u: clip creation tasks (+50 points)**

- **requirements:** use veri's clipping tool to create branded moment from studio content
- **quality threshold:** minimum engagement/quality standards for approval
- **skill development:** improves creator's editing abilities while earning points
- **tool integration:** drives usage of veri's ai tools during task completion

### **task completion & points management (v-x)**

**v: task verification**

- **automated verification:** api confirmations where possible (social follows, shares)
- **manual review:** quality control for clip creation tasks
- **approval timeline:** 24-48 hour approval for manual reviews
- **rejection feedback:** clear reasons for rejected submissions

**w: points balance update**

- **real-time updates:** points appear immediately upon task approval
- **transaction history:** detailed log of all point earnings and spending
- **balance display:** current points + recent activity
- **spending options:** clear breakdown of tool usage costs

**x: matera score progression**

- **score factors:**
    - task completion rate (reliability)
    - content quality ratings (for clip tasks)
    - social engagement authenticity
    - platform activity consistency
- **score impact:** higher scores unlock better tasks, priority access
- **transparency:** creators see exactly how tasks affect their score

---

## **3. earn-to-use tool system (steps y-dd)**

### **point spending hub (y)**

**spending options clearly defined:**

- **revenue refresh:** 10 points per video optimization
- **affiliate scanner:** 15 points per video scan
- **clip multiplier:** 20 points per video clip generation
- **trend-hunter ideation:** 25 points per content idea generation
- **point savings:** option to accumulate for larger optimizations

**cost transparency:**

- each tool shows "per use" pricing
- bulk discounts for multiple uses
- estimated roi for each tool usage

### **tool usage flows (bb-ff)**

**bb: revenue refresh usage (10 points per use)**

- **selection process:** choose video from catalog
- **optimization options:** thumbnail, title, or both
- **results tracking:** before/after performance metrics
- **recommendation engine:** ai suggests which videos to optimize next

**cc: affiliate scanner usage (15 points per use)**

- **content analysis:** deep scan of video content and description
- **opportunity identification:** specific affiliate programs matched
- **implementation support:** step-by-step monetization setup
- **revenue tracking:** projected income from suggested affiliations

**dd: clip multiplier usage (20 points per use)**

- **video processing:** extract multiple clips from single video
- **platform optimization:** customize for youtube shorts, tiktok, instagram reels
- **scheduling integration:** optional posting schedule recommendations
- **performance prediction:** ai estimates for clip performance

**ee: trend-hunter ideation usage (25 points per use)**

- **trend analysis:** real-time detection of high-cpm trending topics
- **content generation:** revenue-optimized scripts and outlines
- **monetization strategy:** specific affiliate products and brand opportunities for each idea
- **timing recommendations:** optimal publishing windows for trending content

**ff: point savings management**

- **balance tracking:** current points + earning history
- **spending strategy:** recommendations for optimal point usage
- **goal setting:** save points for larger optimization projects
- **earning reminders:** suggested tasks to reach spending goals

### **optimization results & tracking (gg)**

**gg: content optimization dashboard**

- **performance metrics:** before/after comparisons for all optimizations
- **roi tracking:** revenue impact of each tool usage
- **success patterns:** identify which optimizations work best for this creator
- **recommendation feed:** ai suggests next optimization opportunities

---

## **4. creator hub - final destination (steps hh-jj)**

### **revenue dashboard (hh)**

**primary metrics:**

- **optimization impact:** total revenue increase from tool usage
- **content performance:** trending of optimized vs non-optimized content
- **point economy:** total points earned, spent, and saved
- **platform growth:** subscriber, view, and engagement trends

**optimization insights:**

- **best performers:** which optimizations drove most revenue
- **content categories:** which content types respond best to optimization
- **timing patterns:** optimal publishing schedules based on performance
- **cross-platform analytics:** performance across all connected platforms

### **performance analytics (ii)**

**content performance analysis:**

- **optimization effectiveness:** percentage improvement from each tool usage
- **revenue attribution:** specific dollar amounts attributed to optimizations
- **engagement improvement:** likes, comments, shares impact
- **cross-platform correlation:** how optimizations affect performance across platforms

**actionable insights:**

- **next optimization targets:** ai-recommended videos for optimization
- **content strategy:** topics and formats that monetize best
- **publishing optimization:** timing and frequency recommendations
- **audience development:** growth strategies based on performance data

### **content insights engine (jj)**

**personalized recommendations:**

- **optimization priorities:** which content needs attention most
- **monetization opportunities:** unexploited revenue streams identified
- **content gaps:** missing content types that could drive revenue
- **collaboration opportunities:** other creators with complementary audiences

**ai-driven suggestions:**

- **content creation:** topics trending in creator's niche with high monetization potential
- **optimization timing:** when to optimize content for maximum impact
- **tool usage strategy:** optimal point spending for maximum roi
- **platform expansion:** new platforms where creator's content might perform well

---

## **5. signal engine & ai processing (steps kk-mm)**

### **signal engine data processing (kk)**

**enhanced messaging:** "every action improves your optimization ai"

**data collection architecture (per josh's backend flow):**

- **veri actions:** oauth connections, tool usage, task completions, content optimization
- **firebase auth:** user authentication and session management
- **redpanda streaming:** real-time event processing and queuing
- **brightmatter consumer:** ai processing engine for all user actions
- **rds postgres:** structured data storage for analysis and recommendations

**real-time processing:**

- **event streaming:** all creator actions trigger immediate data events
- **behavior analysis:** usage patterns, optimization preferences, success factors
- **performance correlation:** link creator actions to content performance outcomes
- **recommendation refinement:** continuous improvement of ai suggestions

### **brightmatter ai analysis (ll)**

**ai processing capabilities:**

- **content resonance scoring:** analyze what content performs best for each creator
- **optimization effectiveness:** measure roi of different tool usages
- **creator success patterns:** identify behaviors that lead to revenue growth
- **personalization engine:** tailor recommendations to individual creator style and audience

**analysis outputs:**

- **performance predictions:** forecast impact of potential optimizations
- **content scoring:** rank existing content by optimization potential
- **strategy recommendations:** suggest point spending and content creation strategies
- **trend identification:** spot emerging opportunities in creator's niche

### **personalized suggestions (mm)**

**recommendation categories:**

- **immediate actions:** next best optimization to perform
- **content strategy:** topics and formats likely to succeed
- **point optimization:** best ways to earn and spend points
- **platform expansion:** new platforms where creator might succeed

**feedback loops:**

- **recommendation tracking:** measure accuracy of ai suggestions
- **creator feedback:** incorporate creator preferences and constraints
- **success attribution:** track which recommendations lead to revenue growth
- **model improvement:** continuously refine ai based on outcomes

---

## **6. re-engagement & retention loops**

### **task refresh cycles**

- **daily task updates:** new studio engagement opportunities appear regularly
- **point earning reminders:** notifications when creator is close to affording tool usage
- **optimization suggestions:** ai recommends content that needs attention
- **performance alerts:** notify creators when optimized content performs well

### **progression motivation**

- **point milestones:** celebrate reaching point thresholds for tool usage
- **optimization streaks:** reward consistent tool usage with bonus points
- **success showcases:** highlight when optimizations drive significant revenue growth
- **peer comparisons:** show creator performance relative to similar creators

### **value reinforcement**

- **roi demonstrations:** show clear revenue impact of platform usage
- **content insights:** provide ongoing value through ai-driven recommendations
- **community building:** connect creators with similar interests and complementary skills
- **platform evolution:** regular updates and new features based on creator feedback

---

## **success metrics & kpis for mvp**

### **creator engagement metrics**

- **tool trial completion rate:** percentage of creators who complete all three tool trials
- **points earning activity:** task completion rate and point accumulation patterns
- **tool usage frequency:** how often creators spend points on additional tool usage
- **retention rate:** percentage of creators who return within 7, 14, 30 days

### **monetization validation**

- **optimization effectiveness:** average revenue increase from tool usage
- **content performance improvement:** engagement and view count improvements
- **creator satisfaction:** qualitative feedback on value delivered
- **task completion quality:** approval rates and creator performance on brand tasks

### **platform health indicators**

- **user activation:** percentage of signups who complete onboarding and first tool trial
- **points economy balance:** ratio of points earned vs points spent
- **ai accuracy:** relevance and effectiveness of personalized recommendations
- **technical performance:** system reliability, api response times, processing accuracy

### **business validation metrics**

- **creator acquisition cost:** cost to acquire and activate new creators
- **creator lifetime value:** total points earned and tool usage over time
- **brand partner satisfaction:** feedback from studios providing tasks
- **revenue attribution:** clear connection between platform usage and creator revenue growth

**this mvp progression ensures every creator gets immediate value through tool trials, understands the earn-to-use mechanic through brand tasks, and builds long-term engagement through ai-powered optimization insights.**