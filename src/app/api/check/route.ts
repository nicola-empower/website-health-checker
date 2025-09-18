// src/app/api/check/route.ts
// TEMPORARY TEST CODE to check for timeouts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { url } = await request.json();
  const apiKey = process.env.PAGESPEED_API_KEY;

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }

  try {
    // We are ONLY fetching the mobile report to be faster
    const mobileResponse = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=MOBILE&key=${apiKey}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY`);

    if (!mobileResponse.ok) {
        throw new Error('Failed to fetch data from PageSpeed Insights API');
    }

    const mobileData = await mobileResponse.json();
    
    // We'll send back a simplified result for this test
    const results = {
      mobile: {
        performance: mobileData.lighthouseResult.categories.performance.score * 100,
        seo: mobileData.lighthouseResult.categories.seo.score * 100,
        accessibility: mobileData.lighthouseResult.categories.accessibility.score * 100,
        firstContentfulPaint: mobileData.lighthouseResult.audits['first-contentful-paint'].displayValue,
      },
      // Desktop data is faked to prevent the frontend from breaking
      desktop: {
        performance: 0,
        seo: 0,
        accessibility: 0,
        firstContentfulPaint: "N/A",
      },
      finalUrl: mobileData.id,
    };

    return NextResponse.json(results);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An unexpected error occurred during the test.' }, { status: 500 });
  }
}