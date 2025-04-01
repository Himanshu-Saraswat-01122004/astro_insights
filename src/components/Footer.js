import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiStar, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const socialLinks = [
    { icon: <FiFacebook className="w-5 h-5" />, href: "#", label: "Facebook" },
    { icon: <FiTwitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <FiInstagram className="w-5 h-5" />, href: "#", label: "Instagram" }
  ];

  const quickLinks = [
    { to: "/horoscope", text: "Daily Horoscope" },
    { to: "/zodiac", text: "Zodiac Signs" },
    { to: "/contact", text: "Contact Us" }
  ];

  return (
    <footer className="bg-gradient-to-b from-orange-600 to-orange-700 text-white mt-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zMCAzMG0tMjggMGEyOCAyOCAwIDEgMCA1NiAwYTI4IDI4IDAgMSAwLTU2IDB6IiBzdHJva2U9IiNmZmZmZmYxMCIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48cGF0aCBkPSJNMzAgMzBtLTE4IDBhMTggMTggMCAxIDAgMzYgMGExOCAxOCAwIDEgMC0zNiAweiIgc3Ryb2tlPSIjZmZmZmZmMTAiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9nPjwvc3ZnPg==')] opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Company Info */}
          <motion.div 
            {...fadeInUp}
            className="text-center md:text-left space-y-4"
          >
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 p-2 rounded-lg"
              >
                <FiStar className="w-6 h-6" />
              </motion.div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
                Astrology Insights
              </h3>
            </div>
            <p className="text-sm text-orange-100/90 leading-relaxed">
              Guiding you through life's journey with celestial wisdom and astrological insights.
            </p>
            <div className="flex items-center justify-center md:justify-start space-x-4 pt-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="text-center md:text-left"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center justify-center md:justify-start space-x-2">
              <span className="bg-white/10 p-1.5 rounded">
                <FiMapPin className="w-4 h-4" />
              </span>
              <span>Quick Links</span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link 
                    to={link.to} 
                    className="text-orange-100/90 hover:text-white transition duration-300 flex items-center justify-center md:justify-start space-x-2 group"
                  >
                    <span className="relative">
                      <motion.span
                        className="absolute -left-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={false}
                        animate={{ x: [-5, 0] }}
                        transition={{ duration: 0.3 }}
                      >
                        ✨
                      </motion.span>
                      {link.text}
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.4 }}
            className="text-center md:text-left space-y-4"
          >
            <h3 className="text-lg font-semibold mb-6 flex items-center justify-center md:justify-start space-x-2">
              <span className="bg-white/10 p-1.5 rounded">
                <FiPhone className="w-4 h-4" />
              </span>
              <span>Contact Us</span>
            </h3>
            <div className="space-y-3">
              <motion.a
                href="mailto:contact@astrologyinsights.com"
                className="text-orange-100/90 hover:text-white transition duration-300 flex items-center justify-center md:justify-start space-x-2"
                whileHover={{ x: 2 }}
              >
                <FiMail className="w-4 h-4" />
                <span>contact@astrologyinsights.com</span>
              </motion.a>
              <motion.p
                className="text-orange-100/90 flex items-center justify-center md:justify-start space-x-2"
                whileHover={{ x: 2 }}
              >
                <FiPhone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-orange-100/70"
        >
          <p> {new Date().getFullYear()} Astrology Insights. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;