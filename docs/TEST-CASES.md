# RMVK College Website — Test Cases

Automated coverage map and manual QA checklist for `college-website`.

## How to run

```bash
npm run test          # Vitest unit tests (__tests__/)
npm run build         # required before E2E (Playwright uses npm run start)
npm run test:e2e      # Playwright (e2e/)
npm run test:watch    # Vitest watch mode
```

Set `PLAYWRIGHT_BASE_URL` to target a deployed staging URL instead of localhost.

---

## 1. Unit tests — RBAC (`__tests__/lib/auth/permissions.test.ts`)

| ID | Role | Module | Action | Expected |
|----|------|--------|--------|----------|
| RBAC-01 | admin | users | admin | deny assign super_admin |
| RBAC-02 | super_admin | users | admin | allow assign super_admin |
| RBAC-03 | faculty | dashboard | view | allow |
| RBAC-04 | faculty | erp | view | allow |
| RBAC-05 | faculty | admissions | view | deny |
| RBAC-06 | examination_staff | examination | view | allow |
| RBAC-07 | examination_staff | admissions | approve | deny |
| RBAC-08 | accounts_staff | payments | view | allow |
| RBAC-09 | accounts_staff | payments | admin | deny |
| RBAC-10 | admissions_staff | admissions | view | allow |
| RBAC-11 | admissions_staff | users | view | deny |
| RBAC-12 | admissions_staff | ai | view | deny |
| RBAC-13 | hr_staff | recruitment | view | allow |
| RBAC-14 | hr_staff | admissions | view | deny |
| RBAC-15 | content_editor | content | edit | allow |
| RBAC-16 | content_editor | admissions | view | deny |
| RBAC-17 | applicant | dashboard | view | deny |
| RBAC-18 | student | erp | view | allow (via student portal) |
| RBAC-19 | principal | compliance | view | allow |
| RBAC-20 | hod | admissions | view | allow (scoped) |
| RBAC-21 | super_admin | settings | edit | allow |
| RBAC-22 | admin | settings | edit | deny |

---

## 2. Unit tests — dashboard prefs (`__tests__/lib/admin/dashboard-widget-order.test.ts`)

| ID | Scenario | Expected |
|----|----------|----------|
| DASH-01 | Default order | admissions before payments when both present |
| DASH-02 | hiddenGroups | hidden group omitted from output |
| DASH-03 | custom groupOrder | payments before admissions when reordered |
| DASH-04 | empty widgets | returns empty array |

---

## 3. Unit tests — staff invites (`__tests__/lib/actions/staff-invites.test.ts`)

| ID | Scenario | Expected |
|----|----------|----------|
| INV-01 | Token hash | SHA-256 hex, deterministic |
| INV-02 | TTL constant | 7 days |
| INV-03 | isInviteExpired | past date → true, future → false |

---

## 4. E2E — public pages (`e2e/public-pages.spec.ts`)

| ID | Route | Assertion |
|----|-------|-----------|
| PUB-01–14 | /, /about, /admissions, … | HTTP < 400, title match, main visible |
| PUB-15 | /about#leadership | leadership section |
| PUB-16 | /search?q=admission | results visible |
| PUB-17 | /news/feed | valid RSS XML |
| PUB-18 | /contact#grievance | grievance + anti-ragging |
| PUB-19 | /manifest.webmanifest | PWA name + theme |
| PUB-20 | /admin (anon) | redirect to /login |

---

## 5. E2E — admissions (`e2e/admissions-apply.spec.ts`)

| ID | Scenario | Expected |
|----|----------|----------|
| ADM-01 | /admissions/apply | wizard or login prompt |
| ADM-02 | Step labels | Personal → Review visible |

---

## 6. E2E — admin RBAC redirects (`e2e/admin-roles.spec.ts`)

Unauthenticated users must redirect to `/login` for all staff routes.

| ID | Route |
|----|-------|
| ADM-R-01 | /admin |
| ADM-R-02 | /admin/admissions |
| ADM-R-03 | /admin/admissions/seats |
| ADM-R-04 | /admin/recruitment |
| ADM-R-05 | /admin/content |
| ADM-R-06 | /admin/examination |
| ADM-R-07 | /admin/payments |
| ADM-R-08 | /admin/erp |
| ADM-R-09 | /admin/tasks |
| ADM-R-10 | /admin/search |
| ADM-R-11 | /admin/notifications |
| ADM-R-12 | /admin/users |
| ADM-R-13 | /admin/settings |
| ADM-R-14 | /admin/audit |
| ADM-R-15 | /admin/compliance |
| ADM-R-16 | /admin/iqac |
| ADM-R-17 | /admin/ai |
| ADM-R-18 | /login?redirect=/admin | staff login UI |

---

## 7. E2E — portal routes (`e2e/portal-routes.spec.ts`)

| ID | Route | Expected (unauthenticated) |
|----|-------|----------------------------|
| PRT-01 | /admissions/dashboard | → /login |
| PRT-02 | /careers/dashboard | → /login |
| PRT-03 | /student | → /login |
| PRT-04 | /mfa | page loads |

---

## 8. E2E — API security (`e2e/api-security.spec.ts`)

| ID | Endpoint | Expected |
|----|----------|----------|
| API-01 | GET /api/health | 200, JSON status |
| API-02 | GET /api/cron/publish-scheduled (no secret when CRON_SECRET set) | 401 |
| API-03 | GET /api/admin/reports/executive | 401/302 |
| API-04 | GET /api/search?q=test | 200 |

---

## 9. E2E — examination & ops pages (`e2e/examination-pages.spec.ts`)

| ID | Route | Expected |
|----|-------|----------|
| EXM-01 | /examination | loads |
| EXM-02 | /examination/notices | loads |
| EXM-03 | /admissions/seats | loads |
| EXM-04 | /iqac | loads |

---

## 10. Manual staging matrix (§8.1 — requires test users)

Create one user per role in Supabase staging, then verify:

| User | Role | Must access | Must deny |
|------|------|-------------|-----------|
| T1 | admissions_staff | /admin, /admin/admissions | /admin/users, /admin/ai |
| T2 | hr_staff | /admin/recruitment | /admin/admissions |
| T3 | content_editor | /admin/content | /admin/admissions |
| T4 | faculty | /admin, /admin/erp | /admin/admissions, /admin/users |
| T5 | admin | all ops modules | cannot assign super_admin |
| T6 | super_admin | /admin/users, invites | — |
| T7 | applicant | /admissions/dashboard | /admin |

### Manual dashboard checks

- [ ] Activity feed ≠ notification inbox
- [ ] Widget prefs save per user (migration 026)
- [ ] Content preview links open public pages
- [ ] Super admin can change application fee in /admin/settings
- [ ] Scheduled news publishes via cron

### Security regression (§8.3)

- [ ] Applicant cannot call admin server actions
- [ ] admin cannot POST role=super_admin
- [ ] Deactivated profile blocked at proxy
- [ ] MFA redirect for admin on /admin/users
- [ ] No PII in staff_notifications.body

---

## 11. Existing unit tests (other)

| File | Coverage |
|------|----------|
| `__tests__/lib/email/otp-config.test.ts` | OTP email config |
| `__tests__/lib/security/rate-limit.test.ts` | Rate limiting |
| `__tests__/lib/pdf/interview-list.test.ts` | Interview PDF |
| `__tests__/lib/erp/parse-csv.test.ts` | ERP CSV parse |
| `__tests__/lib/ai/keyword-retrieval.test.ts` | RAG keyword retrieval |
