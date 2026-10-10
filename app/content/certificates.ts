/**
 * Certificates & awards (language-neutral: official titles stay as issued).
 * Images are first pages rendered from the original PDFs into
 * public/certificates/. `date` is ISO so the UI can localize it.
 */
import type { ProjectField } from "../types/project";

export type CertificateKind = "award" | "specialization" | "course";

export type Certificate = {
  id: string;
  kind: CertificateKind;
  title: string;
  issuer: string;
  /** ISO date, or just the year when the day is unknown. */
  date: string;
  /** Public verification page, when the issuer offers one. */
  verifyUrl?: string;
};

const coursera = (code: string) => `https://coursera.org/verify/${code}`;
const dicoding = (code: string) => `https://www.dicoding.com/certificates/${code}`;

const GOOGLE = "Google · Coursera";
const DLAI = "DeepLearning.AI · Coursera";
const DLAI_STANFORD = "DeepLearning.AI & Stanford · Coursera";

export const certificates: Certificate[] = [
  // Awards
  { id: "data-royale-2023", kind: "award", title: "3rd Place, Senior Division — Data Royale 2023", issuer: "Kotak Riset & DSAI OmahTI, Universitas Gadjah Mada", date: "2023" },
  { id: "kmnr-13-silver", kind: "award", title: "Silver Medal — 13th National Realistic Reasoning Mathematics Competition (KMNR)", issuer: "Klinik Pendidikan MIPA", date: "2018-04-15" },

  // Specializations / professional certificates
  { id: "tensorflow-data-and-deployment", kind: "specialization", title: "TensorFlow: Data and Deployment Specialization", issuer: DLAI, date: "2023-11-17", verifyUrl: coursera("specialization/HM8FVMFL8JW2") },
  { id: "deeplearning-ai-tensorflow-specialization", kind: "specialization", title: "DeepLearning.AI TensorFlow Developer Professional Certificate", issuer: DLAI, date: "2023-11-05", verifyUrl: coursera("professional-cert/LW3DDQVSYJW9") },
  { id: "coursera-machine-learning-specialization", kind: "specialization", title: "Machine Learning Specialization", issuer: DLAI_STANFORD, date: "2023-10-20", verifyUrl: coursera("specialization/J6LGTV6JL2H4") },
  { id: "coursera-mathematics-specialization", kind: "specialization", title: "Mathematics for Machine Learning and Data Science Specialization", issuer: DLAI, date: "2023-09-29", verifyUrl: coursera("specialization/M4XTXCX46BAB") },

  // TensorFlow track
  { id: "advanced-deployment", kind: "course", title: "Advanced Deployment Scenarios with TensorFlow", issuer: DLAI, date: "2023-11-17", verifyUrl: coursera("U29XLTA6EAEX") },
  { id: "browser-based-models", kind: "course", title: "Browser-based Models with TensorFlow.js", issuer: DLAI, date: "2023-11-17", verifyUrl: coursera("3NA4Y4QWL4HA") },
  { id: "data-pipelines", kind: "course", title: "Data Pipelines with TensorFlow Data Services", issuer: DLAI, date: "2023-11-17", verifyUrl: coursera("2VMY2GDLRBVK") },
  { id: "device-based-models", kind: "course", title: "Device-based Models with TensorFlow Lite", issuer: DLAI, date: "2023-11-17", verifyUrl: coursera("EDWSVMVBNN3W") },
  { id: "structuring-machine-learning-projects", kind: "course", title: "Structuring Machine Learning Projects", issuer: DLAI, date: "2023-11-08", verifyUrl: coursera("9NC3JQNJ446J") },
  { id: "sequences-time-series", kind: "course", title: "Sequences, Time Series and Prediction", issuer: DLAI, date: "2023-11-05", verifyUrl: coursera("E6L35JELP8GB") },
  { id: "nlp", kind: "course", title: "Natural Language Processing in TensorFlow", issuer: DLAI, date: "2023-11-04", verifyUrl: coursera("PE3623ACBDH5") },
  { id: "cnn", kind: "course", title: "Convolutional Neural Networks in TensorFlow", issuer: DLAI, date: "2023-11-02", verifyUrl: coursera("PD8CCH37MZP4") },
  { id: "introduction-to-tensorflow", kind: "course", title: "Introduction to TensorFlow for AI, ML, and Deep Learning", issuer: DLAI, date: "2023-10-26", verifyUrl: coursera("DUHFT8QQJ8FG") },

  // Machine learning & math
  { id: "ml-unsupervised", kind: "course", title: "Unsupervised Learning, Recommenders, Reinforcement Learning", issuer: DLAI_STANFORD, date: "2023-10-20", verifyUrl: coursera("A2W4W6S54XVU") },
  { id: "ml-advanced-learning-algorithms", kind: "course", title: "Advanced Learning Algorithms", issuer: DLAI_STANFORD, date: "2023-10-14", verifyUrl: coursera("U7XQLW7D35PZ") },
  { id: "ml-supervised", kind: "course", title: "Supervised Machine Learning: Regression and Classification", issuer: DLAI_STANFORD, date: "2023-10-03", verifyUrl: coursera("JCTWH3WFYB8C") },
  { id: "math-probability", kind: "course", title: "Probability & Statistics for Machine Learning & Data Science", issuer: DLAI, date: "2023-09-29", verifyUrl: coursera("247KLNG45GMQ") },
  { id: "math-calculus", kind: "course", title: "Calculus for Machine Learning and Data Science", issuer: DLAI, date: "2023-09-22", verifyUrl: coursera("QRV5T4FVFRQ5") },
  { id: "math-linear-algebra", kind: "course", title: "Linear Algebra for Machine Learning and Data Science", issuer: DLAI, date: "2023-09-19", verifyUrl: coursera("H9QHG9Y4MHZH") },

  // Google Data Analytics & Python
  { id: "coursera-share-data-through-visualization", kind: "course", title: "Share Data Through the Art of Visualization", issuer: GOOGLE, date: "2023-09-12", verifyUrl: coursera("E46DE3G9WQ7N") },
  { id: "coursera-analyze-data-to-answer-questions", kind: "course", title: "Analyze Data to Answer Questions", issuer: GOOGLE, date: "2023-09-07", verifyUrl: coursera("U3WHJYAN7EZ6") },
  { id: "coursera-process-data-from-dirty-to-clean", kind: "course", title: "Process Data from Dirty to Clean", issuer: GOOGLE, date: "2023-09-05", verifyUrl: coursera("CUGYQQV7F98P") },
  { id: "coursera-prepare-data-for-exploration", kind: "course", title: "Prepare Data for Exploration", issuer: GOOGLE, date: "2023-09-04", verifyUrl: coursera("SLW3ZHDDASNE") },
  { id: "coursera-ask-questions-to-make-data-driven-decisions", kind: "course", title: "Ask Questions to Make Data-Driven Decisions", issuer: GOOGLE, date: "2023-09-01", verifyUrl: coursera("KC9HW4H4RDCQ") },
  { id: "coursera-foundations-data-data-everywhere", kind: "course", title: "Foundations: Data, Data, Everywhere", issuer: GOOGLE, date: "2023-08-28", verifyUrl: coursera("SGM4EDZ8EDP4") },
  { id: "coursera-python-operating-system", kind: "course", title: "Using Python to Interact with the Operating System", issuer: GOOGLE, date: "2023-08-25", verifyUrl: coursera("KJB5RKX5VEEM") },
  { id: "coursera-intro-to-git-and-github", kind: "course", title: "Introduction to Git and GitHub", issuer: GOOGLE, date: "2023-08-23", verifyUrl: coursera("79386A8VPTB9") },
  { id: "coursera-crash-course-on-python", kind: "course", title: "Crash Course on Python", issuer: GOOGLE, date: "2023-08-21", verifyUrl: coursera("QYL6774T2T8N") },

  // Dicoding
  { id: "dicoding-belajar-dasar-git-dengan-github", kind: "course", title: "Belajar Dasar Git dengan GitHub", issuer: "Dicoding", date: "2023-08-11", verifyUrl: dicoding("53XEN5VLYXRN") },
  { id: "dicoding-dasar-pemrograman", kind: "course", title: "Memulai Dasar Pemrograman untuk Menjadi Pengembang Software", issuer: "Dicoding", date: "2023-08-09", verifyUrl: dicoding("JLX1DY2R2Z72") },
  { id: "dicoding-programming-logic-101", kind: "course", title: "Pengenalan ke Logika Pemrograman (Programming Logic 101)", issuer: "Dicoding", date: "2023-08-09", verifyUrl: dicoding("1RXY6V13MZVM") },
];

export const certificateImage = (id: string) => `/certificates/${id}.jpg`;

/** Shown as thumbnails in the home Recognition column. */
export const featuredCertificateIds = [
  "data-royale-2023",
  "deeplearning-ai-tensorflow-specialization",
  "coursera-machine-learning-specialization",
];

/** Credential that backs each project field on /projects. */
export const fieldCertificateIds: Partial<Record<ProjectField, string>> = {
  "AI / ML": "deeplearning-ai-tensorflow-specialization",
  "Data / Optimization": "data-royale-2023",
};

export const certificateHref = (id: string) => `/certificates?c=${id}`;
