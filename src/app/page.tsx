// src/app/page.tsx
'use client'; // This tells Next.js to run this component on the client-side (in the browser)

import { useState } from 'react';

// Define a type for our results object for better TypeScript support
type AnalysisResults = {
  mobile: {
    performance: number;
    seo: number;
    accessibility: number;
    firstContentfulPaint: string;
  };
  desktop: {
    performance: number;
    seo: number;
    accessibility: number;
    firstContentfulPaint: string;
  };
  finalUrl: string;
};

// A helper component for displaying a single score circle
const ScoreCircle = ({ score }: { score: number }) => {
  const getScoreColor = (value: number) => {
    if (value >= 90) return 'text-emerald-500'; // Your brand's emerald!
    if (value >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
      {Math.round(score)}
    </div>
  );
};

export default function HomePage() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResults(null);
    setError('');

    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      const data: AnalysisResults = await response.json();
      setResults(data);
    } catch (err) {
      // FIXED: This now handles the error type safely
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800">Website Health Checker</h1>
          <p className="mt-4 text-lg text-slate-600">
            Enter your website URL to get a free report on its performance, SEO, and more.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="flex-grow p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-600 text-white font-bold py-3 px-6 rounded-md hover:bg-purple-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Analysing...' : 'Analyse Website'}
          </button>
        </form>

        {error && <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}

        {isLoading && <div className="mt-8 text-center text-slate-600">Checking your site... this might take a moment!</div>}

        {results && (
          <div className="mt-10 bg-white p-6 sm:p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800">
              Report for: <span className="text-purple-600">{results.finalUrl}</span>
            </h2>
            
            {/* Results Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Mobile Results */}
                <div className="bg-slate-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-center text-slate-700">📱 Mobile</h3>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <ScoreCircle score={results.mobile.performance} />
                            <p className="text-sm text-slate-500 mt-2">Performance</p>
                        </div>
                        <div>
                            <ScoreCircle score={results.mobile.seo} />
                            <p className="text-sm text-slate-500 mt-2">SEO</p>
                        </div>
                        <div>
                           <ScoreCircle score={results.mobile.accessibility} />
                           <p className="text-sm text-slate-500 mt-2">Accessibility</p>
                        </div>
                    </div>
                    <p className="text-center mt-4 text-sm text-slate-600">First Contentful Paint: <strong>{results.mobile.firstContentfulPaint}</strong></p>
                </div>

                {/* Desktop Results */}
                 <div className="bg-slate-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-center text-slate-700">💻 Desktop</h3>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div>
                            <ScoreCircle score={results.desktop.performance} />
                            <p className="text-sm text-slate-500 mt-2">Performance</p>
                        </div>
                        <div>
                            <ScoreCircle score={results.desktop.seo} />
                            <p className="text-sm text-slate-500 mt-2">SEO</p>
                        </div>
                        <div>
                           <ScoreCircle score={results.desktop.accessibility} />
                           <p className="text-sm text-slate-500 mt-2">Accessibility</p>
                        </div>
                    </div>
                     <p className="text-center mt-4 text-sm text-slate-600">First Contentful Paint: <strong>{results.desktop.firstContentfulPaint}</strong></p>
                </div>
            </div>

            {/* Call to Action */}
            <div className="mt-8 text-center p-6 bg-emerald-50 border-2 border-emerald-300 rounded-lg">
                <h3 className="text-2xl font-bold text-emerald-800">Want to get all scores in the green?</h3>
                {/* FIXED: The apostrophes are now correctly escaped */}
                <p className="mt-2 text-emerald-700">That&apos;s what I&apos;m here for. I can help you optimise your site for speed, user experience, and search engines.</p>
                <a href="https://your-main-website.com/contact" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block bg-emerald-500 text-white font-bold py-3 px-8 rounded-md hover:bg-emerald-600 transition">
                    Let&apos;s Talk
                </a>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}