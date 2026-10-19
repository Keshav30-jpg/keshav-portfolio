import { useState, type FormEvent } from "react";
import { Send, Check } from "lucide-react";
import { z } from "zod";
import { LINKS } from "@/lib/portfolio-data";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email").max(255, "Email is too long"),
  subject: z.string().trim().max(150, "Subject is too long"),
  message: z.string().trim().min(1, "Please enter a message").max(2000, "Message is too long"),
});

type Field = keyof z.infer<typeof schema>;
const empty = { name: "", email: "", subject: "", message: "" };

export function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);

  const set = (k: Field, v: string) => setValues((s) => ({ ...s, [k]: v }));

  function submit(e: FormEvent) {
    e.preventDefault();
    const r = schema.safeParse(values);
    if (!r.success) {
      const errs: Partial<Record<Field, string>> = {};
      r.error.issues.forEach((i) => { const k = i.path[0] as Field; errs[k] ??= i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    const d = r.data;
    const subject = d.subject || "Internship opportunity";
    const body = `${d.message}\n\n— ${d.name} (${d.email})`;
    window.location.href = `mailto:${LINKS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  const input = "mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";
  const label = "text-sm font-semibold";
  const err = (k: Field) => errors[k] && <p className="mt-1.5 text-sm text-destructive">{errors[k]}</p>;

  return (
    <div className="reveal card w-full p-6 sm:p-10">
      <h3 className="text-2xl font-extrabold tracking-tight">Send a Direct Message</h3>
      <p className="mt-2 text-muted-foreground">Fill in your contact details and message to initiate an internship conversation.</p>

      {sent ? (
        <div className="mt-8 rounded-xl border border-primary/30 bg-accent p-8 text-center text-accent-foreground">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground"><Check size={28} /></span>
          <p className="mt-5 text-xl font-bold">Message Drafted & Email Client Opened!</p>
          <p className="mt-2">Thank you! Your mail client has been opened with your message. You can also reach me directly at <a href={`mailto:${LINKS.email}`} className="font-bold underline-offset-2 hover:underline">{LINKS.email}</a>.</p>
          <button type="button" onClick={() => { setValues(empty); setSent(false); }} className="btn btn-outline mt-6 !py-2">Send another message</button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-8 space-y-5">
          <div>
            <label htmlFor="cf-name" className={label}>Your Name *</label>
            <input id="cf-name" className={input} placeholder="e.g. Sarah Jenkins (Hiring Manager)" maxLength={100} value={values.name} onChange={(e) => set("name", e.target.value)} />
            {err("name")}
          </div>
          <div>
            <label htmlFor="cf-email" className={label}>Your Email Address *</label>
            <input id="cf-email" type="email" className={input} placeholder="e.g. sarah@company.com" maxLength={255} value={values.email} onChange={(e) => set("email", e.target.value)} />
            {err("email")}
          </div>
          <div>
            <label htmlFor="cf-subject" className={label}>Subject</label>
            <input id="cf-subject" className={input} placeholder="e.g. Data Analyst Internship Opportunity" maxLength={150} value={values.subject} onChange={(e) => set("subject", e.target.value)} />
            {err("subject")}
          </div>
          <div>
            <label htmlFor="cf-message" className={label}>Message *</label>
            <textarea id="cf-message" rows={4} className={input} placeholder="Describe your role, company, or questions about my machine learning & Power BI projects..." maxLength={2000} value={values.message} onChange={(e) => set("message", e.target.value)} />
            {err("message")}
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center"><Send size={18} /> Send Internship Inquiry</button>
        </form>
      )}
    </div>
  );
}
