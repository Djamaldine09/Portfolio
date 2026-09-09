"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";

export default function MotionCornerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { num: "01", name: "Accueil", href: "#" },
    { num: "02", name: "Projets", href: "#projets" },
    { num: "03", name: "Parcours", href: "#parcours" },
    { num: "04", name: "Contact", href: "#contact" },
  ];

  // Animation globale du conteneur (ressort + cascade d'éléments)
  const menuVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 350,
        damping: 25,
        staggerChildren: 0.07,
        delayChildren: 0.05,
      },
    },
  };

  // Animation individuelle des liens et boutons
  const itemVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 28,
      },
    },
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            style={{ transformOrigin: "bottom right" }}
            className="absolute bottom-16 right-0 w-80 rounded-3xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white"
          >
            {/* Titre / Brand */}
            <motion.div variants={itemVariants} className="mb-6 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Navigation
              </span>
            </motion.div>

            {/* Liens de navigation */}
            <nav className="mb-6">
              <ul className="space-y-3">
                {navLinks.map((link, index) => (
                  <motion.li key={index} variants={itemVariants}>
                    <a
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between group py-1.5 transition-colors"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="text-xs font-mono text-gray-400 group-hover:text-blue-500 transition-colors">
                          {link.num}
                        </span>
                        <span className="text-xl font-bold tracking-tight group-hover:text-blue-500 transition-colors">
                          {link.name}
                        </span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Section Contact & Réseaux sociaux */}
            <motion.div
              variants={itemVariants}
              className="border-t border-gray-200/60 dark:border-gray-800 pt-5"
            >
              <p className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">
                Contact & Réseaux
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com/Djamaldine09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-2xl transition-colors"
                >
                  <Github size={18} />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-2xl transition-colors"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="mailto:votre.email@example.com"
                  className="flex-1 flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium text-sm transition-colors shadow-lg shadow-blue-500/20"
                >
                  <Mail size={16} />
                  <span>Email</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton Flottant (Floating Trigger) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-full flex items-center justify-center shadow-xl focus:outline-none"
        aria-label="Toggle Menu"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isOpen ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}