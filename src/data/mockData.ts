// Mock data for the Digital Experience Platform

export interface Teacher {
  id: string;
  name: string;
  photo: string;
  designation: string;
  qualifications: string;
  subjects: string[];
  impactScore: string;
  experience: string;
  passPercentage: string;
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  image?: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  type: string;
}

export interface PerformanceData {
  year: string;
  stream: string;
  passRate: number;
  distinctionRate: number;
  totalStudents: number;
}

export interface Testimonial {
  id: string;
  name: string;
  batch: string;
  photo: string;
  quote: string;
  currentPosition?: string;
}

export interface PrincipalMessage {
  name: string;
  designation: string;
  photo: string;
  message: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  eligibility: string;
  image: string;
  subjects: string[];
  futureScope: string;
}

export const courses: Course[] = [
  {
    id: 'science-pcmc',
    title: 'Science (PCMC)',
    description: 'Physics, Chemistry, Mathematics, Computer Science. Ideal for students aspiring to pursue engineering, technology, data science, and IT careers. Our PCMC program prepares students for JEE Main, JEE Advanced, KCET, BITSAT, and other technical entrance exams.',
    duration: '2 Years',
    eligibility: '10th Pass with 75% (Science & Maths)',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'],
    futureScope: `**Engineering & Technology:** Software Engineer, Data Scientist, Machine Learning Engineer, Full-Stack Developer, DevOps Engineer, Cloud Architect, Cybersecurity Analyst.

**Research & Academia:** Research Scientist, University Professor, R&D Engineer at tech giants like Google, Microsoft, Amazon.

**Emerging Fields:** AI/ML Specialist, Blockchain Developer, IoT Engineer, Quantum Computing Researcher, Robotics Engineer.

**Salary Range:** Entry-level ₹6-15 LPA, Experienced ₹25-60+ LPA in top companies.

**Key Entrance Exams:** JEE Main, JEE Advanced, KCET, BITSAT, VITEEE, COMEDK.`
  },
  {
    id: 'science-pcmb',
    title: 'Science (PCMB)',
    description: 'Physics, Chemistry, Mathematics, Biology. Perfect for students aiming for medical, pharmaceutical, biotechnology, and research careers. Our PCMB program prepares students for NEET-UG, KCET, AIIMS, and other medical entrance exams.',
    duration: '2 Years',
    eligibility: '10th Pass with 75% (Science)',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
    futureScope: `**Medical Sciences:** Doctor (MBBS), Surgeon, Dentist (BDS), Pharmacist, Medical Researcher, Geneticist, Microbiologist.

**Allied Health:** Physiotherapist, Radiologist, Pathologist, Veterinarian, Public Health Specialist.

**Research & Biotech:** Biotechnologist, Bioinformatics Specialist, Clinical Researcher, Environmental Scientist, Forensic Scientist.

**Salary Range:** Entry-level ₹5-12 LPA, Specialists ₹20-80+ LPA.

**Key Entrance Exams:** NEET-UG, KCET, AIIMS, JIPMER, AFMC.`
  },
  {
    id: 'commerce-ebac',
    title: 'Commerce (EBAC)',
    description: 'Economics, Business Studies, Accountancy, Computer Science. Designed for students pursuing careers in chartered accountancy, business management, finance, and entrepreneurship. Prepares for CA, CMA, CS, and MBA entrance exams.',
    duration: '2 Years',
    eligibility: '10th Pass with 60%',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80',
    subjects: ['Economics', 'Business Studies', 'Accountancy', 'Computer Science'],
    futureScope: `**Finance & Accounting:** Chartered Accountant (CA), Cost Accountant (CMA), Company Secretary (CS), Financial Analyst, Auditor, Tax Consultant.

**Banking & Insurance:** Bank Manager, Investment Banker, Insurance Agent, Credit Analyst, Risk Manager.

**Business & Management:** MBA Graduate, Business Analyst, Consultant, Entrepreneur, Marketing Manager, HR Manager.

**Salary Range:** CA Freshers ₹8-12 LPA, Senior Positions ₹30-60+ LPA.

**Key Entrance Exams:** CA Foundation, IPMAT, CUET, CAT, XAT.`
  },
  {
    id: 'arts-heba',
    title: 'Arts (HEBA)',
    description: 'History, Economics, Business Studies, Political Science/Sociology. Ideal for students interested in humanities, civil services, law, journalism, and social sciences. Prepares for UPSC, CLAT, and humanities entrance exams.',
    duration: '2 Years',
    eligibility: '10th Pass with 55%',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80',
    subjects: ['History', 'Economics', 'Business Studies', 'Political Science'],
    futureScope: `**Civil Services:** IAS, IPS, IFS Officers, State Civil Services, Public Administration roles.

**Law & Judiciary:** Lawyer, Judge, Legal Advisor, Corporate Counsel, Human Rights Advocate.

**Media & Communication:** Journalist, News Anchor, Content Writer, Documentary Filmmaker, Public Relations Specialist.

**Academia & Research:** Historian, Political Scientist, Economist, University Professor, Policy Researcher.

**Salary Range:** Civil Services ₹10-25 LPA, Top Lawyers ₹20-100+ LPA.

**Key Entrance Exams:** UPSC, CLAT, DU JAT, CUET, State PSC.`
  }
];


export const teachers: Teacher[] = [
  {
    id: "t1",
    name: "Dr. Rajesh Kumar",
    photo: "physics-teacher",
    designation: "Senior Lecturer - Physics",
    qualifications: "M.Sc, Ph.D (Physics), B.Ed",
    subjects: ["Physics"],
    impactScore: "99% Result in 2024",
    experience: "15+ Years",
    passPercentage: "99%"
  },
  {
    id: "t2",
    name: "Prof. Anjali Sharma",
    photo: "chemistry-teacher",
    designation: "Head of Department - Chemistry",
    qualifications: "M.Sc (Chemistry), B.Ed",
    subjects: ["Chemistry"],
    impactScore: "98% Result in 2024",
    experience: "12+ Years",
    passPercentage: "98%"
  },
  {
    id: "t3",
    name: "Mr. Vikram Singh",
    photo: "math-teacher",
    designation: "Mathematics Lecturer",
    qualifications: "M.Sc (Mathematics), B.Ed",
    subjects: ["Mathematics"],
    impactScore: "97% Result in 2024",
    experience: "10+ Years",
    passPercentage: "97%"
  },
  {
    id: "t4",
    name: "Ms. Priya Patel",
    photo: "cs-teacher",
    designation: "Computer Science Lecturer",
    qualifications: "M.Tech (Computer Science), B.Ed",
    subjects: ["Computer Science"],
    impactScore: "100% Result in 2024",
    experience: "8+ Years",
    passPercentage: "100%"
  },
  {
    id: "t5",
    name: "Dr. Meera Reddy",
    photo: "biology-teacher",
    designation: "Senior Lecturer - Biology",
    qualifications: "M.Sc, Ph.D (Biotechnology), B.Ed",
    subjects: ["Biology"],
    impactScore: "99% Result in 2024",
    experience: "14+ Years",
    passPercentage: "99%"
  },
  {
    id: "t6",
    name: "Prof. Ramesh Gupta",
    photo: "commerce-teacher",
    designation: "Head of Department - Commerce",
    qualifications: "M.Com, CA, B.Ed",
    subjects: ["Accountancy", "Business Studies"],
    impactScore: "96% Result in 2024",
    experience: "18+ Years",
    passPercentage: "96%"
  },
  {
    id: "t7",
    name: "Ms. Kavita Desai",
    photo: "economics-teacher",
    designation: "Economics Lecturer",
    qualifications: "M.A (Economics), B.Ed",
    subjects: ["Economics"],
    impactScore: "98% Result in 2024",
    experience: "9+ Years",
    passPercentage: "98%"
  },
  {
    id: "t8",
    name: "Mr. Suresh Nair",
    photo: "english-teacher",
    designation: "English Language Lecturer",
    qualifications: "M.A (English Literature), B.Ed",
    subjects: ["English"],
    impactScore: "97% Result in 2024",
    experience: "11+ Years",
    passPercentage: "97%"
  },
  {
    id: "t9",
    name: "Dr. Arun Krishnamurthy",
    photo: "history-teacher",
    designation: "Senior Lecturer - History",
    qualifications: "M.A, Ph.D (History), B.Ed",
    subjects: ["History"],
    impactScore: "95% Result in 2024",
    experience: "16+ Years",
    passPercentage: "95%"
  },
  {
    id: "t10",
    name: "Ms. Lakshmi Iyer",
    photo: "polsci-teacher",
    designation: "Political Science Lecturer",
    qualifications: "M.A (Political Science), B.Ed",
    subjects: ["Political Science"],
    impactScore: "94% Result in 2024",
    experience: "7+ Years",
    passPercentage: "94%"
  }
];

export const newsItems: NewsItem[] = [
  {
    id: "n1",
    title: "Annual Sports Day 2026 - A Grand Success",
    date: "February 5, 2026",
    excerpt: "Our college hosted a spectacular Sports Day with over 500 students participating in various events.",
    content: "The annual Sports Day was held with great enthusiasm, featuring track and field events, relay races, and team sports. Students showcased exceptional talent and sportsmanship.",
    image: "sports-day"
  },
  {
    id: "n2",
    title: "Board Exams Start March 15th, 2026",
    date: "February 1, 2026",
    excerpt: "Important reminder: 12th standard board examinations commence from March 15th.",
    content: "Students are advised to complete their preparation and attend the special revision classes being conducted by our faculty."
  },
  {
    id: "n3",
    title: "100% Results in Computer Science Stream",
    date: "January 28, 2026",
    excerpt: "Celebrating unprecedented success with perfect scores in the CS stream.",
    content: "We are proud to announce that all students in our Computer Science stream have achieved 100% pass rate with 85% scoring distinctions."
  },
  {
    id: "n4",
    title: "New Science Labs Inaugurated",
    date: "January 20, 2026",
    excerpt: "State-of-the-art laboratories for Physics, Chemistry, and Biology now operational.",
    content: "Our institution has invested in cutting-edge equipment and infrastructure to provide students with hands-on learning experiences."
  },
  {
    id: "n5",
    title: "Admissions Open for Academic Year 2026-27",
    date: "January 15, 2026",
    excerpt: "Applications are now being accepted for Science and Commerce streams.",
    content: "Eligible students can apply online or visit the admission office. Early bird discount available for applications received before March 1st."
  }
];

export const jobs: Job[] = [
  {
    id: "j1",
    title: "Mathematics Lecturer",
    department: "Mathematics",
    description: "We are seeking an experienced Mathematics lecturer to join our faculty for the upcoming academic year.",
    requirements: [
      "M.Sc in Mathematics with minimum 55% marks",
      "B.Ed qualification mandatory",
      "Minimum 2 years teaching experience at PU level",
      "Strong communication skills"
    ],
    type: "Full-time"
  },
  {
    id: "j2",
    title: "Physics Laboratory Assistant",
    department: "Physics",
    description: "Looking for a dedicated lab assistant to support practical sessions and maintain laboratory equipment.",
    requirements: [
      "B.Sc in Physics or related field",
      "Experience with laboratory equipment maintenance",
      "Good organizational skills",
      "Ability to assist students during practical sessions"
    ],
    type: "Full-time"
  },
  {
    id: "j3",
    title: "Administrative Officer",
    department: "Administration",
    description: "Experienced administrative professional needed to manage student records and daily office operations.",
    requirements: [
      "Bachelor's degree in any discipline",
      "3+ years experience in educational administration",
      "Proficiency in MS Office and database management",
      "Excellent interpersonal skills"
    ],
    type: "Full-time"
  },
  {
    id: "j4",
    title: "English Language Lecturer",
    department: "Languages",
    description: "Dynamic English lecturer required to teach literature and language skills.",
    requirements: [
      "M.A in English Literature with minimum 55% marks",
      "B.Ed qualification required",
      "Experience with modern teaching methodologies",
      "Passion for literature and language education"
    ],
    type: "Full-time"
  }
];

export const performanceData: PerformanceData[] = [
  {
    year: "2024",
    stream: "Science",
    passRate: 99,
    distinctionRate: 87,
    totalStudents: 245
  },
  {
    year: "2024",
    stream: "Commerce",
    passRate: 98,
    distinctionRate: 82,
    totalStudents: 198
  },
  {
    year: "2023",
    stream: "Science",
    passRate: 98,
    distinctionRate: 85,
    totalStudents: 232
  },
  {
    year: "2023",
    stream: "Commerce",
    passRate: 97,
    distinctionRate: 79,
    totalStudents: 187
  },
  {
    year: "2022",
    stream: "Science",
    passRate: 97,
    distinctionRate: 83,
    totalStudents: 218
  },
  {
    year: "2022",
    stream: "Commerce",
    passRate: 96,
    distinctionRate: 76,
    totalStudents: 175
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "test1",
    name: "Aditya Sharma",
    batch: "2023",
    photo: "student-1",
    quote: "The faculty here are exceptional. Their dedication helped me secure admission to IIT Bombay.",
    currentPosition: "Student, IIT Bombay"
  },
  {
    id: "test2",
    name: "Sneha Krishnan",
    batch: "2022",
    photo: "student-2",
    quote: "The supportive environment and excellent teaching methods prepared me perfectly for my CA exams.",
    currentPosition: "CA Finalist"
  },
  {
    id: "test3",
    name: "Rahul Verma",
    batch: "2024",
    photo: "student-3",
    quote: "Best decision I made was joining this college. The impact engine data speaks for itself!",
    currentPosition: "Engineering Student, NIT"
  },
  {
    id: "test4",
    name: "Priya Menon",
    batch: "2023",
    photo: "student-4",
    quote: "The teachers go above and beyond to ensure every student succeeds. Forever grateful!",
    currentPosition: "Medical Student, AIIMS"
  }
];

export const galleryImages = [
  { id: "g1", title: "Science Laboratory", query: "science laboratory students" },
  { id: "g2", title: "Annual Day Celebrations", query: "college annual function stage" },
  { id: "g3", title: "Computer Lab", query: "students computer lab" },
  { id: "g4", title: "Sports Day", query: "college sports athletics" },
  { id: "g5", title: "Library", query: "college library students reading" },
  { id: "g6", title: "Cultural Fest", query: "college cultural dance performance" }
];

export const principalMessage = {
  name: "Dr. Sudhir Malhotra",
  designation: "Principal",
  photo: "principal",
  message: "Welcome to our esteemed institution. We are committed to providing quality education that empowers students to excel academically and personally. Our 99% pass rate is a testament to the dedication of our faculty and the hard work of our students. We believe in nurturing not just academic excellence, but also character, leadership, and social responsibility. Join us in shaping a brighter future."
};

// Chatbot knowledge base
export const chatbotKnowledge = {
  fees: {
    science: "The fee structure for Science stream is ₹45,000 per year, which includes tuition, laboratory fees, and library access.",
    commerce: "The fee structure for Commerce stream is ₹38,000 per year, which includes tuition and library access."
  },
  admissions: {
    eligibility: "Students who have completed 10th standard with minimum 60% for Commerce and 75% for Science stream are eligible to apply.",
    process: "You can apply online through our website or visit the admission office with your 10th mark sheet, transfer certificate, and 3 passport photos.",
    deadlines: "Admissions for 2026-27 are open until March 31st, 2026. Early applications receive priority."
  },
  facilities: "We offer state-of-the-art science laboratories, a well-stocked library with over 10,000 books, computer labs with high-speed internet, sports facilities including basketball and volleyball courts, and a spacious auditorium.",
  contact: "You can reach us at: Phone: +91-80-2345-6789, Email: info@incpuc.edu.in, Address: INCPUC Campus, MG Road, Bangalore - 560001",
  timings: "College hours are from 7:30 AM to 1:30 PM, Monday to Saturday. The office is open from 9:00 AM to 4:00 PM on weekdays."
};

// Home page layout configuration
export interface LayoutWidget {
  id: string;
  name: string;
  isVisible: boolean;
  order: number;
}

export const defaultHomeLayout: LayoutWidget[] = [
  { id: "hero", name: "Hero Section", isVisible: true, order: 1 },
  { id: "impact", name: "Impact Dashboard", isVisible: true, order: 2 },
  { id: "principal", name: "Principal's Message", isVisible: true, order: 3 },
  { id: "news", name: "News Ticker", isVisible: true, order: 4 },
  { id: "gallery", name: "Gallery", isVisible: true, order: 5 },
  { id: "testimonials", name: "Testimonials", isVisible: true, order: 6 }
];
