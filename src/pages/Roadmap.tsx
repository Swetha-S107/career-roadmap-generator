import { useState, useEffect } from 'react';
import { useUser } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Map, Calendar, CheckCircle2, Loader2, ArrowRight, Download, Flag, Trophy, Target, BookOpen } from 'lucide-react';
import { generateRoadmap } from '../lib/gemini';

export default function Roadmap() {
  const { user, updateUser } = useUser();
  const [duration, setDuration] = useState('1_month');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<any>(user?.roadmap || null);

  const handleGenerate = async () => {
    if (!user?.profile || user.testScore === undefined) return;
    setLoading(true);
    try {
      const qRes = await fetch('/api/questions');
      const allQs = await qRes.json();
      const userSkills = user.profile.skills?.toLowerCase() || '';
      const filteredQs = allQs.filter((q: any) => 
        userSkills.includes(q.skill.toLowerCase()) || q.skill === 'Aptitude'
      );
      const totalQs = filteredQs.length > 0 ? filteredQs.length : allQs.filter((q: any) => q.skill === 'Aptitude').length;

      const generated = await generateRoadmap(user.profile, user.testScore, duration, totalQs);
      setRoadmap(generated);
      
      await fetch('/api/user/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, roadmap: generated }),
      });
      updateUser({ roadmap: generated });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-8">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-stone-900 animate-spin" />
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-400 animate-pulse" />
        </div>
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-stone-900">Crafting Your Path...</h2>
          <p className="text-stone-500 mt-3 text-lg leading-relaxed">
            Our AI is analyzing your {user?.testScore ? 'test results' : 'profile'} and skills to build a professional roadmap just for you.
          </p>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="max-w-3xl mx-auto space-y-12 py-12">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-stone-100 rounded-3xl mb-4">
            <Map className="w-10 h-10 text-stone-900" />
          </div>
          <h1 className="text-4xl font-bold text-stone-900 tracking-tight">Your Career Journey Starts Here</h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Select a duration that fits your schedule. We'll generate a comprehensive, step-by-step guide to help you reach your goals.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { id: '1_week', title: '1 Week', desc: 'Intensive Sprint', icon: Target },
            { id: '1_month', title: '1 Month', desc: 'Balanced Learning', icon: Calendar },
            { id: '3_months', title: '3 Months', desc: 'Deep Mastery', icon: Trophy }
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setDuration(d.id)}
              className={`p-8 rounded-[2.5rem] border-2 transition-all text-left group relative overflow-hidden ${
                duration === d.id
                  ? 'border-stone-900 bg-stone-900 text-white shadow-2xl'
                  : 'border-stone-200 bg-white hover:border-stone-400 text-stone-900'
              }`}
            >
              <d.icon className={`w-8 h-8 mb-6 ${duration === d.id ? 'text-white' : 'text-stone-400'}`} />
              <h3 className="font-bold text-xl">{d.title}</h3>
              <p className={`text-sm mt-2 leading-relaxed ${duration === d.id ? 'text-stone-400' : 'text-stone-500'}`}>
                {d.desc}
              </p>
              {duration === d.id && (
                <motion.div
                  layoutId="active-bg"
                  className="absolute top-0 right-0 p-4"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </motion.div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          className="w-full py-5 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all flex items-center justify-center shadow-xl group"
        >
          Generate Personalized Roadmap 
          <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-stone-500 text-sm font-bold uppercase tracking-widest">
            <Flag className="w-4 h-4" />
            <span>{user?.profile?.domain} • Mentor-Guided Path</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900">{roadmap.title}</h1>
          <p className="text-stone-500 text-lg max-w-2xl leading-relaxed">
            Personalized roadmap for <span className="text-stone-900 font-bold">{user?.profile?.primarySkill}</span>. {roadmap.summary}
          </p>
        </div>
        <button
          onClick={() => setRoadmap(null)}
          className="px-8 py-3 bg-stone-100 text-stone-900 text-sm font-bold rounded-xl hover:bg-stone-200 transition-colors flex items-center"
        >
          Regenerate Roadmap
        </button>
      </header>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-stone-900 via-stone-200 to-transparent rounded-full hidden md:block" />

        <div className="space-y-16">
          {roadmap.weeks.map((week: any, index: number) => (
            <motion.div
              key={week.week}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative md:pl-20"
            >
              {/* Timeline Marker */}
              <div className="absolute left-0 top-0 w-12 h-12 bg-white border-4 border-stone-900 rounded-full flex items-center justify-center z-10 shadow-lg hidden md:flex">
                <span className="text-sm font-black text-stone-900">{week.week}</span>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-stone-200 shadow-sm hover:shadow-xl transition-shadow group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-stone-400 uppercase tracking-widest">Week {week.week} Milestone</span>
                    <h3 className="text-2xl font-bold text-stone-900 group-hover:text-stone-700 transition-colors">{week.focus}</h3>
                  </div>
                  <div className="flex items-center space-x-2 px-4 py-2 bg-stone-50 rounded-full border border-stone-100">
                    <BookOpen className="w-4 h-4 text-stone-400" />
                    <span className="text-xs font-bold text-stone-600">{week.topics.length} Topics</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {week.topics.map((topic: string, tIdx: number) => (
                    <motion.div
                      key={topic}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (index * 0.1) + (tIdx * 0.05) }}
                      className="flex items-center p-5 bg-stone-50 rounded-2xl border border-stone-100 hover:border-stone-300 hover:bg-white transition-all cursor-default"
                    >
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-4 shadow-sm border border-stone-100">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                      <span className="text-sm font-bold text-stone-700">{topic}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="pt-12 text-center">
        <div className="inline-flex items-center space-x-4 p-6 bg-stone-900 text-white rounded-3xl shadow-2xl">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Trophy className="w-8 h-8 text-amber-400" />
          </div>
          <div className="text-left">
            <h4 className="font-bold text-lg">Goal Reached!</h4>
            <p className="text-stone-400 text-sm">Complete all weeks to unlock your certificate.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
