import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import Snowfall from "react-snowfall";

import { 
  Sparkles, 
  Heart, 
  Users, 
  MessageCircle, 
  Gamepad2, 
  Bot, 
  Star, 
  Zap,
  Calendar,
  Video,
  Music,
  Camera,
  Gift,
  MapPin
} from "lucide-react";

export default function Features() {
  const currentFeatures = [
    {
      icon: <Star className="w-8 h-8" />,
      title: "Memory Orb Universe",
      description: "Transform your memories into an interactive 3D starfield where each star represents a cherished moment.",
      status: "live",
      link: "/memory-orb"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Virtual Pet Care",
      description: "Nurture a cosmic companion that grows stronger through friendship and shared care with your best friend.",
      status: "live",
      link: "/pet"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Friendship Streaks",
      description: "Build lasting connections with streak counters and interactive friendship stats.",
      status: "live",
      link: "/friends"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Real-time Chat",
      description: "Connect instantly with friends through our cosmic messaging system.",
      status: "live",
      link: "/chat"
    },
    {
      icon: <Gamepad2 className="w-8 h-8" />,
      title: "Multiplayer Games",
      description: "Challenge friends to cosmic versions of classic games like Tic-Tac-Toe and Rock-Paper-Scissors.",
      status: "live",
      link: "/games"
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI Cosmic Assistant",
      description: "Get personalized guidance and insights from our intelligent companion.",
      status: "live"
    }
  ];

  const upcomingFeatures = [
    {
      icon: <Video className="w-8 h-8" />,
      title: "Video Memory Sharing",
      description: "Upload and share video memories that play as holographic displays in your memory orb.",
      status: "coming-soon",
      timeline: "Q2 2024"
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: "Cosmic Playlists",
      description: "Create shared music playlists that sync with your pet's mood and friendship activities.",
      status: "coming-soon",
      timeline: "Q2 2024"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Memory Calendar",
      description: "Schedule future memories and get reminded to create moments with friends.",
      status: "in-development",
      timeline: "Q3 2024"
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "AR Memory Viewer",
      description: "View your memories in augmented reality, placing them in your real-world environment.",
      status: "planned",
      timeline: "Q4 2024"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Digital Gifts",
      description: "Send virtual gifts to friends that appear as special effects in their memory universe.",
      status: "planned",
      timeline: "2025"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Location Memories",
      description: "Attach memories to real-world locations and discover them when you visit those places.",
      status: "planned",
      timeline: "2025"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "in-development":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "coming-soon":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "planned":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "Live";
      case "in-development":
        return "In Development";
      case "coming-soon":
        return "Coming Soon";
      case "planned":
        return "Planned";
      default:
        return status;
    }
  };

  return (
    <Layout>
      <div className="py-12">
        <Snowfall color="#82C3D9"/>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">Cosmic Features</h1>
            <p className="text-lg text-muted-foreground">
              Discover the magic of Glimmer's universe and what's coming next
            </p>
          </motion.div>

          {/* Current Features */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center">
              <Zap className="w-6 h-6 mr-3 text-primary" />
              Available Now
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="glassmorphism h-full hover:bg-muted/20 transition-colors" data-testid={`feature-card-${index}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white mb-4">
                          {feature.icon}
                        </div>
                        <Badge className={`${getStatusColor(feature.status)} border`}>
                          {getStatusText(feature.status)}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg text-foreground">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 flex flex-col h-full">
                      <p className="text-muted-foreground mb-4 flex-grow">
                        {feature.description}
                      </p>
                      {feature.link && (
                        <Link href={feature.link}>
                          <Button 
                            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-button"
                            data-testid={`button-try-${index}`}
                          >
                            Try It Now
                          </Button>
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Upcoming Features */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center">
              <Sparkles className="w-6 h-6 mr-3 text-accent" />
              Coming to the Universe
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="glassmorphism h-full hover:bg-muted/20 transition-colors" data-testid={`upcoming-feature-${index}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-accent to-primary flex items-center justify-center text-white mb-4 opacity-70">
                          {feature.icon}
                        </div>
                        <Badge className={`${getStatusColor(feature.status)} border`}>
                          {getStatusText(feature.status)}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg text-foreground">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground mb-4">
                        {feature.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-primary font-medium">
                          Expected: {feature.timeline}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="glassmorphism max-w-2xl mx-auto" data-testid="cta-section">
              <CardContent className="p-8">
                <Sparkles className="w-16 h-16 mx-auto text-primary mb-6" />
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Have Ideas for New Features?
                </h3>
                <p className="text-muted-foreground mb-6">
                  We're always looking to expand the Glimmer universe. Share your cosmic ideas with us!
                </p>
                <Link href="/contact">
                  <Button 
                    className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-button"
                    data-testid="button-contact-us"
                  >
                    Contact Us
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
