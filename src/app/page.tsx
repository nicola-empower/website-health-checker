// src/app/page.tsx
'use client';

import { useState, Fragment } from 'react';
import Image from 'next/image';
// CORRECTED: Importing only the icons that are actually used
import { WrenchScrewdriverIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Type definitions
type Scores = { performance: number; seo: number; accessibility: number };
type AnalysisResults = { mobile: Scores; desktop: Scores; finalUrl: string };
type Service = { name: string; price: number | string; details: string[] };

// Helper Components
const ScoreCircle = ({ score }: { score: number }) => {
  const getScoreColor = (value: number) => {
    if (value >= 90) return 'text-emerald-500';
    if (value >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };
  return (<div className={`text-5xl font-bold ${getScoreColor(score)}`}>{Math.round(score)}</div>);
};

// Main Page Component
export default function HomePage() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [siteSize, setSiteSize] = useState('small');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // CORRECTED: Removed unused 'setPlatform' to clear the warning
  const [platform] = useState('WordPress'); 

  // Dynamic Pricing and Content Logic
  const getSeverity = (score: number): {tier: string, problem: string, basePrice: number} => {
    // CORRECTED: Escaped the apostrophe in 'site's'
    if (score < 50) return { tier: 'Red Zone Rescue', problem: 'Critical issues found that are likely harming your site&apos;s performance and user experience.', basePrice: 300 };
    if (score < 90) return { tier: 'Amber Zone Audit', problem: 'Your site&apos;s foundation is good, but is missing key optimisations.', basePrice: 150 };
    return { tier: 'Green Zone Polish', problem: 'Your site is in great shape! This tune-up will fix the final few issues to achieve a near-perfect score.', basePrice: 75 };
  };

  const calculatePrice = (basePrice: number) => {
    if (siteSize === 'large') return "Custom Quote";
    const sizeMultiplier = siteSize === 'medium' ? 1.5 : 1;
    const platformMultiplier = (platform === 'WordPress') ? 1 : 0.75;
    return `£${basePrice * sizeMultiplier * platformMultiplier}`;
  };

  const services = {
    performance: { name: 'Speed Boost Tune-Up', basePrice: 249, details: ['Full Image Optimisation', 'Premium Caching Setup', 'Code Minification', 'Before & After Report'] },
    seo: { ...getSeverity(results?.mobile.seo ?? 100), details: ['Full SEO Audit', 'Fix All Identified Errors', 'Implement Best Practices', 'Google Search Console Setup'] },
    accessibility: { ...getSeverity(results?.mobile.accessibility ?? 100), details: ['Full Accessibility Audit', 'Fix Contrast & Alt Text', 'Ensure Form/Button Labels', 'WCAG Compliance Check'] },
  };
  
  // Handlers
  const handleOpenModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Form submitted! (This is a placeholder)');
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResults(null);
    setError('');
    const fullUrl = `https://${url.trim()}`;

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
    <Fragment>
      <main className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-8">
        <div className="w-full max-w-4xl mx-auto">
            <div className="mb-8 text-center">
                <a href="https://empowervaservices.co.uk" target="_blank" rel="noopener noreferrer" className="inline-block transition-transform hover:scale-105">
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
                        className="flex-grow p-3 border border-gray-300 text-gray-900 rounded-none rounded-r-md focus:ring-2 focus:ring-[#8c3aaa] focus:border-[#8c3aaa] transition"
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
            {isLoading && <div className="mt-8 text-center text-slate-600">Analysing your site... this can take up to 30 seconds!</div>}

            {results && (
              <div className="mt-10">
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border">
                    <h2 className="text-2xl font-bold text-slate-800 text-center">Report for: <a href={results.finalUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">{results.finalUrl}</a></h2>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-6 rounded-lg">
                            <h3 className="text-xl font-bold text-center text-slate-700">Mobile</h3>
                            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                                <div><ScoreCircle score={results.mobile.performance} /><p className="text-sm text-slate-500 mt-2">Performance</p></div>
                                <div><ScoreCircle score={results.mobile.seo} /><p className="text-sm text-slate-500 mt-2">SEO</p></div>
                                <div><ScoreCircle score={results.mobile.accessibility} /><p className="text-sm text-slate-500 mt-2">Accessibility</p></div>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-lg">
                            <h3 className="text-xl font-bold text-center text-slate-700">Desktop</h3>
                            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                                <div><ScoreCircle score={results.desktop.performance} /><p className="text-sm text-slate-500 mt-2">Performance</p></div>
                                <div><ScoreCircle score={results.desktop.seo} /><p className="text-sm text-slate-500 mt-2">SEO</p></div>
                                <div><ScoreCircle score={results.desktop.accessibility} /><p className="text-sm text-slate-500 mt-2">Accessibility</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                  <h2 className="text-3xl font-bold text-center text-slate-800">Your Custom Action Plan</h2>
                  <p className="text-center text-slate-600 mt-2">Here are tailored services based on your results. Prices are estimated based on your site size.</p>
                  
                  <div className="text-center my-6">
                    <label htmlFor="siteSize" className="mr-2 font-semibold text-slate-700">Estimate your site size:</label>
                    <select id="siteSize" value={siteSize} onChange={(e) => setSiteSize(e.target.value)} className="p-2 border rounded-md">
                      <option value="small">Small (1-10 pages)</option>
                      <option value="medium">Medium (11-50 pages)</option>
                      <option value="large">Large (50+ pages)</option>
                    </select>
                  </div>

                  <div className="space-y-8">
                    {(results.mobile.performance < 90) && (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-lg border">
                          <div><h3 className="font-bold text-lg text-slate-800 flex items-center"><ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-500"/>The Problem</h3><p className="text-sm text-slate-600 mt-2">Your site's performance score is {Math.round(results.mobile.performance)}, which can lead to frustrated visitors and a lower Google ranking.</p></div>
                          <div><h3 className="font-bold text-lg text-slate-800 flex items-center"><WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-slate-500"/>My Job Plan</h3><ul className="text-sm text-slate-600 mt-2 list-disc list-inside">{services.performance.details.map(detail => <li key={detail}>{detail}</li>)}</ul></div>
                          <div className="text-center bg-slate-50 p-4 rounded-md flex flex-col justify-center">
                            <h3 className="font-bold text-lg text-slate-800">{services.performance.name}</h3>
                            <div className="text-3xl font-bold text-purple-600 my-4">£249</div>
                            <button onClick={() => handleOpenModal({ name: services.performance.name, price: '£249', details: services.performance.details })} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition">Request This Service</button>
                          </div>
                       </div>
                    )}
                    {(results.mobile.seo < 100) && (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-lg border">
                          <div><h3 className="font-bold text-lg text-slate-800 flex items-center"><ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-500"/>The Problem</h3><p className="text-sm text-slate-600 mt-2">{services.seo.problem}</p></div>
                          <div><h3 className="font-bold text-lg text-slate-800 flex items-center"><WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-slate-500"/>My Job Plan</h3><ul className="text-sm text-slate-600 mt-2 list-disc list-inside">{services.seo.details.map(detail => <li key={detail}>{detail}</li>)}</ul></div>
                          <div className="text-center bg-slate-50 p-4 rounded-md flex flex-col justify-center">
                            <h3 className="font-bold text-lg text-slate-800">{services.seo.tier}</h3>
                            <div className="text-3xl font-bold text-purple-600 my-4">{calculatePrice(services.seo.basePrice)}</div>
                            <button onClick={() => handleOpenModal({ name: services.seo.tier, price: calculatePrice(services.seo.basePrice), details: services.seo.details })} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition">Request This Service</button>
                          </div>
                       </div>
                    )}
                    {(results.mobile.accessibility < 100) && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-lg border">
                      <div><h3 className="font-bold text-lg text-slate-800 flex items-center"><ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-500"/>The Problem</h3><p className="text-sm text-slate-600 mt-2">{services.accessibility.problem}</p></div>
                      <div><h3 className="font-bold text-lg text-slate-800 flex items-center"><WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-slate-500"/>My Job Plan</h3><ul className="text-sm text-slate-600 mt-2 list-disc list-inside">{services.accessibility.details.map(detail => <li key={detail}>{detail}</li>)}</ul></div>
                      <div className="text-center bg-slate-50 p-4 rounded-md flex flex-col justify-center">
                        <h3 className="font-bold text-lg text-slate-800">{services.accessibility.tier}</h3>
                        <div className="text-3xl font-bold text-purple-600 my-4">{calculatePrice(services.accessibility.basePrice)}</div>
                        <button onClick={() => handleOpenModal({ name: services.accessibility.tier, price: calculatePrice(services.accessibility.basePrice), details: services.accessibility.details })} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition">Request This Service</button>
                      </div>
                   </div>
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>

        <footer className="w-full max-w-4xl mx-auto mt-12 pt-8 border-t text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Empower Virtual Assistant Services. All rights reserved.</p>
          <p>A custom tool built by Nicola Berry.</p>
        </footer>
      </main>

      {isModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-slate-800">Request: {selectedService.name}</h2>
            <p className="text-slate-600 mt-2">Price: <span className="font-bold">{selectedService.price}</span></p>
            <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Your Name</label>
                <input type="text" id="name" name="name" required className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Your Email</label>
                <input type="email" id="email" name="email" required className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"/>
              </div>
              <div className="flex justify-end space-x-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">Send Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Fragment>
  );
}