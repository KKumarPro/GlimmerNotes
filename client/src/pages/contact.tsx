import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, Sparkles, Send, MapPin, Clock } from "lucide-react";
import Snowfall from "react-snowfall";


export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you within 24 hours.",
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
    });
    
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "Get help with technical issues",
      contact: "support@glimmer.app",
      response: "Within 24 hours"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "General Inquiries",
      description: "Questions about Glimmer",
      contact: "hello@glimmer.app",
      response: "Within 48 hours"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Feature Requests",
      description: "Share your cosmic ideas",
      contact: "features@glimmer.app",
      response: "Within 1 week"
    }
  ];

  return (
    <Layout>
      <div className="py-12">
        <Snowfall color="#82C3D9"/>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground">
              Reach out across the cosmic void - we're here to help
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glassmorphism" data-testid="contact-form-card">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Name *
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Your name"
                          className="bg-input border-border text-foreground"
                          data-testid="input-name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Email *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="your@email.com"
                          className="bg-input border-border text-foreground"
                          data-testid="input-email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Category
                      </label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger className="bg-input border-border text-foreground" data-testid="select-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="glassmorphism border-border/50">
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
                          <SelectItem value="account">Account Issues</SelectItem>
                          <SelectItem value="privacy">Privacy Questions</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Subject
                      </label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        placeholder="Brief description of your inquiry"
                        className="bg-input border-border text-foreground"
                        data-testid="input-subject"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Message *
                      </label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        className="bg-input border-border text-foreground"
                        data-testid="textarea-message"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-button"
                      data-testid="button-submit"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Contact Methods */}
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={method.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                  >
                    <Card className="glassmorphism hover:bg-muted/20 transition-colors" data-testid={`contact-method-${index}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white">
                            {method.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">{method.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                            <p className="text-sm text-primary font-medium">{method.contact}</p>
                            <div className="flex items-center mt-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3 mr-1" />
                              Response time: {method.response}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Office Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="glassmorphism" data-testid="office-info">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-primary" />
                      Our Cosmic Headquarters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-foreground font-medium">Glimmer Technologies</p>
                        <p className="text-muted-foreground">123 Cosmic Avenue</p>
                        <p className="text-muted-foreground">Starlight City, Universe 12345</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Office Hours:</strong> Monday - Friday, 9 AM - 6 PM (GMT)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* FAQ Link */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card className="glassmorphism border-dashed border-2 border-primary/30 hover:border-primary/50 transition-colors" data-testid="faq-link">
                  <CardContent className="p-6 text-center">
                    <Sparkles className="w-12 h-12 mx-auto text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">
                      Check Our Help Center First
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Many questions are answered in our comprehensive help center
                    </p>
                    <Button 
                      variant="outline" 
                      className="glassmorphism border-border hover:bg-muted/50"
                      data-testid="button-help-center"
                    >
                      Visit Help Center
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
