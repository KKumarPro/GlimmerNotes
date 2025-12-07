import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Gamepad2, ExternalLink, Puzzle, Target, Sparkles, Trophy } from "lucide-react";
import type { Friend, Game } from "@shared/schema";

interface FriendWithDetails extends Friend {
  friend?: {
    id: string;
    username: string;
    displayName: string | null;
  };
}

const msnGamesUrl = "https://www.msn.com/en-in/play";

const featuredGames = [
  {
    id: "solitaire",
    name: "Solitaire",
    description: "Classic card game - relaxing and timeless",
    icon: "🃏",
    url: `${msnGamesUrl}?gameId=solitaire`,
  },
  {
    id: "mahjong",
    name: "Mahjong",
    description: "Match tiles in this ancient puzzle game",
    icon: "🀄",
    url: `${msnGamesUrl}?gameId=mahjong`,
  },
  {
    id: "wordament",
    name: "Wordament",
    description: "Find words in a letter grid challenge",
    icon: "📝",
    url: `${msnGamesUrl}?gameId=wordament`,
  },
  {
    id: "sudoku",
    name: "Sudoku",
    description: "Number puzzle for brain training",
    icon: "🔢",
    url: `${msnGamesUrl}?gameId=sudoku`,
  },
  {
    id: "jigsaw",
    name: "Jigsaw Puzzles",
    description: "Beautiful picture puzzles to solve",
    icon: "🧩",
    url: `${msnGamesUrl}?gameId=jigsaw`,
  },
  {
    id: "trivia",
    name: "Trivia Games",
    description: "Test your knowledge on various topics",
    icon: "❓",
    url: `${msnGamesUrl}?gameId=trivia`,
  },
];

export default function Games() {
  const { user } = useAuth();
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  const { data: activeGamesData = [] } = useQuery<Game[]>({
    queryKey: ["/api/games"],
  });

  const { data: friendsData = [] } = useQuery<FriendWithDetails[]>({
    queryKey: ["/api/friends"],
  });

  const activeGames = activeGamesData as Game[];
  const friends = friendsData as FriendWithDetails[];
  const acceptedFriends = friends.filter(f => f.status === "accepted");

  const openGame = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">Games Hub</h1>
            <p className="text-lg text-muted-foreground">Play together across the cosmos</p>
          </motion.div>

          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="glassmorphism" data-testid="card-msn-games">
              <CardHeader>
                <CardTitle className="text-xl text-foreground flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 text-primary" />
                  MSN Games Collection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Explore hundreds of free games! Click on any game below or visit the full collection.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {featuredGames.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      onMouseEnter={() => setHoveredGame(game.id)}
                      onMouseLeave={() => setHoveredGame(null)}
                    >
                      <Card 
                        className={`glassmorphism cursor-pointer transition-all ${
                          hoveredGame === game.id ? 'bg-muted/30 scale-105' : ''
                        }`}
                        onClick={() => openGame(game.url)}
                        data-testid={`game-card-${game.id}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center text-2xl">
                              {game.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{game.name}</h3>
                              <p className="text-sm text-muted-foreground">{game.description}</p>
                            </div>
                            <ExternalLink className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={() => openGame(msnGamesUrl)}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-button"
                  data-testid="button-explore-all"
                >
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Explore All MSN Games
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glassmorphism text-center h-full" data-testid="card-puzzle-games">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center">
                    <Puzzle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Puzzle Games</h3>
                  <p className="text-muted-foreground text-sm mb-4">Challenge your mind with logic puzzles</p>
                  <Button
                    variant="outline"
                    className="w-full glassmorphism border-border"
                    onClick={() => openGame(`${msnGamesUrl}?category=puzzle`)}
                    data-testid="button-puzzle-games"
                  >
                    Play Puzzles
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="glassmorphism text-center h-full" data-testid="card-action-games">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-accent to-primary rounded-2xl flex items-center justify-center">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Action Games</h3>
                  <p className="text-muted-foreground text-sm mb-4">Fast-paced games for quick fun</p>
                  <Button
                    variant="outline"
                    className="w-full glassmorphism border-border"
                    onClick={() => openGame(`${msnGamesUrl}?category=action`)}
                    data-testid="button-action-games"
                  >
                    Play Action
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glassmorphism text-center h-full" data-testid="card-card-games">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Card Games</h3>
                  <p className="text-muted-foreground text-sm mb-4">Classic card games collection</p>
                  <Button
                    variant="outline"
                    className="w-full glassmorphism border-border"
                    onClick={() => openGame(`${msnGamesUrl}?category=cards`)}
                    data-testid="button-card-games"
                  >
                    Play Cards
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {activeGames.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="glassmorphism" data-testid="card-active-games">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Your Active Games</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeGames.map((game, index) => {
                      const isPlayerTurn = game.currentTurn === user?.id;
                      
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
                                {game.gameType}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {isPlayerTurn ? "Your turn" : "Waiting for opponent"}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant={isPlayerTurn ? "default" : "outline"}
                              className={isPlayerTurn ? "bg-gradient-to-r from-primary to-accent" : "glassmorphism border-border"}
                              data-testid={`button-continue-${index}`}
                            >
                              {isPlayerTurn ? "Play" : "View"}
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

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-muted-foreground text-sm">
              Games are provided by MSN Games. Click any game to open in a new tab.
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
