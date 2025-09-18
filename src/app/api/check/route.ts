// src/app/api/check/route.ts

import { NextResponse } from 'next/server';

// This is the main function that handles requests to our API endpoint
export async function POST(request: Request) {
  // Get the website URL sent from the frontend
  const { url } = await request.json();

  // Get our secret API key from the environment variables
  const apiKey = process.env.PAGESPEED_API_KEY;

  // Basic validation: make sure a URL was provided
  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  // Basic validation: make sure the API key is set up
  if (!apiKey) {
    return NextResponse.json({ error: 'API key is not configured' }, { status: 500 });
  }

  try {
    // We'll call the Google API twice: once for Mobile and once for Desktop
    const [mobileResponse, desktopResponse] = await Promise.all([
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=MOBILE&key=${apiKey}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY`),
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=DESKTOP&key=${apiKey}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY`)
    ]);

    // Check if the API calls were successful
    if (!mobileResponse.ok || !desktopResponse.ok) {
        // If not, throw an error to be caught below
        throw new Error('Failed to fetch data from PageSpeed Insights API');
    }

    // Parse the JSON data from the responses
    const mobileData = await mobileResponse.json();
    const desktopData = await desktopResponse.json();

    // Now we'll pick out the specific scores we want to show on the report card
    const results = {
      mobile: {
        performance: mobileData.lighthouseResult.categories.performance.score * 100,
        seo: mobileData.lighthouseResult.categories.seo.score * 100,
        // We'll use Accessibility as a proxy for mobile-friendliness
        accessibility: mobileData.lighthouseResult.categories.accessibility.score * 100,
        // Also grab a specific speed metric to show
        firstContentfulPaint: mobileData.lighthouseResult.audits['first-contentful-paint'].displayValue,
      },
      desktop: {
        performance: desktopData.lighthouseResult.categories.performance.score * 100,
        seo: desktopData.lighthouseResult.categories.seo.score * 100,
        accessibility: desktopData.lighthouseResult.categories.accessibility.score * 100,
        firstContentfulPaint: desktopData.lighthouseResult.audits['first-contentful-paint'].displayValue,
      },
      // Include the URL that was checked in the final result
      finalUrl: mobileData.id,
    };

    // Send the organised results back to our frontend
    return NextResponse.json(results);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}