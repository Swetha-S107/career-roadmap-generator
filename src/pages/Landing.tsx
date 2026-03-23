import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Map, BookOpen, FileText, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-stone-900" />
            <span className="text-xl font-bold tracking-tight">CareerPath AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/auth" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">Login</Link>
            <Link to="/auth" className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-full hover:bg-stone-800 transition-colors">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
          >
            Your AI-Powered <br />
            <span className="text-stone-500 italic font-serif">Career Navigator</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-stone-600 mb-10 max-w-2xl mx-auto"
          >
            Unlock your potential with personalized roadmaps for Software, Banking, Government Jobs, and more. Expert-curated courses and AI-driven career guidance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link to="/auth" className="w-full sm:w-auto px-8 py-4 bg-stone-900 text-white font-medium rounded-full hover:bg-stone-800 transition-all flex items-center justify-center">
              Start Your Journey <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-white border border-stone-200 text-stone-900 font-medium rounded-full hover:bg-stone-50 transition-all">
              Explore Features
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={Map}
              title="AI Roadmaps"
              description="Get a step-by-step guide tailored to your skills, interests, and goals."
            />
            <FeatureCard
              icon={BookOpen}
              title="Curated Courses"
              description="Access high-quality learning materials structured for your specific path."
            />
            <FeatureCard
              icon={FileText}
              title="Resume Builder"
              description="Generate a professional resume automatically based on your profile and progress."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Sparkles className="w-5 h-5 text-stone-900" />
            <span className="text-lg font-bold tracking-tight">CareerPath AI</span>
          </div>
          <p className="text-sm text-stone-500">© 2026 CareerPath AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="flex flex-col items-start p-8 bg-stone-50 rounded-3xl border border-stone-100 hover:border-stone-300 transition-all group">
      <div className="p-3 bg-white rounded-2xl border border-stone-200 mb-6 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-stone-900" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-stone-600 leading-relaxed">{description}</p>
    </div>
  );
}
