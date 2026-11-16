# Launch Checklist: Moving From Demo to Live

- [ ] **Custom Domain & SSL**: Point `hotelname.com` via Cloudflare or Vercel DNS.
- [ ] **Production Keys**: Switch Razorpay from `rzp_test_...` to live merchant keys.
- [ ] **Bank Settlement**: Confirm owner's bank account verification is complete on Razorpay.
- [ ] **Legal Pages Update**: Ensure `legal/privacy`, `legal/terms`, and `legal/refund` match the registered entity name.
- [ ] **Database Migration**: Switch from local PostgreSQL to Supabase / AWS RDS production instance.
- [ ] **Email & SMS Credentials**: Configure Twilio/Gupshup for WhatsApp and AWS SES or Resend for emails.
- [ ] **SEO Unblocking**: Change `robots.ts` from `noindex` to `index, follow`.
