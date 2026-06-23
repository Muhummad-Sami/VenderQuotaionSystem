import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  const features = [
    {
      icon: '👥',
      title: 'Vendor Management',
      description: 'Add, update, search, and manage all your vendors in one centralized dashboard.',
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      icon: '📝',
      title: 'Quotation Requests',
      description: 'Create detailed requests, assign to vendors, and track submissions in real-time.',
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      icon: '🏆',
      title: 'Smart Comparison',
      description: 'Compare vendor offers side-by-side and automatically highlight the best deal.',
      color: 'from-green-500 to-green-600',
      bg: 'bg-green-500/10',
      border: 'border-green-500/20'
    },
    {
      icon: '📊',
      title: 'Real-Time Dashboard',
      description: 'Get instant insights with live statistics, activity feeds, and performance metrics.',
      color: 'from-orange-500 to-orange-600',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20'
    },
    {
      icon: '🔔',
      title: 'Instant Notifications',
      description: 'Stay updated with real-time alerts on offers, approvals, and deadlines.',
      color: 'from-pink-500 to-pink-600',
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/20'
    },
    {
      icon: '📄',
      title: 'PDF Reports',
      description: 'Generate professional PDF reports for quotations, comparisons, and vendor records.',
      color: 'from-teal-500 to-teal-600',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20'
    }
  ];

  const steps = [
    { number: '01', title: 'Create a Request', description: 'Admin creates a detailed quotation request with specifications and deadlines.', icon: '📋' },
    { number: '02', title: 'Vendors Submit Offers', description: 'Registered vendors review requests and submit their competitive offers.', icon: '📤' },
    { number: '03', title: 'Compare & Award', description: 'Admin compares all offers side-by-side and awards the best proposal.', icon: '🏆' }
  ];

  const stats = [
    { number: '100+', label: 'Vendors Managed', icon: '🏢' },
    { number: '50+', label: 'Active Requests', icon: '📋' },
    { number: '200+', label: 'Quotations Sent', icon: '📤' },
    { number: '95%', label: 'Satisfaction Rate', icon: '⭐' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Procurement Manager',
      company: 'TechCorp Inc.',
      quote: 'This system has completely transformed our vendor management process. We reduced response time by 60%!',
      avatar: 'SJ',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Michael Chen',
      role: 'Operations Director',
      company: 'Global Supplies Co.',
      quote: 'The quotation comparison feature is a game-changer. We can now make data-driven decisions instantly.',
      avatar: 'MC',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Vendor Relations Lead',
      company: 'Logistics Pro',
      quote: 'Our vendors love the transparency and ease of use. This platform saved us countless hours of email back-and-forth.',
      avatar: 'ER',
      color: 'from-green-500 to-green-600'
    }
  ];

  const industries = [
    { icon: '🏢', name: 'Enterprise' },
    { icon: '🏭', name: 'Manufacturing' },
    { icon: '🏗️', name: 'Construction' },
    { icon: '🏬', name: 'Retail' },
    { icon: '🏪', name: 'Logistics' },
    { icon: '🏫', name: 'Education' },
    { icon: '🏥', name: 'Healthcare' },
    { icon: '💻', name: 'Technology' }
  ];

  return (
    <div className="min-h-screen">
      {/* ==================== HERO SECTION ==================== */}
      <section 
        className="relative overflow-hidden min-h-[90vh] flex items-center bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(15,23,42,0.92) 0%, rgba(30,58,138,0.85) 50%, rgba(49,46,129,0.90) 100%), url("https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1920&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white/90 text-sm font-medium">🚀 Enterprise Ready</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                Vendor Management
                <br />
                <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-md">
                  & Quotation System
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-blue-100/90 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed drop-shadow-md">
                Streamline your procurement workflow. Manage vendors, create requests,
                compare offers, and make data-driven decisions — all from one unified platform.
              </p>

              {isAuthenticated ? (
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Link
                    to={user?.role === 'admin' ? '/admin/dashboard' : '/vendor/dashboard'}
                    className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transform hover:-translate-y-0.5"
                  >
                    Go to Dashboard →
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    to="/compare"
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300"
                  >
                    📊 Compare Quotations
                  </Link>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Link
                    to="/login"
                    className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 transform hover:-translate-y-0.5 overflow-hidden"
                  >
                    <span className="relative z-10">👑 Login as Admin</span>
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300"
                  >
                    Register as Vendor
                  </Link>
                </div>
              )}

              {!isAuthenticated && (
                <div className="mt-8 max-w-sm mx-auto lg:mx-0">
                  <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-5">
                    <p className="text-white/70 text-xs mb-3">🔑 Quick Test Credentials</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                        <span className="text-purple-300 font-semibold text-xs">👑 Admin</span>
                        <p className="text-white/80 text-xs font-mono mt-1">admin@demo.com</p>
                        <p className="text-white/40 text-[10px]">pass: demo123</p>
                      </div>
                      <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                        <span className="text-blue-300 font-semibold text-xs">🧑‍💼 Vendor</span>
                        <p className="text-white/80 text-xs font-mono mt-1">vendor@demo.com</p>
                        <p className="text-white/40 text-[10px]">pass: demo123</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden lg:flex justify-center items-center animate-slide-up">
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl"></div>
                <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                  <div className="text-center">
                    <div className="text-8xl mb-4">📊</div>
                    <h3 className="text-white font-semibold text-xl drop-shadow-md">Smart Procurement</h3>
                    <p className="text-white/70 text-sm mt-2">All your vendor data, beautifully organized</p>
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      <div className="bg-white/15 rounded-xl p-3">
                        <div className="text-2xl">👥</div>
                        <p className="text-white/60 text-xs mt-1">Vendors</p>
                      </div>
                      <div className="bg-white/15 rounded-xl p-3">
                        <div className="text-2xl">📋</div>
                        <p className="text-white/60 text-xs mt-1">Requests</p>
                      </div>
                      <div className="bg-white/15 rounded-xl p-3">
                        <div className="text-2xl">🏆</div>
                        <p className="text-white/60 text-xs mt-1">Compare</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-pulse-slow border border-white/30">
                  ⚡ 60% Faster
                </div>
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg animate-pulse-slow delay-1000 border border-white/30">
                  🏅 #1 Choice
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="py-16 bg-slate-900/80 backdrop-blur-sm border-y border-white/10 bg-fixed bg-cover bg-center" style={{
        backgroundImage: 'linear-gradient(135deg, rgba(15,23,42,0.90) 0%, rgba(30,58,138,0.85) 100%), url("https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1920&q=80")'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="text-5xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-4xl font-bold text-white drop-shadow-lg">{stat.number}</div>
                <div className="text-sm text-white/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-20 bg-slate-900/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">Three simple steps to manage your procurement process efficiently</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/3 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-green-500/40 -translate-y-1/2"></div>
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <div className="text-white/20 text-sm font-bold mb-2">{step.number}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-white/50 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900/80 to-indigo-900/90 bg-fixed bg-cover bg-center" style={{
        backgroundImage: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,58,138,0.90) 50%, rgba(49,46,129,0.90) 100%), url("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&q=80")'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">Everything you need to streamline your procurement process</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className={`group ${feature.bg} backdrop-blur-sm border ${feature.border} rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TRUSTED BY ==================== */}
      <section className="py-16 bg-slate-900/95 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-6">Trusted by Industry Leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70 grayscale">
            {industries.map((industry, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <span className="text-4xl">{industry.icon}</span>
                <span className="text-white/50 text-xs">{industry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-20 bg-slate-900/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">Real feedback from real users who transformed their procurement process</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-white/40 text-xs">{testimonial.role}</p>
                    <p className="text-white/30 text-xs">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">"{testimonial.quote}"</p>
                <div className="mt-3 text-yellow-400 text-sm">★★★★★</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-20 bg-gradient-to-r from-blue-600/30 to-purple-600/30 border-y border-white/10 bg-fixed bg-cover bg-center" style={{
        backgroundImage: 'linear-gradient(135deg, rgba(37,99,235,0.30) 0%, rgba(124,58,237,0.30) 100%), url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80")'
      }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Ready to Transform Your Procurement?
          </h2>
          <p className="text-lg text-white/80 mb-8 drop-shadow-md">
            Join thousands of businesses already using our platform to streamline their vendor management.
          </p>
          {isAuthenticated ? (
            <Link
              to={user?.role === 'admin' ? '/admin/dashboard' : '/vendor/dashboard'}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 transform hover:-translate-y-0.5"
            >
              Go to Dashboard →
            </Link>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 transform hover:-translate-y-0.5"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-slate-950 border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">📋 Vendor System</h3>
              <p className="text-white/40 text-sm">Smart procurement, simplified.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-white/40">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-white/40">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-white/40">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center text-sm text-white/30">
            © 2026 Vendor Management & Quotation System. Built with ❤️ for procurement teams.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;