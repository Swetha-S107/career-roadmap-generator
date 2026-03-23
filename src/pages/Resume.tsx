import { useUser } from '../App';
import { motion } from 'motion/react';
import { Printer, Mail, Phone, Github, Linkedin, MapPin, Briefcase, GraduationCap, Code, Sparkles, Trophy, RefreshCw, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';
import { generateResume } from '../lib/gemini';

export default function Resume() {
  const { user, updateUser } = useUser();
  const profile = user?.profile;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile && !user.resume) {
      handleGenerate();
    }
  }, [profile, user.resume]);

  const handleGenerate = async () => {
    if (!profile || !user?.email || !user?.id) return;
    setLoading(true);
    try {
      const resumeData = await generateResume(profile, user.email);
      
      // Save to backend
      const response = await fetch('/api/user/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, resume: resumeData }),
      });

      if (!response.ok) throw new Error('Failed to save resume');
      
      updateUser({ resume: resumeData });
    } catch (error) {
      console.error('Failed to generate resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!profile) return <div className="flex items-center justify-center h-64">Complete your profile to generate a resume.</div>;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-stone-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-stone-900 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-stone-900">Crafting Your Professional Resume</h2>
          <p className="text-stone-500 mt-2">Our AI is expanding your profile into an industry-standard format...</p>
        </div>
      </div>
    );
  }

  const resume = user.resume;

  return (
    <div className="min-h-screen space-y-10 pb-20 overflow-y-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-stone-50/80 backdrop-blur-md py-4 z-20">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Professional Resume</h1>
          <p className="text-stone-500 mt-1">AI-enhanced and ready for your next career move.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            className="px-6 py-3 bg-white text-stone-900 border border-stone-200 font-bold rounded-xl hover:bg-stone-50 transition-all flex items-center justify-center shadow-sm"
          >
            <RefreshCw className="mr-2 w-4 h-4" /> Regenerate
          </button>
          <button
            onClick={handlePrint}
            className="px-8 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all flex items-center justify-center shadow-lg"
          >
            <Printer className="mr-2 w-5 h-5" /> Print / Save as PDF
          </button>
        </div>
      </header>

      {resume ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-16 rounded-[2.5rem] border border-stone-200 shadow-2xl max-w-5xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0"
          id="resume-content"
        >
          {/* Resume Header */}
          <div className="border-b-2 border-stone-100 pb-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="space-y-1">
                <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">{profile.name}</h2>
                <p className="text-base text-stone-500 font-medium tracking-wide uppercase">{profile.domain} Specialist</p>
              </div>
              <div className="grid grid-cols-1 gap-1 text-stone-600 text-[10px] font-medium md:text-right">
                <div className="flex items-center md:justify-end"><Mail className="w-3 h-3 mr-1.5 text-stone-400" /> {user?.email}</div>
                <div className="flex items-center md:justify-end"><Phone className="w-3 h-3 mr-1.5 text-stone-400" /> {profile.phone}</div>
                {profile.github && <div className="flex items-center md:justify-end"><Github className="w-3 h-3 mr-1.5 text-stone-400" /> {profile.github.replace('https://', '')}</div>}
                {profile.linkedin && <div className="flex items-center md:justify-end"><Linkedin className="w-3 h-3 mr-1.5 text-stone-400" /> {profile.linkedin.replace('https://', '')}</div>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Column - Sidebar */}
            <div className="md:col-span-4 space-y-6">
              <section>
                <h3 className="text-[9px] font-black text-stone-900 uppercase tracking-[0.2em] mb-3 flex items-center">
                  <Code className="w-3 h-3 mr-2" /> Core Skills
                </h3>
                <div className="space-y-3">
                  {resume.skills?.map((skillGroup: any, idx: number) => (
                    <div key={idx} className="space-y-1.5">
                      <h4 className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">{skillGroup.category}</h4>
                      <div className="flex flex-wrap gap-1">
                        {skillGroup.items.map((skill: string, sIdx: number) => (
                          <span key={sIdx} className="px-1.5 py-0.5 bg-stone-50 text-stone-700 text-[9px] font-bold rounded border border-stone-100">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[9px] font-black text-stone-900 uppercase tracking-[0.2em] mb-3 flex items-center">
                  <Trophy className="w-3 h-3 mr-2" /> Achievements
                </h3>
                <ul className="space-y-2">
                  {resume.achievements?.map((achievement: string, idx: number) => (
                    <li key={idx} className="flex items-start text-[10px] text-stone-600 leading-tight">
                      <span className="w-1 h-1 bg-stone-900 rounded-full mt-1.5 mr-2 shrink-0" />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-[9px] font-black text-stone-900 uppercase tracking-[0.2em] mb-3 flex items-center">
                  <MapPin className="w-3 h-3 mr-2" /> Interests
                </h3>
                <div className="flex flex-wrap gap-x-2 gap-y-1">
                  {profile.interests && typeof profile.interests === 'string' ? profile.interests.split(',').map((interest: string) => (
                    <span key={interest} className="text-[10px] text-stone-500 font-medium italic">
                      #{interest.trim().replace(/\s+/g, '')}
                    </span>
                  )) : (
                    <span className="text-[10px] text-stone-400 italic">No interests specified</span>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column - Main Content */}
            <div className="md:col-span-8 space-y-6">
              <section>
                <h3 className="text-[9px] font-black text-stone-900 uppercase tracking-[0.2em] mb-2 flex items-center">
                  <Sparkles className="w-3 h-3 mr-2" /> Professional Summary
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed font-serif italic">
                  "{resume.summary}"
                </p>
              </section>

              <section>
                <h3 className="text-[9px] font-black text-stone-900 uppercase tracking-[0.2em] mb-4 flex items-center">
                  <Briefcase className="w-3 h-3 mr-2" /> Experience & Internships
                </h3>
                <div className="space-y-4">
                  {resume.experience?.map((exp: any, idx: number) => (
                    <div key={idx} className="relative pl-5 border-l border-stone-200">
                      <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 bg-stone-900 rounded-full" />
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className="text-sm font-bold text-stone-900">{exp.title}</h4>
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">{exp.duration}</span>
                      </div>
                      <p className="text-stone-500 font-bold text-[10px] mb-1.5">{exp.organization}</p>
                      <ul className="space-y-1">
                        {exp.responsibilities.map((resp: string, rIdx: number) => (
                          <li key={rIdx} className="text-[10px] text-stone-600 leading-tight flex items-start">
                            <span className="mr-2 text-stone-300">•</span>
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[9px] font-black text-stone-900 uppercase tracking-[0.2em] mb-4 flex items-center">
                  <Layers className="w-3 h-3 mr-2" /> Key Projects
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {resume.projects?.map((project: any, idx: number) => (
                    <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <div className="flex justify-between items-start mb-1.5">
                        <h4 className="text-sm font-bold text-stone-900">{project.title}</h4>
                        <span className="px-1.5 py-0.5 bg-white text-[8px] font-black text-stone-400 uppercase tracking-widest rounded-full border border-stone-100">
                          {project.techStack}
                        </span>
                      </div>
                      <ul className="space-y-0.5">
                        {project.description.map((desc: string, dIdx: number) => (
                          <li key={dIdx} className="text-[10px] text-stone-600 leading-tight flex items-start">
                            <span className="mr-2 text-stone-300">›</span>
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-[9px] font-black text-stone-900 uppercase tracking-[0.2em] mb-4 flex items-center">
                  <GraduationCap className="w-3 h-3 mr-2" /> Education
                </h3>
                <div className="space-y-3">
                  {resume.education?.map((edu: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-stone-900">{edu.degree}</h4>
                        <p className="text-stone-500 font-bold text-[10px]">{edu.institution}</p>
                        <p className="text-stone-400 text-[9px] mt-0.5">{edu.details}</p>
                      </div>
                      <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">{edu.duration}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-dashed border-stone-200">
          <p className="text-stone-500">No resume generated yet.</p>
          <button
            onClick={handleGenerate}
            className="mt-4 px-6 py-2 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-all"
          >
            Generate Now
          </button>
        </div>
      )}

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-content, #resume-content * {
            visibility: visible;
          }
          #resume-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 40px;
            box-shadow: none !important;
            border: none !important;
          }
          header, .flex.gap-3, .pb-20 {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
