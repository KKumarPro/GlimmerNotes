import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Zap, Star, Users, Heart, Sparkles } from "lucide-react";

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const user = dashboardData?.user;
  const activities = dashboardData?.activities || [];

  // Mock data for the chart
  const chartData = [
    { day: "Mon", memories: 2, interactions: 5 },
    { day: "Tue", memories: 1, interactions: 8 },
    { day: "Wed", memories: 3, interactions: 6 },
    { day: "Thu", memories: 2, interactions: 9 },
    { day: "Fri", memories: 4, interactions: 7 },
    { day: "Sat", memories: 3, interactions: 12 },
    { day: "Sun", memories: 2, interactions: 10 },
  ];

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
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

          {/* Stats Grid */}
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

          {/* Progress Chart Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-12"
          >
            <Card className="glassmorphism" data-testid="card-progress-chart">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-primary" />
                  Activity Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="memories" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="interactions" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
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
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity: any, index: number) => (
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
                            {new Date(activity.createdAt).toLocaleString()}
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
