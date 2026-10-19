import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowRight, ArrowDownRight, FileText, Download, Github, Linkedin, Mail, MapPin, Menu, X,
  ExternalLink, BarChart3, Brain, Sparkles, Code2, Database, Wrench, GraduationCap, Award, ArrowUp, Check,
} from "lucide-react";
import heroImg from "@/assets/hero-data.jpg";
import { LINKS, SKILLS, PROJECTS, EXPERTISE, NAV, RESUME_URL, RESUME_DOWNLOAD_URL, CERT_URL } from "@/lib/portfolio-data";
import { getFileStatus } from "@/lib/files.functions";
import { PdfViewer } from "@/components/pdf-viewer";
import { DocumentDownload } from "@/components/document-download";
import { AttendanceCertificate } from "@/components/attendance-certificate";

const TITLE = "Keshav S — Data Analyst & Aspiring AI/ML Engineer";
const DESC = "Portfolio of Keshav S, BCA graduate from Chennai building ML models, Power BI dashboards and RAG apps. Open to Data Analyst and AI/ML internships.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:image", content: LINKS.photo },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: LINKS.photo },
    ],
  }),
  component: Index,
});

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Section({ id, eyebrow, title, sub, children, muted }: { id: string; eyebrow: string; title: string; sub?: string; children: ReactNode; muted?: boolean }) {
  return (
    <section id={id} className={`px-5 py-20 sm:px-8 md:py-28 ${muted ? "bg-muted" : ""}`}>
      <div className="mx-auto max-w-6xl">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
          {sub && <p className="mt-3 text-lg text-muted-foreground">{sub}</p>}
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 10);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled || open ? "border-b border-border bg-background/90 backdrop-blur" : ""}`}>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8" aria-label="Main">
        <a href="#home" className="flex items-center gap-1.5 text-lg font-extrabold">Keshav S <span className="h-2 w-2 rounded-full bg-primary" /></a>
        <ul className="hidden items-center gap-7 lg:flex">
          {NAV.map(([l, id]) => <li key={id}><a href={`#${id}`} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">{l}</a></li>)}
        </ul>
        <a href="/documents/resume.pdf" target="_blank" rel="noopener" className="btn btn-primary hidden !py-2.5 lg:inline-flex">View Resume <ArrowRight size={16} /></a>
        <button className="lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <ul className="border-t border-border px-5 py-4 lg:hidden">
          {NAV.map(([l, id]) => <li key={id}><a onClick={() => setOpen(false)} href={`#${id}`} className="block py-3 font-medium">{l}</a></li>)}
          <li><DocumentDownload href={RESUME_DOWNLOAD_URL} className="btn btn-primary mt-2 w-full">Download Resume <Download size={16} /></DocumentDownload></li>
        </ul>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="px-5 pb-20 pt-28 sm:px-8 md:pt-36">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[1.1fr_1fr] landscape:max-md:grid-cols-[1.2fr_1fr]">
        <div className="reveal">
          <p className="eyebrow flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-primary" /> Open to internship opportunities</p>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight text-primary sm:text-6xl lg:text-7xl">Hello.</h1>
          <p className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">I'm Keshav S.</p>
          <p className="mt-5 text-xl font-semibold">Looking for Data Analyst | <span className="whitespace-nowrap">AI/ML Engineer</span> Internship role</p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            BCA graduate with hands-on experience building machine learning models, interactive Power BI dashboards, and Retrieval-Augmented Generation (RAG) applications. Skilled in Python, SQL, data analysis, model evaluation, and AI-powered application development. Seeking Data Analyst and AI/ML Engineer internship opportunities to apply technical knowledge to practical problems.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="btn btn-primary">Explore My Projects <ArrowDownRight size={18} /></a>
            <a href="#resume" className="btn btn-outline">View Resume <FileText size={18} /></a>
            <DocumentDownload href={RESUME_DOWNLOAD_URL} className="btn btn-outline">Download Resume <Download size={18} /></DocumentDownload>
          </div>
          <div className="mt-6 flex gap-3">
            <Social href={LINKS.github} label="GitHub"><Github size={18} /></Social>
            <Social href={LINKS.linkedin} label="LinkedIn"><Linkedin size={18} /></Social>
          </div>
        </div>
        <div className="reveal relative">
          <div className="card overflow-hidden">
            <img src={heroImg} alt="Abstract 3D data visualisation with bar charts and a trend line" width={1200} height={1008} className="w-full" />
            <div className="flex items-center gap-4 border-t border-border p-5">
              <img src={LINKS.photo} alt="Portrait of Keshav S" width={64} height={64} className="h-16 w-16 rounded-full object-cover ring-4 ring-accent" />
              <div>
                <p className="eyebrow">A project-first portfolio</p>
                <p className="mt-1 font-bold">Keshav S · Chennai, India</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Social({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full border border-input bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary">
      {children}
    </a>
  );
}

const skillIcons = [Code2, BarChart3, Brain, Sparkles, Wrench];

function Index() {
  useReveal();
  const [cert, setCert] = useState(false);
  const [certChecked, setCertChecked] = useState(false);
  useEffect(() => {
    getFileStatus()
      .then((s) => setCert(s.certificate))
      .catch(() => {})
      .finally(() => setCertChecked(true));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <main>
        <Hero />

        <Section id="about" eyebrow="About me" title="Turning raw data into useful decisions." muted>
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
            <p className="reveal text-lg leading-relaxed text-muted-foreground">
              I am a BCA graduate interested in Data Analytics, Machine Learning, and Generative AI. Through hands-on projects, I have worked with customer churn prediction, business intelligence dashboards, and Retrieval-Augmented Generation applications. I enjoy transforming raw data into meaningful insights, developing practical machine learning solutions, and building applications that make AI more useful and accessible. I am looking for an internship where I can contribute to real projects, strengthen my technical skills, and learn from experienced professionals.
            </p>
            <ul className="space-y-3">
              {["Data-driven problem solving", "Practical machine learning & analytics projects", "Interest in AI-powered applications & continuous learning"].map((h) => (
                <li key={h} className="reveal card flex items-center gap-3 p-4 font-semibold"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-accent-foreground"><Check size={16} /></span>{h}</li>
              ))}
            </ul>
          </div>
        </Section>

        <Section id="skills" eyebrow="Technical skills" title="The toolkit behind my projects.">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SKILLS.map((g, i) => {
               const Icon = skillIcons[i] ?? Code2;
              return (
                <div key={g.group} className="reveal card lift p-6">
                  <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground"><Icon size={20} /></span><h3 className="font-bold">{g.group}</h3></div>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {g.items.map((s) => <li key={s} className="rounded-full border border-border bg-muted px-3 py-1 text-sm font-medium">{s}</li>)}
                  </ul>
                </div>
              );
            })}
          </div>
        </Section>

        <Section id="projects" eyebrow="Featured projects" title="Real problems, working solutions." muted>
          <div className="grid gap-8">
            {PROJECTS.map((p, i) => (
              <article key={p.title} className="reveal card lift grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.3fr_1fr]">
                <div>
                  <p className="eyebrow">Project 0{i + 1}</p>
                  <h3 className="mt-2 text-2xl font-extrabold">{p.title}</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">{p.tech.map((t) => <li key={t} className="rounded-md bg-accent px-2.5 py-1 font-mono text-xs font-bold text-accent-foreground">{t}</li>)}</ul>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{p.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-4">
                    {p.metrics.map(([v, l]) => <div key={l}><p className="text-2xl font-extrabold text-primary">{v}</p><p className="text-sm text-muted-foreground">{l}</p></div>)}
                  </div>
                  {p.note && <p className="mt-3 text-xs text-muted-foreground">{p.note}</p>}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline"><Github size={18} /> View GitHub Repository</a>
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary">{p.demoLabel} <ExternalLink size={16} /></a>
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-5">
                  <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Key features</p>
                  <ul className="mt-4 space-y-2.5">{p.features.map((f) => <li key={f} className="flex gap-2 text-sm"><Check size={16} className="mt-0.5 shrink-0 text-primary" />{f}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section id="expertise" eyebrow="Areas of expertise" title="Where my project experience lies.">
          <div className="grid gap-5 md:grid-cols-3">
            {EXPERTISE.map((e, i) => {
               const Icon = [BarChart3, Brain, Sparkles][i] ?? BarChart3;
              return (
                <div key={e.title} className="reveal card lift p-7">
                  <Icon className="text-primary" size={28} />
                  <h3 className="mt-5 text-lg font-bold">{e.title}</h3>
                  <p className="mt-2 text-muted-foreground">{e.text}</p>
                </div>
              );
            })}
          </div>
        </Section>

        <Section id="education" eyebrow="Education & development" title="Learning, formally and continuously." muted>
          <div className="grid gap-10 lg:grid-cols-2">
            <ol className="relative space-y-6 border-l-2 border-accent pl-8">
              {[
                { t: "Bachelor of Computer Applications (BCA)", s: "LN Government College, Chennai, Tamil Nadu", d: "Graduation: May 2026", m: "CGPA: 7.25" },
                { t: "Higher Secondary Certificate (HSC)", s: "Marys Matric Hr. Sec. School, Tindivanam, Tamil Nadu", d: "Year: 2023", m: "Percentage: 72.5%" },
              ].map((e) => (
                <li key={e.t} className="reveal relative">
                  <span className="absolute -left-[42px] grid h-5 w-5 place-items-center rounded-full border-4 border-background bg-primary" />
                  <div className="card p-6">
                    <GraduationCap className="text-primary" />
                    <h3 className="mt-3 text-lg font-bold">{e.t}</h3>
                    <p className="text-muted-foreground">{e.s}</p>
                    <p className="mt-3 font-mono text-sm font-bold">{e.d} · {e.m}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="reveal card h-fit w-full min-w-0 p-6 sm:p-7 ml-0 lg:ml-0 max-lg:ml-[34px] max-lg:w-[calc(100%-34px)]">
              <p className="eyebrow">Professional development</p>
              <Award className="mt-4 text-primary" size={28} />
              <h3 className="mt-3 text-lg font-extrabold sm:text-xl">Applied AI & ML Essentials</h3>
              <p className="text-muted-foreground">Vishlesan i-Hub, IIT Patna × Masai</p>
              <p className="mt-3 font-mono text-sm font-bold">February 2026 – August 2026</p>
              <AttendanceCertificate />
              {cert && (
                <div className="mt-5 flex flex-col items-start gap-3">
                  <p className="inline-block rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground">Course completed · Here is my Certificate</p>
                  <a href="/documents/certificate.pdf" target="_blank" rel="noopener" className="btn btn-primary">View Certificate <ExternalLink size={16} /></a>
                </div>
              )}
            </div>
          </div>
        </Section>

        <Section id="resume" eyebrow="Resume" title="My Resume" sub="Explore my technical background, projects, education, and skills.">
          <div className="reveal card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
              <p className="flex items-center gap-2 font-semibold"><FileText size={18} className="text-primary" /> Keshav_S_Resume.pdf</p>
              <div className="flex flex-wrap gap-2">
                <a href="/documents/resume.pdf" target="_blank" rel="noopener" className="btn btn-outline !py-2">Open in new tab <ExternalLink size={16} /></a>
                <DocumentDownload href={RESUME_DOWNLOAD_URL} className="btn btn-primary !py-2">Download Resume <Download size={16} /></DocumentDownload>
              </div>
            </div>
            <PdfViewer url={RESUME_URL} />
          </div>
        </Section>

        <Section id="contact" eyebrow="Contact" title="Let's Connect" sub="I'm actively looking for Data Analyst and AI/ML Engineer internship opportunities. If you are recruiting for a relevant role or would like to discuss one of my projects, feel free to reach out." muted>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Mail, l: "Email", v: LINKS.email, h: `mailto:${LINKS.email}` },
              { icon: MapPin, l: "Location", v: "Chennai, Tamil Nadu, India" },
              { icon: Linkedin, l: "LinkedIn", v: "keshav-s", h: LINKS.linkedin },
              { icon: Github, l: "GitHub", v: "Keshav30-jpg", h: LINKS.github },
            ].map(({ icon: Icon, l, v, h }) => {
              const inner = (<><Icon className="text-primary" /><p className="mt-4 font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">{l}</p><p className="mt-1 break-all font-semibold">{v}</p></>);
              return h ? (
                <a key={l} href={h} target={h.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="reveal card lift block p-6">{inner}</a>
              ) : <div key={l} className="reveal card p-6">{inner}</div>;
            })}
          </div>
          <a href={`mailto:${LINKS.email}?subject=Internship%20opportunity`} className="btn btn-primary mt-10">Email me about an internship <ArrowRight size={18} /></a>
        </Section>
      </main>

      <footer className="border-t border-border px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6">
          <div><p className="font-extrabold">Keshav S</p><p className="text-sm text-muted-foreground">Data Analytics | AI/ML</p></div>
          <ul className="flex flex-wrap gap-5 text-sm">{NAV.slice(1).map(([l, id]) => <li key={id}><a href={`#${id}`} className="text-muted-foreground hover:text-primary">{l}</a></li>)}</ul>
          <div className="flex items-center gap-3">
            <Social href={LINKS.github} label="GitHub"><Github size={18} /></Social>
            <Social href={LINKS.linkedin} label="LinkedIn"><Linkedin size={18} /></Social>
            <a href="#home" aria-label="Back to top" className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground transition-transform hover:-translate-y-0.5"><ArrowUp size={18} /></a>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-6xl text-sm text-muted-foreground">© {new Date().getFullYear()} Keshav S. All rights reserved.</p>
      </footer>
    </div>
  );
}
