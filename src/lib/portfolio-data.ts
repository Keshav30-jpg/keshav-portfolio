export const LINKS = {
  github: "https://github.com/Keshav30-jpg",
  linkedin: "https://www.linkedin.com/in/keshav-s-058264319/",
  email: "keshavharis30@gmail.com",
  photo: "https://i.postimg.cc/nVmXY7Ys/photo-of-keshav.jpg",
  heroPhoto: "https://i.postimg.cc/pTXCV2ty/photo-of-keshav.jpg",
};

export const RESUME_URL = "/api/public/files/resume.pdf";
export const RESUME_DOWNLOAD_URL = "/api/public/files/resume.pdf?download=1";
export const CERT_URL = "/api/public/files/certificate.pdf";

export const SKILLS = [
  { group: "Programming Languages", items: ["Python", "SQL", "Core Java"] },
  { group: "Data Analytics", items: ["Pandas", "NumPy", "Exploratory Data Analysis (EDA)", "Power BI", "DAX", "Excel", "Data Modelling"] },
  { group: "Machine Learning", items: ["Scikit-learn", "Data Preprocessing", "Machine Learning", "Model Evaluation", "Customer Churn Prediction"] },
  { group: "Generative AI & RAG", items: ["Retrieval-Augmented Generation (RAG)", "Large Language Models (LLMs)", "Embeddings", "ChromaDB", "OpenRouter API"] },
  { group: "Tools & Platforms", items: ["Git", "GitHub", "MySQL", "Streamlit", "Cursor IDE"] },
];

export const PROJECTS = [
  {
    title: "Customer Churn Prediction",
    tech: ["Python", "Scikit-learn", "Streamlit"],
    desc: "Developed a customer churn prediction solution using leakage-safe data preprocessing and exploratory data analysis on 1,000 customer records. Built a machine learning model achieving 69% accuracy and a 64.33% F1-score on the test dataset.",
    features: ["Leakage-safe data preprocessing", "Exploratory data analysis", "ML-based churn prediction", "Interactive Streamlit dashboard", "Input validation & PII detection", "AI-generated prediction explanations", "Customer retention recommendations"],
    metrics: [["1,000", "customer records"], ["69%", "test accuracy"], ["64.33%", "test F1-score"]],
    note: "Metrics measured on the held-out test set, not production performance.",
    github: "https://github.com/Keshav30-jpg/Capstone-Project-Recheck",
    demo: "https://churn-prediction-check.streamlit.app/",
    demoLabel: "Try Live Demo",
  },
  {
    title: "Adventure Works Sales Analysis Report",
    tech: ["Power BI", "DAX", "Data Modelling"],
    desc: "Developed an interactive sales analytics dashboard to examine revenue, profitability margins, and customer behaviour across more than 29,000 transactions. Implemented DAX time-intelligence calculations to evaluate business performance and identify trends.",
    features: ["Interactive sales dashboard", "Revenue & profitability analysis", "Customer behaviour analysis", "Month-over-month (MoM) growth", "Month-to-date (MTD) tracking", "Year-to-date (YTD) tracking", "Business performance visuals"],
    metrics: [["29,000+", "transactions analysed"]],
    note: "",
    github: "https://github.com/Keshav30-jpg/PowerBI-Project",
    demo: "https://power-bi-project-two.vercel.app/",
    demoLabel: "View Dashboard",
  },
  {
    title: "PDF Q&A — Retrieval-Augmented Generation",
    tech: ["Python", "Streamlit", "ChromaDB", "OpenRouter API"],
    desc: "Engineered a RAG pipeline from scratch without LangChain. Integrated document chunking, embeddings, ChromaDB vector search, and prompt grounding to answer questions from uploaded PDFs, with filename and page-number citations — designed to improve grounding and traceability.",
    features: ["Multi-PDF question answering", "Text extraction & chunking", "Embedding-based semantic retrieval", "ChromaDB vector search", "Grounded responses from your documents", "Filename & page-number citations", "Secure API-key management", "Streamlit web interface"],
    metrics: [["200", "pages per PDF"], ["15 MB", "per file, multiple per session"]],
    note: "",
    github: "https://github.com/Keshav30-jpg/Capstone-RAG-Project",
    demo: "https://pdfs-based-rag.streamlit.app/",
    demoLabel: "Try Live Demo",
  },
];

export const EXPERTISE = [
  { title: "Data Analysis & Interactive Dashboards", text: "Exploratory data analysis, business intelligence, data modelling, Power BI dashboards, DAX calculations, and data-driven reporting." },
  { title: "Machine Learning Model Development", text: "Preprocessing, leakage prevention, model evaluation, classification metrics, churn prediction, and practical model deployment." },
  { title: "AI-Powered Applications & RAG", text: "LLM applications, document chunking, embeddings, vector databases, retrieval, prompt grounding, and PDF question-answering interfaces." },
];

export const NAV = [
  ["Home", "home"], ["About", "about"], ["Skills", "skills"], ["Projects", "projects"],
  ["Education", "education"], ["Resume", "resume"], ["Contact", "contact"],
] as const;
