import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type JournalItem = {
  id: string;
  title: string;
  category: "achievement" | "project" | "experience";
  date: string;
  description: string;
  details?: string[];
  image?: string;
};

const journalItems: JournalItem[] = [
  {
    id: "1",
    title: "Dean's Lister Award",
    category: "achievement",
    date: "2024",
    description: "Recognized for academic excellence with a GPA of 3.8 or higher.",
    details: [
      "Consistent academic performance",
      "Leadership in technical projects",
      "Contribution to university innovation"
    ]
  },
  {
    id: "2",
    title: "Full Stack Developer",
    category: "experience",
    date: "2024 - Present",
    description: "Software Engineer at Sigma Solutions",
    details: [
      "Led development of enterprise web applications",
      "Implemented microservices architecture",
      "Mentored junior developers"
    ]
  },
  {
    id: "3",
    title: "Hackathon Winner",
    category: "achievement",
    date: "2024",
    description: "First place in National Coding Competition",
    details: [
      "Built AI-powered solution in 24 hours",
      "Team leadership and collaboration",
      "Innovative problem-solving approach"
    ]
  },
  {
    id: "4",
    title: "Open Source Contributor",
    category: "project",
    date: "2023 - Present",
    description: "Active contributor to various open-source projects",
    details: [
      "Over 500+ commits across repositories",
      "Maintained popular libraries",
      "Code reviews and community engagement"
    ]
  }
];

const categoryColors = {
  achievement: "255, 215, 0",
  project: "77, 128, 237",
  experience: "106, 90, 205"
};

const categoryLabels = {
  achievement: "Achievement",
  project: "Project",
  experience: "Experience"
};

export default function JournalOverlay({ isMobile }: { isMobile: boolean }) {
  const [selectedItem, setSelectedItem] = useState<JournalItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredItems = activeFilter === "all"
    ? journalItems
    : journalItems.filter(item => item.category === activeFilter);

  return (
    <motion.div
      data-lenis-prevent
      className="text-white inset-0 overflow-y-scroll overflow-x-hidden fixed max-h-[100vh] px-4 w-full flex justify-center pb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      <div
        style={{ marginTop: !isMobile ? "20vh" : "2.5rem" }}
        className="max-w-[1000px] w-full"
      >
        <div className="flex flex-col items-start w-full mb-[8vh]">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="khula-regular max-sm:text-[12vw] text-8xl tracking-[calc(6rem * 0.03)]"
          >
            Journal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="poppins-light text-gray-1 text-lg mt-4"
          >
            A collection of achievements, experiences, and notable projects
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {selectedItem ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="poppins-light text-gray-2 hover:text-gray-1 transition-colors mb-12 text-left flex items-center gap-x-2 group"
              >
                <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span> 
                <span>Back to all</span>
              </button>

              <div className="flex flex-col gap-y-6">
                <div>
                  <p
                    className="poppins-extralight text-sm uppercase tracking-[calc(0.875rem * 0.08)] mb-4 px-3 py-1.5 rounded-full w-fit"
                    style={{ 
                      backgroundColor: `rgba(${categoryColors[selectedItem.category]}, 0.15)`,
                      color: `rgb(${categoryColors[selectedItem.category]})` 
                    }}
                  >
                    {categoryLabels[selectedItem.category]}
                  </p>
                  <h2 className="khula-semibold text-7xl max-sm:text-5xl mb-4 tracking-[calc(4rem * 0.02)]">
                    {selectedItem.title}
                  </h2>
                  <p className="poppins-light text-gray-2 text-xl max-sm:text-lg">
                    {selectedItem.date}
                  </p>
                </div>

                <hr className="border-gray-3 mt-6" />

                <div className="mt-4">
                  <p className="khula-light text-sm tracking-[calc(0.875rem * 0.05)] uppercase text-gray-1 mb-6">
                    Overview
                  </p>
                  <p className="poppins-regular text-gray-1 text-lg leading-relaxed">
                    {selectedItem.description}
                  </p>

                  {selectedItem.details && selectedItem.details.length > 0 && (
                    <div className="mt-12">
                      <p className="khula-light text-sm tracking-[calc(0.875rem * 0.05)] uppercase text-gray-1 mb-6">
                        Highlights
                      </p>
                      <div className="space-y-4">
                        {selectedItem.details.map((detail, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 * index }}
                            className="flex items-start gap-x-4 group/item"
                          >
                            <span
                              className="mt-2 w-2 h-2 rounded-full flex-shrink-0 group-hover/item:scale-125 transition-transform"
                              style={{ backgroundColor: `rgb(${categoryColors[selectedItem.category]})` }}
                            />
                            <p className="poppins-light text-gray-1 text-base leading-relaxed flex-1">
                              {detail}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col"
            >
              <div className="flex flex-col items-start w-full mb-12">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="khula-regular max-sm:text-[12vw] text-8xl tracking-[calc(6rem * 0.03)]"
                >
                  Journal
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="poppins-light text-gray-1 text-lg mt-4"
                >
                  A collection of achievements, experiences, and notable projects
                </motion.p>
              </div>

              {/* Category Filters */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex gap-x-3 mb-12 max-sm:flex-wrap max-sm:gap-y-2"
              >
                {["all", "achievement", "experience", "project"].map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`poppins-light text-sm uppercase tracking-[calc(0.875rem * 0.05)] px-5 py-2 rounded-full border transition-all ${
                      activeFilter === category
                        ? "border-gray-1 text-gray-1 bg-gray-4"
                        : "border-gray-3 text-gray-3 hover:text-gray-2 hover:border-gray-2"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </motion.div>

              {/* Journal Items List */}
              <div className="flex flex-col gap-y-1">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.08 }}
                    onClick={() => setSelectedItem(item)}
                    className="group cursor-pointer border-b border-gray-3 py-8 hover:border-gray-1 transition-all"
                  >
                    <div className="flex justify-between items-start gap-x-8 max-sm:flex-col max-sm:gap-y-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-x-4 mb-4 max-sm:flex-wrap max-sm:gap-y-2">
                          <span
                            className="poppins-extralight text-xs uppercase tracking-[calc(0.75rem * 0.08)] px-3 py-1.5 rounded-full"
                            style={{
                              backgroundColor: `rgba(${categoryColors[item.category]}, 0.15)`,
                              color: `rgb(${categoryColors[item.category]})`
                            }}
                          >
                            {categoryLabels[item.category]}
                          </span>
                          <span className="poppins-light text-gray-3 text-sm">
                            {item.date}
                          </span>
                        </div>

                        <h3 className="khula-semibold text-4xl max-sm:text-3xl mb-4 group-hover:text-gray-2 group-hover:translate-x-2 transition-all tracking-[calc(2.25rem * 0.02)]">
                          {item.title}
                        </h3>
                        
                        <p className="poppins-regular text-gray-2 text-base leading-relaxed group-hover:text-gray-1 transition-colors max-w-[600px]">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 max-sm:w-12 max-sm:h-12 rounded-full border border-gray-3 flex items-center justify-center group-hover:border-gray-1 group-hover:scale-110 transition-all">
                          <span className="text-2xl text-gray-3 group-hover:text-gray-1 group-hover:translate-x-1 transition-all">
                            →
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
