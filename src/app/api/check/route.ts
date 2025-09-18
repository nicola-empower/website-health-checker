// src/app/api/check/route.ts

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
    // We are back to fetching both reports at the same time
    const [mobileResponse, desktopResponse] = await Promise.all([
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=MOBILE&key=${apiKey}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY`),
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=DESKTOP&key=${apiKey}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY`)
    ]);

    if (!mobileResponse.ok || !desktopResponse.ok) {
        const errorText = await mobileResponse.text();
        console.error("PageSpeed API Error:", errorText);
        throw new Error('Failed to fetch data from PageSpeed Insights API. The URL may be invalid or the API is temporarily unavailable.');
    }

    const mobileData = await mobileResponse.json();
    const desktopData = await desktopResponse.json();

    const results = {
      mobile: {
        performance: mobileData.lighthouseResult.categories.performance.score * 100,
        seo: mobileData.lighthouseResult.categories.seo.score * 100,
        accessibility: mobileData.lighthouseResult.categories.accessibility.score * 100,
        firstContentfulPaint: mobileData.lighthouseResult.audits['first-contentful-paint'].displayValue,
      },
      desktop: {
        performance: desktopData.lighthouseResult.categories.performance.score * 100,
        seo: desktopData.lighthouseResult.categories.seo.score * 100,
        accessibility: desktopData.lighthouseResult.categories.accessibility.score * 100,
        firstContentfulPaint: desktopData.lighthouseResult.audits['first-contentful-paint'].displayValue,
      },
      finalUrl: mobileData.id,
    };

    return NextResponse.json(results);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An unexpected error occurred. This can happen if the website takes too long to respond.' }, { status: 500 });
  }
}