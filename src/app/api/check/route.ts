// src/app/api/check/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { url } = await request.json();
  
  // Read both of your secret API keys
  const googleApiKey = process.env.PAGESPEED_API_KEY;
  const builtWithApiKey = process.env.BUILTWITH_API_KEY;

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }
  if (!googleApiKey || !builtWithApiKey) {
    return NextResponse.json({ error: 'API keys are not configured correctly' }, { status: 500 });
  }

  try {
    // We'll now make three API calls at the same time
    const [mobileResponse, desktopResponse, builtWithResponse] = await Promise.all([
      // Call 1: Google Mobile
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=MOBILE&key=${googleApiKey}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY`),
      // Call 2: Google Desktop
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=DESKTOP&key=${googleApiKey}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY`),
      // Call 3: BuiltWith Technology Lookup
      fetch(`https://api.builtwith.com/v21/api.json?KEY=${builtWithApiKey}&LOOKUP=${encodeURIComponent(url)}`)
    ]);

    if (!mobileResponse.ok || !desktopResponse.ok || !builtWithResponse.ok) {
        console.error("An API call failed.");
        throw new Error('Failed to fetch data from one of the APIs.');
    }

    // Process the data from all three calls
    const mobileData = await mobileResponse.json();
    const desktopData = await desktopResponse.json();
    const builtWithData = await builtWithResponse.json();

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

    // --- NEW: Logic to find the website's platform ---
    let detectedPlatform = 'Unknown';
    // Safely check the structure of the BuiltWith response
    if (builtWithData.Results && builtWithData.Results.length > 0 && builtWithData.Results[0].Result?.Paths) {
        for (const path of builtWithData.Results[0].Result.Paths) {
            // Find the first technology tagged as a 'cms'
            const cms = path.Technologies.find((tech: any) => tech.Tag === 'cms');
            if (cms) {
                detectedPlatform = cms.Name;
                break; // Stop as soon as we find the main CMS
            }
        }
    }

    // Add the detected platform to our final results object
    return NextResponse.json({ ...results, platform: detectedPlatform });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An unexpected error occurred while analysing the site.' }, { status: 500 });
  }
}