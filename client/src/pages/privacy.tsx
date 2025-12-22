import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Database, Users, Globe } from "lucide-react";
import Snowfall from "react-snowfall";

export default function Privacy() {
  return (
    <Layout>
      <div className="py-12">
        <Snowfall color="#82C3D9"/>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              Your privacy is sacred in our cosmic universe
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: December 2024
            </p>
          </motion.div>

          {/* Privacy Overview */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glassmorphism text-center" data-testid="card-data-protection">
              <CardContent className="pt-6">
                <Shield className="w-12 h-12 mx-auto text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Data Protection</h3>
                <p className="text-sm text-muted-foreground">
                  We use industry-standard encryption to protect your data
                </p>
              </CardContent>
            </Card>

            <Card className="glassmorphism text-center" data-testid="card-minimal-collection">
              <CardContent className="pt-6">
                <Eye className="w-12 h-12 mx-auto text-accent mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Minimal Collection</h3>
                <p className="text-sm text-muted-foreground">
                  We only collect data necessary for the app to function
                </p>
              </CardContent>
            </Card>

            <Card className="glassmorphism text-center" data-testid="card-your-control">
              <CardContent className="pt-6">
                <Lock className="w-12 h-12 mx-auto text-primary mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Your Control</h3>
                <p className="text-sm text-muted-foreground">
                  You can delete your data at any time
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy Sections */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="glassmorphism" data-testid="section-information-collection">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Database className="w-5 h-5 mr-2 text-primary" />
                    Information We Collect
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Account Information</h4>
                    <p className="text-muted-foreground">
                      We collect your username, email address, and display name when you create an account. 
                      This information is necessary to provide you with personalized service and enable 
                      communication with friends.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Memories and Content</h4>
                    <p className="text-muted-foreground">
                      Your memories, messages, and pet care data are stored securely to provide the core 
                      functionality of Glimmer. You have full control over what you share and with whom.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Usage Analytics</h4>
                    <p className="text-muted-foreground">
                      We collect anonymous usage statistics to improve the app experience. This includes 
                      feature usage patterns and performance metrics, but never personal content.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glassmorphism" data-testid="section-data-usage">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Users className="w-5 h-5 mr-2 text-accent" />
                    How We Use Your Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Service Provision</h4>
                    <p className="text-muted-foreground">
                      Your data is used to provide Glimmer's core features including memory sharing, 
                      pet care, friend connections, and real-time communication.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Personalization</h4>
                    <p className="text-muted-foreground">
                      We use your activity patterns to personalize your experience, suggest memories 
                      to revisit, and optimize your pet's care recommendations.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Communication</h4>
                    <p className="text-muted-foreground">
                      We may send you important updates about the service, new features, or security 
                      notices. You can opt out of non-essential communications.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="glassmorphism" data-testid="section-data-sharing">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Globe className="w-5 h-5 mr-2 text-primary" />
                    Data Sharing and Third Parties
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">No Data Sales</h4>
                    <p className="text-muted-foreground">
                      We never sell your personal data to third parties. Your memories and relationships 
                      are yours alone.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Service Providers</h4>
                    <p className="text-muted-foreground">
                      We work with trusted service providers for hosting, analytics, and AI features. 
                      These partners are bound by strict data protection agreements.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Legal Requirements</h4>
                    <p className="text-muted-foreground">
                      We may disclose data if required by law or to protect the safety and security 
                      of our users and service.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="glassmorphism" data-testid="section-your-rights">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Lock className="w-5 h-5 mr-2 text-accent" />
                    Your Rights and Choices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Access and Portability</h4>
                    <p className="text-muted-foreground">
                      You can request a copy of all your data stored in Glimmer at any time through 
                      your account settings.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Correction and Updates</h4>
                    <p className="text-muted-foreground">
                      You can update or correct your personal information directly through the app 
                      or by contacting our support team.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Deletion</h4>
                    <p className="text-muted-foreground">
                      You can delete your account and all associated data at any time. This action 
                      is permanent and cannot be undone.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="glassmorphism" data-testid="section-contact">
                <CardHeader>
                  <CardTitle className="text-foreground">Contact Us About Privacy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    If you have questions about this privacy policy or how we handle your data, 
                    please don't hesitate to reach out:
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p>Email: privacy@glimmer.app</p>
                    <p>Address: Cosmic Privacy Office, Glimmer Universe</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
