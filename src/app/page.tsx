// src/app/page.tsx
'use client';

import { useState, Fragment } from 'react';
import Image from 'next/image';

// Type definitions
type Scores = { performance: number; seo: number; accessibility: number };
type AnalysisResults = { mobile: Scores; desktop: Scores; finalUrl: string };
type Service = { name: string; price: number | string; details: string[] };

// --- Helper Components ---
const ScoreCircle = ({ score }: { score: number }) => {
  const getScoreColor = (value: number) => {
    if (value >= 90) return 'text-emerald-500';
    if (value >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };
  return (<div className="text-5xl font-bold">{Math.round(score)}</div>);
};

// --- Main Page Component ---
export default function HomePage() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // NEW: State for the dynamic services and modal
  const [siteSize, setSiteSize] = useState('small');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  // NOTE: In a real app, this would come from an API call (e.g., Wappalyzer)
  const [platform, setPlatform] = useState('WordPress'); 

  // --- Dynamic Pricing and Content Logic ---
  const getSeverity = (score: number): {tier: string, problem: string, basePrice: number} => {
    if (score < 50) return { tier: 'Red Zone Rescue', problem: 'Critical issues found that are likely harming your site’s performance and user experience.', basePrice: 300 };
    if (score < 90) return { tier: 'Amber Zone Audit', problem: 'Your site’s foundation is good, but is missing key optimisations.', basePrice: 150 };
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
    seo: getSeverity(results?.mobile.seo ?? 100),
    accessibility: getSeverity(results?.mobile.accessibility ?? 100),
  };
  
  // --- Handlers ---
  const handleOpenModal = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };
  
  const handleFormSubmit = async (e: React.FormEvent) => {
     // This would handle form submission, e.g., send an email
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
        {/* ... Header and Form sections are the same as before ... */}
        
        {results && (
          <div className="w-full max-w-4xl mx-auto">
            {/* ... Results scores display ... */}
            
            {/* === NEW: DYNAMIC SERVICE OFFERS === */}
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
                {/* Performance Service Card */}
                {(results.mobile.performance < 90) && (
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-lg border">
                      <div><h3 className="font-bold text-lg text-slate-800">[Icon] The Problem</h3><p className="text-sm text-slate-600 mt-2">Your site's performance score is {Math.round(results.mobile.performance)}, which can lead to frustrated visitors and a lower Google ranking.</p></div>
                      <div><h3 className="font-bold text-lg text-slate-800">[Icon] My Job Plan</h3><ul className="text-sm text-slate-600 mt-2 list-disc list-inside"><li>Full Image Optimisation</li><li>Premium Caching Setup</li><li>Code Minification</li><li>Before & After Report</li></ul></div>
                      <div className="text-center bg-slate-50 p-4 rounded-md">
                        <h3 className="font-bold text-lg text-slate-800">Speed Boost Tune-Up</h3>
                        <div className="text-3xl font-bold text-purple-600 my-4">£249</div>
                        <button onClick={() => handleOpenModal({ name: 'Speed Boost Tune-Up', price: '£249', details: services.performance.details })} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition">Request This Service</button>
                      </div>
                   </div>
                )}
                {/* SEO Service Card */}
                {(results.mobile.seo < 100) && (
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-lg border">
                      <div><h3 className="font-bold text-lg text-slate-800">[Icon] The Problem</h3><p className="text-sm text-slate-600 mt-2">{services.seo.problem}</p></div>
                      <div><h3 className="font-bold text-lg text-slate-800">[Icon] My Job Plan</h3><ul className="text-sm text-slate-600 mt-2 list-disc list-inside"><li>Full SEO Audit</li><li>Fix All Identified Errors</li><li>Implement Best Practices</li><li>Google Search Console Setup</li></ul></div>
                      <div className="text-center bg-slate-50 p-4 rounded-md">
                        <h3 className="font-bold text-lg text-slate-800">{services.seo.tier}</h3>
                        <div className="text-3xl font-bold text-purple-600 my-4">{calculatePrice(services.seo.basePrice)}</div>
                        <button onClick={() => handleOpenModal({ name: services.seo.tier, price: calculatePrice(services.seo.basePrice), details: [] })} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition">Request This Service</button>
                      </div>
                   </div>
                )}
                {/* Accessibility Service Card */}
                {(results.mobile.accessibility < 100) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-lg border">
                  <div><h3 className="font-bold text-lg text-slate-800">[Icon] The Problem</h3><p className="text-sm text-slate-600 mt-2">{services.accessibility.problem}</p></div>
                  <div><h3 className="font-bold text-lg text-slate-800">[Icon] My Job Plan</h3><ul className="text-sm text-slate-600 mt-2 list-disc list-inside"><li>Full Accessibility Audit</li><li>Fix Contrast & Alt Text</li><li>Ensure Form/Button Labels</li><li>WCAG Compliance Check</li></ul></div>
                  <div className="text-center bg-slate-50 p-4 rounded-md">
                    <h3 className="font-bold text-lg text-slate-800">{services.accessibility.tier}</h3>
                    <div className="text-3xl font-bold text-purple-600 my-4">{calculatePrice(services.accessibility.basePrice)}</div>
                    <button onClick={() => handleOpenModal({ name: services.accessibility.tier, price: calculatePrice(services.accessibility.basePrice), details: [] })} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition">Request This Service</button>
                  </div>
               </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* ... Footer ... */}
      </main>

      {/* === NEW: CONTACT MODAL === */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-slate-800">Request: {selectedService.name}</h2>
            <p className="text-slate-600 mt-2">Price: <span className="font-bold">{selectedService.price}</span></p>
            <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Your Name</label>
                <input type="text" id="name" required className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Your Email</label>
                <input type="email" id="email" required className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm"/>
              </div>
              {/* Hidden fields to capture data */}
              <input type="hidden" value={`Service: ${selectedService.name}, Price: ${selectedService.price}`} />
              <input type="hidden" value={`URL Tested: ${results?.finalUrl}`} />
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