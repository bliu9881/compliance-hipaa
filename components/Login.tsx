
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../services/AuthContext';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Decorative Side */}
      <div className="hidden lg:flex flex-1 bg-emerald-600 relative overflow-hidden items-center justify-center p-20">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 0 L100 0 L100 100 L0 100 Z" fill="url(#grid)" />
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
          </svg>
        </div>
        
        <div className="relative z-10 text-white space-y-8 max-w-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/30">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-black tracking-tight">GuardPHI</h1>
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-bold leading-tight">Advanced HIPAA Compliance Sentinel.</h2>
            <p className="text-emerald-100 text-xl font-medium leading-relaxed">
              Secure your health infrastructure with AI-driven audits, incremental checks, and actionable remediation guides.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
              <h4 className="font-bold text-lg">99.9%</h4>
              <p className="text-xs text-emerald-200 uppercase font-black tracking-widest mt-1">Accuracy Rate</p>
            </div>
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
              <h4 className="font-bold text-lg">Real-time</h4>
              <p className="text-xs text-emerald-200 uppercase font-black tracking-widest mt-1">Analysis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white lg:rounded-l-[40px] shadow-2xl">
        <div className="w-full max-w-md space-y-10">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <ShieldCheck className="text-emerald-600 w-8 h-8" />
            <span className="font-bold text-2xl text-slate-900 tracking-tight">GuardPHI</span>
          </div>

          <div>
            <h2 className="text-3xl font-black text-slate-900">{isLogin ? 'Sign In' : 'Create Account'}</h2>
            <p className="text-slate-500 mt-2 font-medium">
              {isLogin ? 'Enter your administrative credentials to continue.' : 'Start protecting your health application today.'}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  placeholder="name@healthcare.org"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                {isLogin && <a href="#" className="text-xs font-bold text-emerald-600 hover:underline">Forgot?</a>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  {isLogin ? 'Access Dashboard' : 'Create Sentinel Account'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="text-emerald-600 font-bold hover:underline"
              >
                {isLogin ? 'Create one now' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
