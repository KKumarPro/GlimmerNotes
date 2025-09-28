import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TicTacToe, RockPaperScissors, CosmicCards } from "@/components/GameComponents";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useSocket } from "@/hooks/use-socket";
import { useToast } from "@/hooks/use-toast";
import { Gamepad2, Users, Trophy, Plus, Play } from "lucide-react";

export default function Games() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { sendMessage } = useSocket();
  const [createGameDialogOpen, setCreateGameDialogOpen] = useState(false);
  const [selectedGameType, setSelectedGameType] = useState<string>("");
  const [selectedOpponent, setSelectedOpponent] = useState<string>("");
  const [activeGame, setActiveGame] = useState<any>(null);

  const { data: activeGames = [] } = useQuery({
    queryKey: ["/api/games"],
  });

  const { data: friends = [] } = useQuery({
    queryKey: ["/api/friends"],
  });

  const createGameMutation = useMutation({
    mutationFn: async (gameData: { gameType: string; player2Id: string }) => {
      const response = await apiRequest("POST", "/api/games", gameData);
      return response.json();
    },
    onSuccess: (game) => {
      queryClient.invalidateQueries({ queryKey: ["/api/games"] });
      setCreateGameDialogOpen(false);
      setSelectedGameType("");
      setSelectedOpponent("");
      setActiveGame(game);
      toast({
        title: "Game Created",
        description: "Your game has been created! Waiting for opponent...",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create game. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateGame = () => {
    if (selectedGameType && selectedOpponent) {
      createGameMutation.mutate({
        gameType: selectedGameType,
        player2Id: selectedOpponent,
      });
    }
  };

  const handleGameMove = (gameId: string, gameState: any, nextTurn: string) => {
    sendMessage({
      type: 'game_move',
      gameId,
      gameState,
      nextTurn,
    });
  };

  const acceptedFriends = friends.filter((f: any) => f.status === "accepted");

  const gameTypes = [
    { value: "tic-tac-toe", label: "Cosmic Tic-Tac-Toe", icon: "❌" },
    { value: "rock-paper-scissors", label: "Stellar RPS", icon: "✂️" },
    { value: "cards", label: "Cosmic Cards", icon: "🃏" },
  ];

  const renderGame = (game: any) => {
    switch (game.gameType) {
      case "tic-tac-toe":
        return (
          <TicTacToe
            game={game}
            currentUserId={user?.id || ""}
            onMove={(gameState, nextTurn) => handleGameMove(game.id, gameState, nextTurn)}
          />
        );
      case "rock-paper-scissors":
        return (
          <RockPaperScissors
            game={game}
            currentUserId={user?.id || ""}
            onMove={(gameState, nextTurn) => handleGameMove(game.id, gameState, nextTurn)}
          />
        );
      case "cards":
        return (
          <CosmicCards
            game={game}
            currentUserId={user?.id || ""}
            onMove={(gameState, nextTurn) => handleGameMove(game.id, gameState, nextTurn)}
          />
        );
      default:
        return <div>Unknown game type</div>;
    }
  };

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
            <h1 className="text-4xl font-bold text-foreground mb-4">Games Hub</h1>
            <p className="text-lg text-muted-foreground">Play together across the cosmos</p>
          </motion.div>

          {/* Active Game */}
          {activeGame && (
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="glassmorphism" data-testid="card-active-game">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground flex items-center">
                    <Trophy className="w-6 h-6 mr-2 text-primary" />
                    Active Game: {gameTypes.find(g => g.value === activeGame.gameType)?.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderGame(activeGame)}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Game Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {gameTypes.map((gameType, index) => (
              <motion.div
                key={gameType.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="glassmorphism hover:bg-muted/20 transition-colors" data-testid={`card-game-${gameType.value}`}>
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center text-2xl">
                      {gameType.icon}
                    </div>
                    <CardTitle className="text-xl text-foreground">{gameType.label}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {gameType.value === "tic-tac-toe" && "Classic strategy with a cosmic twist"}
                      {gameType.value === "rock-paper-scissors" && "Rock, Paper, Scissors in space"}
                      {gameType.value === "cards" && "Simple card battle game"}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-button"
                      onClick={() => {
                        setSelectedGameType(gameType.value);
                        setCreateGameDialogOpen(true);
                      }}
                      data-testid={`button-play-${gameType.value}`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Active Games List */}
          {activeGames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="glassmorphism" data-testid="card-active-games">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Your Active Games</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeGames.map((game: any, index: number) => {
                      const isPlayerTurn = game.currentTurn === user?.id;
                      const opponent = game.player1Id === user?.id ? "Player 2" : "Player 1";
                      
                      return (
                        <motion.div
                          key={game.id}
                          className="p-4 bg-muted/30 rounded-xl"
                          whileHover={{ scale: 1.02 }}
                          data-testid={`active-game-${index}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-foreground">
                                vs {opponent}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {gameTypes.find(g => g.value === game.gameType)?.label} • {isPlayerTurn ? "Your turn" : "Waiting"}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant={isPlayerTurn ? "default" : "outline"}
                              className={isPlayerTurn ? "bg-gradient-to-r from-primary to-accent" : "glassmorphism border-border"}
                              onClick={() => setActiveGame(game)}
                              data-testid={`button-continue-${index}`}
                            >
                              {isPlayerTurn ? "Continue" : "View"}
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Create Game Dialog */}
          <Dialog open={createGameDialogOpen} onOpenChange={setCreateGameDialogOpen}>
            <DialogContent className="glassmorphism border-border/50" data-testid="dialog-create-game">
              <DialogHeader>
                <DialogTitle className="text-foreground">Create New Game</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Game Type</label>
                  <Select value={selectedGameType} onValueChange={setSelectedGameType}>
                    <SelectTrigger className="bg-input border-border text-foreground" data-testid="select-game-type">
                      <SelectValue placeholder="Choose a game" />
                    </SelectTrigger>
                    <SelectContent className="glassmorphism border-border/50">
                      {gameTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Opponent</label>
                  <Select value={selectedOpponent} onValueChange={setSelectedOpponent}>
                    <SelectTrigger className="bg-input border-border text-foreground" data-testid="select-opponent">
                      <SelectValue placeholder="Choose an opponent" />
                    </SelectTrigger>
                    <SelectContent className="glassmorphism border-border/50">
                      {acceptedFriends.map((friend: any) => {
                        const friendId = friend.userId === user?.id ? friend.friendId : friend.userId;
                        return (
                          <SelectItem key={friendId} value={friendId}>
                            {friend.friend?.displayName || friend.friend?.username || "Friend"}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleCreateGame}
                  disabled={!selectedGameType || !selectedOpponent || createGameMutation.isPending}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  data-testid="button-create-game"
                >
                  {createGameMutation.isPending ? "Creating..." : "Create Game"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
}
