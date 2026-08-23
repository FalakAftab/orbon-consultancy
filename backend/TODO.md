# TODO

## Goal
Make the existing application fully runnable in a safe way (no feature breakage), using the uploaded Excel dataset.

## Step 1 — Repo verification (read-only)
- [ ] Inspect remaining admin controllers and requests for universites/program CRUD
- [ ] Inspect student profile + recommendation endpoints (requests/resources)
- [ ] Inspect frontend entry file(s) that actually exist and how routing is done

## Step 2 — DAAD column consistency audit
- [ ] Verify DAAD link field is present in: import normalization -> DB columns -> API resources -> frontend rendering

## Step 3 — Wiring & runtime
- [ ] Ensure migrations + seeding run successfully against PostgreSQL DB `germany_consultancy`
