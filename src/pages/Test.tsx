import { useState, useEffect } from 'react';
import { useUser } from '../App';
import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
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

  // ✅ ONLY prevent re-entering test (NO redirect to selection)
  useEffect(() => {
    if (user?.testCompleted) {
      navigate('/roadmap'); // ✅ direct roadmap only
    }
  }, []);

  // ✅ Fetch questions
  useEffect(() => {
    if (submitted) return;

    fetch('/api/questions')
      .then(res => res.json())
      .then(data => {
        const primarySkill = user?.profile?.primarySkill || 'Python';
        const domain = user?.profile?.domain || 'Software/Engineering';
        
        let filtered = data.filter((q: any) => 
          q.skill.toLowerCase() === primarySkill.toLowerCase()
        );
        
        if (filtered.length === 0) {
          filtered = data.filter((q: any) => 
            q.skill.toLowerCase().includes(domain.toLowerCase()) || 
            domain.toLowerCase().includes(q.skill.toLowerCase())
          );
        }
        
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());
        setQuestions(shuffled.slice(0, 10));
        setLoading(false);
      });
  }, [user?.profile?.primarySkill, user?.profile?.domain, submitted]);

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

  // ✅ Submit only once
  const handleSubmit = async () => {
    if (submitted) return;

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

      // ✅ Save test completed
      updateUser({ testScore: correct, testCompleted: true });

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      Loading...
    </div>
  );

  if (questions.length === 0) return (
    <div className="text-center mt-20">
      <AlertCircle className="mx-auto mb-4" />
      <p>No questions available</p>
    </div>
  );

  // ✅ RESULT SCREEN (NO AUTO REDIRECT)
  if (submitted) {
    const percentage = (score / questions.length) * 100;
    const level =
      percentage <= 40 ? 'Beginner' :
      percentage <= 75 ? 'Intermediate' : 'Advanced';

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-20"
      >
        <CheckCircle2 className="mx-auto text-green-500 mb-4" size={40} />
        <h2 className="text-xl font-bold">Test Completed</h2>
        <p>Score: {score}/{questions.length}</p>
        <p>Level: {level}</p>

        <button
          onClick={() => navigate('/roadmap')}
          className="mt-4 px-6 py-2 bg-black text-white rounded"
        >
          Generate Roadmap
        </button>
      </motion.div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-lg font-bold mb-4">
        Question {currentIdx + 1} of {questions.length}
      </h2>

      <p className="mb-4">{currentQ.question}</p>

      {currentQ.options.map((option: string) => {
        const isSelected = answers[currentQ.id] === option;
        return (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className={`block w-full p-2 mb-2 border ${
              isSelected ? 'bg-black text-white' : ''
            }`}
          >
            {option}
          </button>
        );
      })}

      <button
        onClick={handleNext}
        disabled={!answers[currentQ.id]}
        className="mt-4 px-6 py-2 bg-black text-white rounded"
      >
        {currentIdx === questions.length - 1 ? 'Finish' : 'Next'}
      </button>
    </div>
  );
}