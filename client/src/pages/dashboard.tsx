import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Star, Users, Heart, Sparkles } from "lucide-react";
import cosmicBg from "@assets/Untitled_1766157378996.png";
import type { User, Activity } from "@shared/schema";
import Snowfall from 'react-snowfall';

interface DashboardData {
  user: User;
  memories: number;
  friends: number;
  pet: any;
  activities: Activity[];
}

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${cosmicBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const user = dashboardData?.user;
  const activities = dashboardData?.activities || [];

  return (
    <Layout>
      <div 
        className="py-12 min-h-screen"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${cosmicBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <Snowfall color="#82C3D"/>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent" data-testid="text-username">
                {user?.displayName || user?.username || "Cosmic Explorer"}
              </span>
            </h1>
            <p className="text-lg text-muted-foreground">Your cosmic journey continues...</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="glassmorphism text-center" data-testid="card-streak">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center animate-pulse-glow">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1" data-testid="text-current-streak">
                    {user?.currentStreak || 0}
                  </h3>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glassmorphism text-center" data-testid="card-memories">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center animate-float">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1" data-testid="text-memories-count">
                    {user?.memoriesCount || 0}
                  </h3>
                  <p className="text-sm text-muted-foreground">Memories</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="glassmorphism text-center" data-testid="card-friends">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1" data-testid="text-friends-count">
                    {user?.friendsCount || 0}
                  </h3>
                  <p className="text-sm text-muted-foreground">Friends</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glassmorphism text-center" data-testid="card-pet-level">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center animate-pulse-glow">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1" data-testid="text-pet-level">
                    {user?.petLevel || 1}
                  </h3>
                  <p className="text-sm text-muted-foreground">Pet Level</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="glassmorphism" data-testid="card-recent-activity">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No recent activities. Start exploring the cosmos!</p>
                    <p className="text-sm text-muted-foreground mt-2">Create memories, care for your pet, or connect with friends to see your activity here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        className="flex items-center space-x-4 p-4 bg-muted/30 rounded-xl"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        data-testid={`activity-item-${index}`}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                          {activity.type === "memory_shared" && <Star className="w-5 h-5 text-white" />}
                          {activity.type === "friend_added" && <Users className="w-5 h-5 text-white" />}
                          {activity.type === "pet_interaction" && <Heart className="w-5 h-5 text-white" />}
                          {activity.type === "game_played" && <Sparkles className="w-5 h-5 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground font-medium" data-testid={`activity-description-${index}`}>
                            {activity.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : ''}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
