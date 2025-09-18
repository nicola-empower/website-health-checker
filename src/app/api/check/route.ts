// src/app/api/check/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { url } = await request.json();
  const googleApiKey = process.env.PAGESPEED_API_KEY;

  if (!url) { return NextResponse.json({ error: 'URL is required' }, { status: 400 }); }
  if (!googleApiKey) { return NextResponse.json({ error: 'API key is not configured' }, { status: 500 }); }

  try {
    const [mobileResponse, desktopResponse] = await Promise.all([
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=MOBILE&key=${googleApiKey}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY`),
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=DESKTOP&key=${googleApiKey}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY`)
    ]);

    if (!mobileResponse.ok || !desktopResponse.ok) {
        throw new Error('Failed to fetch data from Google PageSpeed Insights API.');
    }

    const mobileData = await mobileResponse.json();
    const desktopData = await desktopResponse.json();

    const results = {
      mobile: {
        performance: mobileData.lighthouseResult.categories.performance.score * 100,
        seo: mobileData.lighthouseResult.categories.seo.score * 100,
        accessibility: mobileData.lighthouseResult.categories.accessibility.score * 100,
      },
      desktop: {
        performance: desktopData.lighthouseResult.categories.performance.score * 100,
        seo: desktopData.lighthouseResult.categories.seo.score * 100,
        accessibility: desktopData.lighthouseResult.categories.accessibility.score * 100,
      },
      finalUrl: mobileData.id,
    };
    
    // We no longer return a platform, as the user will select it on the frontend.
    return NextResponse.json(results);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An unexpected error occurred while analysing the site.' }, { status: 500 });
  }
}