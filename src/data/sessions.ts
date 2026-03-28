export interface Session {
  letter: string;
  title: string;
  description: string;
  feedbackUrl: string;
  buttonText?: string;
}

export interface SessionGroup {
  id: string;
  sectionId: string;
  title: string;
  time: string;
  sessionListClass: string;
  sessions: Session[];
}

export const surveyUrl = "https://forms.gle/6kAsHAJNWZ6rGDqd9";

export const sessionGroups: SessionGroup[] = [
  {
    id: "workshop-1",
    sectionId: "Workshop 1 Sessions",
    title: "Workshop 1 Sessions",
    time: "10:10 am - 11:05 am",
    sessionListClass: "pt-2",
    sessions: [
      {
        letter: "A:",
        title: "Careers in Medicine",
        description:
          "Explore cutting-edge technologies transforming patient care and medical practice.",
        feedbackUrl: "https://forms.gle/6HLVAN3H46QEnv5S9",
      },
      {
        letter: "B:",
        title: "Careers in Nursing",
        description:
          "Learn about the diverse opportunities and challenges in the nursing profession.",
        feedbackUrl: "https://forms.gle/nQcqLFmfNGa3rabs9",
      },
      {
        letter: "C:",
        title: "Careers in the Laboratory",
        description:
          "Discover the critical role of laboratory professionals in healthcare.",
        feedbackUrl: "https://forms.gle/YDFPRjWigshu8uzD8",
      },
      {
        letter: "D:",
        title: "Careers in Veterinary Medicine",
        description:
          "Explore the rewarding field of veterinary medicine and animal care.",
        feedbackUrl: "https://forms.gle/cKPU8e2ymZc7itTHA",
      },
      {
        letter: "E:",
        title: "Reducing Public Health Emergencies in Developing Nations",
        description:
          "Learn strategies to mitigate public health crises in underserved regions.",
        feedbackUrl: "https://forms.gle/dBrFYnU5YYsRruABA",
      },
      {
        letter: "F:",
        title: "Women Physicians in Family Practice",
        description:
          "Celebrate the contributions of women physicians in family medicine.",
        feedbackUrl: "https://forms.gle/DkKHKA8r3yRyzyN86",
      },
    ],
  },
  {
    id: "workshop-2",
    sectionId: "Workshop 2 Sessions",
    title: "Workshop 2 Sessions",
    time: "11:10 am - 12:05 pm",
    sessionListClass: "pt-2 pb-4",
    sessions: [
      {
        letter: "A:",
        title: "A Military Career in Dentistry",
        description:
          "Explore the unique opportunities and challenges of a military career in dentistry.",
        feedbackUrl: "https://forms.gle/1AX1WQNfe78zUfm8A",
      },
      {
        letter: "B:",
        title: "Neurosurgeon, Researcher, Mentor: Making a Difference",
        description:
          "Learn about the impactful career of a neurosurgeon who is also a researcher and mentor.",
        feedbackUrl: "https://forms.gle/tAFfF1Pt5eT8pzVS7",
      },
      {
        letter: "C:",
        title: "One Health Model: Predicting and Preventing the Next Pandemic",
        description:
          "Discover how the One Health Model helps predict and prevent global pandemics.",
        feedbackUrl: "https://forms.gle/GQxdfiSxFdpZuD7C7",
      },
      {
        letter: "D:",
        title:
          "Thriving in the Fast Lane: A Discussion of Career and Life Balance with Women in Emergency Medicine",
        description:
          "Join a discussion on balancing career and life as women in emergency medicine.",
        feedbackUrl: "https://forms.gle/Em8zPWEDGokttgYp9",
      },
      {
        letter: "E:",
        title: "Making the Most of Your Global Health Experience",
        description:
          "Gain insights on maximizing the impact of your global health experiences.",
        feedbackUrl: "https://forms.gle/FZqyvBoFQChPqaq37",
      },
      {
        letter: "F:",
        title: "Podiatrists Make a Big Difference in Patient’s Lives … Find Out How!",
        description:
          "Learn how podiatrists make a significant impact on patients' lives.",
        feedbackUrl: "https://forms.gle/zGRySP3eL5r8fVcY7",
      },
    ],
  },
  {
    id: "workshop-3",
    sectionId: "Workshop 3 Sessions",
    title: "Workshop 3 Sessions",
    time: "12:10 pm - 1:05 pm",
    sessionListClass: "pt-2 pb-4",
    sessions: [
      {
        letter: "A:",
        title: "Medical School Admissions Panel",
        description:
          "Gain insights into the medical school admissions process from experts.",
        feedbackUrl: "https://forms.gle/AooeL1KVa27oV1QZA",
      },
      {
        letter: "B:",
        title: "Summer Internship Programs & Altamed Institute for Health Equity",
        description:
          "Learn about summer internships and health equity initiatives.",
        feedbackUrl: "https://forms.gle/ue4LUcaRJQmZHEf66",
      },
      {
        letter: "C:",
        title: "How to Get a 99th Percentile MCAT Score",
        description: "Discover strategies to achieve a top score on the MCAT.",
        feedbackUrl: "https://forms.gle/hzHSbesTEtvqCQzaA",
      },
      {
        letter: "D:",
        title: "Bone Marrow Transplants and Graft vs Host Disease",
        description:
          "Understand the complexities of bone marrow transplants and related conditions.",
        feedbackUrl: "https://forms.gle/A3fe27MEP6RfF9vm9",
      },
      {
        letter: "E:",
        title: "Careers in Public Health",
        description:
          "Explore the diverse opportunities available in public health careers.",
        feedbackUrl: "https://forms.gle/6GkChnoTjGjBobDCA",
      },
      {
        letter: "F:",
        title:
          "UCI School of Medicine Program in Medical Education for the Latino Community (PRIME-LC)",
        description:
          "Learn about PRIME-LC and its mission to serve the Latino community.",
        feedbackUrl: "https://forms.gle/Ebxc8hqzz6nS5vxJ9",
      },
    ],
  },
  {
    id: "focus-group-1",
    sectionId: "Focus Group 1 Sessions",
    title: "Focus Group 1 Sessions",
    time: "3:00 pm - 3:45 pm",
    sessionListClass: "pt-2 pb-4",
    sessions: [
      {
        letter: "A:",
        title: "Introduction to the Doula and Midwifery Professions",
        description:
          "Learn about the vital roles of doulas and midwives in maternal healthcare.",
        feedbackUrl: "https://forms.gle/DbdnKAcF8fjoMysS7",
      },
      {
        letter: "B:",
        title:
          "Caring for Patients with Gender Dysphoria: Perspectives of a Reconstructive Surgeon",
        description:
          "Understand the surgical aspects of gender-affirming care from a reconstructive surgeon.",
        feedbackUrl: "https://forms.gle/BdpYYp1XbzmS7S1r5",
      },
      {
        letter: "C:",
        title: "Global Public Health: Seeking Solutions for Problems of Global Impact",
        description:
          "Explore approaches to addressing worldwide public health challenges.",
        feedbackUrl: "https://forms.gle/7xrCUCbugXzWLPTJ7",
      },
      {
        letter: "D:",
        title: "Medical Student Panel",
        description:
          "Get firsthand insights from current medical students about their experiences.",
        feedbackUrl: "https://forms.gle/pDjhy792Srg4E8rw6",
      },
      {
        letter: "E:",
        title: "Community College to PharmD",
        description:
          "Learn about the pathway from community college to becoming a Doctor of Pharmacy.",
        feedbackUrl: "https://forms.gle/tpPSn8AiZs22XeS2A",
      },
    ],
  },
  {
    id: "focus-group-2",
    sectionId: "Focus Group 2 Sessions",
    title: "Focus Group 2 Sessions",
    time: "3:45 pm - 4:30 pm",
    sessionListClass: "pt-2 pb-4",
    sessions: [
      {
        letter: "A:",
        title: "MCAT Strategies: Solving Problems with Swartwood",
        description: "Learn effective strategies for tackling MCAT problems.",
        feedbackUrl: "https://forms.gle/E69K6bixikqH7yyH7",
      },
      {
        letter: "B:",
        title: "Beyond the Basics: The Secret Journey of a Laboratory Sample",
        description:
          "Discover the intricate process of laboratory sample handling and analysis.",
        feedbackUrl: "https://forms.gle/dwrBV4oBGi8WxzcYA",
      },
      {
        letter: "C:",
        title: "Native American Health Disparities: A Call to Action",
        description:
          "Explore health disparities affecting Native American communities and solutions.",
        feedbackUrl: "https://forms.gle/YU9Uq9U6jtqy4kL89",
      },
      {
        letter: "D:",
        title: "WHAT … NO EGGS? The Story of HPAI (Highly Pathogenic Avian Influenza)",
        description:
          "Learn about the impact of HPAI on food security and public health.",
        feedbackUrl: "https://forms.gle/DgcXdU2gKgH2SARK9",
      },
    ],
  },
  {
    id: "focus-group-3",
    sectionId: "Focus Group 3 Sessions",
    title: "Focus Group 3 Sessions",
    time: "4:30 pm - 5:15 pm",
    sessionListClass: "pt-2 pb-4",
    sessions: [
      {
        letter: "A:",
        title: "Ethical Issues in Medicine and Public Health",
        description:
          "Explore ethical challenges and considerations in medicine and public health.",
        feedbackUrl: "https://forms.gle/EYtEyKvqAAFgdvsr6",
      },
      {
        letter: "B:",
        title: "Career as a Physician Assistant",
        description:
          "Learn about the role and opportunities as a Physician Assistant.",
        feedbackUrl: "https://forms.gle/82XnJZY3hkx7MPtK8",
      },
      {
        letter: "C:",
        title:
          "Revolutionizing Healthcare: Bridging the Gap Between Clinicians and Patients",
        description:
          "Discover innovative approaches to improve clinician-patient relationships.",
        feedbackUrl: "https://forms.gle/R8MmkusY3RD9tJyi8",
      },
      {
        letter: "D:",
        title: "Focus Group on Nursing",
        description:
          "Explore career paths and opportunities in the nursing profession.",
        feedbackUrl: "https://forms.gle/98boKp4vJE72QzR99",
      },
    ],
  },
];
