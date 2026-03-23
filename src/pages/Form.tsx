import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../App';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

export default function Form() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'school';
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [formData, setFormData] = useState<any>({ type });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setFormData(user.profile);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, profile: formData }),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      const data = await response.json();
      updateUser({ profile: data.user.profile, resume: null });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };

    // Career-based skill suggestion logic
    if (name === 'domain') {
      if (value === 'Software/Engineering') {
        newFormData.primarySkill = 'Python'; // Default for software
      } else if (value === 'Banking') {
        newFormData.primarySkill = 'Banking Preparation';
      } else if (value === 'Government Jobs') {
        newFormData.primarySkill = 'IAS Preparation';
      } else if (value === 'Data Science') {
        newFormData.primarySkill = 'Python';
      } else if (value === 'Digital Marketing') {
        newFormData.primarySkill = 'Digital Marketing';
      }
    }

    setFormData(newFormData);
  };

  const getSkillLabel = () => {
    if (formData.domain === 'Government Jobs') return 'Primary Subject for Evaluation';
    if (formData.domain === 'Banking') return 'Preparation Focus';
    return 'Primary Skill (For Screening Test)';
  };

  const showSkillSelector = () => {
    return !['Government Jobs', 'Banking'].includes(formData.domain);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full">
        <button
          onClick={() => navigate('/selection')}
          className="flex items-center text-sm font-medium text-stone-600 hover:text-stone-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Selection
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-3xl border border-stone-200 shadow-sm"
        >
          <div className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 mb-2">Complete your profile</h1>
            <p className="text-stone-500">Tell us your career goals, and we'll guide you through the required skills and subjects.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-stone-700 ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>

              {type === 'school' && (
                <>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-stone-700 ml-1">School Name</label>
                    <input
                      type="text"
                      name="schoolName"
                      required
                      value={formData.schoolName || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                      placeholder="Greenwood High"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-stone-700 ml-1">Standard (Class)</label>
                    <input
                      type="text"
                      name="standard"
                      required
                      value={formData.standard || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                      placeholder="10th Grade"
                    />
                  </div>
                </>
              )}

              {type === 'college' && (
                <>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-stone-700 ml-1">Year</label>
                    <select
                      name="year"
                      required
                      value={formData.year || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                    >
                      <option value="">Select Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-stone-700 ml-1">Department</label>
                    <input
                      type="text"
                      name="department"
                      required
                      value={formData.department || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                      placeholder="Computer Science"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-stone-700 ml-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {(type === 'college' || type === 'passed_out') && (
                <>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-stone-700 ml-1">GitHub URL</label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-stone-700 ml-1">LinkedIn URL</label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-stone-700 ml-1">Years of Experience / Internships</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-stone-700 ml-1">Career Domain</label>
                <select
                  name="domain"
                  required
                  value={formData.domain || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                >
                  <option value="">Select Career Domain</option>
                  <option value="Software/Engineering">Software/Engineering</option>
                  <option value="Banking">Banking</option>
                  <option value="Government Jobs">Government Jobs (IAS, TNPSC, etc.)</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Other">Other Professional Fields</option>
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-stone-700 ml-1">{getSkillLabel()}</label>
                {showSkillSelector() ? (
                  <select
                    name="primarySkill"
                    required
                    value={formData.primarySkill || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all"
                  >
                    <option value="">Select Primary Skill</option>
                    <option value="Python">Python</option>
                    <option value="Java">Java</option>
                    <option value="Full Stack">Full Stack (Web Development)</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                  </select>
                ) : (
                  <div className="w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl text-stone-600 font-bold">
                    {formData.primarySkill || 'Select a domain first'}
                  </div>
                )}
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-stone-700 ml-1">Additional Skills or Subjects (Optional)</label>
                <textarea
                  name="skills"
                  value={formData.skills || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all h-24 resize-none"
                  placeholder="React, SQL, Docker, or specific subjects like History, Economics..."
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-stone-700 ml-1">Interests & Hobbies</label>
              <textarea
                name="interests"
                required
                value={formData.interests || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 outline-none transition-all h-24 resize-none"
                placeholder="AI, Web Development, Reading, Traveling..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all flex items-center justify-center disabled:opacity-50 shadow-lg shadow-stone-200"
            >
              {loading ? 'Saving Profile...' : 'Save & Continue to Mentor Guidance'}
              {!loading && <Save className="ml-2 w-5 h-5" />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
