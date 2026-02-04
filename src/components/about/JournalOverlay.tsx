import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// @ts-ignore - Lenis types may not be available
import Lenis from "@studio-freight/lenis";
import { Award, Briefcase, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type JournalOverlayProps = {
  isMobile: boolean;
  onClose: () => void;
};

type Category = "achievements" | "experience" | "hobby" | null;

type ProjectData = {
  region: string;
  placement: string;
  name: string;
  image: string;
};

const achievementsData: ProjectData[] = [
  { region: "Asia Pacific & Oceana", placement: "Semi Finalist", name: "GameJamPlus+", image: "/img/achievements/1.png" },
  { region: "Philippines", placement: "Champion", name: "NextGenPH", image: "/img/achievements/2.jpg" },
  { region: "Philippines", placement: "Champion", name: "C++ Nationals", image: "/img/achievements/3.jpg" },
  { region: "Southeast Asia", placement: "2nd Place", name: "10th Huawei ICT", image: "/img/achievements/4.jpg" },
  { region: "International", placement: "Finalist", name: "World Student Pitch", image: "/img/achievements/5.jpg" },
  { region: "Philippines", placement: "Champion", name: "C++ Regionals", image: "/img/achievements/6.png" },
  { region: "Southeast Asia", placement: "2nd Place", name: "9th Huawei ICT", image: "/img/achievements/7.jpg" },
  { region: "Philippines", placement: "Gold Gears", name: "BULSU GGA", image: "/img/achievements/8.jpg" },
];

const experienceData: ProjectData[] = [
  { region: "JanAces Admission", placement: "Hong Kong", name: "Wordpress Developer", image: "/img/experience/1.png" },
  { region: "HoCH Solutions", placement: "Singapore", name: "AI Developer", image: "/img/experience/2.png" },
];

const hobbyData: ProjectData[] = [
  { region: "Game Development", placement: "C++", name: "Space Ablaze", image: "/img/hobbies/1.mp4" },
  { region: "Web Development", placement: "Javascript, HTML, CSS", name: "MemorialDB", image: "/img/hobbies/2.png" },
  { region: "AI Development", placement: "Python, Gemini", name: "AI Paint Calculator", image: "/img/hobbies/3.png" },
  { region: "Digital Illustration", placement: "Art", name: "Hobby Four", image: "/img/seraface/thumbnail.png" },
  { region: "Travel Diaries", placement: "Adventure", name: "Hobby Five", image: "/img/lavisual/thumbnail.png" },
  { region: "Woodworking", placement: "Craft", name: "Hobby Six", image: "/img/bbuild/thumbnail.png" },
  { region: "Urban Exploration", placement: "Photography", name: "Hobby Seven", image: "/img/cakes/thumbnail.png" },
  { region: "Creative Writing", placement: "Literature", name: "Hobby Eight", image: "/img/seraface/thumbnail.png" },
  { region: "3D Modeling", placement: "Digital", name: "Hobby Nine", image: "/img/lavisual/thumbnail.png" },
  { region: "Experimental Cook", placement: "Culinary", name: "Hobby Ten", image: "/img/bbuild/thumbnail.png" },
];

export default function JournalOverlay({ onClose: _onClose }: JournalOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const projectIndexRef = useRef<HTMLHeadingElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const namesContainerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nameRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const labelLeftRef = useRef<HTMLParagraphElement>(null);
  const labelRightRef = useRef<HTMLParagraphElement>(null);
  const lenisRef = useRef<any>(null);
  const spotlightOffsetRef = useRef<number>(0);
  
  const [selectedCategory, setSelectedCategory] = useState<Category>(null);
  const [hasSelectedOnce, setHasSelectedOnce] = useState(false);
  const [currentNumber, setCurrentNumber] = useState("01");
  const [labelLeft, setLabelLeft] = useState("");
  const [labelRight, setLabelRight] = useState("");
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Get current projects based on selected category
  const currentProjects = selectedCategory === "achievements" 
    ? achievementsData 
    : selectedCategory === "experience" 
    ? experienceData 
    : selectedCategory === "hobby"
    ? hobbyData
    : achievementsData;

  const handleCategorySelect = (category: Category) => {
    // Start fade out
    setIsFadingOut(true);
    
    // Wait for fade animation then update state
    setTimeout(() => {
      setSelectedCategory(category);
      setHasSelectedOnce(true);
      
      // Update initial labels based on selected category
      const projects = category === "achievements" 
        ? achievementsData 
        : category === "experience" 
        ? experienceData 
        : hobbyData;
      
      setLabelLeft(projects[0].region);
      setLabelRight(projects[0].placement);
      setCurrentNumber("01");
      
      // Wait a bit more for ScrollTrigger to be ready, then scroll
      setTimeout(() => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(window.innerHeight, {
            duration: 1.5,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
        
        // Reset fade state after scroll
        setTimeout(() => {
          setIsFadingOut(false);
        }, 1600);
      }, 100);
    }, 300);
  };

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
      touchMultiplier: 2,
      infinite: false,
    });

    // Store lenis instance in ref for access outside useEffect
    lenisRef.current = lenis;

    // Lock scroll on intro section if no category selected yet
    if (!hasSelectedOnce) {
      lenis.stop();
    }

    // Calculate and store spotlight section offset (intro section height)
    spotlightOffsetRef.current = window.innerHeight;

    // Connect Lenis to GSAP
    lenis.on("scroll", ScrollTrigger.update);
    
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);

    // Clear any existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Only setup ScrollTrigger if category is selected
    if (!selectedCategory) {
      return () => {
        lenis.destroy();
        gsap.ticker.remove((time) => {
          lenis.raf(time * 1000);
        });
      };
    }

    const spotlightHeight = spotlight.offsetHeight;
    const spotlightPadding = parseFloat(getComputedStyle(spotlight).padding);
    const projectIndexHeight = projectIndex.offsetHeight;
    const namesContainerHeight = namesContainer.offsetHeight;
    const imagesHeight = imagesContainer.offsetHeight;

    const moveDistanceIndex = spotlightHeight - spotlightPadding * 2 - projectIndexHeight;
    const moveDistanceNames = spotlightHeight - spotlightPadding * 2 - namesContainerHeight - 50;
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
        const totalProjects = currentProjects.length;
        const currentIndex = Math.min(
          Math.floor(progress * totalProjects) + 1,
          totalProjects
        );

        // Update current number
        setCurrentNumber(String(currentIndex).padStart(2, "0"));
        
        // Update labels
        setLabelLeft(currentProjects[currentIndex - 1].region);
        setLabelRight(currentProjects[currentIndex - 1].placement);

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
  }, [selectedCategory, hasSelectedOnce, currentProjects]);

  const handleProjectClick = (projectIndex: number) => {
    if (!lenisRef.current) return;

    const totalScrollDistance = window.innerHeight * 5; 
    const projectProgress = (projectIndex + 0.5) / currentProjects.length;
    const targetScrollPosition = spotlightOffsetRef.current + (projectProgress * totalScrollDistance);

    lenisRef.current.scrollTo(targetScrollPosition, {
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  };

  const handleCategorySwitch = (newCategory: Category) => {
    // Start fade out immediately
    setIsFadingOut(true);
    
    // Wait for fade out to complete before changing content
    setTimeout(() => {
      // Update category (this will trigger useEffect)
      setSelectedCategory(newCategory);
      
      // Update labels based on new category
      const projects = newCategory === "achievements" 
        ? achievementsData 
        : newCategory === "experience" 
        ? experienceData 
        : hobbyData;
      
      setLabelLeft(projects[0].region);
      setLabelRight(projects[0].placement);
      setCurrentNumber("01");
    }, 300);
    
    // Scroll immediately (simultaneously with fade out)
    setTimeout(() => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(window.innerHeight, {
          duration: 1.5,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
      
      // Reset fade state after scroll completes
      setTimeout(() => {
        setIsFadingOut(false);
      }, 1600);
    }, 300);
  };

  const categoryCards = [
    {
      id: "achievements" as Category,
      title: "Achievements",
      icon: Award,
      description: "Awards & Recognition"
    },
    {
      id: "experience" as Category,
      title: "Experience",
      icon: Briefcase,
      description: "Professional Journey"
    },
    {
      id: "hobby" as Category,
      title: "Hobby",
      icon: Heart,
      description: "Passion Projects"
    }
  ];

  // Get other categories (not currently selected)
  const otherCategories = categoryCards.filter(card => card.id !== selectedCategory);

  return (  
    <motion.div
      ref={containerRef}
      data-lenis-prevent
      className="text-white inset-0 overflow-y-scroll overflow-x-hidden fixed max-h-[100vh] w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Intro Section - Category Selection */}
      <section className="relative w-full h-screen p-8 overflow-hidden flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isFadingOut ? 0 : 1, y: isFadingOut ? 30 : 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-4 mb-16"
        >
          <h1 className="khula-regular text-7xl max-sm:text-5xl text-center">
            What do you want
          </h1>
          <h2 className="khula-regular text-6xl max-sm:text-3xl text-center">
            to know about me?
          </h2>
          <p className="poppins-light text-base text-gray-2 mt-8"> 
            Choose one:
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-3 max-md:grid-cols-1 gap-8 max-w-5xl w-full px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isFadingOut ? 0 : 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {categoryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.button
                key={card.id}
                onClick={() => handleCategorySelect(card.id)}
                className="group relative aspect-square bg-transparent border border-gray-3 hover:border-white transition-all duration-300 rounded-none flex flex-col items-center justify-center gap-6 p-8 cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center gap-6 transition-transform duration-300 group-hover:scale-95">
                  <Icon 
                    size={64} 
                    strokeWidth={1}
                    className="text-white transition-colors duration-300" 
                  />
                  <h3 className="khula-light text-3xl max-sm:text-2xl text-white">
                    {card.title}
                  </h3>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </section>

      {/* Spotlight Section - Only show if category selected */}
      {selectedCategory && (
        <section 
          ref={spotlightRef}
          className="relative w-full h-screen p-8 overflow-hidden"
        >
          {/* Project Index */}
          <div className="absolute top-8 left-8 z-10">
            <h1 ref={projectIndexRef} className="khula-regular uppercase leading-none">
              <span className="text-[9rem] max-sm:text-[6rem]">{currentNumber}</span>
              <span className="text-4xl max-sm:text-2xl opacity-50">/{currentProjects.length.toString().padStart(2, "0")}</span>
            </h1>
          </div>

          {/* Project Images */}
          <div 
            ref={imagesContainerRef}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] max-md:w-[calc(100%-4rem)] flex flex-col gap-2 -z-10"
            style={{ paddingTop: "50vh", paddingBottom: "50vh" }}
          >
            {currentProjects.map((project, index) => (
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
            {currentProjects.map((project, index) => (
              <p
                key={index}
                ref={(el) => (nameRefs.current[index] = el)}
                onClick={() => handleProjectClick(index)}
                className="khula-semibold text-xl transition-colors duration-300 max-md:text-white cursor-pointer hover:opacity-80"
                style={{ color: "#4a4a4a" }}
              >
                {project.name}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Outro Section - Only show if category selected */}
      {selectedCategory && (
        <section className="relative w-full h-screen p-8 overflow-hidden flex flex-col justify-center items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            animate={{ opacity: isFadingOut ? 0 : 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="poppins-light text-base text-gray-2 text-center">
              Explore more facets
            </p>
            <h3 className="khula-semibold text-6xl max-sm:text-4xl text-center">
              Discover Other Personalities
            </h3>
          </motion.div>

          <div className="grid grid-cols-2 max-md:grid-cols-1 gap-8 max-w-3xl w-full px-4">
            {otherCategories.map((card) => {
              const Icon = card.icon;
              return (
                <motion.button
                  key={card.id}
                  onClick={() => handleCategorySwitch(card.id)}
                  className="group relative aspect-square bg-transparent border border-gray-3 hover:border-white transition-all duration-300 rounded-none flex flex-col items-center justify-center gap-6 p-8 cursor-pointer"
                  animate={{ opacity: isFadingOut ? 0 : 1 }}
                  transition={{ duration: 0.3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex flex-col items-center gap-6 transition-transform duration-300 group-hover:scale-95">
                    <Icon 
                      size={64} 
                      strokeWidth={1}
                      className="text-white transition-colors duration-300" 
                    />
                    <h3 className="khula-light text-3xl max-sm:text-2xl text-white">
                      {card.title}
                    </h3>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>
      )}
    </motion.div>
  );
}
