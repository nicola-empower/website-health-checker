'use client';

import { useState, FormEvent, FC } from 'react';
import { ChartBarIcon, DevicePhoneMobileIcon, ComputerDesktopIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';


// --- Reusable UI Components ---

const ServicePlan = ({ title, problem, plan, investment }: { title: string; problem: string[]; plan: string[]; investment: string }) => (
  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 w-full">
    <h3 className="text-2xl font-bold text-teal-400 mb-4">{title}</h3>
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h4 className="text-lg font-semibold text-white mb-2">The Problem</h4>
        <ul className="space-y-2">
          {problem.map((item, index) => (
            <li key={index} className="flex items-start">
              <XCircleIcon className="w-5 h-5 text-red-400 mr-2 mt-1 flex-shrink-0" />
              <span className="text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-lg font-semibold text-white mb-2">My Job Plan</h4>
        <ul className="space-y-2">
          {plan.map((item, index) => (
            <li key={index} className="flex items-start">
              <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
              <span className="text-gray-300">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
    <div className="mt-6 pt-6 border-t border-gray-700">
      <h4 className="text-lg font-semibold text-white mb-2">Your Investment</h4>
      <p className="text-3xl font-bold text-teal-400">{investment}</p>
    </div>
  </div>
);

const DiyPlan = ({ title, problem, plan, investment }: { title: string; problem: string[]; plan: string[]; investment: string }) => (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 w-full">
      <h3 className="text-2xl font-bold text-teal-400 mb-4">{title}</h3>
      <div className="grid md:grid-cols-1 gap-6">
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">Common Issues</h4>
          <ul className="space-y-2">
            {problem.map((item, index) => (
              <li key={index} className="flex items-start">
                <XCircleIcon className="w-5 h-5 text-red-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
       <div className="mt-6 pt-6 border-t border-gray-700 grid md:grid-cols-2 gap-6">
         <div>
          <h4 className="text-lg font-semibold text-white mb-2">DIY Action Plan</h4>
           <ul className="space-y-2">
            {plan.map((item, index) => (
                <li key={index} className="flex items-start">
                <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-300">{item}</span>
                </li>
            ))}
            </ul>
        </div>
        <div>
            <h4 className="text-lg font-semibold text-white mb-2">Need a Hand?</h4>
            <p className="text-gray-300 mb-4">If you get stuck or want a professional to handle it, I can perform a deep-dive audit and provide a detailed roadmap.</p>
             <p className="text-3xl font-bold text-teal-400">{investment}</p>
        </div>
      </div>
    </div>
  );


const ScoreCircle = ({ score }: { score: number | null }) => {
  if (score === null) {
    return (
      <div className="w-32 h-32 rounded-full flex items-center justify-center bg-gray-700">
        <span className="text-gray-400 text-lg">-</span>
      </div>
    );
  }
  const getScoreColor = (value: number) => {
    if (value >= 90) return 'text-green-400';
    if (value >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };
  const colorClass = getScoreColor(score);
  return (
    <div className={`w-32 h-32 rounded-full flex items-center justify-center bg-gray-800 border-4 ${colorClass.replace('text-', 'border-')}`}>
      <span className={`text-5xl font-bold ${colorClass}`}>{score}</span>
    </div>
  );
};

const Loader = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


// --- Main Page Component ---

export default function HealthCheckerPage() {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('wordpress');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState({ submitting: false, success: false, error: '' });
  
  const analyzeWebsite = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    if (!url || !url.startsWith('http')) {
        setError("Please enter a valid URL (e.g., https://www.example.com)");
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(`/api/pagespeed`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze the website.');
      }
      
      const data = await response.json();
      setResults(data);
      setTimeout(() => setIsModalOpen(true), 1000); // Open modal after a short delay
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus({ submitting: true, success: false, error: '' });

    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
        const response = await fetch('https://formspree.io/f/movngvvy', { // IMPORTANT: Replace with your Formspree form ID
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            setFormStatus({ submitting: false, success: true, error: '' });
        } else {
            const data = await response.json();
            if (Object.hasOwn(data, 'errors')) {
                throw new Error(data["errors"].map((error: any) => error["message"]).join(", "));
            } else {
                throw new Error('Oops! There was a problem submitting your form');
            }
        }
    } catch (error: any) {
        setFormStatus({ submitting: false, success: false, error: error.message });
    }
  };


  const renderActionPlan = () => {
    if (!results) return null;

    const avgPerf = (results.mobile.performance + results.desktop.performance) / 2;
    
    // WordPress Plans
    if (platform === 'wordpress') {
        if (avgPerf >= 50 && avgPerf < 90) {
            return <ServicePlan 
                title="WordPress Quick Win"
                problem={["Slow loading times are frustrating visitors.", "Unoptimized images are bloating your page.", "Lack of caching is making your server work too hard."]}
                plan={["Install and configure a premium caching plugin.", "Optimize all existing images AND set up automatic optimization for new uploads.", "Basic database cleanup to remove unnecessary clutter."]}
                investment="£250"
            />;
        }
        if (avgPerf < 50) {
             return <ServicePlan 
                title="WordPress Performance Deep Dive"
                problem={["Your site is critically slow, likely losing customers and search ranking.", "Code (CSS/JS) is not optimized, blocking page render.", "Your server is struggling to keep up with requests."]}
                plan={["Everything in the 'Quick Win' package.", "Advanced code minification and deferral of non-critical scripts.", "In-depth database optimization.", "A full report on further potential improvements."]}
                investment="Starting at £600 (Custom Quote)"
            />;
        }
        return (
            <div className="text-center bg-gray-800 p-8 rounded-lg">
                <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white">Great job!</h3>
                <p className="text-gray-300">Your WordPress site is already performing well. Keep up the good work!</p>
            </div>
        );
    }

    // Plans for other platforms
    if (['shopify', 'wix', 'squarespace'].includes(platform)) {
        if (avgPerf < 90) {
            return <DiyPlan
                title={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Performance Plan`}
                problem={[`Unoptimized images are the #1 cause of slow ${platform} sites.`, "Too many apps or custom scripts can bog down performance.", "Large videos or custom fonts can increase load times."]}
                plan={["Compress all images before uploading them.", "Regularly review and remove unused apps.", "Use platform-native features wherever possible instead of third-party code."]}
                investment="Platform Audit from £150"
            />
        }
         return (
            <div className="text-center bg-gray-800 p-8 rounded-lg">
                <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white">Looking Good!</h3>
                <p className="text-gray-300">{`Your ${platform} site is performing well. Continue to follow best practices for content and images.`}</p>
            </div>
        );
    }
    
    return null;
  };


  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <ChartBarIcon className="w-16 h-16 mx-auto text-teal-400 mb-4" />
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Website Health Checker</h1>
          <p className="text-lg text-gray-400">
            Enter your website URL to get an instant analysis of its performance, SEO, and accessibility, plus a tailored action plan to boost your scores.
          </p>
        </div>

        <div className="max-w-2xl mx-auto my-10">
          <form onSubmit={analyzeWebsite} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.yourwebsite.com"
              className="flex-grow bg-gray-700 text-white rounded-md px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
             <select 
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="bg-gray-700 text-white rounded-md px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="wordpress">WordPress</option>
                <option value="shopify">Shopify</option>
                <option value="wix">Wix</option>
                <option value="squarespace">Squarespace</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-md transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? <><Loader /> <span className="ml-2">Analyzing...</span></> : 'Analyze'}
            </button>
          </form>
           {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </div>

        {results && (
          <div id="results" className="space-y-12">
            {/* --- Score Display --- */}
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-gray-700">
              <h2 className="text-3xl font-bold text-center mb-8">Performance Scores</h2>
              <div className="flex flex-col md:flex-row justify-around items-center gap-8">
                <div className="text-center">
                  <h3 className="flex items-center justify-center gap-2 text-2xl font-semibold mb-4"><DevicePhoneMobileIcon className="w-6 h-6"/> Mobile</h3>
                  <ScoreCircle score={results.mobile.performance} />
                </div>
                <div className="text-center">
                  <h3 className="flex items-center justify-center gap-2 text-2xl font-semibold mb-4"><ComputerDesktopIcon className="w-6 h-6"/> Desktop</h3>
                  <ScoreCircle score={results.desktop.performance} />
                </div>
              </div>
               <div className="mt-8 text-center text-gray-400">
                 <p>Scores are provided by Google PageSpeed Insights.</p>
                 <a href={results.finalUrl} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">View the full Google report</a>
               </div>
            </div>

            {/* --- Action Plan --- */}
            <div className="text-center">
                 <h2 className="text-3xl font-bold mb-6">Your Action Plan</h2>
                 <div className="max-w-4xl mx-auto">
                    {renderActionPlan()}
                 </div>
            </div>
          </div>
        )}
      </main>

       <footer className="text-center py-8 mt-12 border-t border-gray-800">
            <p className="text-gray-500">&copy; 2024 Your Company Name. All rights reserved.</p>
            <div className="max-w-3xl mx-auto mt-4 px-4">
                 <p className="text-sm text-gray-600 flex items-start justify-center">
                     <InformationCircleIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"/> 
                     <span>
                         **Disclaimer:** Website performance scores can fluctuate slightly between tests. This is normal and can be caused by temporary server load, network conditions, or other transient factors. The action plan provided is based on the results at the time of testing.
                     </span>
                </p>
            </div>
       </footer>


        {/* --- Modal for PDF Request --- */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50" onClick={() => setIsModalOpen(false)}>
                <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
                    
                    {!formStatus.success ? (
                         <>
                            <h2 className="text-2xl font-bold text-teal-400 mb-4">Like this report?</h2>
                            <p className="text-gray-300 mb-6">Enter your details below, and I'll send a full PDF copy of your results and action plan straight to your inbox.</p>
                            
                            <form onSubmit={handleFormSubmit}>
                                <input type="hidden" name="url" value={url} />
                                <input type="hidden" name="platform" value={platform} />
                                <input type="hidden" name="mobile_score" value={results?.mobile?.performance} />
                                <input type="hidden" name="desktop_score" value={results?.desktop?.performance} />

                                <div className="space-y-4">
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input type="text" name="name" placeholder="Your Name" required className="w-full bg-gray-700 text-gray-200 rounded-md py-3 pl-10 pr-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                    </div>
                                    <div className="relative">
                                        <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input type="email" name="email" placeholder="your@email.com" required className="w-full bg-gray-700 text-gray-200 rounded-md py-3 pl-10 pr-4 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                    </div>
                                </div>
                                <button type="submit" disabled={formStatus.submitting} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-md mt-6 transition-colors disabled:bg-gray-500 flex items-center justify-center">
                                    {formStatus.submitting ? <><Loader /> <span className="ml-2">Sending...</span></> : 'Send Me The PDF'}
                                </button>
                                {formStatus.error && <p className="text-red-400 mt-2 text-sm">{formStatus.error}</p>}
                            </form>
                         </>
                    ) : (
                        <div className="text-center">
                            <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white">Thank You!</h2>
                            <p className="text-gray-300">Your report is on its way to your inbox. Please check your spam folder if you don't see it in the next few minutes.</p>
                            <button onClick={() => setIsModalOpen(false)} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-md mt-6 transition-colors">
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}

    </div>
  );
}

