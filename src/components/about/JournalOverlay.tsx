import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "../Magnetic";
import { useLenis } from "@studio-freight/react-lenis";

type Section = "achievements" | "experience" | "projects";

type JournalOverlayProps = {
  isMobile: boolean;
  onClose: () => void;
};

const sectionContent = {
  achievements: {
    title: "My Achievements",
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  },
  experience: {
    title: "Professional Experience",
    quote: "The only way to do great work is to love what you do.",
  },
  projects: {
    title: "Hobby Projects",
    quote: "Innovation distinguishes between a leader and a follower.",
  },
};

export default function JournalOverlay({ isMobile, onClose }: JournalOverlayProps) {
  const [activeSection, setActiveSection] = useState<Section>("achievements");
  const lenis = useLenis();

  const handleGetInTouch = () => {
    onClose();
    setTimeout(() => {
      const contactSection = document.getElementById("contact");
      if (contactSection && lenis) {
        lenis.scrollTo(contactSection);
      }
    }, 2000);
  };

  return (
    <motion.div
      data-lenis-prevent
      className="text-white inset-0 overflow-y-scroll overflow-x-hidden fixed max-h-[100vh] w-full flex justify-start pb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full flex gap-x-24 pl-24 relative">
        {/* Sidebar */}
        <div 
          style={{ marginTop: !isMobile ? "25vh" : "2.5rem" }}
          className="flex flex-col gap-y-8 min-w-[200px] flex-shrink-0"
        >
          <p className="poppins-light text-xs uppercase tracking-[calc(0.75rem * 0.1)] text-gray-3">
            Sections
          </p>
          
          <div className="flex flex-col gap-y-6">
            <button
              onClick={() => setActiveSection("achievements")}
              className={`poppins-regular text-left text-[2.5rem] transition-colors ${
                activeSection === "achievements" ? "text-light" : "text-gray-3"
              }`}
            >
              Achievements
            </button>
            
            <button
              onClick={() => setActiveSection("experience")}
              className={`poppins-regular text-left text-[2.5rem] transition-colors ${
                activeSection === "experience" ? "text-light" : "text-gray-3"
              }`}
            >
              Experience
            </button>
            
            <button
              onClick={() => setActiveSection("projects")}
              className={`poppins-regular text-left text-[2.5rem] transition-colors ${
                activeSection === "projects" ? "text-light" : "text-gray-3"
              }`}
            >
              Projects
            </button>
          </div>
        </div>

        {/* Content Area - Header and Gallery Placeholder */}
        <div 
          style={{ marginTop: !isMobile ? "10vh" : "2.5rem" }}
          className="flex-1 max-w-[900px] mr-16"
        >
          {/* Header Section */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center mb-12"
          >
            <h1 className="khula-semibold text-6xl max-sm:text-5xl mb-6 tracking-[calc(3.75rem * 0.02)]">
              {sectionContent[activeSection].title}
            </h1>
            
            <p className="poppins-light text-gray-1 text-lg max-w-[500px] mb-8 leading-relaxed">
              {sectionContent[activeSection].quote}
            </p>

            <Magnetic>
              <button
                onClick={handleGetInTouch}
                className="flex bg-light rounded-full text-dark pl-4 pr-6 gap-x-1 py-3 w-max poppins-regular select-none hover:bg-gray-1 transition-colors"
              >
                <ArrowUpRight />
                Get in Touch
              </button>
            </Magnetic>
          </motion.div>

          {/* Gallery Placeholder */}
          <div className="min-h-[400px] w-full border border-gray-4 rounded-lg">
            {/* Gallery will be added here */}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
