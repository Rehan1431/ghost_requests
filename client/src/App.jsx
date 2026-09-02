import { useState } from 'react';
import axios from 'axios';

function App() {
  const [endpoint, setEndpoint] = useState('/users');
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  const [latencyTime, setLatencyTime] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setResponseData(null);
    setStatusCode(null);
    setLatencyTime(null);
    setErrorMsg(null);

    const startTime = performance.now();
    try {
      const res = await axios.get(`http://localhost:3000${endpoint}`);
      const endTime = performance.now();
      
      setStatusCode(res.status);
      setLatencyTime(Math.round(endTime - startTime));
      setResponseData(res.data);
    } catch (err) {
      const endTime = performance.now();
      setLatencyTime(Math.round(endTime - startTime));
      
      if (err.response) {
        setStatusCode(err.response.status);
        setResponseData(err.response.data);
      } else {
        setErrorMsg(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-6 md:p-12 selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              Ghost-Environment
            </h1>
            <h2 className="text-xl md:text-2xl font-medium text-slate-400 mt-1">
              Telemetry Dashboard
            </h2>
          </div>
          <div className="text-sm text-slate-500 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Connection Active
          </div>
        </header>

        {/* Controls */}
        <section className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-slate-700/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Client Request Endpoint
              </label>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="w-full bg-slate-950/50 backdrop-blur-sm border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                placeholder="e.g., /users"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchData}
                disabled={loading}
                className={`w-full md:w-auto px-8 py-3 rounded-lg font-bold text-white transition-all shadow-lg ${
                  loading 
                    ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                    : 'bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-0.5 hover:shadow-indigo-500/25'
                }`}
              >
                {loading ? 'Executing...' : 'Execute Request'}
              </button>
            </div>
          </div>
        </section>

        {/* Telemetry HUD & Payload Viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Status HUD Panel */}
          <section className="lg:col-span-1 bg-slate-800/50 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-slate-700/50 h-fit space-y-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/50 pb-2">
              Network Telemetry
            </h3>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-slate-700/50"></div>
                  <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="text-indigo-400 text-sm font-medium animate-pulse">Awaiting Server Response...</p>
                <p className="text-slate-500 text-xs text-center px-4">Resilience Simulation Engine may be injecting latency.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">HTTP Status</p>
                  {statusCode ? (
                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-1.5 rounded-md font-bold text-lg tracking-widest ${
                        statusCode === 200 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {statusCode}
                      </div>
                      <span className="text-sm text-slate-400 font-medium">
                        {statusCode === 200 ? 'OK' : 'Internal Error'}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-600 italic">No request initiated</span>
                  )}
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Roundtrip Latency</p>
                  {latencyTime !== null ? (
                    <div className="flex items-center gap-3">
                      <div className={`text-3xl font-light font-mono ${
                        latencyTime > 1000 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {latencyTime}<span className="text-lg text-slate-500 ml-1">ms</span>
                      </div>
                      {latencyTime > 1000 && (
                        <span className="bg-amber-500/10 text-amber-400 text-xs px-2 py-1 rounded border border-amber-500/30">
                          Simulated Delay
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-600 italic">N/A</span>
                  )}
                </div>

                {errorMsg && !statusCode && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">System Error</p>
                    <div className="bg-rose-950/50 border border-rose-900/50 text-rose-400 p-3 rounded text-sm">
                      {errorMsg}
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Payload Viewer */}
          <section className="lg:col-span-2 bg-slate-800/50 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden flex flex-col h-[500px]">
            <div className="bg-slate-900/80 px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
              </div>
              <span className="text-xs text-slate-500 font-mono">Response Payload</span>
            </div>
            
            <div className="flex-1 overflow-auto p-4 bg-[#0B0F19]">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 font-mono text-sm space-y-4">
                  <div className="w-full max-w-md space-y-3 opacity-30">
                    <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-slate-700 rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-slate-700 rounded w-2/3 animate-pulse"></div>
                  </div>
                  <p>Intercepting stream...</p>
                </div>
              ) : responseData ? (
                <pre className={`text-sm font-mono leading-relaxed ${statusCode === 200 ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {JSON.stringify(responseData, null, 2)}
                </pre>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-700 font-mono text-sm">
                  /* Data payload rendering */
                </div>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default App;
