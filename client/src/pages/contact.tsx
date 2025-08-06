import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: "support@sonicwave.com",
    description: "Get in touch with our support team"
  },
  {
    icon: Phone,
    title: "Call Us",
    details: "+91 9876543210",
    description: "Mon-Fri 9AM-6PM IST"
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: "Borivali(W), Mumbai, Maharashtra, India",
    description: "Our headquarters and showroom"
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: "Mon-Fri: 9AM-6PM EST",
    description: "Weekend support via email"
  }
];

const faqItems = [
  {
    question: "What's your return policy?",
    answer: "We offer a 30-day money-back guarantee on all products. Items must be in original condition with packaging."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes! We ship to over 40 countries worldwide. Shipping costs and delivery times vary by location."
  },
  {
    question: "How long is the warranty?",
    answer: "All SonicWave headphones come with a 2-year manufacturer warranty covering defects in materials and workmanship."
  },
  {
    question: "Can I track my order?",
    answer: "Absolutely! You'll receive a tracking number via email once your order ships. You can track it on our website or the carrier's site."
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        category: "",
        message: ""
      });
      setIsSubmitting(false);
    }, 1500);
  };

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
                Get In Touch
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Have questions about our products? Need support? Want to partner with us? 
                We'd love to hear from you. Our team is here to help.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-900 rounded-2xl p-6 text-center hover:bg-gray-800 transition-colors duration-300"
                >
                  <div className="flex justify-center mb-4">
                    <info.icon className="h-12 w-12 text-[var(--sonic-blue)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{info.title}</h3>
                  <div className="text-[var(--sonic-orange)] font-semibold mb-2">
                    {info.details}
                  </div>
                  <p className="text-gray-400 text-sm">{info.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-gray-900 rounded-3xl p-8"
              >
                <div className="flex items-center mb-8">
                  <MessageSquare className="h-8 w-8 text-[var(--sonic-blue)] mr-3" />
                  <h2 className="text-3xl font-bold">Send us a Message</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="mb-2 block">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="bg-gray-800 border-gray-700 focus:border-[var(--sonic-blue)] text-white"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="mb-2 block">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="bg-gray-800 border-gray-700 focus:border-[var(--sonic-blue)] text-white"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="mb-2 block">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="bg-gray-800 border-gray-700 focus:border-[var(--sonic-blue)] text-white"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="mb-2 block">
                      Category
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 focus:border-[var(--sonic-blue)] text-white">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="sales">Sales Question</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="feedback">Product Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="mb-2 block">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="bg-gray-800 border-gray-700 focus:border-[var(--sonic-blue)] text-white"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="mb-2 block">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="bg-gray-800 border-gray-700 focus:border-[var(--sonic-blue)] text-white min-h-[120px]"
                      placeholder="Tell us more about your inquiry..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[var(--sonic-blue)] hover:bg-blue-600 text-black font-semibold py-3 rounded-full transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>

              {/* FAQ Section */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {faqItems.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      className="bg-gray-900 rounded-2xl p-6"
                    >
                      <h3 className="text-xl font-semibold mb-3 text-[var(--sonic-blue)]">
                        {faq.question}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mt-8 bg-gradient-to-r from-[var(--sonic-blue)]/20 to-[var(--sonic-orange)]/20 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-semibold mb-3">Still have questions?</h3>
                  <p className="text-gray-300 mb-4">
                    Can't find what you're looking for? Our support team is here to help you 24/7.
                  </p>
                  <Button 
                    className="bg-[var(--sonic-orange)] hover:bg-orange-600 text-black font-semibold rounded-full"
                  >
                    Contact Support
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
