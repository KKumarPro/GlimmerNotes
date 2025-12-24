import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { VirtualPet3D } from "@/components/VirtualPet3D";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Heart, Zap, Users, Coffee, Gamepad2, Moon, Dumbbell, UserPlus } from "lucide-react";
import type { Pet } from "@shared/schema";
import Snowfall from "react-snowfall";

// Defined extended interface with the specific property name 'coCarePartner'
interface PetWithPartner extends Pet {
  coCarePartner?: {
    id: string;
    username: string;
    displayName?: string | null;
  } | null;
}

export default function VirtualPet() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");

  const { data: pet, isLoading } = useQuery<PetWithPartner>({
    queryKey: ["/api/pet"],
  });

  const petActionMutation = useMutation({
    mutationFn: async (action: string) => {
      const response = await apiRequest("POST", "/api/pet/action", { action });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/pet"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      if (data.response) {
        toast({
          title: "Pet Action",
          description: data.response,
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to perform pet action. Please try again.",
        variant: "destructive",
      });
    },
  });

  const inviteFriendMutation = useMutation({
    mutationFn: async (username: string) => {
      const response = await apiRequest("POST", "/api/pet/co-care", { friendId: username });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pet"] });
      setInviteDialogOpen(false);
      setFriendUsername("");
      toast({
        title: "Invitation Sent",
        description: "Co-care invitation sent to your friend!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePetAction = (action: string) => {
    petActionMutation.mutate(action);
  };

  const handlePetClick = () => {
    const actions = ["play", "feed"];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    handlePetAction(randomAction);
  };

  const handleInviteFriend = () => {
    if (friendUsername.trim()) {
      inviteFriendMutation.mutate(friendUsername.trim());
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!pet) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="glassmorphism max-w-md">
            <CardContent className="p-8 text-center">
              <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No Pet Found</h2>
              <p className="text-muted-foreground">Your cosmic companion will appear here once created.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const happiness = pet.happiness ?? 50;
  const energy = pet.energy ?? 50;
  const bond = pet.bond ?? 30;

  // Sanitized object for 3D component
  const sanitizedPet = {
    ...pet,
    level: pet.level ?? 1,
    happiness: happiness,
    energy: energy,
    bond: bond,
    mood: pet.mood ?? "Neutral"
  };

  return (
    <Layout>
      <div className="py-12">
        <Snowfall color="#82C3D9"/>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">Your Cosmic Pet</h1>
            <p className="text-lg text-muted-foreground">Nurture your digital companion together</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glassmorphism" data-testid="card-pet-display">
                <CardContent className="p-8">
                  <VirtualPet3D pet={sanitizedPet} onPetClick={handlePetClick} />
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground font-medium flex items-center">
                        <Heart className="w-4 h-4 mr-2 text-primary" />
                        Happiness
                      </span>
                      <div className="flex items-center space-x-2">
                        <Progress value={happiness} className="w-32" data-testid="progress-happiness" />
                        <span className="text-sm text-muted-foreground">{happiness}%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-foreground font-medium flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-accent" />
                        Energy
                      </span>
                      <div className="flex items-center space-x-2">
                        <Progress value={energy} className="w-32" data-testid="progress-energy" />
                        <span className="text-sm text-muted-foreground">{energy}%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-foreground font-medium flex items-center">
                        <Users className="w-4 h-4 mr-2 text-primary" />
                        Bond
                      </span>
                      <div className="flex items-center space-x-2">
                        <Progress value={bond} className="w-32" data-testid="progress-bond" />
                        <span className="text-sm text-muted-foreground">{bond}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="glassmorphism" data-testid="card-pet-info">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground">{pet.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Level</p>
                        <p className="text-lg font-semibold text-foreground" data-testid="text-pet-level">{pet.level ?? 1}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Species</p>
                        <p className="text-lg font-semibold text-foreground" data-testid="text-pet-species">{pet.species}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Age</p>
                        <p className="text-lg font-semibold text-foreground" data-testid="text-pet-age">
                          {pet.createdAt ? Math.floor((Date.now() - new Date(pet.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0} days
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mood</p>
                        <p className="text-lg font-semibold text-foreground" data-testid="text-pet-mood">{pet.mood ?? "Neutral"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="glassmorphism" data-testid="card-care-actions">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Care Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => handlePetAction("feed")}
                        disabled={petActionMutation.isPending}
                        className="p-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-button flex-col h-auto"
                        data-testid="button-feed"
                      >
                        <Coffee className="w-6 h-6 mb-2" />
                        <span>Feed</span>
                      </Button>
                      
                      <Button
                        onClick={() => handlePetAction("play")}
                        disabled={petActionMutation.isPending}
                        variant="outline"
                        className="p-4 glassmorphism border-border hover:bg-muted/50 flex-col h-auto"
                        data-testid="button-play"
                      >
                        <Gamepad2 className="w-6 h-6 mb-2" />
                        <span>Play</span>
                      </Button>
                      
                      <Button
                        onClick={() => handlePetAction("sleep")}
                        disabled={petActionMutation.isPending}
                        variant="outline"
                        className="p-4 glassmorphism border-border hover:bg-muted/50 flex-col h-auto"
                        data-testid="button-sleep"
                      >
                        <Moon className="w-6 h-6 mb-2" />
                        <span>Sleep</span>
                      </Button>
                      
                      <Button
                        onClick={() => handlePetAction("exercise")}
                        disabled={petActionMutation.isPending}
                        variant="outline"
                        className="p-4 glassmorphism border-border hover:bg-muted/50 flex-col h-auto"
                        data-testid="button-exercise"
                      >
                        <Dumbbell className="w-6 h-6 mb-2" />
                        <span>Exercise</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="glassmorphism" data-testid="card-co-care">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Co-Care Partner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Fixed: Use pet.coCarePartner directly */}
                    {pet.coCarePartner ? (
                      <div className="co-care-info flex items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                         </div>
                         <div>
                            <p className="text-sm text-muted-foreground">
                              Co-Care Partner:
                            </p>
                            <p className="font-semibold text-foreground">
                              {pet.coCarePartner.displayName || pet.coCarePartner.username}
                            </p>
                         </div>
                      </div>
                    ) : (
                      <div className="co-care-add text-center">
                        <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">No co-care partner yet</p>
                      </div>
                    )}
                    
                    {!pet.coCarePartner && (
                      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full mt-4 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-button"
                            data-testid="button-invite-partner"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Invite Co-Care Partner
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glassmorphism border-border/50" data-testid="dialog-invite-partner">
                          <DialogHeader>
                            <DialogTitle className="text-foreground">Invite Co-Care Partner</DialogTitle>
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
                              onClick={handleInviteFriend}
                              disabled={inviteFriendMutation.isPending || !friendUsername.trim()}
                              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                              data-testid="button-send-invite"
                            >
                              {inviteFriendMutation.isPending ? "Sending..." : "Send Invitation"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
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