---
name: Asgard Project Hub = D1 products table
description: 51 projects in asgard-brain D1. Dashboard reads client-side. Never hardcode the list.
type: project
---
The products table in asgard-brain D1 is the single source of truth for Paddy's projects + ideas.

D1 read: POST https://asgard-brain.pgallivan.workers.dev/d1/query with X-Pin: 2967 and {sql, params}
Must be called CLIENT-SIDE — CF blocks worker→worker fetch in same zone (1042).

Schema includes: id, project_name, category, status, live_url, tech_stack, description, next_action, progress_pct, revenue_y1-y10, income_priority, cost_monthly, github_url, linked_workers, cash_spent, cash_earned, hours_needed, recommendations.

Live UI: https://asgard.pgallivan.workers.dev
