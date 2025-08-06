import { motion } from "framer-motion";
import { Volume2, Shield, Headphones } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Volume2,
      title: "Premium Audio",
      description: "Experience crystal-clear sound with our advanced driver technology",
    },
    {
      icon: Shield,
      title: "Durability",
      description: "Built to last with premium materials and rigorous testing",
    },
    {
      icon: Headphones,
      title: "Comfort",
      description: "Ergonomic design for extended listening sessions",
    },
  ];

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Why Choose <span className="gradient-text">SonicWave</span>
          </h2>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ y: -5 }}
                className="text-center p-8 rounded-3xl bg-gray-900 hover:bg-gray-800 transition-all duration-300"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block mb-6"
                >
                  <Icon className={`h-12 w-12 ${index === 1 ? 'text-[var(--sonic-orange)]' : 'text-[var(--sonic-blue)]'}`} />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
