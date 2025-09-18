// src/app/page.tsx
'use client';

import { useState, Fragment } from 'react';
import Image from 'next/image';
import { WrenchScrewdriverIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

// --- TYPE DEFINITIONS ---
type Scores = { performance: number; seo: number; accessibility: number };
type AnalysisResults = { mobile: Scores; desktop: Scores; finalUrl: string; }; // Platform is no longer needed from the API
type Service = { name: string; price: number | 'Custom Quote'; details: string[] };
type Severity = { tier: string, problem: string, basePrice: number, color: string, isRed: boolean, isAmber: boolean, isGreen: boolean };

// --- HELPER COMPONENTS ---
const ScoreCircle = ({ score }: { score: number }) => {
  const getScoreColor = (value: number) => {
    if (value >= 90) return 'text-emerald-500';
    if (value >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };
  return (<div className={`text-5xl font-bold ${getScoreColor(score)}`}>{Math.round(score)}</div>);
};

// --- PRICE FORMATTING HELPER ---
const formatPrice = (price: number | 'Custom Quote') => {
  if (price === 'Custom Quote') {
    return 'Custom Quote';
  }
  return `£${Math.round(price)}`;
};

// --- MAIN PAGE COMPONENT ---
export default function HomePage() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // NEW: State for the user's manual platform choice
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [showActionPlan, setShowActionPlan] = useState(false);

  const [siteSize, setSiteSize] = useState('small');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // --- LOGIC & CALCULATIONS ---
  const getSeverity = (score: number): Severity => {
    if (score < 50) return { tier: 'Red Zone Rescue', problem: 'Your score indicates critical issues that are actively harming your site.', basePrice: 300, color: 'text-red-500', isRed: true, isAmber: false, isGreen: false };
    if (score < 90) return { tier: 'Amber Zone Audit', problem: 'Your score is in the amber zone, indicating key areas for improvement.', basePrice: 150, color: 'text-yellow-500', isRed: false, isAmber: true, isGreen: false };
    return { tier: 'Green Zone Polish', problem: 'Congratulations! Your site is in great shape. This optional tune-up is for those who want to go from great to perfect.', basePrice: 75, color: 'text-emerald-500', isRed: false, isAmber: false, isGreen: true };
  };

  const calculatePrice = (basePrice: number): number | 'Custom Quote' => {
    if (siteSize === 'large') return "Custom Quote";
    const sizeMultiplier = siteSize === 'medium' ? 1.5 : 1;
    // Price multiplier is now based on the user's selection
    const platformMultiplier = (selectedPlatform === 'WordPress') ? 1 : 0.75;
    return basePrice * sizeMultiplier * platformMultiplier;
  };
  
  // --- HANDLERS ---
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
    // Reset the action plan on new submission
    setShowActionPlan(false);
    setSelectedPlatform(''); 
    
    const cleanedUrl = url.trim().replace(/^(https?:\/\/)?/, '');
    const fullUrl = `https://${cleanedUrl}`;

    try {
      // NOTE: We will now use the backend that does NOT call BuiltWith
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

  // --- DERIVED STATE & HELPER VARIABLES ---
  const perfSeverity = results ? getSeverity(results.mobile.performance) : null;
  const seoSeverity = results ? getSeverity(results.mobile.seo) : null;
  const accessibilitySeverity = results ? getSeverity(results.mobile.accessibility) : null;

  const showAllRedBundle = perfSeverity?.isRed && seoSeverity?.isRed && accessibilitySeverity?.isRed;
  const showAllAmberBundle = perfSeverity?.isAmber && seoSeverity?.isAmber && accessibilitySeverity?.isAmber;
  const showAllGreenBundle = perfSeverity?.isGreen && seoSeverity?.isGreen && accessibilitySeverity?.isGreen;
  
  const allSeveritiesAvailable = perfSeverity && seoSeverity && accessibilitySeverity;
  
  const totalRedBasePrice = allSeveritiesAvailable ? (perfSeverity.basePrice + seoSeverity.basePrice + accessibilitySeverity.basePrice) : 0;
  const totalRedPrice = calculatePrice(totalRedBasePrice);
  const discountedRedPrice = typeof totalRedPrice === 'number' ? totalRedPrice * 0.85 : 'Custom Quote';

  const totalAmberBasePrice = allSeveritiesAvailable ? (perfSeverity.basePrice + seoSeverity.basePrice + accessibilitySeverity.basePrice) : 0;
  const totalAmberPrice = calculatePrice(totalAmberBasePrice);
  const discountedAmberPrice = typeof totalAmberPrice === 'number' ? totalAmberPrice * 0.90 : 'Custom Quote';

  // --- RENDER ---
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

                <div className="mt-12 text-center">
                  <h2 className="text-3xl font-bold text-slate-800">Your Custom Action Plan</h2>
                  
                  {!showActionPlan ? (
                    <div className="mt-6 bg-white p-6 rounded-lg shadow-lg border">
                      <label htmlFor="platform" className="block text-lg font-semibold text-slate-700">To create your tailored plan, what is your website built with?</label>
                      <select 
                        id="platform" 
                        value={selectedPlatform} 
                        onChange={(e) => setSelectedPlatform(e.target.value)} 
                        className="mt-4 p-3 border rounded-md text-gray-900 w-full max-w-xs"
                      >
                        <option value="" disabled>Select a platform...</option>
                        <option value="WordPress">WordPress</option>
                        <option value="Squarespace">Squarespace</option>
                        <option value="Wix">Wix</option>
                        <option value="Other">Other / I'm not sure</option>
                      </select>
                      <button 
                        onClick={() => setShowActionPlan(true)} 
                        disabled={!selectedPlatform}
                        className="mt-4 block mx-auto bg-purple-600 text-white font-bold py-3 px-8 rounded-md hover:bg-purple-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
                      >
                        Create My Action Plan
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-slate-600 mt-2">Here are tailored services based on your results. Prices are estimated based on your site size.</p>
                      <div className="text-center my-6">
                        <label htmlFor="siteSize" className="mr-2 font-semibold text-slate-700">Estimate your site size:</label>
                        <select id="siteSize" value={siteSize} onChange={(e) => setSiteSize(e.target.value)} className="p-2 border rounded-md text-gray-900">
                          <option value="small">Small (1-10 pages)</option>
                          <option value="medium">Medium (11-50 pages)</option>
                          <option value="large">Large (50+ pages)</option>
                        </select>
                      </div>
                      
                      <div className="space-y-8 text-left">
                        {/* BUNDLE LOGIC */}
                        {showAllRedBundle && allSeveritiesAvailable && (
                            <div className="bg-red-100 border-2 border-red-400 p-6 rounded-lg shadow-lg text-center">
                                <h3 className="text-2xl font-bold text-red-800">Critical Site Rescue Package</h3>
                                <p className="text-red-700 mt-2">Your site has critical issues in all three core areas. This complete overhaul will fix all foundational problems.</p>
                                <div className="my-4">
                                    {typeof totalRedPrice === 'number' && <span className="text-xl line-through text-slate-500">{formatPrice(totalRedPrice)}</span>}
                                    <span className="text-4xl font-bold text-purple-600 ml-4">{formatPrice(discountedRedPrice)}</span>
                                    {typeof totalRedPrice === 'number' && <span className="text-purple-600 font-semibold"> (15% off)</span>}
                                </div>
                                <button onClick={() => handleOpenModal({ name: 'Critical Site Rescue', price: discountedRedPrice, details: []})} className="w-auto bg-purple-600 text-white font-bold py-2 px-6 rounded-md hover:bg-purple-700 transition">Request Full Rescue</button>
                            </div>
                        )}
                        {showAllAmberBundle && allSeveritiesAvailable && (
                            <div className="bg-yellow-100 border-2 border-yellow-400 p-6 rounded-lg shadow-lg text-center">
                                <h3 className="text-2xl font-bold text-yellow-800">Full Optimisation Package</h3>
                                <p className="text-yellow-700 mt-2">Your site needs improvement across the board. This package will address all issues to get your scores into the green.</p>
                                <div className="my-4">
                                    {typeof totalAmberPrice === 'number' && <span className="text-xl line-through text-slate-500">{formatPrice(totalAmberPrice)}</span>}
                                    <span className="text-4xl font-bold text-purple-600 ml-4">{formatPrice(discountedAmberPrice)}</span>
                                    {typeof totalAmberPrice === 'number' && <span className="text-purple-600 font-semibold"> (10% off)</span>}
                                </div>
                                <button onClick={() => handleOpenModal({ name: 'Full Optimisation Package', price: discountedAmberPrice, details: []})} className="w-auto bg-purple-600 text-white font-bold py-2 px-6 rounded-md hover:bg-purple-700 transition">Request Full Package</button>
                            </div>
                        )}
                        {showAllGreenBundle && (
                            <div className="bg-emerald-100 border-2 border-emerald-400 p-6 rounded-lg shadow-lg text-center">
                                <h3 className="text-2xl font-bold text-emerald-800">Perfectionist Polish Package</h3>
                                <p className="text-emerald-700 mt-2">Congratulations! Your site is in great shape. This package combines a final SEO and Accessibility tune-up to get you as close to 100 as possible.</p>
                                <div className="text-4xl font-bold text-purple-600 my-4">£99</div>
                                <button onClick={() => handleOpenModal({ name: 'Perfectionist Polish', price: 99, details: []})} className="w-auto bg-purple-600 text-white font-bold py-2 px-6 rounded-md hover:bg-purple-700 transition">Request Polish Package</button>
                            </div>
                        )}

                        {/* INDIVIDUAL CARDS LOGIC */}
                        {!showAllRedBundle && !showAllAmberBundle && !showAllGreenBundle && allSeveritiesAvailable &&(
                            <>
                                {(perfSeverity.isRed || perfSeverity.isAmber) && (
                                    <>
                                        {selectedPlatform === 'WordPress' ? (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-lg border">
                                                <div><h3 className="font-bold text-lg text-slate-800 flex items-center"><ExclamationTriangleIcon className={`h-5 w-5 mr-2 ${perfSeverity.color}`}/>The Problem</h3><p className="text-sm text-slate-600 mt-2">Your WordPress site has a low performance score, likely due to common issues with images or caching.</p></div>
                                                <div><h3 className="font-bold text-lg text-slate-800 flex items-center"><WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-slate-500"/>My Job Plan</h3><ul className="text-sm text-slate-600 mt-2 list-disc list-inside"><li>Install & Configure Caching Plugin</li><li>OR Bulk Optimise All Images</li></ul></div>
                                                <div className="text-center bg-slate-50 p-4 rounded-md flex flex-col justify-center">
                                                <h3 className="font-bold text-lg text-slate-800">WordPress Quick Win</h3>
                                                <div className="text-3xl font-bold text-purple-600 my-4">£50</div>
                                                <button onClick={() => handleOpenModal({ name: 'WordPress Quick Win', price: 50, details: ['Install Caching OR Image Plugin'] })} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition">Request This Service</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-lg border">
                                                <div><h3 className="font-bold text-lg text-slate-800 flex items-center"><ExclamationTriangleIcon className={`h-5 w-5 mr-2 ${perfSeverity.color}`}/>The Problem</h3><p className="text-sm text-slate-600 mt-2">Your {selectedPlatform} site has a low performance score. Best practices for this platform can still make a big difference.</p></div>
                                                <div><h3 className="font-bold text-lg text-slate-800 flex items-center"><WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-slate-500"/>My Job Plan</h3><ul className="text-sm text-slate-600 mt-2 list-disc list-inside"><li>Manual Image Compression Review</li><li>Slow Widget/App Identification</li><li>Best Practice Action Report</li></ul></div>
                                                <div className="text-center bg-slate-50 p-4 rounded-md flex flex-col justify-center">
                                                <h3 className="font-bold text-lg text-slate-800">Platform Performance Audit</h3>
                                                <div className="text-3xl font-bold text-purple-600 my-4">£150</div>
                                                <button onClick={() => handleOpenModal({ name: 'Platform Performance Audit', price: 150, details: ['Manual review and action report'] })} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition">Request This Service</button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                
                                {(seoSeverity.isRed || seoSeverity.isAmber) && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-lg border">
                                        <div><h3 className={`font-bold text-lg text-slate-800 flex items-center`}><ExclamationTriangleIcon className={`h-5 w-5 mr-2 ${seoSeverity.color}`}/>The Problem</h3><p className="text-sm text-slate-600 mt-2">{seoSeverity.problem}</p></div>
                                        <div><h3 className="font-bold text-lg text-slate-800 flex items-center"><WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-slate-500"/>My Job Plan</h3><ul className="text-sm text-slate-600 mt-2 list-disc list-inside">{['Full SEO Audit', 'Fix All Identified Errors', 'Implement Best Practices', 'Google Search Console Setup'].map(detail => <li key={detail}>{detail}</li>)}</ul></div>
                                        <div className="text-center bg-slate-50 p-4 rounded-md flex flex-col justify-center">
                                        <h3 className="font-bold text-lg text-slate-800">{seoSeverity.tier}</h3>
                                        <div className="text-3xl font-bold text-purple-600 my-4">{formatPrice(calculatePrice(seoSeverity.basePrice))}</div>
                                        <button onClick={() => handleOpenModal({ name: seoSeverity.tier, price: calculatePrice(seoSeverity.basePrice), details: [] })} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition">Request This Service</button>
                                        </div>
                                    </div>
                                )}
                                {(accessibilitySeverity.isRed || accessibilitySeverity.isAmber) && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-lg border">
                                        <div><h3 className={`font-bold text-lg text-slate-800 flex items-center`}><ExclamationTriangleIcon className={`h-5 w-5 mr-2 ${accessibilitySeverity.color}`}/>The Problem</h3><p className="text-sm text-slate-600 mt-2">{accessibilitySeverity.problem}</p></div>
                                        <div><h3 className="font-bold text-lg text-slate-800 flex items-center"><WrenchScrewdriverIcon className="h-5 w-5 mr-2 text-slate-500"/>My Job Plan</h3><ul className="text-sm text-slate-600 mt-2 list-disc list-inside">{['Full Accessibility Audit', 'Fix Contrast & Alt Text', 'Ensure Form/Button Labels', 'WCAG Compliance Check'].map(detail => <li key={detail}>{detail}</li>)}</ul></div>
                                        <div className="text-center bg-slate-50 p-4 rounded-md flex flex-col justify-center">
                                        <h3 className="font-bold text-lg text-slate-800">{accessibilitySeverity.tier}</h3>
                                        <div className="text-3xl font-bold text-purple-600 my-4">{formatPrice(calculatePrice(accessibilitySeverity.basePrice))}</div>
                                        <button onClick={() => handleOpenModal({ name: accessibilitySeverity.tier, price: calculatePrice(accessibilitySeverity.basePrice), details: [] })} className="w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition">Request This Service</button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                      </div>
                    </div>
                  )}
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
            <p className="text-slate-600 mt-2">Price: <span className="font-bold">{formatPrice(selectedService.price)}</span></p>
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