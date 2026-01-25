import { motion } from "framer-motion";

export default function JournalOverlay({ isMobile }: { isMobile: boolean }) {
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
        style={{ marginTop: !isMobile ? "10vh" : "2.5rem" }}
        className="max-w-[1000px] w-full"
      >
        {/* Empty - ready for new content */}
      </div>
    </motion.div>
  );
}
