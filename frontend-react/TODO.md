# Task Progress — Subject Category Sync + Admin Pagination

## Part 1 — Ground Truth
- [x] Tinker query — 21 distinct subject_category values in DB (business, humanities are legacy values)

## Part 2 — Subject Category Sync
- [x] Update `backend/app/Services/RecommendationService.php` SUBJECT_GROUPS constant (10 parents, 40+ leaves incl. legacy aliases)
- [x] Update `frontend-react/src/constants/options.js` SUBJECT_CATEGORIES to mirror backend
- [x] Verify exact-category matching (Category Purity) — subjectMatches does exact leaf matching

## Part 3-6 — Admin Pagination (React)
- [x] `AdminUniversities.jsx` per_page 10 -> 50, pageSize 10 -> 50 (reuses existing Pagination component)
- [x] `AdminPrograms.jsx` per_page 10 -> 50, pageSize 10 -> 50 (reuses existing Pagination component)
- [x] `AdminStudents.jsx` per_page 10 -> 50, pageSize 10 -> 50 (reuses existing Pagination component)
- [x] Search/filter resets to page 1 (already present in all admin lists)

## Part 7-9 — Refine Criteria, Grid/List, History
- [x] Refine Criteria preserves previous criteria (RecommendationWizard prefills from location.state.criteria)
- [x] Grid/List toggle with localStorage persistence (ResultsPage)
- [x] History persistence (RecommendationService persists history record on authenticated runs)

## Verification
- [x] `npm run build` succeeds for frontend-react (built in ~11.85s)
- [x] PHP syntax/lint passes
- [x] Temporary verification script deleted
- [x] Vanilla frontend/ folder NOT modified
- [ ] Manual browser test pending (recommendation + admin pagination)
