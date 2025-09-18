// src/app/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

// Type definitions and ScoreCircle component
type AnalysisResults = {
  mobile: { performance: number; seo: number; accessibility: number; firstContentfulPaint: string; };
  desktop: { performance: number; seo: number; accessibility: number; firstContentfulPaint: string; };
  finalUrl: string;
};
const ScoreCircle = ({ score }: { score: number }) => {
  const getScoreColor = (value: number) => {
    if (value >= 90) return 'text-emerald-500';
    if (value >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };
  return (<div className={`text-5xl font-bold ${getScoreColor(score)}`}>{Math.round(score)}</div>);
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
    const fullUrl = `https://${url}`;

    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fullUrl }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }
      const data: AnalysisResults = await response.json();
      setResults(data);
    } catch (err) {
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
        <div className="mb-8 text-center">
            <a href="https://empowervaservices.co.uk" target="_blank" rel="noopener noreferrer" className="inline-block">
                <Image 
                    src="/logo.png"
                    alt="Empower Virtual Assistant Services Logo"
                    width={200}
                    height={50}
                    priority
                />
            </a>
        </div>
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800">Website Health Checker</h1>
          <p className="mt-4 text-lg text-slate-600">
            Enter your website URL to get a free report on its performance, SEO, and more.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                    https://
                </span>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="yourwebsite.co.uk"
                    required
                    className="flex-grow p-3 border border-gray-300 rounded-none rounded-r-md focus:ring-2 focus:ring-[#8c3aaa] focus:border-[#8c3aaa] transition"
                />
            </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-[#8c3aaa] text-white font-bold py-3 px-6 rounded-md hover:bg-[#7a3296] transition disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Analysing...' : 'Analyse Website'}
          </button>
        </form>

        {error && <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
        {isLoading && <div className="mt-8 text-center text-slate-600">Checking your site... this might take a moment!</div>}

        {/* === UPDATED RESULTS SECTION FOR THE TEST === */}
        {results && (
          <div className="mt-10 bg-white p-6 sm:p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800">
              Report for: <span className="text-purple-600">{results.finalUrl}</span>
            </h2>
            <p className="text-center text-emerald-700 font-semibold my-4">
              Test successful! Mobile data loaded correctly.
            </p>
            
            <div className="mt-6 flex justify-center">
                {/* Mobile Results Only */}
                <div className="bg-slate-50 p-6 rounded-lg w-full max-w-sm">
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
            </div>
          </div>
        )}
      </div>
    </main>
  );
}