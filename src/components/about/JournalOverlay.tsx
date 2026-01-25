import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// @ts-ignore - Lenis types may not be available
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

type JournalOverlayProps = {
  isMobile: boolean;
  onClose: () => void;
};

const projects = [
  { name: "Human Form Study", category: "Photography", image: "/img/lavisual/thumbnail.png" },
  { name: "Urban Landscape", category: "Design", image: "/img/bbuild/thumbnail.png" },
  { name: "Abstract Patterns", category: "Art", image: "/img/cakes/thumbnail.png" },
  { name: "Nature's Embrace", category: "Digital", image: "/img/seraface/thumbnail.png" },
  { name: "Technological Wonders", category: "Technology", image: "/img/lavisual/thumbnail.png" },
  { name: "Architectural Marvels", category: "Architecture", image: "/img/bbuild/thumbnail.png" },
  { name: "Cultural Tapestry", category: "Culture", image: "/img/cakes/thumbnail.png" },
  { name: "Cosmic Exploration", category: "Space", image: "/img/seraface/thumbnail.png" },
  { name: "Emotional Expressions", category: "Portrait", image: "/img/lavisual/thumbnail.png" },
  { name: "Futuristic Visions", category: "Futurism", image: "/img/bbuild/thumbnail.png" },
];

export default function JournalOverlay({ isMobile, onClose }: JournalOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const projectIndexRef = useRef<HTMLHeadingElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const namesContainerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nameRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const labelLeftRef = useRef<HTMLParagraphElement>(null);
  const labelRightRef = useRef<HTMLParagraphElement>(null);
  
  const [currentNumber, setCurrentNumber] = useState("01");
  const [labelLeft, setLabelLeft] = useState(projects[0].name);
  const [labelRight, setLabelRight] = useState(projects[0].category);

  useEffect(() => {
    const container = containerRef.current;
    const spotlight = spotlightRef.current;
    const projectIndex = projectIndexRef.current;
    const imagesContainer = imagesContainerRef.current;
    const namesContainer = namesContainerRef.current;
    
    if (!container || !spotlight || !projectIndex || !imagesContainer || !namesContainer) return;

    // Initialize Lenis smooth scroll for the overlay container
    const lenis = new Lenis({
      wrapper: container,
      content: container,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    // Connect Lenis to GSAP
    lenis.on("scroll", ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);

    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    const spotlightHeight = spotlight.offsetHeight;
    const spotlightPadding = parseFloat(getComputedStyle(spotlight).padding);
    const projectIndexHeight = projectIndex.offsetHeight;
    const namesContainerHeight = namesContainer.offsetHeight;
    const imagesHeight = imagesContainer.offsetHeight;

    const moveDistanceIndex = spotlightHeight - spotlightPadding * 2 - projectIndexHeight;
    const moveDistanceNames = spotlightHeight - spotlightPadding * 2 - namesContainerHeight;
    const moveDistanceImages = window.innerHeight - imagesHeight;
    const imgActivationThreshold = window.innerHeight / 2;

    const scrollTrigger = ScrollTrigger.create({
      trigger: spotlight,
      scroller: container,
      start: "top top",
      end: `+=${window.innerHeight * 5}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalProjects = projects.length;
        const currentIndex = Math.min(
          Math.floor(progress * totalProjects) + 1,
          totalProjects
        );

        // Update current number
        setCurrentNumber(String(currentIndex).padStart(2, "0"));
        
        // Update labels
        setLabelLeft(projects[currentIndex - 1].name);
        setLabelRight(projects[currentIndex - 1].category);

        // Animate project index
        gsap.set(projectIndex, {
          y: progress * moveDistanceIndex,
        });

        // Animate images container
        gsap.set(imagesContainer, {
          y: progress * moveDistanceImages,
        });

        // Animate individual images
        imageRefs.current.forEach((img) => {
          if (!img) return;
          const imgRect = img.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const imgTop = imgRect.top - containerRect.top;
          const imgBottom = imgRect.bottom - containerRect.top;

          if (imgTop <= imgActivationThreshold && imgBottom >= imgActivationThreshold) {
            gsap.set(img, { opacity: 1 });
          } else {
            gsap.set(img, { opacity: 0.5 });
          }
        });

        // Animate project names
        nameRefs.current.forEach((p, index) => {
          if (!p) return;
          const startProgress = index / totalProjects;
          const endProgress = (index + 1) / totalProjects;
          const projectProgress = Math.max(
            0,
            Math.min(1, (progress - startProgress) / (endProgress - startProgress))
          );

          gsap.set(p, {
            y: -projectProgress * moveDistanceNames,
          });

          if (projectProgress > 0 && projectProgress < 1) {
            gsap.set(p, { color: "#ffffff" });
          } else {
            gsap.set(p, { color: "#4a4a4a" });
          }
        });
      },
    });

    return () => {
      scrollTrigger.kill();
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      data-lenis-prevent
      className="text-white inset-0 overflow-y-scroll overflow-x-hidden fixed max-h-[100vh] w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      style={{ backgroundColor: "#000000" }}
    >
      {/* Intro Section */}
      <section className="relative w-full h-screen p-8 overflow-hidden flex justify-center items-center">
        <p className="poppins-medium text-2xl text-center">A collection of selected works</p>
      </section>

      {/* Spotlight Section */}
      <section 
        ref={spotlightRef}
        className="relative w-full h-screen p-8 overflow-hidden"
      >
        {/* Project Index */}
        <div className="absolute top-8 left-8 z-10">
          <h1 ref={projectIndexRef} className="khula-regular uppercase leading-none">
            <span className="text-[9rem] max-sm:text-[6rem]">{currentNumber}</span>
            <span className="text-4xl max-sm:text-2xl opacity-50">/{projects.length.toString().padStart(2, "0")}</span>
          </h1>
        </div>

        {/* Project Images */}
        <div 
          ref={imagesContainerRef}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] max-md:w-[calc(100%-4rem)] flex flex-col gap-2 -z-10"
          style={{ paddingTop: "50vh", paddingBottom: "50vh" }}
        >
          {projects.map((project, index) => (
            <div
              key={index}
              ref={(el) => (imageRefs.current[index] = el)}
              className="w-full aspect-video opacity-50 transition-all duration-300 overflow-hidden rounded-lg"
            >
              <img 
                src={project.image} 
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Project Labels */}
        <div className="absolute top-1/2 left-0 right-0 pointer-events-none z-10">
          <p
            ref={labelLeftRef}
            className="absolute poppins-light-italic text-xs uppercase tracking-widest text-white transition-opacity duration-300"
            style={{
              left: "calc(50% - 17.5% - 1rem)",
              transform: "translateX(-100%)",
              textAlign: "right"
            }}
          >
            {labelLeft}
          </p>
          <p
            ref={labelRightRef}
            className="absolute poppins-light-italic text-xs uppercase tracking-widest text-white transition-opacity duration-300"
            style={{
              right: "calc(50% - 17.5% - 1rem)",
              transform: "translateX(100%)",
              textAlign: "left"
            }}
          >
            {labelRight}
          </p>
        </div>

        {/* Project Names */}
        <div 
          ref={namesContainerRef}
          className="absolute right-8 bottom-8 flex flex-col items-end"
        >
          {projects.map((project, index) => (
            <p
              key={index}
              ref={(el) => (nameRefs.current[index] = el)}
              className="poppins-medium text-xl transition-colors duration-300 max-md:text-white"
              style={{ color: "#4a4a4a" }}
            >
              {project.name}
            </p>
          ))}
        </div>
      </section>

      {/* Outro Section */}
      <section className="relative w-full h-screen p-8 overflow-hidden flex justify-center items-center">
        <p className="poppins-medium text-2xl text-center">Scroll complete</p>
      </section>
    </motion.div>
  );
}
