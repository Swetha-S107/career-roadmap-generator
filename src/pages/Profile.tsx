import { useUser } from '../App';
import { motion } from 'motion/react';
import { User, Mail, GraduationCap, Code, Heart, Link as LinkIcon, Github, Linkedin, Briefcase } from 'lucide-react';

export default function Profile() {
  const { user } = useUser();

  if (!user?.profile) return null;

  const profile = user.profile;

  const sections = [
    {
      title: 'Personal Information',
      icon: User,
      items: [
        { label: 'Full Name', value: user.name, icon: User },
        { label: 'Email Address', value: user.email, icon: Mail },
        { label: 'Career Domain', value: profile.domain, icon: Briefcase },
        { label: 'User Type', value: profile.type.replace('_', ' ').toUpperCase(), icon: Briefcase },
      ]
    },
    {
      title: 'Education & Skills',
      icon: GraduationCap,
      items: [
        { label: 'Education', value: profile.education, icon: GraduationCap },
        { label: 'Primary Skill', value: profile.primarySkill, icon: Code },
        { label: 'Other Skills', value: profile.skills, icon: Code },
      ]
    },
    {
      title: 'Interests & Links',
      icon: Heart,
      items: [
        { label: 'Interests', value: profile.interests, icon: Heart },
        { label: 'GitHub', value: profile.github || 'Not provided', icon: Github, isLink: !!profile.github },
        { label: 'LinkedIn', value: profile.linkedin || 'Not provided', icon: Linkedin, isLink: !!profile.linkedin },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header className="flex items-center space-x-6">
        <div className="w-24 h-24 bg-stone-900 text-white rounded-3xl flex items-center justify-center text-4xl font-black shadow-xl">
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-4xl font-bold text-stone-900 tracking-tight">{user.name}</h1>
          <p className="text-stone-500 text-lg">{user.email}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-sm ${idx === 2 ? 'md:col-span-2' : ''}`}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-2 bg-stone-50 rounded-xl">
                <section.icon className="w-5 h-5 text-stone-900" />
              </div>
              <h2 className="text-xl font-bold text-stone-900">{section.title}</h2>
            </div>

            <div className={`grid gap-6 ${idx === 2 ? 'md:grid-cols-3' : ''}`}>
              {section.items.map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{item.label}</p>
                  {item.isLink && item.value !== 'Not provided' ? (
                    <a 
                      href={item.value.startsWith('http') ? item.value : `https://${item.value}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-900 font-bold flex items-center hover:text-stone-600 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-stone-900 font-bold">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
