import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Heart, Sparkles, Users, Star, Rocket, Globe, Target, Award } from "lucide-react";
import Snowfall from "react-snowfall";


export default function About() {
  const teamMembers = [
    {
      name: "Karan Kumar",
      role: "Founder & CEO",
      description: "Visionary behind the cosmic connection experience",
      icon: "🌟"
    }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Authentic Connection",
      description: "We believe in fostering genuine relationships that transcend digital boundaries."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Magical Experiences",
      description: "Every interaction should feel special, memorable, and enchanting."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Inclusive Community",
      description: "Our cosmic universe welcomes all souls seeking meaningful connections."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Privacy First",
      description: "Your memories and relationships are sacred and protected."
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "The Spark",
      description: "Glimmer was born from a simple idea: making digital relationships feel magical"
    },
    {
      year: "2024 Q2",
      title: "Memory Orb Launch",
      description: "Our 3D memory universe feature revolutionized how people share experiences"
    },
    {
      year: "2024 Q3",
      title: "Virtual Pets",
      description: "Introduced cosmic companions that grow through friendship and care"
    },
    {
      year: "2024 Q4",
      title: "Growing Community",
      description: "Reached thousands of cosmic souls creating meaningful connections"
    }
  ];

  return (
    <Layout>
      <div className="py-12">
        <Snowfall color="#82C3D9"/>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">About Glimmer</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're building a cosmic universe where relationships bloom, memories shine like stars, 
              and every connection creates something magical.
            </p>
          </motion.div>

          {/* Hero Story */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="glassmorphism" data-testid="hero-story">
              <CardContent className="p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mb-6">
                      <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Our Cosmic Mission</h2>
                    <p className="text-muted-foreground mb-6">
                      In a world where digital connections often feel shallow, we set out to create something different. 
                      Glimmer transforms the way people share memories, nurture relationships, and express love through 
                      technology that feels magical, not mechanical.
                    </p>
                    <p className="text-muted-foreground">
                      Every feature we build is designed to strengthen the invisible threads that connect hearts 
                      across time and space, making distance disappear and moments last forever.
                    </p>
                  </div>
                  <div className="relative">
                    <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <div className="text-6xl animate-float">🌌</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Values */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
                >
                  <Card className="glassmorphism h-full hover:bg-muted/20 transition-colors" data-testid={`value-${index}`}>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white mb-4">
                        {value.icon}
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Team */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Our Cosmic Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="glassmorphism text-center" data-testid={`team-member-${index}`}>
                    <CardContent className="p-6">
                      <div className="text-4xl mb-4">{member.icon}</div>
                      <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                      <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                      <p className="text-xs text-muted-foreground">{member.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Journey Timeline */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">Our Journey</h2>
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  className="flex items-start space-x-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.7 }}
                  data-testid={`milestone-${index}`}
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                    {milestone.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Stats */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glassmorphism text-center" data-testid="stat-users">
                <CardContent className="p-6">
                  <Globe className="w-12 h-12 mx-auto text-primary mb-4" />
                  <div className="text-2xl font-bold text-foreground mb-1">10,000+</div>
                  <p className="text-sm text-muted-foreground">Cosmic Souls Connected</p>
                </CardContent>
              </Card>
              
              <Card className="glassmorphism text-center" data-testid="stat-memories">
                <CardContent className="p-6">
                  <Star className="w-12 h-12 mx-auto text-accent mb-4" />
                  <div className="text-2xl font-bold text-foreground mb-1">50,000+</div>
                  <p className="text-sm text-muted-foreground">Memories Shared</p>
                </CardContent>
              </Card>
              
              <Card className="glassmorphism text-center" data-testid="stat-pets">
                <CardContent className="p-6">
                  <Heart className="w-12 h-12 mx-auto text-primary mb-4" />
                  <div className="text-2xl font-bold text-foreground mb-1">25,000+</div>
                  <p className="text-sm text-muted-foreground">Cosmic Pets Cared For</p>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Card className="glassmorphism max-w-2xl mx-auto" data-testid="cta-section">
              <CardContent className="p-8">
                <Award className="w-16 h-16 mx-auto text-primary mb-6" />
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Join Our Cosmic Community
                </h3>
                <p className="text-muted-foreground mb-6">
                  Be part of something magical. Create memories, nurture relationships, 
                  and experience the wonder of true connection.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/features">
                    <Button 
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-button"
                      data-testid="button-explore-features"
                    >
                      Explore Features
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button 
                      variant="outline" 
                      className="glassmorphism border-border hover:bg-muted/50"
                      data-testid="button-get-in-touch"
                    >
                      Get in Touch
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
