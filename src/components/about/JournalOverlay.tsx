import { motion } from "framer-motion";

type JournalOverlayProps = {
  isMobile: boolean;
  onClose: () => void;
};

export default function JournalOverlay({ isMobile, onClose }: JournalOverlayProps) {
  return (
    <motion.div
      data-lenis-prevent
      className="text-white inset-0 overflow-y-scroll overflow-x-hidden fixed max-h-[100vh] w-full flex justify-start pb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Blank overlay - content will be added here */}
    </motion.div>
  );
}
