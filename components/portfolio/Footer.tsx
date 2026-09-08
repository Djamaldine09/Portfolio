'use client';

import { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useTransform,
  animate,
  type Variants,
} from 'framer-motion';
import { Github, Linkedin, Mail, Send, Twitter, CheckCircle2 } from 'lucide-react';

/**
 * ==============   Variants   ================
 */
const columnVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const linkVariants: Variants = {
  rest: { x: 0, color: 'rgba(255,255,255,0.6)' },
  hover: { x: 4, color: 'rgba(255,255,255,1)' },
};

const feedbackVariants: Variants = {
  initial: { opacity: 0, y: 8, height: 0 },
  animate: { opacity: 1, y: 0, height: 'auto' },
  exit: { opacity: 0, y: -8, height: 0 },
};

/**
 * ==============   Link column   ================
 */
function LinkColumn({
  title,
  links,
  index,
}: {
  title: string;
  links: { label: string; href: string }[];
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={columnVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <motion.a
              href={link.href}
              initial="rest"
              whileHover="hover"
              animate="rest"
              variants={linkVariants}
              transition={{ duration: 0.2 }}
              className="inline-block text-sm text-white/60"
            >
              {link.label}
            </motion.a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/**
 * ==============   Newsletter form   ================
 */
type FormStatus = 'idle' | 'loading' | 'success' | 'error';

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.includes('@')) {
      setStatus('error');
      if (buttonRef.current) {
        animate(
          buttonRef.current,
          { x: [0, -6, 6, -4, 4, 0] },
          { duration: 0.4 }
        );
      }
      return;
    }

    setStatus('loading');
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStatus('success');
    setEmail('');

    setTimeout(() => setStatus('idle'), 3500);
  };

  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">
        Newsletter
      </h4>
      <p className="mb-5 max-w-sm text-sm text-white/60">
        Reçois mes derniers projets et articles sur le développement web,
        directement par email.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          placeholder="ton@email.com"
          disabled={status === 'loading' || status === 'success'}
          className={`w-full max-w-xs rounded-lg border bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-cyan-400 disabled:opacity-60 ${
            status === 'error' ? 'border-red-400' : 'border-white/15'
          }`}
        />
        <motion.button
          ref={buttonRef}
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          whileTap={{ scale: 0.95 }}
          className="flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/10 transition-opacity disabled:opacity-70"
        >
          {status === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : status === 'loading' ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
              className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
            />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </motion.button>
      </form>

      <div className="mt-2 min-h-[20px]">
        <AnimatePresence mode="wait">
          {status === 'success' && (
            <motion.p
              key="success"
              variants={feedbackVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="overflow-hidden text-sm text-cyan-300"
            >
              Merci ! Vérifie ta boîte mail pour confirmer.
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p
              key="error"
              variants={feedbackVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="overflow-hidden text-sm text-red-400"
            >
              Merci d'entrer une adresse email valide.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * ==============   Footer   ================
 */
const LINK_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Navigation',
    links: [
      { label: 'À propos', href: '#about' },
      { label: 'Projets', href: '#projects' },
      { label: 'Compétences', href: '#skills' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { label: 'CV', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Mentions légales', href: '#' },
    ],
  },
];

const SOCIALS = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Mail, href: 'mailto:contact@portfolio.com', label: 'Email' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['start end', 'end end'],
  });
  const revealOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const revealScale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const revealBlur = useTransform(scrollYProgress, [0, 1], ['blur(10px)', 'blur(0px)']);

  return (
    <motion.footer
      ref={footerRef}
      style={{ opacity: revealOpacity, scale: revealScale, filter: revealBlur }}
      className="sticky bottom-0 z-0 overflow-hidden bg-[#0a0f0d] px-4 pt-20 pb-10 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 border-b border-white/10 pb-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <NewsletterForm />
          </motion.div>

          {LINK_COLUMNS.map((column, i) => (
            <LinkColumn key={column.title} title={column.title} links={column.links} index={i} />
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-6 pt-8 md:flex-row">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Portfolio. Tous droits réservés.
          </p>

          <div className="flex items-center gap-3">
            {SOCIALS.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                whileHover={{ y: -3, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.2 }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white"
              >
                <social.icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
}