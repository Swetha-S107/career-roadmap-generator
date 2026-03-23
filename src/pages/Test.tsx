import { useState, useEffect } from 'react';
import { useUser } from '../App';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, ArrowRight, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Test() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user, updateUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => {
        // Filter questions based on primary skill or domain
        const primarySkill = user?.profile?.primarySkill || 'Python';
        const domain = user?.profile?.domain || 'Software/Engineering';
        
        let filtered = data.filter((q: any) => 
          q.skill.toLowerCase() === primarySkill.toLowerCase()
        );
        
        // If no questions for specific skill, fallback to domain-related skills
        if (filtered.length === 0) {
          // This is a simple fallback, in a real app we'd have a mapping
          filtered = data.filter((q: any) => 
            q.skill.toLowerCase().includes(domain.toLowerCase()) || 
            domain.toLowerCase().includes(q.skill.toLowerCase())
          );
        }
        
        // Ensure exactly 10 questions, shuffle if possible (simple shuffle)
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 10));
        setLoading(false);
      });
  }, [user?.profile?.primarySkill, user?.profile?.domain]);

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [questions[currentIdx].id]: answer });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);

    try {
      await fetch('/api/user/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, score: correct }),
      });
      updateUser({ testScore: correct });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
      <p className="text-stone-500 font-medium">Preparing your {user?.profile?.domain} evaluation...</p>
    </div>
  );

  if (questions.length === 0) return (
    <div className="max-w-xl mx-auto text-center py-20 space-y-6">
      <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto">
        <AlertCircle className="w-10 h-10 text-stone-400" />
      </div>
      <h2 className="text-3xl font-bold text-stone-900">Evaluation Unavailable</h2>
      <p className="text-stone-500 text-lg">
        We're still crafting the evaluation for <span className="text-stone-900 font-bold">{user?.profile?.primarySkill}</span>. 
        Please check back soon or try another skill.
      </p>
      <button 
        onClick={() => navigate('/form')}
        className="px-8 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all"
      >
        Update Profile
      </button>
    </div>
  );

  if (submitted) {
    const percentage = (score / questions.length) * 100;
    const level = percentage <= 40 ? 'Beginner' : percentage <= 75 ? 'Intermediate' : 'Advanced';
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-20 bg-white rounded-3xl border border-stone-200 shadow-sm p-10"
      >
        <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-4">Test Completed!</h1>
        <div className="inline-flex items-center px-4 py-2 bg-stone-900 text-white rounded-full text-sm font-black uppercase tracking-widest mb-6">
          Level: {level}
        </div>
        <p className="text-stone-500 mb-8 text-lg">
          You scored <span className="text-stone-900 font-bold">{score} out of {questions.length}</span>.
          We've categorized you as <span className="text-stone-900 font-bold">{level}</span>. 
          Your roadmap will be tailored to this level.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-8 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/roadmap')}
            className="w-full sm:w-auto px-8 py-3 bg-white border border-stone-200 text-stone-900 font-bold rounded-xl hover:bg-stone-50 transition-colors"
          >
            Generate Roadmap
          </button>
        </div>
      </motion.div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Career Readiness Evaluation</h1>
          <div className="flex items-center space-x-2 mt-1">
            <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-[10px] font-black uppercase tracking-widest rounded">
              {user?.profile?.domain}
            </span>
            <span className="text-stone-400">•</span>
            <p className="text-stone-500 text-sm font-medium">Evaluating: {user?.profile?.primarySkill}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-stone-100 rounded-full text-sm font-medium text-stone-600">
          <Timer className="w-4 h-4" />
          <span>Question {currentIdx + 1} of {questions.length}</span>
        </div>
      </header>

      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          className="h-full bg-stone-900"
        />
      </div>

      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-10 rounded-3xl border border-stone-200 shadow-sm"
      >
        <span className="inline-block px-3 py-1 bg-stone-100 text-stone-600 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
          {currentQ.category}
        </span>
        <h2 className="text-xl font-bold text-stone-900 mb-8 leading-relaxed">
          {currentQ.question}
        </h2>

        <div className="space-y-4">
          {currentQ.options.map((option: string) => {
            const isSelected = answers[currentQ.id] === option;
            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`w-full p-5 text-left rounded-2xl border transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-200 bg-stone-50 hover:border-stone-400 text-stone-700'
                }`}
              >
                <span className="font-medium">{option}</span>
                {isSelected && <CheckCircle2 className="w-5 h-5" />}
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!answers[currentQ.id]}
            className="px-8 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all flex items-center disabled:opacity-50"
          >
            {currentIdx === questions.length - 1 ? 'Finish Test' : 'Next Question'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
