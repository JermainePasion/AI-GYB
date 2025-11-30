import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const FadeInSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5 }); 
  return (
    <motion.div
      ref={ref}
      className="w-full flex justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInSection;
