import { MotionValue, useAnimationControls, motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import Magnetic from "../Magnetic";
import { useLenis } from "@studio-freight/react-lenis";
import JournalOverlay from "./JournalOverlay";
import JournalCurve from "./JournalCurve";

type AboutSectionProps = {
  isAboutInView: boolean;
  isMobile: boolean;
  backgroundGradient: MotionValue<string>;
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: custom * 0.2,
      type: "tween",
      useNativeDriver: true
    },
  }),
};

const lineVariants = {
  hidden: { width: 0 },
  visible: {
    width: "100%",
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      type: "tween",
      useNativeDriver: true
    },
  },
};

const About: React.FC<AboutSectionProps> = ({
  isAboutInView,
  isMobile,
  backgroundGradient,
}) => {
  const aboutControls = useAnimationControls();

  const [hasAnimated, setHasAnimated] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  const lenis = useLenis();

  useEffect(() => {
    if (isAboutInView && !hasAnimated) {
      aboutControls.start("visible");
      setHasAnimated(true);
    } else if (!isAboutInView && hasAnimated) {
      aboutControls.start("hidden");
      setHasAnimated(false);
    }
  }, [isAboutInView, aboutControls, hasAnimated, setHasAnimated]);

  const handleJournalClick = () => {
    setIsJournalOpen(true);
    setIsOverlayVisible(true);
  };

  const closeOverlay = () => {
    setIsContentVisible(false);
    setTimeout(() => {
      setIsOverlayVisible(false);
    }, 800);
    setTimeout(() => {
      setIsJournalOpen(false);
    }, 2000);
  };

  useEffect(() => {
    if (isOverlayVisible) {
      lenis?.stop();
      document.documentElement.style.overflowY = "hidden";
      const timer = setTimeout(() => {
        setIsContentVisible(true);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      lenis?.start();
      document.documentElement.style.overflowY = "auto";
    }
  }, [isOverlayVisible, lenis]);

  const initialState = isMobile ? "visible" : "hidden";

  return (
    <motion.div
      style={{ 
        background: backgroundGradient,
        zIndex: isOverlayVisible ? 20 : 10,
      }}
      className="w-screen min-h-screen overflow-hidden flex justify-center items-center relative z-10"
    >
      <motion.div
        initial={initialState}
        animate={aboutControls}
        className="max-w-[1000px] px-4"
      >
        <motion.h1
          variants={fadeInUpVariants}
          custom={0}
          className={`khula-semibold ${isMobile ? "text-4xl" : "text-6xl"}`}
        >
          We are a technology-driven startup that creates innovative software and hardware solutions.
        </motion.h1>

        <motion.div
          variants={fadeInUpVariants}
          custom={1}
          className={`mt-[10vh] ${isMobile && "mt-8"}`}
        >
          <p className="text-gray-3 poppins-light-italic ml-2 mb-1 select-none">
            Hi, We are
          </p>
          <motion.hr
            variants={lineVariants}
            className="bg-gray-3 origin-left w-full"
          ></motion.hr>
        </motion.div>
        <div
          className={`flex justify-between flex-row mt-16 ${
            isMobile && "mt-8 flex-col"
          }`}
        >
          <div className="flex flex-col w-1/2">
            <motion.h2
              variants={fadeInUpVariants}
              custom={2}
              className="khula-light text-5xl text-nowrap"
            >
            Sigma Solutions.
            </motion.h2>
            {!isMobile && (
              <Magnetic>
                <motion.button
                  variants={fadeInUpVariants}
                  custom={3}
                  onClick={handleJournalClick}
                  className="flex bg-dark rounded-full text-light pl-4 pr-6 gap-x-1 py-3 w-max poppins-regular mt-24 select-none"
                >
                  <ArrowUpRight />
                  Know More
                </motion.button>
              </Magnetic>
            )}
          </div>
          <div
            className={`flex flex-col gap-y-4 w-1/2 khula-light text-2xl ${
              isMobile && "mt-8 text-lg w-full"
            }`}
          >
            <motion.p variants={fadeInUpVariants} custom={4}>
              We build mobile, web, and desktop apps, along with custom tools, research, and data analytics. On the hardware side, we work on IoT devices, embedded systems, smart integrations, prototypes, and support.
            </motion.p>
            <motion.p variants={fadeInUpVariants} custom={5}>
              By combining software and hardware skills, we deliver practical tech solutions that solve real problems. Our goal is to keep innovating and creating smart solutions that truly stand out.
            </motion.p>
          </div>
          {isMobile && (
            <motion.button
              variants={fadeInUpVariants}
              custom={3}
              onClick={handleJournalClick}
              className="flex bg-dark rounded-full text-light pl-4 pr-6 gap-x-1 py-3 w-max h-fit poppins-regular select-none mt-8"
            >
              <ArrowUpRight />
              Know More
            </motion.button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {(isOverlayVisible || isJournalOpen) && (
          <>
            <JournalCurve isVisible={isOverlayVisible} />
            <motion.div
              className="fixed inset-0 w-full z-[999] flex items-center justify-center"
              style={{ pointerEvents: isContentVisible ? "auto" : "none" }}
              initial="hidden"
              animate={isOverlayVisible ? "visible" : "exit"}
              exit="exit"
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                {isContentVisible && (
                  <JournalOverlay isMobile={isMobile} onClose={closeOverlay} />
                )}
              </AnimatePresence>
            </motion.div>
            {isContentVisible && (
              <button
                onClick={closeOverlay}
                className="fixed z-[9999] top-6 right-6 px-4 py-2 text-light text-xl poppins-regular flex flex-row gap-x-2 items-center"
              >
                <X size={32} />
              </button>
            )}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default About;
