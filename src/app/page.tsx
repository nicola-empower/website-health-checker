// src/app/page.tsx
'use client';

import { useState, Fragment } from 'react';
import Image from 'next/image';
import { WrenchScrewdriverIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// Type definitions - UPDATED to include platform
type Scores = { performance: number; seo: number; accessibility: number };
type AnalysisResults = { mobile: Scores; desktop: Scores; finalUrl: string; platform: string };
type Service = { name: string; price: number | string; details: string[] };
type Severity = { tier: string, problem: string, basePrice: number, color: string };

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

  // Dynamic Pricing and Content Logic
  const getSeverity = (score: number): Severity => {
    if (score < 50) return { tier: 'Red Zone Rescue', problem: 'Critical issues found that are likely harming your site&apos;s performance and user experience.', basePrice: 300, color: 'text-red-500' };
    if (score < 90) return { tier: 'Amber Zone Audit', problem: 'Your site&apos;s foundation is good, but is missing key optimisations.', basePrice: 150, color: 'text-yellow-500' };
    return { tier: 'Green Zone Polish', problem: 'Your site is in great shape! This tune-up will fix the final few issues to achieve a near-perfect score.', basePrice: 75, color: 'text-emerald-500' };
  };

  const calculatePrice = (basePrice: number) => {
    if (siteSize === 'large') return "Custom Quote";
    const sizeMultiplier = siteSize === 'medium' ? 1.5 : 1;
    const platformMultiplier = (results?.platform === 'WordPress') ? 1 : 0.75;
    return `£${basePrice * sizeMultiplier * platformMultiplier}`;
  };

  const services = {
    // UPDATED: SEO and Accessibility now have their own getSeverity call
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
            <div className="mb-8 text-center">{/* Logo */}</div>
            <div className="text-center">{/* Title */}</div>
            <form onSubmit={handleSubmit} className="mt-8">{/* Form */} </form>

            {error && <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>}
            {isLoading && <div className="mt-8 text-center text-slate-600">Analysing your site... this can take up to 30 seconds!</div>}

            {results && (
              <div className="mt-10">
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl border">{/* Results Scores Display */}</div>

                <div className="mt-12">
                  <h2 className="text-3xl font-bold text-center text-slate-800">Your Custom Action Plan</h2>
                  <p className="text-center text-slate-600 mt-2">Here are tailored services based on your results. Prices are estimated based on your site size.</p>
                  
                  <div className="text-center my-6">
                    <label htmlFor="siteSize" className="mr-2 font-semibold text-slate-700">Estimate your site size:</label>
                    {/* FIXED: Added text-gray-900 to the dropdown */}
                    <select id="siteSize" value={siteSize} onChange={(e) => setSiteSize(e.target.value)} className="p-2 border rounded-md text-gray-900">
                      <option value="small">Small (1-10 pages)</option>
                      <option value="medium">Medium (11-50 pages)</option>
                      <option value="large">Large (50+ pages)</option>
                    </select>
                  </div>

                  <div className="space-y-8">
                    {/* === NEW: SMART PERFORMANCE CARDS === */}
                    {(results.mobile.performance < 90) && (
                      <>
                        {results.platform === 'WordPress' && (
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-lg border">
                              <div><h3 className="font-bold text-lg text-slate-800 flex items-center"><ExclamationTriangleIcon className={`h-5 w-5 mr-2 ${getSeverity(results.mobile.performance).color}`}/>The Problem</h3><p className="text-sm text-slate-600 mt-2">Your WordPress site has a low performance score, likely due to common issues with images or caching.</p></div>
                              <div><h3 className="font-bold text-lg text-slate-800 flex items-center"><WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-slate-500"/>My Job Plan</h3><ul className="text-sm text-slate-600 mt-2 list-disc list-inside"><li>Install & Configure Caching Plugin</li><li>OR Bulk Optimise All Images</li></ul></div>
                              <div className="text-center bg-slate-50 p-4 rounded-md flex flex-col justify-center">
                                <h3 className="font-bold text-lg text-slate-800">WordPress Quick Win</h3>
                                <div className="text-3xl font-bold text-purple-600 my-4">£50</div>
                                <button onClick={() => handleOpenModal({ name: 'WordPress Quick Win', price: '£50', details: ['Install Caching OR Image Plugin'] })} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition">Request This Service</button>
                              </div>
                           </div>
                        )}
                        {(results.platform === 'Wix' || results.platform === 'Squarespace') && (
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-lg border">
                              <div><h3 className="font-bold text-lg text-slate-800 flex items-center"><ExclamationTriangleIcon className={`h-5 w-5 mr-2 ${getSeverity(results.mobile.performance).color}`}/>The Problem</h3><p className="text-sm text-slate-600 mt-2">Your {results.platform} site has a low performance score. While options are limited on this platform, best practices can still make a difference.</p></div>
                              <div><h3 className="font-bold text-lg text-slate-800 flex items-center"><WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-slate-500"/>My Job Plan</h3><ul className="text-sm text-slate-600 mt-2 list-disc list-inside"><li>Manual Image Compression Review</li><li>Slow Widget/App Identification</li><li>Best Practice Action Report</li></ul></div>
                              <div className="text-center bg-slate-50 p-4 rounded-md flex flex-col justify-center">
                                <h3 className="font-bold text-lg text-slate-800">Platform Performance Audit</h3>
                                <div className="text-3xl font-bold text-purple-600 my-4">£150</div>
                                <button onClick={() => handleOpenModal({ name: 'Platform Performance Audit', price: '£150', details: ['Manual review and action report'] })} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition">Request This Service</button>
                              </div>
                           </div>
                        )}
                      </>
                    )}
                    
                    {/* SEO and Accessibility cards remain the same */}
                    {(results.mobile.seo < 100) && (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-lg border">{/* SEO Card */}</div>
                    )}
                    {(results.mobile.accessibility < 100) && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-lg border">{/* Accessibility Card */}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
        <footer className="w-full max-w-4xl mx-auto mt-12 pt-8 border-t text-center text-sm text-slate-500">{/* Footer */}</footer>
      </main>
      {isModalOpen && selectedService && (<div className="fixed inset-0">{/* Modal */}</div>)}
    </Fragment>
  );
}