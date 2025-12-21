import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Users, UserPlus, MessageCircle, Gamepad2, Check, X, Zap } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import type { Friend } from "@shared/schema";

interface FriendWithDetails extends Friend {
  friend?: {
    id: string;
    username: string;
    displayName: string | null;
  };
}

export default function Friends() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");

  const { data: friendsData = [], isLoading } = useQuery<FriendWithDetails[]>({
    queryKey: ["/api/friends"],
  });

  const friends = friendsData as FriendWithDetails[];

  const addFriendMutation = useMutation({
    mutationFn: async (username: string) => {
      const response = await apiRequest("POST", "/api/friends", { friendId: username });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/friends"] });
      setAddFriendDialogOpen(false);
      setFriendUsername("");
      toast({
        title: "Friend Request Sent",
        description: "Your friend request has been sent!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send friend request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateFriendshipMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/friends/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/friends"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update friendship status.",
        variant: "destructive",
      });
    },
  });

  const handleAddFriend = () => {
    if (friendUsername.trim()) {
      addFriendMutation.mutate(friendUsername.trim());
    }
  };

  const handleFriendshipAction = (id: string, status: string) => {
    updateFriendshipMutation.mutate({ id, status });
  };

  const acceptedFriends = friends.filter(f => f.status === "accepted");
  const pendingRequests = friends.filter(f => f.status === "pending");

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">Cosmic Connections</h1>
            <p className="text-lg text-muted-foreground">Your constellation of friendships</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Friends List */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="glassmorphism" data-testid="card-friends-list">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl text-foreground">Friends</CardTitle>
                      <Dialog open={addFriendDialogOpen} onOpenChange={setAddFriendDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-button"
                            data-testid="button-add-friend"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add Friend
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glassmorphism border-border/50" data-testid="dialog-add-friend">
                          <DialogHeader>
                            <DialogTitle className="text-foreground">Add New Friend</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input
                              placeholder="Enter friend's username..."
                              value={friendUsername}
                              onChange={(e) => setFriendUsername(e.target.value)}
                              className="bg-input border-border text-foreground"
                              data-testid="input-friend-username"
                            />
                            <Button
                              onClick={handleAddFriend}
                              disabled={addFriendMutation.isPending || !friendUsername.trim()}
                              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                              data-testid="button-send-request"
                            >
                              {addFriendMutation.isPending ? "Sending..." : "Send Friend Request"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {acceptedFriends.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No friends yet. Start connecting!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {acceptedFriends.map((friendship: any, index: number) => (
                          <motion.div
                            key={friendship.id}
                            className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            data-testid={`friend-item-${index}`}
                          >
                            <div className="flex items-center space-x-4">
                              <Avatar className="w-12 h-12 bg-gradient-to-r from-primary to-accent">
                                <AvatarFallback className="bg-transparent text-white">
                                  {friendship.friend?.displayName?.[0] || friendship.friend?.username?.[0] || "F"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-foreground font-medium" data-testid={`friend-name-${index}`}>
                                  {friendship.friend?.displayName || friendship.friend?.username || "Friend"}
                                </p>
                                <p className="text-sm text-muted-foreground flex items-center">
                                  <Zap className="w-3 h-3 mr-1" />
                                  {friendship.streakCount} day streak
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <a href={`/chat/${friendship.userId === user?.id ? friendship.friendId : friendship.userId}`}>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="p-2 hover:bg-muted/50"
                                  data-testid={`button-chat-${index}`}
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </Button>
                              </a>
                              <a href="/games">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="p-2 hover:bg-muted/50"
                                  data-testid={`button-games-${index}`}
                                >
                                  <Gamepad2 className="w-4 h-4" />
                                </Button>
                              </a>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Friendship Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="glassmorphism" data-testid="card-friendship-stats">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Friendship Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Friends</span>
                        <span className="text-foreground font-semibold" data-testid="text-total-friends">
                          {acceptedFriends.length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Active Streaks</span>
                        <span className="text-foreground font-semibold" data-testid="text-active-streaks">
                          {acceptedFriends.filter((f: any) => f.streakCount > 0).length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Longest Streak</span>
                        <span className="text-foreground font-semibold" data-testid="text-longest-streak">
                          {Math.max(...acceptedFriends.map((f: any) => f.streakCount), 0)} days
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Friend Requests */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glassmorphism" data-testid="card-friend-requests">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Friend Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pendingRequests.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No pending requests</p>
                    ) : (
                      <div className="space-y-3">
                        {pendingRequests.map((request: any, index: number) => (
                          <div 
                            key={request.id} 
                            className="flex items-center justify-between"
                            data-testid={`request-item-${index}`}
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8 bg-gradient-to-r from-accent to-primary">
                                <AvatarFallback className="bg-transparent text-white text-sm">
                                  {request.friend?.displayName?.[0] || request.friend?.username?.[0] || "F"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-foreground text-sm" data-testid={`request-name-${index}`}>
                                {request.friend?.displayName || request.friend?.username || "Friend"}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="p-1 text-primary hover:text-primary/80"
                                onClick={() => handleFriendshipAction(request.id, "accepted")}
                                data-testid={`button-accept-${index}`}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="p-1 text-destructive hover:text-destructive/80"
                                onClick={() => handleFriendshipAction(request.id, "blocked")}
                                data-testid={`button-reject-${index}`}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
