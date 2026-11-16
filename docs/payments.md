# Payments & Gateway Setup Guide

## 1. Demo Mode vs Live Mode
| Feature | Demo Mode | Production / Live Mode |
|---|---|---|
| **Razorpay API Keys** | `rzp_test_...` | `rzp_live_...` |
| **Real Money Deducted?** | No | Yes (Deposited directly to owner's bank) |
| **Webhooks** | Simulated or ngrok | Secure HTTPS endpoint |
| **Mandatory Legal Pages** | Provided in `app/legal/*` | Must have real registered business details |

## 2. Setting Up Razorpay Webhook
Set webhook URL in Razorpay Dashboard to:
`https://api.yourdomain.com/api/v1/payments/webhook`

Subscribe to events:
- `payment.captured`
- `payment.failed`
- `refund.processed`
