// src/app/api/check/route.ts
import { NextResponse } from 'next/server';

// Define a type for the technology object to avoid using 'any'
type Technology = {
  Name: string;
  Tag: string;
};

export async function POST(request: Request) {
  const { url } = await request.json();
  
  const googleApiKey = process.env.PAGESPEED_API_KEY;
  const builtWithApiKey = process.env.BUILTWITH_API_KEY;

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }
  if (!googleApiKey || !builtWithApiKey) {
    return NextResponse.json({ error: 'API keys are not configured correctly' }, { status: 500 });
  }

  try {
    const [mobileResponse, desktopResponse, builtWithResponse] = await Promise.all([
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=MOBILE&key=${googleApiKey}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY`),
      fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=DESKTOP&key=${googleApiKey}&category=PERFORMANCE&category=SEO&category=ACCESSIBILITY`),
      fetch(`https://api.builtwith.com/v21/api.json?KEY=${builtWithApiKey}&LOOKUP=${encodeURIComponent(url)}`)
    ]);

    if (!mobileResponse.ok || !desktopResponse.ok || !builtWithResponse.ok) {
        console.error("An API call failed.");
        throw new Error('Failed to fetch data from one of the APIs.');
    }

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

    let detectedPlatform = 'Unknown';
    if (builtWithData.Results && builtWithData.Results.length > 0 && builtWithData.Results[0].Result?.Paths) {
        for (const path of builtWithData.Results[0].Result.Paths) {
            const cms = path.Technologies.find((tech: Technology) => tech.Tag === 'cms');
            if (cms) {
                detectedPlatform = cms.Name;
                break; 
            }
        }
    }

    return NextResponse.json({ ...results, platform: detectedPlatform });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An unexpected error occurred while analysing the site.' }, { status: 500 });
  }
}