This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


Resend Configuration.

Now you need to verify your domain in Resend. Here's how:
1. Go to resend.com/domains (https://resend.com/domains)
2. Click Add Domain → enter drc.duet.ac.bd
3. Resend will give you 3 DNS records to add (2 DKIM + 1 SPF):
- DKIM records (CNAME) — add in your DNS panel
- SPF record (TXT) — add in your DNS panel
4. Wait a few minutes, then click Verify in Resend
5. Once verified, emails will be sent from noreply@drc.duet.ac.bd → lands in inbox
If drc.duet.ac.bd domain DNS is not accessible, you can use your university domain instead — just use whatever domain you control. The key is: sender domain must be verified in Resend or emails will go to spam.
The code is already updated to use noreply@drc.duet.ac.bd. Just verify the domain in Resend and you're good.