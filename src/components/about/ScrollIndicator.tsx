import { motion } from "framer-motion";

export default function ScrollIndicator() {
  return (
    <motion.div
      className="flex flex-col items-center gap-y-3 my-16"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Animated Circle with "SCROLL" text */}
      <motion.div
        className="relative w-32 h-32 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {/* SVG with thick white borders */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120">
          <defs>
            <path
              id="circlePath"
              d="M 60, 60 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
            />
          </defs>
          
          {/* Outer thick white border */}
          <circle
            cx="60"
            cy="60"
            r="48"
            fill="none"
            stroke="white"
            strokeWidth="3"
          />
          
          {/* Inner thick white border */}
          <circle
            cx="60"
            cy="60"
            r="42"
            fill="none"
            stroke="white"
            strokeWidth="3"
          />
          
          <text className="text-[9px] fill-white poppins-light uppercase tracking-[0.25em]">
            <textPath href="#circlePath" startOffset="0%">
              SCROLL DOWN • SCROLL DOWN •
            </textPath>
          </text>
        </svg>

        {/* Center Arrow - Counter-rotating, NO floating animation */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            className="text-light"
          >
            <path
              d="M12 4L12 20M12 20L6 14M12 20L18 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
