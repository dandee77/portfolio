import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";

type GalleryStackProps = {
  activeSection: "achievements" | "experience" | "projects";
  scrollContainer: HTMLElement | null;
};

const galleryCards = [
  {
    id: 1,
    color: "#1a1a1a",
    title: "Card One",
  },
  {
    id: 2,
    color: "#2a2a2a",
    title: "Card Two",
  },
  {
    id: 3,
    color: "#3a3a3a",
    title: "Card Three",
  },
];

export default function GalleryStack({ activeSection, scrollContainer }: GalleryStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!scrollContainer) return;

    const handleScroll = () => {
      const container = scrollContainer;
      const element = containerRef.current;
      if (!element) return;

      // Get container scroll position
      const scrollTop = container.scrollTop;
      const containerHeight = container.scrollHeight - container.clientHeight;
      
      // Get element position relative to container
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      
      // Calculate scroll progress through this element
      const start = elementTop - container.clientHeight;
      const end = elementTop + elementHeight;
      const range = end - start;
      
      const progress = Math.max(0, Math.min(1, (scrollTop - start) / range));
      setScrollProgress(progress);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [scrollContainer]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: "300vh" }}>
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-start justify-center pt-12">
        <div className="relative w-full max-w-[900px] h-[600px]">
          {galleryCards.map((card, index) => {
            // Calculate when each card should start moving
            const totalCards = galleryCards.length;
            const start = index / totalCards;
            const end = (index + 1) / totalCards;
            
            // Interpolate values based on scroll progress
            const cardProgress = Math.max(0, Math.min(1, (scrollProgress - start) / (end - start)));
            
            // Calculate Y position
            const startY = index === 0 ? 100 : (100 - index * 4);
            const y = startY - (startY * cardProgress);
            
            // Calculate scale
            const startScale = 1 - index * 0.05;
            const scale = startScale + ((1 - startScale) * cardProgress);

            return (
              <motion.div
                key={card.id}
                className="absolute w-full h-full rounded-lg border border-gray-4 overflow-hidden"
                style={{
                  y: `${y}%`,
                  scale: scale,
                  zIndex: totalCards - index,
                  backgroundColor: card.color,
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-1 text-2xl poppins-light">
                    {card.title} - {activeSection}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
