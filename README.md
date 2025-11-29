# Website Health Checker

A powerful, user-friendly tool designed to analyse website performance, SEO, and accessibility. Built with Next.js and powered by the Google PageSpeed Insights API, this application provides actionable insights and tailored service packages to help website owners improve their digital presence.

https://website-health-checker.vercel.app/

## Features

-   **Real-time Analysis**: Instantly fetches data from Google PageSpeed Insights for both Mobile and Desktop.
-   **Score Visualisation**: Clear, colour-coded scores for Performance, SEO, and Accessibility.
-   **Traffic Light System**:
    -   **Red Zone Rescue (<50)**: Critical issues requiring immediate attention.
    -   **Amber Zone Audit (50-89)**: Key areas for improvement.
    -   **Green Zone Polish (90+)**: Minor tweaks for perfection.
-   **Custom Action Plans**: Generates tailored service packages based on the site's specific scores and platform (WordPress, Squarespace, Wix, etc.).
-   **Service Integration**: Allows users to request specific services (e.g., "Critical Site Rescue", "WordPress Quick Win") directly through the app via Formspree.

## Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **API**: [Google PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v5/get-started)
-   **Icons**: [Heroicons](https://heroicons.com/)
-   **Forms**: [Formspree](https://formspree.io/)

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

## Environment Variables

To run this project locally, you need to configure the following environment variable in a `.env.local` file:

```bash
PAGESPEED_API_KEY=your_google_api_key_here
```

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
