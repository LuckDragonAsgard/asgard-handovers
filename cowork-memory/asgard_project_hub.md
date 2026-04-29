---
name: Asgard Project Hub — products table = source of truth
description: 51 projects in asgard-brain D1 products table. Dashboard reads client-side. Never hardcode project list.
type: project
---
The "Project Hub" is the products table in asgard-brain D1. Single source of truth for Paddy's projects + ideas.

**D1 read:** POST https://asgard-brain.pgallivan.workers.dev/d1/query with header X-Pin: 2967 and body {sql, params}.
**D1 write:** POST .../d1/write same shape.
**Must be called client-side** — CF blocks worker→worker fetch in same zone (error 1042).

Schema: id, project_name, category, status, live_url, tech_stack, description, next_action, progress_pct, revenue_y1/y2/y3, income_priority, key_features, scale_notes, cost_monthly, github_url, linked_workers, last_updated, notes, created_at, cash_spent, cash_earned, hours_needed, recommendations, revenue_y1-y10.
