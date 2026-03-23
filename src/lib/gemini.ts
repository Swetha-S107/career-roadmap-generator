// ❌ No API version – Fully local logic

export async function generateRoadmap(
  profile: any,
  score: number,
  duration: string,
  totalQuestions: number
) {
  const percentage = (score / totalQuestions) * 100;
  const level =
    percentage <= 40
      ? "Beginner"
      : percentage <= 75
      ? "Intermediate"
      : "Advanced";

  // ✅ FIXED duration logic
  let totalWeeks = 4;

  if (duration === "1_week") totalWeeks = 1;
  else if (duration === "1_month") totalWeeks = 4;
  else if (duration === "3_months") totalWeeks = 12;

  const roadmap = {
    title: `${profile.domain} Career Roadmap`,
    summary: `This roadmap is designed for a ${level} level student aiming to become a ${profile.domain} professional.`,
    weeks: [] as any[],
  };

  for (let i = 1; i <= totalWeeks; i++) {
    roadmap.weeks.push({
      week: i,
      focus: `${level} Level - Week ${i} Focus`,
      topics: [
        `Understand fundamentals of ${profile.primarySkill}`,
        `Practice real-world problems in ${profile.primarySkill}`,
        `Work on ${profile.domain} related mini tasks`,
        `Improve logical and analytical thinking`,
        `Build a mini project for Week ${i}`,
      ],
    });
  }

  return roadmap;
}

// ✅ RESUME GENERATOR (IMPROVED)

export async function generateResume(profile: any, email: string) {
  return {
    summary: `${profile.name} is a passionate ${profile.domain} enthusiast with strong interest in ${profile.primarySkill}. Focused on developing real-world skills and building impactful projects.`,

    skills: [
      {
        category: "Technical Skills",
        items: [
          profile.primarySkill,
          "Problem Solving",
          "Basic Programming",
          "Debugging",
        ],
      },
      {
        category: "Tools",
        items: ["VS Code", "Git", "GitHub", "Chrome DevTools"],
      },
    ],

    experience: [
      {
        title: "Fresher",
        organization: "Self Learning",
        duration: "Present",
        responsibilities: [
          "Actively learning and building projects",
          "Practicing real-world problem solving",
        ],
      },
    ],

    projects: [
      {
        title: "Career Roadmap Generator",
        techStack: "React, Node.js",
        description: [
          "Built a dynamic career roadmap generator",
          "Designed interactive UI with personalized outputs",
        ],
      },
      {
        title: "Portfolio Website",
        techStack: "HTML, CSS, JavaScript",
        description: [
          "Developed personal portfolio website",
          "Showcased skills and projects effectively",
        ],
      },
    ],

    education: [
      {
        degree: profile.type,
        institution: profile.schoolName || profile.department,
        duration: profile.year || "Ongoing",
        details: "Focused on academic and career growth",
      },
    ],

    achievements: [
      "Built multiple real-time projects",
      "Continuously learning new technologies",
    ],
  };
}