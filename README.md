# UdayCreates MVP — prototype

A responsive front-end prototype for a creator learning community, freelancer directory and creative services agency.

## Run it
1. Unzip the folder.
2. Open `index.html` in a browser. For best results, use a simple local server such as VS Code Live Server.
3. Try **Join free**, select a plan, create a demo account, add a community post, filter freelancer profiles and submit a project enquiry.

## What's included
- Bold, colourful responsive landing page
- Demo sign-up/login flow
- Membership plan selection (Free, Plus, Pro)
- Community feed with locally saved posts and helpful buttons
- Filterable freelancer cards and project enquiry modal
- Agency services request form
- Browser-local persistence via `localStorage`

## Important: this is not production-ready
This prototype has no server, real authentication, real subscription billing, central database, admin dashboard, email delivery, or secure messaging. Demo passwords are stored locally in your browser and must never be real passwords. Project enquiries and posts are only stored on the device/browser that created them. The freelancer cards and feed examples are fictional demo content. Pricing is illustrative.

## Suggested production architecture
- Front end: Next.js / React
- Authentication and database: Supabase or an equivalent managed backend
- Billing: Razorpay or Stripe, using server-side checkout and verified webhooks
- Media: private/public object storage with upload limits and access policies
- Notifications: transactional email provider
- Admin: moderate members/posts, approve freelancer profiles, manage plans and route agency leads
- Security: server-side authorization, input validation, rate limiting, privacy policy, terms, refund/cancellation policy and backups

## Recommended build sequence
1. Validate demand with the landing page, interest form and manual service enquiries.
2. Add secure accounts and database-backed profiles/posts.
3. Add gated member content and billing.
4. Add project messaging, file sharing, milestones and reporting/moderation.
5. Add admin tools, analytics, email notifications and operational policies.
