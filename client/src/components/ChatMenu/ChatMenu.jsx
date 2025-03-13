import { MoreVertical, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ChatMenu = ({ otherUserId, isOpen, toggleMenu }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    if (otherUserId) {
      navigate(`/profile/${otherUserId}`);
      toggleMenu(); 
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X size={30} className="text-red-600" /> : <MoreVertical size={30} />}
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="block w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={handleViewProfile}
            >
              View Profile
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default ChatMenu;
