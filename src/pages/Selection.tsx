import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GraduationCap, School, Briefcase, ArrowRight } from 'lucide-react';

const userTypes = [
  { id: 'school', title: 'School Student', icon: School, description: 'Class 1 to 12 students exploring their future.' },
  { id: 'college', title: 'College Student', icon: GraduationCap, description: 'Undergraduate or postgraduate students building skills.' },
  { id: 'passed_out', title: 'Passed Out', icon: Briefcase, description: 'Graduates looking for career transitions or growth.' },
];

export default function Selection() {
  const navigate = useNavigate();

  const handleSelect = (type: string) => {
    navigate(`/form?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 mb-4">Who are you?</h1>
          <p className="text-stone-600 text-lg">Select your current status to personalize your experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {userTypes.map((type, index) => (
            <motion.button
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleSelect(type.id)}
              className="group flex flex-col items-start p-8 bg-white rounded-3xl border border-stone-200 hover:border-stone-900 hover:shadow-xl transition-all text-left"
            >
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 mb-6 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                <type.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-stone-900">{type.title}</h3>
              <p className="text-stone-500 mb-8 flex-1">{type.description}</p>
              <div className="flex items-center text-sm font-bold text-stone-900 group-hover:translate-x-2 transition-transform">
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
