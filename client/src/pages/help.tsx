import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Link } from "wouter";
import { 
  Search, 
  HelpCircle, 
  ChevronDown, 
  Star, 
  Heart, 
  Users, 
  MessageCircle, 
  Gamepad2,
  Bot,
  Shield,
  Settings,
  Mail
} from "lucide-react";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const helpCategories = [
    {
      icon: <Star className="w-6 h-6" />,
      title: "Memory Orb Universe",
      color: "from-primary to-accent",
      faqs: [
        {
          question: "How do I create a new memory?",
          answer: "Navigate to the Memory Orb page and click 'Add New Memory'. Fill in the title and description, then click 'Create Memory'. Your memory will appear as a star in your cosmic universe."
        },
        {
          question: "Why can't I see my memories as stars?",
          answer: "Make sure your browser supports WebGL for 3D graphics. If you're still having issues, try refreshing the page or using a different browser like Chrome or Firefox."
        },
        {
          question: "Can I make my memories private?",
          answer: "Yes! When creating a memory, uncheck the 'Public' option to keep it private. Only you will be able to see private memories in your universe."
        }
      ]
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Virtual Pet Care",
      color: "from-accent to-primary",
      faqs: [
        {
          question: "How do I care for my cosmic pet?",
          answer: "Use the action buttons to feed, play, exercise, or let your pet sleep. Each action affects your pet's happiness, energy, and bond levels differently."
        },
        {
          question: "What happens if I don't care for my pet?",
          answer: "Your pet's happiness and energy will gradually decrease over time. Regular care keeps your cosmic companion healthy and happy!"
        },
        {
          question: "How do I invite a friend to co-care for my pet?",
          answer: "Click 'Invite Co-Care Partner' on your pet page and enter your friend's username. They'll receive an invitation to help care for your pet."
        }
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Friends & Connections",
      color: "from-primary to-accent",
      faqs: [
        {
          question: "How do I add friends?",
          answer: "Go to the Friends page and click 'Add Friend'. Enter their username and send a friend request. They'll need to accept it before you become friends."
        },
        {
          question: "What are friendship streaks?",
          answer: "Friendship streaks track consecutive days of interaction between you and your friends. Chat, play games, or care for pets together to maintain your streak!"
        },
        {
          question: "Can I remove a friend?",
          answer: "Yes, you can remove friends from your friends list. This will end your friendship streak and stop shared activities."
        }
      ]
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Chat & Messaging",
      color: "from-accent to-primary",
      faqs: [
        {
          question: "How do I start a chat with a friend?",
          answer: "Go to the Chat page, select a friend from your conversation list, and start typing! Messages are delivered in real-time."
        },
        {
          question: "Are my messages private?",
          answer: "Yes! All messages are encrypted and only visible to you and the person you're chatting with. We never read or store your private conversations."
        },
        {
          question: "Can I create group chats?",
          answer: "Group chat functionality is coming soon! Currently, you can only chat one-on-one with friends."
        }
      ]
    },
    {
      icon: <Gamepad2 className="w-6 h-6" />,
      title: "Games & Activities",
      color: "from-primary to-accent",
      faqs: [
        {
          question: "What games can I play with friends?",
          answer: "Currently available: Cosmic Tic-Tac-Toe, Stellar Rock-Paper-Scissors, and Cosmic Cards. More games are being added regularly!"
        },
        {
          question: "How do I challenge a friend to a game?",
          answer: "Go to the Games Hub, select a game type, choose your opponent from your friends list, and click 'Create Game'. They'll be notified to join."
        },
        {
          question: "Can I play multiple games at once?",
          answer: "Yes! You can have multiple active games with different friends. Check your active games list to continue where you left off."
        }
      ]
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "AI Cosmic Assistant",
      color: "from-accent to-primary",
      faqs: [
        {
          question: "How do I talk to the AI assistant?",
          answer: "Click the chat bubble icon in the navigation bar to open the Cosmic Assistant. Ask questions about Glimmer features or get personalized suggestions."
        },
        {
          question: "What can the AI assistant help me with?",
          answer: "The assistant can help you navigate features, suggest activities, provide memory insights, and answer questions about using Glimmer."
        },
        {
          question: "Is my conversation with the AI private?",
          answer: "Yes, your conversations with the AI assistant are private and used only to provide you with better assistance."
        }
      ]
    }
  ];

  const quickLinks = [
    { icon: <Settings className="w-5 h-5" />, title: "Account Settings", href: "/" },
    { icon: <Shield className="w-5 h-5" />, title: "Privacy Policy", href: "/privacy" },
    { icon: <Mail className="w-5 h-5" />, title: "Contact Support", href: "/contact" }
  ];

  const filteredCategories = helpCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0 || searchQuery === "");

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">Help Center</h1>
            <p className="text-lg text-muted-foreground">
              Find answers to your cosmic questions
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="glassmorphism" data-testid="search-card">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for help topics..."
                    className="pl-10 bg-input border-border text-foreground text-lg h-12"
                    data-testid="search-input"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
              >
                <Link href={link.href}>
                  <Card className="glassmorphism hover:bg-muted/20 transition-colors cursor-pointer" data-testid={`quick-link-${index}`}>
                    <CardContent className="p-4 flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white">
                        {link.icon}
                      </div>
                      <span className="font-medium text-foreground">{link.title}</span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* FAQ Categories */}
          <div className="space-y-6">
            {filteredCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: categoryIndex * 0.1 + 0.4 }}
              >
                <Card className="glassmorphism" data-testid={`category-${categoryIndex}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-white mr-3`}>
                        {category.icon}
                      </div>
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.faqs.map((faq, faqIndex) => (
                        <Collapsible
                          key={faqIndex}
                          open={openItems.includes(categoryIndex * 100 + faqIndex)}
                          onOpenChange={() => toggleItem(categoryIndex * 100 + faqIndex)}
                        >
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="w-full justify-between p-4 h-auto text-left glassmorphism hover:bg-muted/50"
                              data-testid={`faq-trigger-${categoryIndex}-${faqIndex}`}
                            >
                              <span className="font-medium text-foreground">{faq.question}</span>
                              <ChevronDown className={`w-4 h-4 transition-transform ${
                                openItems.includes(categoryIndex * 100 + faqIndex) ? 'rotate-180' : ''
                              }`} />
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-4 pb-4">
                            <p className="text-muted-foreground" data-testid={`faq-answer-${categoryIndex}-${faqIndex}`}>
                              {faq.answer}
                            </p>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Support */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="glassmorphism max-w-2xl mx-auto" data-testid="contact-support">
              <CardContent className="p-8">
                <HelpCircle className="w-16 h-16 mx-auto text-primary mb-6" />
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Still Need Help?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Can't find what you're looking for? Our cosmic support team is here to help you navigate any challenges.
                </p>
                <Link href="/contact">
                  <Button 
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-button"
                    data-testid="button-contact-support"
                  >
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
