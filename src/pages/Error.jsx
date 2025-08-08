import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Error = () => {
  const navigate = useNavigate();


  // Robot animation states
  const robotVariants = {
    initial: { y: 50, opacity: 0 },
    enter: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", damping: 10 }
    },
    hover: { 
      rotate: [0, -5, 5, 0],
      transition: { duration: 0.5 }
    },
    tap: { scale: 0.95 }
  };

  // Text/staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-richblack-900 text-richblack-5 p-6">
      <motion.div
        className="max-w-md text-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Animated Robot */}
        <motion.div
          className="mx-auto mb-8 w-32 h-32 relative cursor-pointer"
          variants={robotVariants}
          initial="initial"
          animate="enter"
          whileHover="hover"
          whileTap="tap"
          onClick={() => navigate("/")}
        >
          {/* Robot Head */}
          <div className="w-24 h-24 bg-richblue-200 rounded-xl mx-auto relative">
            {/* Eyes */}
            <div className="flex justify-center gap-4 pt-6">
              <motion.div 
                className="w-4 h-4 bg-richblack-900 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="w-4 h-4 bg-richblack-900 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
            </div>
            {/* Mouth */}
            <motion.div
              className="w-8 h-2 bg-richblack-900 rounded-full mx-auto mt-4"
              animate={{ 
                width: ["2rem", "1.5rem", "2rem"],
                opacity: [1, 0.7, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
          {/* Robot Body */}
          <div className="w-32 h-16 bg-caribbeangreen-100 rounded-b-lg mx-auto -mt-2 flex justify-center">
            <div className="w-12 h-1 bg-richblack-900 mt-4 rounded-full" />
          </div>
        </motion.div>

   
        <motion.h1 
          className="text-3xl font-bold mb-4"
          variants={itemVariants}
        >
          Whoops! Nothing here...
        </motion.h1>

        <motion.p 
          className="text-richblack-100 mb-6"
          variants={itemVariants}
        >
          The page you’re looking for might have been moved, deleted, or never existed. 
          Let’s get you back on track!
        </motion.p>

        {/* Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-3 justify-center"
          variants={itemVariants}
        >
          <motion.button
            className="px-6 py-2 bg-blue-200 text-richblack-900 rounded-lg font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
          >
            ← Previous Page
          </motion.button>
          <motion.button
            className="px-6 py-2 bg-caribbeangreen-100 text-richblack-900 rounded-lg font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
          >
            🏠 Home
          </motion.button>
        </motion.div>

        {/* Subtle background dots */}
        <div className="fixed inset-0 -z-10 overflow-hidden opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-richblue-200"
              style={{
                width: Math.random() * 10 + 2,
                height: Math.random() * 10 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, (Math.random() - 0.5) * 50],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Error;