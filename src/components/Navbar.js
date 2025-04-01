import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHome, FiSun, FiStar, FiMail, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { to: "/", text: "Home", icon: <FiHome className="w-5 h-5" /> },
    { to: "/horoscope", text: "Daily Horoscope", icon: <FiSun className="w-5 h-5" /> },
    { to: "/zodiac", text: "Zodiac Signs", icon: <FiStar className="w-5 h-5" /> },
    { to: "/contact", text: "Contact", icon: <FiMail className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and brand name */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0 flex items-center"
          >
            <Link to="/" className="text-2xl font-bold group flex items-center space-x-2">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 p-2 rounded-lg"
              >
                <FiStar className="w-6 h-6" />
              </motion.span>
              <span className="bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent group-hover:from-orange-100 group-hover:to-white transition-all duration-300">
                Astrology Insights
              </span>
            </Link>
          </motion.div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={item.to} 
                    className="px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 hover:bg-white/10 hover:scale-105 transform transition duration-300"
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:hidden"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-3 rounded-lg hover:bg-white/10 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
          >
            <motion.div 
              className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-b from-orange-600/95 to-orange-500/95 backdrop-blur-sm"
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.to}
                    className="block px-4 py-3 rounded-lg text-base font-medium flex items-center space-x-3 hover:bg-white/10 transition duration-300"
                    onClick={toggleMenu}
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;