import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { StarField } from "./StarField";
import { ChatBot } from "./ChatBot";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen cosmic-bg relative overflow-x-hidden">
      <StarField />
      <Navbar />
      
      <motion.main
        className="relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.main>
      
      <ChatBot />
    </div>
  );
}
