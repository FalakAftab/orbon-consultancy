# Complete Email Verification — Secure System

## Steps

- [ ] 1. Backend: `AuthController@login` — block login if email not verified (403)
- [ ] 2. Backend: `AuthController@register` — stop auto-login, return no token
- [ ] 3. Backend: `UserResource` — add `email_verified_at` + `email_verified`
- [ ] 4. Backend: `.env.example` — add SMTP + FRONTEND_URL config block
- [ ] 5. Frontend: `api/auth.js` — add `resendVerification()`
- [ ] 6. Frontend: `RegisterPage.jsx` — show "verify email" screen after registration
- [ ] 7. Frontend: `LoginPage.jsx` — handle 403 unverified error + resend button
- [ ] 8. Frontend: New `VerifyEmailPage.jsx` — verify email status screen
- [ ] 9. Frontend: `routes/index.jsx` — add `/verify-email` route + enforce verified for student routes
- [ ] 10. Frontend: `AuthContext.jsx` — expose `emailVerified` flag

## Follow-up

- [ ] Configure real SMTP credentials in `.env`
- [ ] Test register → verify → login flow

