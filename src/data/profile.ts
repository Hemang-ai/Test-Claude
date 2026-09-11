// Every piece of copy on the site lives here. Edit this file to change content;
// the components only render what they find.

export const identity = {
  firstName: 'Hemang',
  lastName: 'Upadhyay',
  monogram: 'H',
  greeting: "Hello! I'm",
  roleEyebrow: 'AI',
  roleLines: ['PRODUCT', 'LEADER'],
  tagline: 'Strategic Product Leader & AI Researcher',
  location: 'New York metro (Nutley, NJ)',
  email: 'hemang.u1988@gmail.com',
  site: 'https://www.hemangai.com',
  linkedin: 'https://www.linkedin.com/in/hemang-up/',
  scholar: 'https://scholar.google.com/citations?user=3cdNYHQAAAAJ&hl=en',
  sessionize: 'https://sessionize.com/hemang-upadhyay/',
  resumeFile: 'Hemang_Upadhyay_Resume.pdf',
  headshot: 'hemang.png',
  headshotJpg: 'hemang.jpg',
  currentRole: 'Senior Product Manager, D2C Digital Product, AI & Platform Modernization',
  currentCompany: 'LG Electronics USA',
}

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Speaking', href: '#speaking' },
  { label: 'Research', href: '#research' },
  { label: 'Writing', href: '#writing' },
  { label: 'Contact', href: '#contact' },
]

export const about = {
  lead:
    'I build AI-driven commerce and financial products inside large, regulated organizations, and I care about the part after the demo: the roadmap, the OKRs, the vendor decisions and the measurable outcome.',
  body: [
    'Over 16 years I have shipped digital lending workflows, AI-enabled D2C experiences, consumer commerce platforms and financial-services transformations for high-scale U.S. companies. Today I lead product strategy across LG Electronics’ consumer and B2B digital ecosystem: AI-powered search, recommendations, self-service automation, checkout and payments, post-purchase journeys and product-data modernization.',
    'Before LG, I led digital mortgage and borrower platforms at Caliber Home Loans and subscription product development at TiVo. I am a published researcher in applied AI, a frequent conference speaker, and a research-paper session judge.',
  ],
  focus: ['Agentic AI in commerce', 'AI search & personalization', 'Digital lending & borrower journeys', 'D2C growth & experimentation', 'Product data & platform modernization', 'OKR / KPI leadership'],
}

export const stats = [
  { value: '$240M+', label: 'Scalable solution value across digital commerce, AI and platform modernization' },
  { value: '+40%', label: 'B2C revenue growth after PIM, headless CMS and DAM modernization' },
  { value: '+15%', label: 'Checkout conversion lift from AI recommendations, plus $18 higher average order' },
  { value: '$1.2M', label: 'Annual service-cost savings from Sprinklr self-service automation' },
  { value: '+12', label: 'NPS points from Coveo AI-powered search, with +8% conversion' },
  { value: '40%', label: 'Faster borrower processing across mortgage onboarding workflows' },
  { value: '$400K', label: 'Vendor cost eliminated through SAP–Salesforce workflow automation' },
  { value: '56', label: 'Person Agile delivery ecosystem led, with 95% on-time delivery' },
]

export type Role = {
  company: string
  role: string
  start: string
  end: string
  location: string
  bullets: string[]
  compact?: boolean
}

export const experience: Role[] = [
  {
    company: 'LG Electronics USA',
    role: 'Senior Product Manager — D2C Digital Product, AI & Platform Modernization',
    start: 'Nov 2021',
    end: 'Present',
    location: 'Englewood Cliffs, NJ',
    bullets: [
      'Own product strategy, roadmap, discovery, PRDs and lifecycle across lg.com/us, solutions.lg.com/us, Magento/OMS, checkout, support and post-purchase.',
      'Modernized the B2C platform with Akeneo PIM, Contentstack headless CMS and Bynder DAM, building an AI-ready product-data foundation that contributed to 40% revenue growth.',
      'Shipped Coveo AI search (+12 NPS, +8% conversion) and AI recommendations (+15% checkout conversion, +$18 AOV).',
      'Owned the Sprinklr self-service chatbot from discovery to optimization: 60% faster support responses and about $1.2M in annual savings.',
      'Defined payments and post-purchase requirements: PayPal, Affirm/Klarna BNPL, Apple Pay and Google Pay, refunds, PCI Pal and New Relic observability.',
      'Led discovery for B2B cloud software sales: standalone and bundled SaaS licensing with activation, usage-aware cancellation and lifecycle controls.',
      'Mentor 3 product managers and 2 business analysts across a 56-person delivery ecosystem; release cycles 30% shorter, about 95% on time.',
    ],
  },
  {
    company: 'Caliber Home Loans · Tavant Technologies',
    role: 'Senior Product Manager — Digital Mortgage & Borrower Platforms',
    start: 'Dec 2019',
    end: 'Nov 2021',
    location: 'United States',
    bullets: [
      'Led discovery and delivery for regulated mortgage onboarding, credit approval, DTU optimization and borrower-facing workflows.',
      'Redesigned borrower signup and lending journeys, cutting processing time by 40%.',
      'Automated SAP–Salesforce workflows: 40% fewer manual hours and about $400K in vendor cost removed.',
    ],
  },
  {
    company: 'TiVo Corporation · Tavant Technologies',
    role: 'Senior Product Manager — Platform, Subscription & Client Product Development',
    start: 'Dec 2018',
    end: 'Nov 2019',
    location: 'United States',
    bullets: [
      'Defined vision, strategy and roadmap for enterprise client solutions tied to about $60M in projected growth.',
      'Built onboarding workflows and subscription operating models around an 18-month roadmap.',
    ],
  },
  {
    company: 'Intexture LLP',
    role: 'Senior Product Analyst — B2B/B2C Digital Solutions',
    start: 'Jun 2014',
    end: 'Mar 2017',
    location: 'India / U.S. clients',
    bullets: ['Agile delivery leadership, client discovery and implementation-ready product documentation; Mailchimp nurture journeys lifted open rates 40%.'],
    compact: true,
  },
  {
    company: 'Softweb Solutions',
    role: 'Manager — Enterprise Web and Mobility Solutions',
    start: 'Apr 2013',
    end: 'May 2014',
    location: 'India / U.S. clients',
    bullets: ['Managed enterprise web, mobility, healthcare and digital campaign programs from requirements through delivery.'],
    compact: true,
  },
  {
    company: 'i-Triangle Technolabs',
    role: 'Senior Product Analyst — Healthcare, UI/UX & Delivery',
    start: 'Mar 2010',
    end: 'Mar 2013',
    location: 'Ahmedabad, India',
    bullets: ['BRD/SRS documentation, backlog management, UI/UX coordination and delivery for healthcare and enterprise web products.'],
    compact: true,
  },
  {
    company: 'iMobDev Technologies',
    role: 'Software Developer — Chat & CRM Web Application Modules',
    start: 'May 2009',
    end: 'Feb 2010',
    location: 'Ahmedabad, India',
    bullets: ['Built chat and CRM web application modules.'],
    compact: true,
  },
]

export type Project = {
  title: string
  outcome: string
  summary: string
  tools: string[]
  org: string
}

export const work: Project[] = [
  {
    title: 'Agentic AI and self-service on lg.com/us',
    outcome: '60% faster support, $1.2M saved per year',
    summary: 'Took conversational self-service from discovery to production on a Fortune 500 commerce platform, replacing rule-based flows with observable, self-correcting automation.',
    tools: ['Sprinklr', 'LLM agents', 'Observability'],
    org: 'LG Electronics',
  },
  {
    title: 'AI search and discovery',
    outcome: '+12 NPS, +8% conversion',
    summary: 'Replaced keyword search with Coveo AI relevance, merchandising controls and self-service findability across consumer and B2B catalogs.',
    tools: ['Coveo', 'Merchandising', 'Experimentation'],
    org: 'LG Electronics',
  },
  {
    title: 'AI recommendations and personalization',
    outcome: '+15% checkout conversion, +$18 AOV',
    summary: 'Connected product data, intent signals and experiments into a measurable D2C personalization roadmap.',
    tools: ['Recommendations', 'GA4', 'Amplitude', 'A/B testing'],
    org: 'LG Electronics',
  },
  {
    title: 'Headless commerce and product-data modernization',
    outcome: '+40% B2C revenue',
    summary: 'Migrated product information into Akeneo PIM, integrated Contentstack headless CMS and adopted Bynder DAM to create an AI-ready product-data foundation.',
    tools: ['Akeneo', 'Contentstack', 'Bynder', 'Magento'],
    org: 'LG Electronics',
  },
  {
    title: 'Payments and post-purchase journeys',
    outcome: 'Wallets, BNPL and observability across lg.com/us',
    summary: 'Defined PayPal, Affirm/Klarna, Apple Pay and Google Pay flows, refunds and cancellations, PCI Pal service payments and New Relic monitoring for transaction failures.',
    tools: ['PayPal', 'Affirm', 'Klarna', 'New Relic'],
    org: 'LG Electronics',
  },
  {
    title: 'B2B cloud software licensing',
    outcome: 'Standalone and bundled SaaS sales on OBS',
    summary: 'Product discovery for LG cloud software: activation, license status, usage-aware cancellation, exception handling and lifecycle controls.',
    tools: ['SaaS licensing', 'B2B commerce', 'APIs'],
    org: 'LG Electronics',
  },
  {
    title: 'Digital mortgage borrower platform',
    outcome: '40% faster borrower processing',
    summary: 'Simplified regulated onboarding, credit approval and DTU workflows through journey redesign and workflow automation.',
    tools: ['Digital lending', 'Salesforce', 'SAP'],
    org: 'Caliber Home Loans',
  },
  {
    title: 'SAP–Salesforce workflow automation',
    outcome: '40% fewer manual hours, $400K vendor cost removed',
    summary: 'Automated hand-offs between lending operations systems with better data consistency, traceability and reporting.',
    tools: ['SAP', 'Salesforce', 'Automation'],
    org: 'Caliber Home Loans',
  },
]

export type Talk = { event: string; when: string; title?: string; kind: string }

export const talks: Talk[] = [
  { event: 'Agentic AI Summit, NY Tech Week', when: '2026', title: 'From Pilot to Production: Scaling Rule-Free AI Agents', kind: 'Talk' },
  { event: 'B2B Online Chicago', when: '2026', title: 'The Evolution to Autonomous Commerce', kind: 'Keynote & panel' },
  { event: 'Women in Tech Global Conference', when: '2026', title: 'AI-Native Fraud Detection and Real-Time Risk Intelligence for E-Commerce', kind: 'Talk' },
  { event: 'Identity Week America', when: '2026', kind: 'Speaker' },
  { event: 'Commerce Media Brand Summit', when: '2026', kind: 'Speaker' },
  { event: 'LMD Conference', when: '2026', kind: 'Speaker' },
  { event: 'B2B Connect', when: '2025', kind: 'Speaker' },
  { event: 'Logicbroker', when: '2025', kind: 'Speaker' },
  { event: 'B2B Atlanta', when: '2025', kind: 'Speaker' },
]

export const media = ['CNBC India', 'Zee Business', 'The eCommerce Edge podcast']

export type Paper = { title: string; venue: string; year: string; award?: string; href?: string }

export const papers: Paper[] = [
  {
    title: 'Quantum Computing as a Service (QCaaS): Architecture, Orchestration, and Performance Trade-offs',
    venue: 'IEEE International Conference on Computing Theory and Wireless Communication (ICCTWC)',
    year: '2026',
    award: 'Best Paper Award',
  },
  {
    title: 'Deep Learning Approach for Detection of Fraudulent Credit Card Transactions',
    venue: 'Artificial Intelligence in Cyber Security: Theories and Applications, Springer',
    year: '2023',
  },
]

export const researchThemes = [
  'Agentic AI orchestration',
  'AI-driven fraud detection and risk forecasting',
  'AI-based supply chain optimization and ethics',
  'AI-driven consumer experience trends',
]

export const recognition = [
  { title: 'International Advisory Board Member', detail: 'ICEASTI 2026 — AI, e-commerce, analytics and research evaluation' },
  { title: 'Research paper session judge', detail: 'Academic and professional forums in applied AI' },
  { title: 'Judge, 24-Hour AI Hackathon', detail: 'Hack UNCP 2026, University of North Carolina at Pembroke' },
]

export type Article = { title: string; outlet: string; when: string; href: string; blurb: string }

export const articles: Article[] = [
  {
    title: 'The product detail page is becoming a customer promise contract',
    outlet: 'Retail Customer Experience',
    when: 'Sep 2026',
    href: 'https://www.retailcustomerexperience.com/blogs/the-product-detail-page-is-becoming-a-customer-promise-contract/',
    blurb: 'Shoppers, service teams and AI assistants all rely on product information to decide. That turns the PDP from a merchandising asset into a promise the business has to keep.',
  },
  {
    title: 'Columns on AI, product data and commerce',
    outlet: 'CDO Magazine',
    when: 'Ongoing',
    href: 'https://www.cdomagazine.tech/author/dXNlcjo4MTA=',
    blurb: 'Writing for data and digital leaders on trust-ready AI in commerce, product data governance and enterprise automation.',
  },
  {
    title: 'All articles and talks',
    outlet: 'LinkedIn',
    when: '',
    href: 'https://www.linkedin.com/in/hemang-up/',
    blurb: 'Posts, event recaps and longer essays on agentic commerce and AI product management.',
  },
]

export const education = [
  { school: 'IGlobal University, Virginia', degree: 'Master in Information Technology', when: '2017–2018', note: 'GPA 3.85 / 4.0' },
  { school: 'C.U. Shah College of Engineering & Technology, Gujarat', degree: 'Bachelor in Computer Engineering', when: '2005–2009' },
]

export const certifications = [
  'AI for Product Management — Pendo / Credly, 2025',
  'Advanced Certified Scrum Product Owner — 2021',
  'Agile Certified Product Manager & Product Owner — 2020',
  'Certified ScrumMaster — 2020',
]

export const skills = [
  { group: 'Product leadership', items: ['Vision & roadmap', 'OKRs / KPIs', 'Product-market fit', 'PRDs & user stories', 'Executive alignment', 'Governance'] },
  { group: 'AI & analytics', items: ['AI/ML personalization', 'GenAI & agents', 'Self-service automation', 'GA4', 'Amplitude', 'Tableau', 'SQL', 'Pendo'] },
  { group: 'Commerce & lending', items: ['Checkout & payments', 'Post-purchase', 'A/B testing', 'Mortgage onboarding', 'Credit approval flows', 'Regulated operations'] },
  { group: 'Platforms', items: ['SAP', 'Salesforce', 'Magento / OMS', 'Akeneo', 'Contentstack', 'Bynder', 'Coveo', 'Sprinklr', 'New Relic', 'PayPal', 'Affirm / Klarna'] },
]

export const footer = {
  volunteering: 'Gujarati teacher coordinator at BAPS Temple, Clifton NJ, since 2021.',
}
