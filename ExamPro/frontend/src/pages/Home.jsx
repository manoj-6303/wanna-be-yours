import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, Target, BookOpen, Star, Clock, Coins, MapPin, 
  Mail, Phone, ArrowRight, ShieldCheck, TrendingUp, MonitorPlay, 
  BarChart, Users, FileText, CheckCircle 
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* ================= HEADER / NAVBAR ================= */}
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-blue-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="bg-blue-900 text-white p-2 rounded-lg font-bold text-xl leading-none">
                LA
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold text-blue-900 tracking-tight leading-tight">LAKSHYA ACADEMY</span>
                <span className="text-[0.65rem] text-yellow-600 font-bold tracking-widest uppercase">Real Education Centre</span>
              </div>
            </div>
            <div className="hidden lg:flex space-x-8">
              <a href="#home" className="text-blue-900 font-semibold hover:text-yellow-600 transition-colors border-b-2 border-yellow-500 pb-1">Home</a>
              <a href="#about" className="text-slate-600 font-medium hover:text-blue-900 transition-colors">About Us</a>
              <a href="#challenges" className="text-slate-600 font-medium hover:text-blue-900 transition-colors">Challenge Tests</a>
              <a href="#courses" className="text-slate-600 font-medium hover:text-blue-900 transition-colors">Courses</a>
              <a href="#achievements" className="text-slate-600 font-medium hover:text-blue-900 transition-colors">Results</a>
              <a href="#contact" className="text-slate-600 font-medium hover:text-blue-900 transition-colors">Contact</a>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login" className="text-blue-900 font-semibold hover:text-blue-700 transition">Login</Link>
              <Link to="/dashboard" className="bg-yellow-500 hover:bg-yellow-400 text-blue-950 px-6 py-2.5 rounded-md font-bold shadow-sm transition-all transform hover:-translate-y-0.5">
                Student Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section id="home" className="relative bg-blue-950 text-white py-20 lg:py-32 overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute left-0 top-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                <span className="flex h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
                <span className="text-sm font-medium text-blue-100">Admissions Open 2026-27</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-white">
                Challenge Yourself.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
                  Improve Your Rank.
                </span>
              </h1>
              <p className="text-lg text-blue-200 leading-relaxed max-w-xl">
                Lakshya Academy Open Challenge Examination Platform provides real exam practice, instant evaluation, performance analysis, and competitive preparation for JEE, NEET, and EAMCET aspirants.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/register" className="bg-yellow-500 hover:bg-yellow-400 text-blue-950 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg shadow-yellow-500/30 flex items-center gap-2">
                  Start Challenge <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#challenges" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-lg font-bold text-lg transition-all backdrop-blur-sm">
                  Explore Tests
                </a>
              </div>
            </div>

            {/* Right Statistics & Illustration */}
            <div className="relative lg:ml-auto w-full max-w-lg mt-12 lg:mt-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-yellow-400 rounded-[2.5rem] transform rotate-3 opacity-20 blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[2rem] shadow-2xl">
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center hover:bg-white/10 transition">
                    <div className="text-yellow-400 flex justify-center mb-3"><Star className="w-8 h-8" /></div>
                    <div className="text-3xl font-bold text-white mb-1">27+</div>
                    <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Years Experience</div>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center hover:bg-white/10 transition">
                    <div className="text-yellow-400 flex justify-center mb-3"><Users className="w-8 h-8" /></div>
                    <div className="text-3xl font-bold text-white mb-1">10k+</div>
                    <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Students</div>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center hover:bg-white/10 transition">
                    <div className="text-yellow-400 flex justify-center mb-3"><FileText className="w-8 h-8" /></div>
                    <div className="text-3xl font-bold text-white mb-1">500+</div>
                    <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Tests Conducted</div>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center hover:bg-white/10 transition">
                    <div className="text-yellow-400 flex justify-center mb-3"><TrendingUp className="w-8 h-8" /></div>
                    <div className="text-3xl font-bold text-white mb-1">Top</div>
                    <div className="text-xs text-blue-200 uppercase tracking-wider font-semibold">Rank Improvement</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT LAKSHYA ACADEMY SECTION ================= */}
      <section id="about" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-yellow-600 tracking-widest uppercase mb-2">Our Legacy</h2>
            <h3 className="text-4xl font-extrabold text-blue-950 mb-6">About Lakshya Academy</h3>
            <p className="text-lg text-slate-600">
              Lakshya Academy is dedicated to providing quality education and competitive exam preparation through structured learning, regular assessments, and personalized performance improvement.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Director Profile */}
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-blue-600 rounded-2xl opacity-20 blur-lg group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
                <img 
                  src="/director_profile.png" 
                  alt="Director" 
                  className="w-full h-[400px] object-cover rounded-xl"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x500?text=Director+Profile' }}
                />
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white text-center">
                  <h4 className="font-bold text-xl text-blue-950">Sri. Director Garu</h4>
                  <p className="text-sm text-yellow-600 font-bold tracking-wider uppercase mt-1">Founder & Director</p>
                </div>
              </div>
            </div>

            {/* Vision & Mission */}
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:shadow-md transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl text-blue-700">
                    <Target className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-blue-950">Our Vision</h4>
                </div>
                <p className="text-xl text-slate-700 italic border-l-4 border-yellow-500 pl-4 py-2">
                  "Build confident students through knowledge and practice."
                </p>
              </div>

              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 hover:shadow-md transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-yellow-100 p-3 rounded-xl text-yellow-700">
                    <Award className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-blue-950">Our Mission</h4>
                </div>
                <p className="text-xl text-slate-700 italic border-l-4 border-blue-600 pl-4 py-2">
                  "Provide exam-oriented preparation with technology-driven assessments."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US SECTION ================= */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-yellow-600 tracking-widest uppercase mb-2">The Lakshya Advantage</h2>
            <h3 className="text-4xl font-extrabold text-blue-950">Why Choose Us</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-blue-950 mb-3">Expert Faculty</h4>
              <p className="text-slate-600 leading-relaxed">Experienced mentors helping students understand concepts clearly.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="bg-yellow-50 w-16 h-16 rounded-2xl flex items-center justify-center text-yellow-600 mb-6">
                <MonitorPlay className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-blue-950 mb-3">Open Challenge Tests</h4>
              <p className="text-slate-600 leading-relaxed">Real competitive exam pattern tests with instant results.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                <BarChart className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-blue-950 mb-3">Performance Analytics</h4>
              <p className="text-slate-600 leading-relaxed">Detailed analysis to identify strengths and weaknesses.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition duration-300">
              <div className="bg-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-blue-950 mb-3">Rank Improvement</h4>
              <p className="text-slate-600 leading-relaxed">Track progress and improve competitive readiness effectively.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OPEN CHALLENGE TEST SECTION ================= */}
      <section id="challenges" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-sm font-bold text-yellow-600 tracking-widest uppercase mb-2">Assess Yourself</h2>
              <h3 className="text-4xl font-extrabold text-blue-950">Test Your Preparation</h3>
            </div>
            <Link to="/register" className="hidden md:inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition mt-4 md:mt-0">
              View All Tests <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* JEE Card */}
            <div className="group bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:bg-blue-950 hover:border-blue-950 transition-colors duration-300 shadow-sm">
              <div className="bg-white group-hover:bg-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6 transition-colors">
                <BookOpen className="w-8 h-8 text-blue-600 group-hover:text-white" />
              </div>
              <h4 className="text-2xl font-bold text-blue-950 group-hover:text-white mb-6 transition-colors">JEE Challenge</h4>
              <ul className="space-y-4 mb-8 text-slate-600 group-hover:text-blue-200 transition-colors">
                <li className="flex items-center gap-3"><FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-400" /> 10 Questions</li>
                <li className="flex items-center gap-3"><Clock className="w-5 h-5 text-slate-400 group-hover:text-blue-400" /> 15 Minutes</li>
                <li className="flex items-center gap-3"><Coins className="w-5 h-5 text-yellow-500" /> Reward: Gold Coins</li>
              </ul>
              <Link to="/login" className="block w-full text-center bg-blue-100 group-hover:bg-yellow-500 text-blue-900 group-hover:text-blue-950 font-bold py-3 rounded-xl transition-colors">
                Take Challenge
              </Link>
            </div>

            {/* EAMCET Card */}
            <div className="group bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:bg-blue-950 hover:border-blue-950 transition-colors duration-300 shadow-sm">
              <div className="bg-white group-hover:bg-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6 transition-colors">
                <Target className="w-8 h-8 text-yellow-600 group-hover:text-yellow-400" />
              </div>
              <h4 className="text-2xl font-bold text-blue-950 group-hover:text-white mb-6 transition-colors">EAMCET Challenge</h4>
              <ul className="space-y-4 mb-8 text-slate-600 group-hover:text-blue-200 transition-colors">
                <li className="flex items-center gap-3"><FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-400" /> 10 Questions</li>
                <li className="flex items-center gap-3"><Clock className="w-5 h-5 text-slate-400 group-hover:text-blue-400" /> 15 Minutes</li>
                <li className="flex items-center gap-3"><Coins className="w-5 h-5 text-yellow-500" /> Reward: Gold Coins</li>
              </ul>
              <Link to="/login" className="block w-full text-center bg-blue-100 group-hover:bg-yellow-500 text-blue-900 group-hover:text-blue-950 font-bold py-3 rounded-xl transition-colors">
                Take Challenge
              </Link>
            </div>

            {/* NEET Card */}
            <div className="group bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:bg-blue-950 hover:border-blue-950 transition-colors duration-300 shadow-sm">
              <div className="bg-white group-hover:bg-blue-900 w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6 transition-colors">
                <ShieldCheck className="w-8 h-8 text-green-600 group-hover:text-green-400" />
              </div>
              <h4 className="text-2xl font-bold text-blue-950 group-hover:text-white mb-6 transition-colors">NEET Challenge</h4>
              <ul className="space-y-4 mb-8 text-slate-600 group-hover:text-blue-200 transition-colors">
                <li className="flex items-center gap-3"><FileText className="w-5 h-5 text-slate-400 group-hover:text-blue-400" /> 10 Questions</li>
                <li className="flex items-center gap-3"><Clock className="w-5 h-5 text-slate-400 group-hover:text-blue-400" /> 15 Minutes</li>
                <li className="flex items-center gap-3"><Coins className="w-5 h-5 text-yellow-500" /> Reward: Gold Coins</li>
              </ul>
              <Link to="/login" className="block w-full text-center bg-blue-100 group-hover:bg-yellow-500 text-blue-900 group-hover:text-blue-950 font-bold py-3 rounded-xl transition-colors">
                Take Challenge
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= GOLD COIN REWARD SYSTEM ================= */}
      <section className="py-24 bg-gradient-to-br from-yellow-50 to-orange-50 border-y border-yellow-100 relative overflow-hidden">
        {/* Background Coins Illustration */}
        <div className="absolute -right-20 -top-20 opacity-20 text-yellow-500">
          <Coins className="w-96 h-96" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold text-yellow-600 tracking-widest uppercase mb-2">Rewards Program</h2>
              <h3 className="text-4xl font-extrabold text-blue-950 mb-6">Earn Gold Coins With Every Achievement</h3>
              <p className="text-lg text-slate-700 mb-8">
                Learning is rewarding at Lakshya Academy. Accumulate gold coins for your academic milestones and redeem them for fee concessions and special perks!
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-yellow-200">
                  <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600 shrink-0"><Coins className="w-8 h-8" /></div>
                  <div>
                    <h4 className="font-bold text-blue-950 text-lg">Earn 50 Gold Coins</h4>
                    <p className="text-slate-600 text-sm">Score above the threshold to instantly earn 50 gold coins on our platform.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-yellow-200">
                  <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600 shrink-0"><Award className="w-8 h-8" /></div>
                  <div>
                    <h4 className="font-bold text-blue-950 text-lg">Massive Fee Concession</h4>
                    <p className="text-slate-600 text-sm">Top performers receive massive fee concessions for our long-term academy courses.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-yellow-200">
                  <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600 shrink-0"><Target className="w-8 h-8" /></div>
                  <div>
                    <h4 className="font-bold text-blue-950 text-lg">Academy Courses</h4>
                    <p className="text-slate-600 text-sm">Designed specifically for dedicated EAMCET and JEE Mains preparation.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Wallet Preview Mockup */}
            <div className="flex justify-center">
              <div className="bg-white rounded-3xl p-8 shadow-2xl border border-yellow-200 w-full max-w-sm transform md:rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                    <span className="text-3xl">👨‍🎓</span>
                  </div>
                  <h4 className="text-xl font-bold text-blue-950">Student Profile</h4>
                  <p className="text-slate-500 text-sm">Class 11 - JEE Aspirant</p>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl p-6 text-white shadow-lg shadow-yellow-500/40 relative overflow-hidden">
                  <div className="absolute right-0 top-0 opacity-20 transform translate-x-4 -translate-y-4">
                    <Coins className="w-32 h-32" />
                  </div>
                  <div className="relative z-10">
                    <p className="text-yellow-900 font-bold text-sm uppercase tracking-wider mb-1">Student Wallet</p>
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-extrabold">120</span>
                      <span className="text-xl font-semibold mb-1">Coins</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <button className="text-blue-600 font-bold text-sm hover:underline">View Reward Catalog</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section className="py-24 bg-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-yellow-500 tracking-widest uppercase mb-2">Process</h2>
            <h3 className="text-4xl font-extrabold">How It Works</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-blue-900 relative z-10">
                <span className="text-2xl font-bold text-yellow-400">1</span>
              </div>
              <h4 className="text-xl font-bold mb-3">Register</h4>
              <p className="text-blue-200 text-sm">Create your student account in minutes.</p>
              {/* Connector */}
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-blue-800 -z-0"></div>
            </div>
            
            <div className="relative">
              <div className="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-blue-900 relative z-10">
                <span className="text-2xl font-bold text-yellow-400">2</span>
              </div>
              <h4 className="text-xl font-bold mb-3">Choose Challenge</h4>
              <p className="text-blue-200 text-sm">Select from JEE, NEET, or EAMCET patterns.</p>
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-blue-800 -z-0"></div>
            </div>
            
            <div className="relative">
              <div className="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-blue-900 relative z-10">
                <span className="text-2xl font-bold text-yellow-400">3</span>
              </div>
              <h4 className="text-xl font-bold mb-3">Write Exam</h4>
              <p className="text-blue-200 text-sm">Experience real exam environment.</p>
              <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-blue-800 -z-0"></div>
            </div>
            
            <div className="relative">
              <div className="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-blue-900 relative z-10">
                <span className="text-2xl font-bold text-yellow-400">4</span>
              </div>
              <h4 className="text-xl font-bold mb-3">Improve Rank & Earn</h4>
              <p className="text-blue-200 text-sm">Analyze results and collect gold coins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RESULTS / ACHIEVEMENTS SECTION ================= */}
      <section id="achievements" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-yellow-600 tracking-widest uppercase mb-2">Leaderboard Preview</h2>
            <h3 className="text-4xl font-extrabold text-blue-950">Student Success</h3>
          </div>
          
          <div className="max-w-4xl mx-auto bg-slate-50 rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-4 bg-blue-950 text-white font-bold p-6 text-sm sm:text-base">
              <div>Rank</div>
              <div className="col-span-2">Student Name</div>
              <div className="text-right">Score & Reward</div>
            </div>
            
            <div className="divide-y divide-slate-200">
              {/* Row 1 */}
              <div className="grid grid-cols-4 p-6 items-center bg-yellow-50/50">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-yellow-400 text-yellow-900 font-bold rounded-full">1</span>
                  <Award className="w-5 h-5 text-yellow-500 hidden sm:block" />
                </div>
                <div className="col-span-2 font-bold text-blue-950">Rahul V.</div>
                <div className="text-right">
                  <div className="font-extrabold text-lg">980</div>
                  <div className="text-sm font-semibold text-yellow-600 flex justify-end items-center gap-1"><Coins className="w-4 h-4"/> 500 Coins</div>
                </div>
              </div>
              
              {/* Row 2 */}
              <div className="grid grid-cols-4 p-6 items-center bg-slate-100/50">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-slate-300 text-slate-700 font-bold rounded-full">2</span>
                </div>
                <div className="col-span-2 font-bold text-blue-950">Priya K.</div>
                <div className="text-right">
                  <div className="font-extrabold text-lg">945</div>
                  <div className="text-sm font-semibold text-yellow-600 flex justify-end items-center gap-1"><Coins className="w-4 h-4"/> 250 Coins</div>
                </div>
              </div>
              
              {/* Row 3 */}
              <div className="grid grid-cols-4 p-6 items-center bg-orange-50/30">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-orange-300 text-orange-900 font-bold rounded-full">3</span>
                </div>
                <div className="col-span-2 font-bold text-blue-950">Karthik S.</div>
                <div className="text-right">
                  <div className="font-extrabold text-lg">910</div>
                  <div className="text-sm font-semibold text-yellow-600 flex justify-end items-center gap-1"><Coins className="w-4 h-4"/> 100 Coins</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-100 text-center border-t border-slate-200">
              <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in to view full leaderboard</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FACILITIES SECTION ================= */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-yellow-600 tracking-widest uppercase mb-2">Our Features</h2>
            <h3 className="text-4xl font-extrabold text-blue-950">Platform Facilities</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-300 transition">
              <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><MonitorPlay /></div>
              <span className="font-bold text-blue-950">Online Exam Platform</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-300 transition">
              <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><TrendingUp /></div>
              <span className="font-bold text-blue-950">Instant Result Analysis</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-300 transition">
              <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><BookOpen /></div>
              <span className="font-bold text-blue-950">Question Bank</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-300 transition">
              <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><BarChart /></div>
              <span className="font-bold text-blue-950">Performance Reports</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-300 transition">
              <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><Award /></div>
              <span className="font-bold text-blue-950">Leaderboard</span>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-300 transition">
              <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><Coins /></div>
              <span className="font-bold text-blue-950">Reward System</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LOCATION & CONTACT SECTION ================= */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Contact Information */}
            <div className="order-2 lg:order-1">
              <h2 className="text-sm font-bold text-yellow-600 tracking-widest uppercase mb-2">Get In Touch</h2>
              <h3 className="text-4xl font-extrabold text-blue-950 mb-8">Contact & Location</h3>
              
              <div className="space-y-6">
                {/* Map Style Card */}
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-700 mt-1 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-blue-950 mb-2">Lakshya Academy</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Near Vallabha Ganapathi Temple,<br />
                      Opp to Keshava Emergency Hospital, 4th Bridge,<br />
                      Konthamuru, Rajahmundry Rural,<br />
                      Andhra Pradesh
                    </p>
                  </div>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-700 shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-blue-950 mb-1">Phone</h4>
                    <p className="text-slate-600 text-lg font-medium">+91 85006 57991, 94928 39534</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex items-center gap-4 shadow-sm">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-700 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xl font-bold text-blue-950 mb-1">Email</h4>
                    <p className="text-slate-600 text-base md:text-lg font-medium truncate">lakshyaacademy.konthamuru@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="order-1 lg:order-2 bg-blue-950 rounded-3xl p-8 lg:p-12 text-white shadow-2xl flex flex-col justify-center h-full">
              <h3 className="text-3xl font-bold mb-4">Start Your Journey Today</h3>
              <p className="text-blue-200 mb-10 text-lg leading-relaxed">
                Join Lakshya Academy to experience top-tier competitive exam coaching and a platform designed for your success.
              </p>
              
              <div className="space-y-4">
                <Link to="/register" className="block w-full text-center bg-yellow-500 hover:bg-yellow-400 text-blue-950 py-4 rounded-xl font-bold text-lg transition shadow-lg">
                  Register Now
                </Link>
                <a href="mailto:lakshyaacademy.konthamuru@gmail.com" className="block w-full text-center bg-transparent border-2 border-blue-400 hover:border-white text-white py-4 rounded-xl font-bold text-lg transition">
                  Contact Us
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-xl leading-none">LA</div>
                <span className="text-2xl font-extrabold text-white tracking-tight">LAKSHYA ACADEMY</span>
              </div>
              <p className="text-slate-400 max-w-sm">
                Real Education Centre for Genuine Aspirants. Preparing students for a brighter future through competitive excellence.
              </p>
            </div>
            
            <div id="courses">
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#about" className="hover:text-yellow-400 transition">About Us</a></li>
                <li><a href="#challenges" className="hover:text-yellow-400 transition">Challenge Tests</a></li>
                <li><Link to="/login" className="hover:text-yellow-400 transition">Student Login</Link></li>
                <li><a href="#contact" className="hover:text-yellow-400 transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Courses</h4>
              <ul className="space-y-3">
                <li className="text-slate-400">IIT-JEE</li>
                <li className="text-slate-400">NEET</li>
                <li className="text-slate-400">EAMCET</li>
                <li className="text-slate-400">Intermediate MPC & BiPC</li>
                <li className="text-slate-400">Foundation Courses</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
            <p>&copy; 2026 Lakshya Academy Open Challenge Test Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
