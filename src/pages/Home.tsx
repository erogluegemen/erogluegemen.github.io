import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardBody } from '@/components/ui/card';
import { btnCls } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { canonicalUrl } from '@/lib/seo';

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 22, stiffness: 90 } },
};

const stagger = (delayChildren = 0.05) => ({
  hidden: {},
  show: { transition: { staggerChildren: delayChildren } },
});

function FadeIn({ children, className, delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', damping: 22, stiffness: 90, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const TRACKING_STEPS = ['Idea', 'R&D', 'Testing', 'Shipped'];

function TrackingBar() {
  const [step, setStep] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let started = false;
    let t: ReturnType<typeof setInterval>;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true;
        let i = 0;
        t = setInterval(() => {
          setStep(i);
          i++;
          if (i >= TRACKING_STEPS.length) clearInterval(t);
        }, 650);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => { observer.disconnect(); clearInterval(t); };
  }, []);

  return (
    <div ref={containerRef} className="mt-5 p-4 rounded-2xl border border-card-border bg-white shadow-md min-w-[280px]">
      <p className="text-xs font-black text-muted uppercase tracking-widest mb-4">
        Shipping status
      </p>
      <div className="grid grid-cols-4">
        {TRACKING_STEPS.map((label, i) => {
          const active = i <= step;
          return (
            <div key={label} className="flex flex-col items-center relative">
              {i > 0 && (
                <motion.div
                  className="absolute top-[9px] right-1/2 w-full h-0.5"
                  style={{ background: active ? '#D40511' : '#e5e7eb', transformOrigin: 'right' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: active ? 1 : 0 }}
                  transition={{ duration: 0.4, delay: i * 0.65 + 0.2 }}
                />
              )}
              <motion.div
                className={cn(
                  'w-5 h-5 rounded-full border-2 z-10 flex items-center justify-center',
                  active ? 'bg-dhl-red border-dhl-red' : 'bg-white border-card-border'
                )}
                animate={active ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                transition={{ duration: 0.35, delay: i * 0.65 }}
              >
                {active && i === TRACKING_STEPS.length - 1 && (
                  <span className="text-white text-[9px] font-black leading-none">✓</span>
                )}
              </motion.div>
              <span className={cn('text-[10px] font-bold mt-2 text-center leading-tight whitespace-nowrap', active ? 'text-dhl-red' : 'text-muted')}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VanPanel() {
  const vanRef = useRef<HTMLVideoElement>(null);
  const [honking, setHonking] = useState(false);

  const honk = useCallback(() => {
    if (honking) return;
    setHonking(true);
    vanRef.current?.classList.add('van-wiggle');
    setTimeout(() => {
      vanRef.current?.classList.remove('van-wiggle');
      setHonking(false);
    }, 400);
  }, [honking]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key.toLowerCase() === 'h') honk(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [honk]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative inline-block cursor-pointer" onClick={honk}>
        <video
          ref={vanRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/assets/images/dhl-van-poster.png"
          aria-label="DHL Van"
          className="block mx-auto"
          style={{
            width: 'clamp(220px, 36vw, 400px)',
            height: 'auto',
            filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.15))',
          }}
        >
          <source src="/assets/images/dhl-van.webm" type="video/webm" />
          <source src="/assets/images/dhl-van.mp4" type="video/mp4" />
        </video>
        <AnimatePresence>
          {honking && (
            <motion.div
              key="beep"
              initial={{ opacity: 0, y: 4, scale: 0.85 }}
              animate={{ opacity: 1, y: -8, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-dhl-red text-white px-3 py-1.5 rounded-full font-black text-sm shadow-lg pointer-events-none z-10"
            >
              beep-beep! 📯
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <p className="text-xs text-muted text-center mt-1">
        <span className="sm:hidden">Tap the van to honk.</span>
        <span className="hidden sm:inline">Tip: press <span className="font-mono font-bold bg-dhl-yellow/30 px-1 rounded">H</span> to honk.</span>
      </p>
      <TrackingBar />
    </div>
  );
}

function Hero() {
  return (
    <section id="home" className="w-full max-w-[1120px] mx-auto px-4 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        <motion.div variants={stagger(0.08)} initial="hidden" animate="show">
          <motion.div variants={fadeUp} className="mb-4">
            <img
              src="/assets/images/avatar.png"
              alt="Egemen Eroglu"
              className="w-20 h-20 rounded-full object-cover border-4 border-dhl-yellow shadow-lg"
              style={{ objectPosition: 'center top' }}
            />
          </motion.div>
          <motion.h1 variants={fadeUp}>
            Hi, I'm Egemen, building &amp; testing ideas that ship at{' '}
            <span className="font-mono bg-dhl-yellow/30 px-1.5 py-0.5 rounded-lg">Express</span> speed.
          </motion.h1>

          <motion.p variants={fadeUp} className="text-base text-muted mt-1">
            <strong className="text-ink">R&D Specialist at DHL Express.</strong> AI training delivered
            to 200+ people · predictive ML systems running in production logistics.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mt-5">
            <a href="#projects" className={btnCls()}>See Projects</a>
            <a href="#contact" className={btnCls('outline')}>Get in Touch</a>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <VanPanel />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

type ProjectStatus = 'published' | 'internal' | 'upcoming';

interface Project {
  num: string;
  category: string;
  title: string;
  desc: string;
  stack: string[];
  status: ProjectStatus;
  statusLabel: string;
  href?: string;
}

const PROJECTS: Project[] = [
  {
    num: '01',
    category: 'ML · Last-Mile',
    title: 'Address Error Detection',
    desc: 'Predictive ML framework that catches address errors before shipment, improving last-mile delivery success rates and reducing manual handling.',
    stack: ['Python', 'Transformers', 'XGBoost', 'LightGBM', 'CatBoost'],
    status: 'published',
    statusLabel: 'IEEE UBMK 2025',
    href: 'https://www.researchgate.net/profile/Egemen-Eroglu-2/publication/396872399_Predictive_Machine_Learning_Framework_for_Address_Error_Detection_in_Logistics_System/links/68fc876a220a341aa15825a5/Predictive-Machine-Learning-Framework-for-Address-Error-Detection-in-Logistics-System.pdf',
  },
  {
    num: '02',
    category: 'Deep Learning · Routing',
    title: 'Destination Facility Prediction',
    desc: 'Deep learning framework for predicting the correct destination facility for inbound shipments, reducing misrouting and handling costs.',
    stack: ['Python', 'Deep Learning', 'Pandas'],
    status: 'upcoming',
    statusLabel: 'INFUS 2026 (accepted)',
  },
  {
    num: '03',
    category: 'AI · LLM · MCP',
    title: 'MCP Customs Portal',
    desc: 'Hybrid RAG + LLM + MCP system for DHL Express Turkey customs operations, resolving unstructured regulatory queries (legislation PDFs) and structured EVRIM/BILGE data via natural language. Incorporates sentiment analysis, topic modeling, and hybrid keyword-semantic retrieval; targeting 90%+ intent classification accuracy, Recall@5 above 85%, and sub-5-second latency, with autonomous handling of 30% of routine call center queries. Patent application filed for the secure RAG + MCP integration component.',
    stack: ['Python', 'MCP', 'LLM'],
    status: 'internal',
    statusLabel: 'Internal',
  },
  {
    num: '04',
    category: 'RPA · OCR · Automation',
    title: 'Freight Documentation Automation',
    desc: 'Automated end-to-end generation of Freight Non-Existence Letters across 150-200 daily inbound shipment requests, cutting per-request processing time from 1.5 minutes to under 15 seconds via a Snowflake → Dataiku → MSSQL → IIS pipeline with full audit logging, freeing 0.5 FTE and extending availability from business hours to 7/24.',
    stack: ['Python', 'RPA', 'OCR'],
    status: 'internal',
    statusLabel: 'Internal',
  },
  {
    num: '05',
    category: 'OR · EV Infrastructure',
    title: 'EV Charging Station Optimization',
    desc: "Formulated a binary integer linear program for EV fleet allocation across DHL Express Turkey's 3 Istanbul distribution centers, jointly optimizing customer-to-depot and vehicle-to-depot assignment to minimize demand-weighted total distance under capacity constraints. Solved via PuLP/CBC.",
    stack: ['Python', 'ILP', 'PuLP/CBC'],
    status: 'upcoming',
    statusLabel: 'ISPR 2026 (accepted)',
  },
  {
    num: '06',
    category: 'NLP · MLOps · ITSM',
    title: 'ARGUS — ITSM Intelligence Platform',
    desc: "Built an AI-powered ticket intelligence system for DHL Express Turkey's IT support team, combining a fine-tuned Turkish BERT classifier, a LightGBM SLA-risk scorer with SHAP explainability, and a FAISS-based similar-ticket retrieval engine over historical ServiceNow data. Served through a single FastAPI endpoint with a web UI supporting drag-and-drop ticket parsing and analysis history, to speed up IT operations triage and routing.",
    stack: ['Python', 'BERT', 'LightGBM', 'FAISS', 'FastAPI'],
    status: 'internal',
    statusLabel: 'Internal',
  },
];

const STATUS_STYLES: Record<ProjectStatus, string> = {
  published: 'bg-green-50 border-green-300/60 text-green-700',
  internal:  'bg-gray-50 border-gray-200 text-muted',
  upcoming:  'bg-dhl-yellow/20 border-dhl-yellow/60 text-ink',
};

const STATUS_ICONS: Record<ProjectStatus, string> = {
  published: '📄',
  internal:  '🔒',
  upcoming:  '⏳',
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const badge = (
    <span className={cn(
      'shrink-0 inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border',
      STATUS_STYLES[project.status]
    )}>
      {project.statusLabel} {project.href ? '↗' : STATUS_ICONS[project.status]}
    </span>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', damping: 22, delay: index * 0.05 }}
      whileHover={project.status !== 'upcoming' ? { y: -3, transition: { type: 'spring', stiffness: 400, damping: 25 } } : undefined}
      className={cn(
        'relative bg-card border border-card-border rounded-2xl p-6 overflow-hidden shadow-sm flex flex-col gap-4',
        project.status === 'upcoming' && 'border-dashed opacity-70'
      )}
    >
      {/* Decorative project number */}
      <span aria-hidden="true" className="absolute top-2 right-4 text-8xl font-black select-none pointer-events-none leading-none"
        style={{ color: 'rgba(26,26,26,0.04)' }}>
        {project.num}
      </span>

      {/* Category + status badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-black text-muted uppercase tracking-widest">
          {project.category}
        </span>
        {project.href
          ? <a href={project.href} target="_blank" rel="noopener" className="no-underline hover:opacity-80 transition-opacity">{badge}</a>
          : badge
        }
      </div>

      {/* Title + description */}
      <div>
        <h3 className="text-lg font-black mb-2 leading-tight">{project.title}</h3>
        <p className="text-sm text-muted leading-relaxed">{project.desc}</p>
      </div>

      {/* Stack chips */}
      <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
        {project.stack.map(tech => (
          <span key={tech} className="text-[11px] font-bold px-2 py-0.5 rounded-full border border-ink/10 text-ink/60"
            style={{ background: 'rgba(26,26,26,0.04)' }}>
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function Projects() {
  return (
    <section id="projects" className="w-full max-w-[1120px] mx-auto px-4 py-14 border-t border-card-border">
      <FadeIn><h2 className="mb-6">Selected Projects</h2></FadeIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PROJECTS.map((project, i) => (
          <ProjectCard key={project.num} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

const ABOUT_FACTS = [
  { label: 'Focus', value: 'The model is 20% of the work. The other 80% is keeping it alive.' },
  { label: 'Fun', value: 'Strong coffee · mechanical watches · saxophone.' },
  { label: 'Languages', value: 'Turkish (native) · English (C1) · German (A2)' },
  { label: 'Location', value: 'Istanbul, open to relocation in Germany.' },
];

const SKILLS: { group: string; items: string[] }[] = [
  { group: 'ML & AI', items: ['PyTorch', 'scikit-learn', 'Transformers', 'XGBoost', 'LightGBM', 'CatBoost', 'Optuna', 'SHAP', 'LIME', 'LLM/RAG pipelines', 'Agent Orchestration (MCP)'] },
  { group: 'Languages', items: ['Python', 'SQL', 'Unix/Linux Scripting', 'Git'] },
  { group: 'Cloud & Databases', items: ['Azure (AZ-900, DP-900)', 'Snowflake', 'Databricks', 'MSSQL', 'PostgreSQL', 'MongoDB', 'Teradata'] },
  { group: 'Data Engineering', items: ['Airflow', 'Kafka', 'Docker', 'Spark', 'Dataiku', 'IBM DataStage'] },
  { group: 'Frameworks', items: ['Django', 'FastAPI', 'Streamlit', 'Pydantic', 'Pytest'] },
  { group: 'BI & Monitoring', items: ['PowerBI', 'Tableau', 'Grafana', 'ELK Stack'] },
];

function About() {
  return (
    <section id="about" className="w-full max-w-[1120px] mx-auto px-4 py-10 border-t border-card-border">
      <FadeIn><h2>About</h2></FadeIn>
      <FadeIn delay={0.05}>
        <p className="text-base mb-5">
          I'm an R&D Specialist at DHL Express: researching, prototyping, and deploying ML systems
          that run in DHL Express's global logistics network.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
        {ABOUT_FACTS.map((fact, i) => (
          <FadeIn key={fact.label} delay={0.05 * i}>
            <div className="bg-card border border-card-border rounded-xl p-3.5 h-full">
              <span className="block text-xs font-black text-dhl-red uppercase tracking-wide mb-0.5">
                {fact.label}
              </span>
              <span className="text-sm font-semibold">{fact.value}</span>
            </div>
          </FadeIn>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {SKILLS.map((group, gi) => (
          <FadeIn key={group.group} delay={0.05 * gi}>
            <div>
              <h3 className="text-sm font-black mb-2">{group.group}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-card-border bg-card text-xs font-bold shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-dhl-red inline-block" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ─── Vitae ────────────────────────────────────────────────────────────────────

interface TimelineItemProps { icon: string; title: string; date: string; desc?: string; }

function TimelineItem({ icon, title, date, desc }: TimelineItemProps) {
  return (
    <FadeIn>
      <div className="flex gap-3 mb-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dhl-red text-white flex items-center justify-center text-sm shadow-sm mt-0.5">
          {icon}
        </div>
        <div className="bg-card border border-card-border rounded-xl p-3.5 flex-1 shadow-sm">
          <h4 className="text-sm font-black mb-0.5 leading-snug">{title}</h4>
          <span className="text-xs font-semibold text-muted">{date}</span>
          {desc && <p className="text-xs text-muted mt-1 mb-0">{desc}</p>}
        </div>
      </div>
    </FadeIn>
  );
}

interface PubItemProps { title: string; venue: string; href?: string; upcoming?: boolean; }

function PubItem({ title, venue, href, upcoming }: PubItemProps) {
  return (
    <FadeIn>
      <div className="flex gap-3 mb-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-dhl-red text-white flex items-center justify-center text-sm shadow-sm mt-0.5">
          📄
        </div>
        <div className={cn('bg-card border border-card-border rounded-xl p-3.5 flex-1 shadow-sm', upcoming && 'border-dashed opacity-60')}>
          <h4 className="text-sm font-black leading-snug mb-0.5">
            {href ? <a href={href} target="_blank" rel="noopener" className="text-dhl-red">{title}</a> : title}
          </h4>
          <span className="text-xs font-semibold text-muted">{venue}</span>
        </div>
      </div>
    </FadeIn>
  );
}

function Vitae() {
  return (
    <section id="experience" className="w-full max-w-[1120px] mx-auto px-4 py-10 border-t border-card-border">
      <FadeIn><h2>Experience</h2></FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-2">
        <div>
          <h3 className="text-base font-black mb-4">Experience</h3>
          <TimelineItem icon="🚚" title="R&D Specialist · DHL Express" date="Apr 2025 – Present" desc="Patent application filed · AI training for 200+ · DigiForce · RPA leadership" />
          <TimelineItem icon="🏭" title="Data Scientist · Bosch" date="Oct 2023 – Mar 2025" desc="AI-SCREP · SparkUp / GecoAI" />
          <TimelineItem icon="🧠" title="ML Researcher · Koç University" date="Jul 2023 – Jul 2024" />
          <TimelineItem icon="🏦" title="DWH & Data Engineer · Halkbank" date="Jul 2023 – Oct 2023" />
          <TimelineItem icon="💻" title="Data Engineer Team Lead · Jeton Digital" date="Mar 2023 – Jun 2023" />
          <TimelineItem icon="💻" title="Data Engineer · Jeton Digital" date="Sep 2022 – Mar 2023" />
          <TimelineItem icon="📊" title="Data Scientist Intern · SmartOpt" date="Jul 2022 – Aug 2022" />
        </div>

        <div>
          <h3 className="text-base font-black mb-4">Education</h3>
          <TimelineItem icon="🎓" title="MSc Computer Engineering · Bahçeşehir University" date="Oct 2025 – Present" />
          <TimelineItem icon="🎓" title="BSc Computer Engineering · Bahçeşehir University" date="Sep 2020 – Jan 2025" />
        </div>

        <div>
          <h3 className="text-base font-black mb-4">Publications</h3>
          <PubItem title="From Detection to Resolution: A Deep Learning Framework for Destination Facility Prediction in Inbound Shipments" venue="INFUS 2026" />
          <PubItem title="Post-Hoc Explainability for Neural Anomaly Detection in Logistics: An Empirical Comparison of SHAP, LIME, and Integrated Gradients" venue="UBMK 2026" />
          <PubItem title="Set Covering Problem-Based Location Optimization for Electric Vehicle Charging Stations: A Real Case Study" venue="ISPR 2026" />
          <PubItem title="AI and Operations Research Applications in Express Air Cargo: A Systematic Literature Review" venue="YAEM 2026" />
          <PubItem
            title="Simulation Applications in the Logistics Sector: A Systematic Literature Review"
            venue="YAEM 2025"
            href="https://www.researchgate.net/publication/404775234_Simulation_Applications_in_the_Logistics_Sector_A_Systematic_Literature_Review"
          />
          <PubItem
            title="Predictive Machine Learning Framework for Address Error Detection in Logistics System"
            venue="IEEE UBMK 2025"
            href="https://www.researchgate.net/profile/Egemen-Eroglu-2/publication/396872399_Predictive_Machine_Learning_Framework_for_Address_Error_Detection_in_Logistics_System/links/68fc876a220a341aa15825a5/Predictive-Machine-Learning-Framework-for-Address-Error-Detection-in-Logistics-System.pdf"
          />
          <PubItem
            title="A Data Envelopment Analysis Model for the Efficiency Measurement of Call Center Agents in Logistic Industry"
            venue="ETMS 2025"
            href="https://ituyayinevi.itu.edu.tr/docs/librariesprovider59/bildiriler/978-975-561-713-8.pdf?sfvrsn=4f2efed0_2#page=18"
          />
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" className="w-full max-w-[1120px] mx-auto px-4 py-10 border-t border-card-border">
      <FadeIn><h2>Contact</h2></FadeIn>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        <FadeIn>
          <Card className="h-full">
            <CardBody>
              <h3 className="text-base font-black mb-2">Let's talk</h3>
              <p className="text-sm text-muted mb-0">
                Best way:{' '}
                <a href="mailto:erogluegemen@gmail.com" className="font-bold text-dhl-red">
                  erogluegemen@gmail.com
                </a>
              </p>
              <p className="text-sm text-muted mt-2 mb-0">
                Also on:{' '}
                <a href="https://github.com/erogluegemen" target="_blank" rel="noopener" className="font-bold text-dhl-red">GitHub</a>
                {' · '}
                <a href="https://www.linkedin.com/in/egemeneroglu" target="_blank" rel="noopener" className="font-bold text-dhl-red">LinkedIn</a>
                {' · '}
                <a href="https://scholar.google.com/citations?user=_MF_RW8AAAAJ&hl=tr" target="_blank" rel="noopener" className="font-bold text-dhl-red">Google Scholar</a>
              </p>
            </CardBody>
          </Card>
        </FadeIn>
        <FadeIn delay={0.07}>
          <Card className="h-full">
            <CardBody className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black mb-0.5">Resume</h3>
                <p className="text-sm text-muted mb-0">Updated July 2026.</p>
              </div>
              <a href="assets/pdf/EgemenEroglu_CV.pdf" target="_blank" rel="noopener" className={btnCls('default', 'default', 'shrink-0')}>
                View Resume ↗
              </a>
            </CardBody>
          </Card>
        </FadeIn>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Egemen Eroglu — R&D Specialist | ML Researcher</title>
        <meta name="description" content="Egemen Eroglu — R&D Specialist & ML Researcher at DHL Express. Researching, prototyping, and deploying ML systems for global logistics." />
        <link rel="canonical" href={canonicalUrl('/')} />
        <meta property="og:url" content={canonicalUrl('/')} />
      </Helmet>
      <Hero />
      <Projects />
      <About />
      <Vitae />
      <Contact />
    </>
  );
}
