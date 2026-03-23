// ❌ REMOVE GoogleGenAI بالكامل

export async function generateRoadmap(profile: any, score: number, duration: string, totalQuestions: number) {
  const percentage = (score / totalQuestions) * 100;
  const level = percentage <= 40 ? 'Beginner' : percentage <= 75 ? 'Intermediate' : 'Advanced';

  const totalWeeks = duration === '1_month' ? 4 : 12;

  const roadmap = {
    title: `${profile.domain} Career Roadmap`,
    summary: `This roadmap is designed for a ${level} level student aiming to become a ${profile.domain} professional.`,
    weeks: []
  };

  for (let i = 1; i <= totalWeeks; i++) {
    roadmap.weeks.push({
      week: i,
      focus: `${level} level learning - Week ${i}`,
      topics: [
        `Learn basics of ${profile.primarySkill}`,
        `Practice ${profile.primarySkill} concepts`,
        `Work on small tasks in ${profile.domain}`,
        `Improve problem solving skills`,
        `Build mini project related to ${profile.domain}`
      ]
    });
  }

  return roadmap;
}

// ✅ RESUME GENERATOR (NO API)

export async function generateResume(profile: any, email: string) {
  return {
    summary: `${profile.name} is an aspiring ${profile.domain} professional with strong interest in ${profile.primarySkill}. Passionate about learning and building real-world projects.`,

    skills: [
      {
        category: "Technical Skills",
        items: [profile.primarySkill, "Problem Solving", "Basics of Programming"]
      },
      {
        category: "Tools",
        items: ["VS Code", "Git", "GitHub"]
      }
    ],

    experience: [
      {
        title: "Fresher",
        organization: "Self Learning",
        duration: "Present",
        responsibilities: [
          "Practicing and building projects",
          "Learning new technologies regularly"
        ]
      }
    ],

    projects: [
      {
        title: "Career Roadmap Generator",
        techStack: "React, Node.js",
        description: [
          "Built a personalized roadmap generator",
          "Designed dynamic UI for user interaction"
        ]
      },
      {
        title: "Portfolio Website",
        techStack: "HTML, CSS, JavaScript",
        description: [
          "Created personal portfolio website",
          "Showcased projects and skills"
        ]
      }
    ],

    education: [
      {
        degree: profile.type,
        institution: profile.schoolName || profile.department,
        duration: profile.year || "Ongoing",
        details: "Pursuing education with focus on career growth"
      }
    ],

    achievements: [
      "Completed multiple mini projects",
      "Actively learning new technologies"
    ]
  };
}