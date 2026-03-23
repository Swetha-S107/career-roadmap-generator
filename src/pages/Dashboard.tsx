import { useUser } from '../App';
import { motion } from 'motion/react';
import { Sparkles, Target, BookOpen, FileText, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useUser();

  const getActiveCourses = () => {
    if (!user?.courseProgress) return 0;
    return Object.keys(user.courseProgress).length;
  };

  const stats = [
    { label: 'Test Score', value: user?.testScore ? `${user.testScore}/10` : 'Not Taken', icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Roadmap', value: user?.roadmap ? 'Generated' : 'Not Started', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Courses', value: `${getActiveCourses()} Active`, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Resume', value: 'Ready', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Welcome back, {user?.name}!</h1>
          <div className="flex items-center space-x-2 mt-1">
            <span className="px-2 py-0.5 bg-stone-900 text-white text-[10px] font-black uppercase tracking-widest rounded">
              {user?.profile?.domain}
            </span>
            <p className="text-stone-500 text-sm font-medium">Your Career Mentor is ready to guide you.</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Link 
            to="/profile"
            className="px-4 py-2 bg-white border border-stone-200 text-stone-900 text-sm font-bold rounded-xl hover:bg-stone-50 transition-colors"
          >
            View Profile
          </Link>
          <div className="flex items-center space-x-2 px-4 py-2 bg-stone-100 rounded-full text-sm font-medium text-stone-600">
            <Clock className="w-4 h-4" />
            <span>Last updated: Today</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-white rounded-3xl border border-stone-200 shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-stone-500">{stat.label}</p>
            <p className="text-xl font-bold text-stone-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-stone-900">Recent Activity</h2>
          <div className="bg-white rounded-3xl border border-stone-200 divide-y divide-stone-100">
            <ActivityItem
              title="Profile Completed"
              time="2 hours ago"
              description="You successfully updated your professional profile."
              icon={CheckCircle2}
              color="text-emerald-500"
            />
            <ActivityItem
              title="New Course Recommendation"
              time="5 hours ago"
              description="Based on your skills, we recommend 'Advanced Python'."
              icon={Sparkles}
              color="text-purple-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-stone-900">Next Steps</h2>
          <div className="bg-stone-900 text-white p-8 rounded-3xl space-y-6">
            {!user?.testScore ? (
              <>
                <h3 className="text-lg font-bold">Take the Screening Test</h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  Evaluate your current skills to get a more accurate roadmap.
                </p>
                <Link
                  to="/test"
                  className="block w-full py-3 bg-white text-stone-900 text-center font-bold rounded-xl hover:bg-stone-100 transition-colors"
                >
                  Start Test
                </Link>
              </>
            ) : !user?.roadmap ? (
              <>
                <h3 className="text-lg font-bold">Generate Your Roadmap</h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  Your test score is ready! Now let's build your personalized path.
                </p>
                <Link
                  to="/roadmap"
                  className="block w-full py-3 bg-white text-stone-900 text-center font-bold rounded-xl hover:bg-stone-100 transition-colors"
                >
                  Create Roadmap
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold">Continue Learning</h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  You're doing great! Keep following your roadmap to reach your goals.
                </p>
                <Link
                  to="/courses"
                  className="block w-full py-3 bg-white text-stone-900 text-center font-bold rounded-xl hover:bg-stone-100 transition-colors"
                >
                  Go to Courses
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ title, time, description, icon: Icon, color }: any) {
  return (
    <div className="p-6 flex items-start space-x-4">
      <div className={`p-2 bg-stone-50 rounded-xl ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-bold text-stone-900">{title}</h4>
          <span className="text-xs text-stone-400">{time}</span>
        </div>
        <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
