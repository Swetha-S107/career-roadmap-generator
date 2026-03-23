import { useState, useEffect } from 'react';
import { useUser } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle2, ChevronRight, PlayCircle, X, BarChart, Clock, Info, GraduationCap, Lock, Unlock, Trophy, FileText, ArrowRight } from 'lucide-react';

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, updateUser } = useUser();

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        // Filter courses based on user's domain and skill
        let filteredData = data;
        if (user?.profile?.domain) {
          filteredData = data.filter((course: any) => course.domain === user.profile.domain);
          
          // If a primary skill is selected, prioritize it or filter further if needed
          // For now, filtering by domain is the primary requirement
          if (user?.profile?.primarySkill) {
            // We can optionally show only the specific skill course if it exists
            // or just keep the domain filter which is more broad.
            // The user requested: "If user selects a specific skill within a career: Show only that course content"
            const skillMatch = filteredData.filter((course: any) => course.skill === user.profile.primarySkill);
            if (skillMatch.length > 0) {
              filteredData = skillMatch;
            }
          }
        }
        setCourses(filteredData);
        setLoading(false);
      });
  }, [user?.profile?.domain, user?.profile?.primarySkill]);

  const handleMarkAsCompleted = async (courseId: string, week: number, day: number) => {
    if (!user) return;
    const topicId = `${courseId}-${week}-${day}`;
    
    try {
      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, courseId, topicId }),
      });
      
      if (response.ok) {
        const data = await response.json();
        updateUser({ courseProgress: data.progress });
        
        // Find next topic
        const currentCourse = courses.find(c => c.id === courseId);
        if (currentCourse) {
          let foundCurrent = false;
          let nextTopic = null;
          
          for (const month of currentCourse.months) {
            for (const w of month.weeks) {
              for (const d of w.days) {
                if (foundCurrent) {
                  nextTopic = { ...d, week: w.week, courseId };
                  break;
                }
                if (w.week === week && d.day === day) {
                  foundCurrent = true;
                }
              }
              if (nextTopic) break;
            }
            if (nextTopic) break;
          }
          
          if (nextTopic) {
            setSelectedTopic(nextTopic);
          } else {
            setSelectedTopic(null);
          }
        }
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const isTopicCompleted = (courseId: string, week: number, day: number) => {
    const topicId = `${courseId}-${week}-${day}`;
    return user?.courseProgress?.[courseId]?.includes(topicId);
  };

  const getCourseProgress = (course: any) => {
    if (!user?.courseProgress?.[course.id]) return 0;
    let totalTopics = 0;
    course.months.forEach((m: any) => {
      m.weeks.forEach((w: any) => {
        totalTopics += w.days.length;
      });
    });
    const completedTopics = user.courseProgress[course.id].length;
    return Math.round((completedTopics / totalTopics) * 100);
  };

  const isWeekCompleted = (courseId: string, week: any) => {
    if (!week || !week.days) return false;
    return week.days.every((day: any) => isTopicCompleted(courseId, week.week, day.day));
  };

  const isWeekUnlocked = (course: any, weekIndex: number, monthIndex: number) => {
    // First week of first month is always unlocked
    if (monthIndex === 0 && weekIndex === 0) return true;
    
    // Check if previous week is completed
    let prevWeek;
    if (weekIndex > 0) {
      prevWeek = course.months[monthIndex].weeks[weekIndex - 1];
    } else {
      const prevMonth = course.months[monthIndex - 1];
      prevWeek = prevMonth.weeks[prevMonth.weeks.length - 1];
    }
    
    return isWeekCompleted(course.id, prevWeek);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
      <p className="text-stone-500 font-medium">Loading your courses...</p>
    </div>
  );

  // Topic View
  if (selectedTopic) {
    const isCompleted = isTopicCompleted(selectedTopic.courseId, selectedTopic.week, selectedTopic.day);
    
    return (
      <div className="space-y-8 pb-20">
        <button
          onClick={() => setSelectedTopic(null)}
          className="flex items-center text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors group"
        >
          <ChevronRight className="w-4 h-4 mr-1 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Course Overview
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] border border-stone-200 shadow-xl overflow-hidden"
        >
          <header className="p-8 md:p-12 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-stone-50/50">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-3 py-1 bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                  Week {selectedTopic.week}
                </span>
                <span className="px-3 py-1 bg-stone-200 text-stone-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Day {selectedTopic.day}
                </span>
                {isCompleted && (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-bold text-stone-900 tracking-tight">{selectedTopic.topic}</h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Course Progress</p>
                <p className="text-sm font-bold text-stone-900">{getCourseProgress(courses.find(c => c.id === selectedTopic.courseId))}%</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-2xl border border-stone-200 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-stone-900" />
              </div>
            </div>
          </header>

          <div className="p-8 md:p-12 space-y-12">
            <section className="space-y-6">
              <div className="flex items-center space-x-3 text-stone-900">
                <div className="p-2 bg-stone-100 rounded-xl">
                  <Info className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">Concept Overview</h3>
              </div>
              <div className="prose prose-stone max-w-none">
                <p className="text-stone-600 leading-relaxed text-lg">
                  {selectedTopic.content}
                </p>
              </div>
            </section>

            {selectedTopic.syntax && (
              <section className="space-y-6">
                <div className="flex items-center space-x-3 text-stone-900">
                  <div className="p-2 bg-stone-100 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold">Syntax & Structure</h3>
                </div>
                <div className="bg-stone-50 p-8 rounded-3xl border border-stone-200 font-mono text-sm text-stone-700 relative group">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Reference</span>
                  </div>
                  <code className="block whitespace-pre-wrap">{selectedTopic.syntax}</code>
                </div>
              </section>
            )}

            {selectedTopic.use_case && (
              <section className="space-y-6">
                <div className="flex items-center space-x-3 text-stone-900">
                  <div className="p-2 bg-stone-100 rounded-xl">
                    <BarChart className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold">Real-World Application</h3>
                </div>
                <div className="bg-stone-50/50 p-8 rounded-3xl border border-stone-100">
                  <p className="text-stone-600 leading-relaxed text-lg italic">
                    "{selectedTopic.use_case}"
                  </p>
                </div>
              </section>
            )}

            <section className="space-y-6">
              <div className="flex items-center space-x-3 text-stone-900">
                <div className="p-2 bg-stone-100 rounded-xl">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">Code Example</h3>
              </div>
              <div className="bg-stone-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-8 py-4 bg-stone-800/50 border-b border-white/5">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/40" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/40" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/40" />
                  </div>
                  <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Interactive Playground</span>
                </div>
                <div className="p-10">
                  <pre className="text-emerald-400 font-mono text-sm leading-relaxed overflow-x-auto">
                    <code>{selectedTopic.example}</code>
                  </pre>
                </div>
              </div>
            </section>
          </div>

          <footer className="p-8 md:p-12 border-t border-stone-100 bg-stone-50/50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <button
              onClick={() => setSelectedTopic(null)}
              className="text-sm font-bold text-stone-500 hover:text-stone-900 transition-colors"
            >
              Exit Lesson
            </button>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {isCompleted ? (
                <div className="flex-1 sm:flex-none flex items-center justify-center px-10 py-4 bg-emerald-50 text-emerald-600 font-bold rounded-2xl border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Completed
                </div>
              ) : (
                <button
                  onClick={() => handleMarkAsCompleted(selectedTopic.courseId, selectedTopic.week, selectedTopic.day)}
                  className="flex-1 sm:flex-none px-10 py-4 bg-stone-900 text-white font-bold rounded-2xl hover:bg-stone-800 transition-all shadow-xl shadow-stone-200 flex items-center justify-center group"
                >
                  Mark as Completed
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </footer>
        </motion.div>
      </div>
    );
  }

  // Course Detail View
  if (selectedCourse) {
    return (
      <div className="space-y-8 pb-20">
        <button
          onClick={() => setSelectedCourse(null)}
          className="flex items-center text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ChevronRight className="w-4 h-4 mr-1 rotate-180" /> Back to Courses
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] border border-stone-200 shadow-sm"
        >
          <header className="p-8 md:p-12 bg-white border-b border-stone-200">
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center space-x-3">
                  <span className="px-4 py-1.5 bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                    {selectedCourse.difficulty}
                  </span>
                  <span className="flex items-center text-sm font-bold text-stone-500">
                    <Clock className="w-4 h-4 mr-2" /> {selectedCourse.duration}
                  </span>
                </div>
                <h2 className="text-4xl font-bold text-stone-900 tracking-tight">{selectedCourse.title}</h2>
                <p className="text-stone-500 text-lg leading-relaxed">{selectedCourse.overview}</p>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <BarChart className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Progress</p>
                  <p className="text-sm font-bold text-stone-900">{getCourseProgress(selectedCourse)}% Complete</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Certificate</p>
                  <p className="text-sm font-bold text-stone-900">Included</p>
                </div>
              </div>
            </div>
          </header>

          <div className="p-8 md:p-12 space-y-12">
            {getCourseProgress(selectedCourse) === 100 && (
              <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-[2rem] text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 mb-2">Course Completed!</h3>
                <p className="text-emerald-700">Congratulations! You've mastered all the topics in this course.</p>
              </div>
            )}

            {selectedCourse.months.map((month: any, mIdx: number) => (
              <div key={month.month} className="space-y-8">
                <div className="flex items-center space-x-4">
                  <div className="h-px flex-1 bg-stone-200" />
                  <h3 className="text-sm font-black text-stone-400 uppercase tracking-[0.2em]">Month {month.month}: {month.title}</h3>
                  <div className="h-px flex-1 bg-stone-200" />
                </div>

                <div className="grid grid-cols-1 gap-10">
                  {month.weeks.map((week: any, wIdx: number) => {
                    const unlocked = isWeekUnlocked(selectedCourse, wIdx, mIdx);
                    const completed = isWeekCompleted(selectedCourse.id, week);
                    
                    return (
                      <div key={week.week} className={`space-y-6 ${!unlocked ? 'opacity-50' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 ${completed ? 'bg-emerald-500' : unlocked ? 'bg-stone-900' : 'bg-stone-300'} text-white rounded-full flex items-center justify-center text-xs font-bold`}>
                              {completed ? <CheckCircle2 className="w-4 h-4" /> : week.week}
                            </div>
                            <h4 className="text-xl font-bold text-stone-900">Week {week.week}: {week.title}</h4>
                          </div>
                          {!unlocked && (
                            <div className="flex items-center text-stone-400 text-xs font-bold uppercase tracking-widest">
                              <Lock className="w-3 h-3 mr-1" /> Locked
                            </div>
                          )}
                          {unlocked && !completed && (
                            <div className="flex items-center text-stone-900 text-xs font-bold uppercase tracking-widest">
                              <Unlock className="w-3 h-3 mr-1" /> In Progress
                            </div>
                          )}
                          {completed && (
                            <div className="flex items-center text-emerald-600 text-xs font-bold uppercase tracking-widest">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {week.days.map((day: any) => {
                            const topicDone = isTopicCompleted(selectedCourse.id, week.week, day.day);
                            return (
                              <button
                                key={day.day}
                                disabled={!unlocked}
                                onClick={() => setSelectedTopic({ ...day, week: week.week, courseId: selectedCourse.id })}
                                className={`flex items-center justify-between p-6 bg-white rounded-3xl border ${topicDone ? 'border-emerald-200 bg-emerald-50/30' : 'border-stone-200'} hover:border-stone-900 hover:shadow-xl transition-all group text-left disabled:cursor-not-allowed`}
                              >
                                <div className="flex items-center space-x-4">
                                  <div className={`w-12 h-12 ${topicDone ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-50'} border border-stone-100 rounded-2xl flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-colors`}>
                                    {topicDone ? <CheckCircle2 className="w-6 h-6" /> : <span className="text-xs font-black">D{day.day}</span>}
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-0.5">Day {day.day}</p>
                                    <p className={`font-bold ${topicDone ? 'text-emerald-900' : 'text-stone-900'}`}>{day.topic}</p>
                                  </div>
                                </div>
                                {unlocked ? (
                                  <PlayCircle className={`w-6 h-6 ${topicDone ? 'text-emerald-400' : 'text-stone-200'} group-hover:text-stone-900 transition-colors`} />
                                ) : (
                                  <Lock className="w-5 h-5 text-stone-200" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Course List View
  return (
    <div className="space-y-12 pb-20">
      <header className="space-y-2">
        <div className="flex items-center space-x-2 mb-2">
          <span className="px-3 py-1 bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
            {user?.profile?.domain || 'All Domains'}
          </span>
          {user?.profile?.primarySkill && (
            <span className="px-3 py-1 bg-stone-200 text-stone-600 text-[10px] font-black uppercase tracking-widest rounded-full">
              {user.profile.primarySkill}
            </span>
          )}
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-stone-900">Learning Center</h1>
        <p className="text-stone-500 text-lg">
          {user?.profile?.domain 
            ? `Explore professional courses structured for your ${user.profile.domain} career path.`
            : 'Explore professional courses structured for your career growth.'}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {courses.map((course, index) => {
          const progress = getCourseProgress(course);
          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col p-8 bg-white rounded-[2.5rem] border border-stone-200 hover:border-stone-900 hover:shadow-2xl transition-all text-left"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="px-3 py-1 bg-stone-100 text-stone-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-stone-200">
                    {course.difficulty}
                  </span>
                  <span className="flex items-center text-xs font-bold text-stone-400">
                    <Clock className="w-3 h-3 mr-1" /> {course.duration}
                  </span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 text-stone-900">{course.title}</h3>
              <p className="text-stone-500 mb-6 leading-relaxed flex-1">{course.description}</p>
              
              <div className="mb-8 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-stone-400">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-stone-900" 
                  />
                </div>
              </div>

              <button
                onClick={() => setSelectedCourse(course)}
                className="w-full py-4 bg-stone-50 text-stone-900 font-bold rounded-2xl hover:bg-stone-900 hover:text-white transition-all flex items-center justify-center group/btn"
              >
                {progress === 100 ? 'Review Course' : progress > 0 ? 'Continue Learning' : 'Start Learning'} 
                <ChevronRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
