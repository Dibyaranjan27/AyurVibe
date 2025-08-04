import { motion } from 'framer-motion';

interface QuadrantProps {
  title: string;
  text: string;
  color: string;
  svgPath: string; // The "d" attribute for the SVG <path>
}

const Quadrant: React.FC<QuadrantProps> = ({ title, text, color, svgPath }) => {
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div className="relative w-full aspect-square" variants={itemVariants}>
      {/* SVG Background Shape */}
      <div className="absolute inset-0">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d={svgPath} fill={color} />
        </svg>
      </div>

      {/* Text Content */}
      <div className="relative z-10 p-6 sm:p-10 h-full flex flex-col justify-center text-left text-white">
        <h3 className="text-2xl font-lora font-bold mb-2">{title}</h3>
        <p className="font-openSans text-sm max-w-xs">{text}</p>
      </div>
    </motion.div>
  );
};

export default Quadrant;