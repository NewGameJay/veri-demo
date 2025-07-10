# veri ai agents mvp overview

**context (july 2025):** monetization infrastructure layer for performance-based creator marketing—agents are the core product, not background automation. creator-first thesis: paid tooling → prove roi → monetize insights.

**timeline:** build jul–aug '25 (mvp launch 31 aug) · validate ≥15% rev-lift within 60d · prep for on-chain campaigns sep–oct

---

## mvp architecture: two-bucket system

### **platform bucket**
**role:** memory-driven intelligence infrastructure → builds persistent creator profiles + powers compound learning

**brightmatter intelligence layer (powered by signal engine)**
- **what:** memory-driven ai that captures every creator interaction as persistent memory, processes via openai o3 + voyage embeddings, stores in mongodb atlas with hybrid search
- **why:** compound learning where each creator interaction improves recommendations for all similar creators—defensible advantage competitors cannot replicate
- **memory types:** entity memory (persistent profiles), episodic memory (campaign outcomes), content knowledge (video analysis), workflow memory (tool usage patterns)
- **flow:** runs continuously, visible insights to creator, feeds personalization engine

### **user tools bucket** 
**role:** immediate creator value → retention → usage data fed back to signal engine

**monetization suite (3 agents):**
- **thumbnail, title + seo revenue refresh:** auto-optimizes back-catalog using real-time trend + keyword data → instant rpm lift without new content
- **clipping agent:** detects high-engagement + sponsor-friendly moments, auto-clips into shorts/sponsor assets → saves editing time, increases multi-platform reach
- **trend-hunter ideation agent:** scans social + search trends, produces monetizable content outlines + hooks → reduces creative guesswork, targets high-earning topics

**web3 gaming suite (3 agents):**
- **gaming airdrop eligibility scanner:** wallet vs curated gaming airdrop db → shows missing steps → free tokens/nfts, daily check-ins
- **web3 gaming alpha aggregator:** curates early intel from x + reddit filtered by creator's games → first-mover content ideas, community kudos
- **gaming nft + token drop hunter:** tracks upcoming gaming nft/token launches, personalized alerts → early mint access, hype content

---

## mvp flow (earn-to-use model)

### **creator onboarding**
1. **creator signs up** → connects platforms (firebase oauth)
2. **brightmatter processes** → ingests data via signal engine, insights visible to creator immediately
3. **welcome:** 25 points = 2 tool trials (concrete value quantification)

### **trial + engagement loop**
4. **tool trials** → see monetization potential (+15-30% cpm boost estimates)
5. **results shown** → specific dollar/percentage estimates for optimization
6. **unlock prompt** → "complete brand tasks to earn points" (clear earn-to-use mechanic)

### **p2p progression system**
7. **creator completes quest/task/campaign** → p2p points awarded (visible balance)
8. **points economy:** 10-25 pts per tool use, unlock tooling + access better campaigns
9. **matera score updates** → progression visible, builds trust/eligibility metric

### **signal engine activation**
10. **every action feeds signal engine** → updates creator's memory profile + resonance tags
11. **compound learning** → creator's usage improves recommendations for similar creators
12. **brightmatter intelligence** → processes memory into actionable insights for tools + future brand matching

---

## roadmap alignment (timeline + success metrics)

**mvp phase (8 weeks - 31 aug)**
- **goal:** 40-60% creator 7-day retention
- **deliverables:** insight processing live, 6 user tools functional, p2p points integration
- **tech stack:** mongodb atlas + openai o3 + voyage embeddings + firebase auth + redpanda streams

**post-mvp validation (60 days)**
- **goal:** ≥15% avg creator monthly revenue lift
- **signal engine target:** 67% prediction accuracy on campaign performance
- **cost target:** $3.30/creator monthly (including o3 upgrade delta)

**growth phase (q4 '25)**
- **goal:** brand saas rollout via ng+ agency pipeline
- **deliverables:** campaign summary + brand brief agents, automated brief generation
- **target:** $50k/mo brand mrr

---

## risk register (mvp agents)

| **risk** | **impact** | **mitigation** |
|---|---|---|
| **o3 api cost spikes** | unit economics swing negative → $3.30/creator target missed | hard rate limits, redis caching, fallback to gpt-4 for non-critical tasks |
| **mongodb atlas scaling** | memory queries slow → poor ux | proper sharding on creator_id, query optimization, atlas autoscaling |
| **creator habit formation** | retention target (40-60%) aggressive | daily value delivery, notification strategy, gamified points, memory-driven personalization |
| **signal accuracy lag** | brightmatter predictions poor → creator churn | human qa layer, accuracy ledger, confidence scoring |
| **brand inertia** | studios slow to fund tasks → no p2p economy | fallback internal promo budget, direct studio outreach |

---

## success metrics (rough formulas)

- **rev-lift %** = (post-rpm ÷ base-rpm) − 1 → target ≥15%
- **dac** = daily creators who perform ≥1 agent action → target 30%+ of total creators
- **signal accuracy** = brightmatter prediction accuracy on top-quartile campaigns → target 67%
- **creator retention** = 7-day retention rate → target 40-60%
- **memory compound rate** = improvement in recommendations from cross-creator learning → track monthly

---

*this mvp overview reflects veri's memory-driven intelligence approach where every creator interaction builds toward automated campaign optimization that competitors cannot replicate. brightmatter + signal engine create defensible moats through compound learning.*