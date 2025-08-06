import { motion } from "framer-motion";
import { Users, Award, Headphones, Globe, Heart, Star } from "lucide-react";
import Navbar from "@/components/navbar";

const teamMembers = [
  {
    name: "Alex Chen",
    role: "Founder & CEO",
    bio: "Audio engineer with 15+ years in premium headphone design",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
  },
  {
    name: "Sarah Rodriguez",
    role: "Head of Design",
    bio: "Former designer at top audio brands, passionate about user experience",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
  },
  {
    name: "Marcus Kim",
    role: "Chief Technology Officer",
    bio: "Acoustic specialist focused on revolutionary sound technology",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  }
];

const stats = [
  { label: "Happy Customers", value: "50K+", icon: Users },
  { label: "Awards Won", value: "25+", icon: Award },
  { label: "Products Sold", value: "100K+", icon: Headphones },
  { label: "Countries", value: "40+", icon: Globe }
];

const values = [
  {
    icon: Heart,
    title: "Passion for Audio",
    description: "Every product is crafted with love for exceptional sound quality and user experience."
  },
  {
    icon: Star,
    title: "Premium Quality",
    description: "We use only the finest materials and cutting-edge technology in our headphones."
  },
  {
    icon: Users,
    title: "Community First",
    description: "Our customers are at the heart of everything we do, driving continuous innovation."
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[var(--sonic-blue)] to-[var(--sonic-orange)] bg-clip-text text-transparent">
                About SonicWave
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                We're on a mission to deliver the ultimate audio experience through innovative design, 
                premium materials, and cutting-edge technology. Since 2019, we've been crafting headphones 
                that don't just play music – they transform how you experience sound.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-900/50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <stat.icon className="h-12 w-12 text-[var(--sonic-blue)]" />
                  </div>
                  <div className="text-3xl font-bold text-[var(--sonic-orange)] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    SonicWave was born from a simple frustration: we couldn't find headphones that 
                    delivered both exceptional sound quality and comfort for long listening sessions. 
                    As audio enthusiasts and engineers, we knew we could do better.
                  </p>
                  <p>
                    What started in a small garage lab in 2019 has grown into a globally recognized 
                    brand. We've spent countless hours perfecting every detail – from the acoustic 
                    drivers to the memory foam padding – to create headphones that exceed expectations.
                  </p>
                  <p>
                    Today, our headphones are trusted by music producers, gamers, and audio enthusiasts 
                    worldwide. But we're just getting started on our journey to revolutionize how 
                    people experience sound.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop"
                  alt="SonicWave Workshop"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6">Our Values</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                These core principles guide everything we do, from product design to customer service.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-gray-800 rounded-2xl p-8 text-center hover:bg-gray-700 transition-colors duration-300"
                >
                  <div className="flex justify-center mb-6">
                    <value.icon className="h-12 w-12 text-[var(--sonic-blue)]" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold mb-6">Meet Our Team</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                The passionate individuals behind SonicWave's innovation and success.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-gray-900 rounded-2xl p-8 text-center hover:bg-gray-800 transition-colors duration-300"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-6 object-cover border-4 border-[var(--sonic-blue)]"
                  />
                  <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                  <div className="text-[var(--sonic-blue)] font-semibold mb-4">{member.role}</div>
                  <p className="text-gray-300">{member.bio}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}