import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

export default function Footer() {
  const footerSections = [
    {
      title: "Products",
      links: [
        { href: "/products?category=premium", label: "Premium Series" },
        { href: "/products?category=gaming", label: "Gaming Series" },
        { href: "/products?category=studio", label: "Studio Series" },
        { href: "/products?category=wireless", label: "Wireless Series" },
      ]
    },
    {
      title: "Support",
      links: [
        { href: "#", label: "Contact Us" },
        { href: "#", label: "Warranty" },
        { href: "#", label: "Returns" },
        { href: "#", label: "FAQ" },
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-2xl font-bold gradient-text mb-4">SonicWave</div>
            <p className="text-gray-400 mb-4">
              Premium audio experiences crafted for the discerning listener.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-[var(--sonic-blue)] transition-colors duration-300"
              >
                <Facebook className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-[var(--sonic-blue)] transition-colors duration-300"
              >
                <Twitter className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-[var(--sonic-blue)] transition-colors duration-300"
              >
                <Instagram className="h-6 w-6" />
              </motion.a>
            </div>
          </motion.div>
          
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index + 1) * 0.1, duration: 0.6 }}
            >
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-gray-400">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <a className="hover:text-[var(--sonic-blue)] transition-colors duration-300">
                        {link.label}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">
              Stay updated with our latest releases and exclusive offers.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-gray-800 border-gray-600 focus:border-[var(--sonic-blue)] rounded-l-full"
              />
              <Button
                className="bg-[var(--sonic-blue)] hover:bg-blue-600 text-black rounded-r-full px-6"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400"
        >
          <p>&copy; 2024 SonicWave. All rights reserved. | Privacy Policy | Terms of Service</p>
        </motion.div>
      </div>
    </footer>
  );
}
