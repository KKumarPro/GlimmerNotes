import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Italic, Circle, Square, Scissors, FileText, Mountain } from "lucide-react";

interface GameComponentProps {
  game: any;
  currentUserId: string;
  onMove: (gameState: any, nextTurn: string) => void;
}

// Tic-Tac-Toe Component
export function TicTacToe({ game, currentUserId, onMove }: GameComponentProps) {
  const [board, setBoard] = useState<(string | null)[]>(
    game.gameState?.board || Array(9).fill(null)
  );
  const [winner, setWinner] = useState<string | null>(game.gameState?.winner || null);
  
  const isMyTurn = game.currentTurn === currentUserId;
  const isPlayer1 = game.player1Id === currentUserId;
  const mySymbol = isPlayer1 ? 'X' : 'Italic';
  const opponentSymbol = isPlayer1 ? 'Italic' : 'X';

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleCellClick = (index: number) => {
    if (!isMyTurn || board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = mySymbol;
    
    const gameWinner = checkWinner(newBoard);
    const isBoardFull = !newBoard.includes(null);
    
    setBoard(newBoard);
    setWinner(gameWinner);

    const nextTurn = gameWinner || isBoardFull ? null : 
      (currentUserId === game.player1Id ? game.player2Id : game.player1Id);

    onMove(
      { 
        board: newBoard, 
        winner: gameWinner,
        isDraw: !gameWinner && isBoardFull
      },
      nextTurn
    );
  };

  const renderCell = (index: number) => {
    const cellValue = board[index];
    return (
      <Button
        key={index}
        variant="outline"
        onClick={() => handleCellClick(index)}
        disabled={!isMyTurn || !!cellValue || !!winner}
        className="h-16 w-16 glassmorphism border-border hover:bg-muted/50 flex items-center justify-center text-2xl font-bold"
        data-testid={`tic-tac-toe-cell-${index}`}
      >
        {cellValue === 'X' && <X className="w-8 h-8 text-primary" />}
        {cellValue === 'Italic' && <Circle className="w-8 h-8 text-accent" />}
      </Button>
    );
  };

  const getGameStatus = () => {
    if (winner) {
      const winnerSymbol = winner;
      const isWinner = (isPlayer1 && winnerSymbol === 'X') || (!isPlayer1 && winnerSymbol === 'Italic');
      return isWinner ? "You Won! 🎉" : "You Lost 😔";
    }
    if (game.gameState?.isDraw) {
      return "It's a Draw! 🤝";
    }
    return isMyTurn ? "Your Turn" : "Opponent's Turn";
  };

  return (
    <div className="space-y-6" data-testid="tic-tac-toe-game">
      <div className="text-center">
        <Badge variant={winner ? "default" : isMyTurn ? "default" : "secondary"}>
          {getGameStatus()}
        </Badge>
      </div>
      
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {Array.from({ length: 9 }, (_, index) => renderCell(index))}
      </div>

      <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
        <div className="flex items-center">
          <X className="w-4 h-4 text-primary mr-1" />
          <span>You ({mySymbol})</span>
        </div>
        <div className="flex items-center">
          <Circle className="w-4 h-4 text-accent mr-1" />
          <span>Opponent ({opponentSymbol})</span>
        </div>
      </div>
    </div>
  );
}

// Rock Paper Scissors Component
export function RockPaperScissors({ game, currentUserId, onMove }: GameComponentProps) {
  const [myChoice, setMyChoice] = useState<string | null>(null);
  const [opponentChoice, setOpponentChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [round, setRound] = useState(1);

  const choices = [
    { value: 'rock', label: 'Rock', icon: <Mountain className="w-8 h-8" />, emoji: '🪨' },
    { value: 'paper', label: 'Paper', icon: <FileText className="w-8 h-8" />, emoji: '📄' },
    { value: 'scissors', label: 'Scissors', icon: <Scissors className="w-8 h-8" />, emoji: '✂️' }
  ];

  useEffect(() => {
    if (game.gameState) {
      setMyChoice(game.gameState.myChoice || null);
      setOpponentChoice(game.gameState.opponentChoice || null);
      setResult(game.gameState.result || null);
      setRound(game.gameState.round || 1);
    }
  }, [game.gameState]);

  const determineWinner = (choice1: string, choice2: string) => {
    if (choice1 === choice2) return 'draw';
    if (
      (choice1 === 'rock' && choice2 === 'scissors') ||
      (choice1 === 'paper' && choice2 === 'rock') ||
      (choice1 === 'scissors' && choice2 === 'paper')
    ) {
      return 'player1';
    }
    return 'player2';
  };

  const handleChoice = (choice: string) => {
    if (myChoice || result) return;
    
    setMyChoice(choice);
    
    // Simulate opponent choice (in real game, this would come from the other player)
    const opponentChoices = ['rock', 'paper', 'scissors'];
    const randomChoice = opponentChoices[Math.floor(Math.random() * 3)];
    
    setTimeout(() => {
      setOpponentChoice(randomChoice);
      
      const gameResult = determineWinner(choice, randomChoice);
      const resultText = gameResult === 'draw' ? 'Draw!' : 
        gameResult === 'player1' ? 'You Win!' : 'You Lose!';
      
      setResult(resultText);
      
      onMove({
        myChoice: choice,
        opponentChoice: randomChoice,
        result: resultText,
        round: round + 1
      }, game.currentTurn);
    }, 1000);
  };

  const resetRound = () => {
    setMyChoice(null);
    setOpponentChoice(null);
    setResult(null);
  };

  return (
    <div className="space-y-6" data-testid="rock-paper-scissors-game">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Round {round}</h3>
        {result && (
          <Badge variant={result.includes('Win') ? "default" : result.includes('Lose') ? "destructive" : "secondary"}>
            {result}
          </Badge>
        )}
      </div>

      {/* Choices Display */}
      <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Your Choice</p>
          <div className="w-20 h-20 mx-auto rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center text-4xl">
            {myChoice ? choices.find(c => c.value === myChoice)?.emoji : '?'}
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Opponent</p>
          <div className="w-20 h-20 mx-auto rounded-xl bg-gradient-to-r from-accent to-primary flex items-center justify-center text-4xl">
            {opponentChoice ? choices.find(c => c.value === opponentChoice)?.emoji : '?'}
          </div>
        </div>
      </div>

      {/* Choice Buttons */}
      {!myChoice && !result && (
        <motion.div 
          className="grid grid-cols-3 gap-3 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {choices.map((choice) => (
            <Button
              key={choice.value}
              onClick={() => handleChoice(choice.value)}
              variant="outline"
              className="h-20 glassmorphism border-border hover:bg-muted/50 flex-col space-y-1"
              data-testid={`rps-choice-${choice.value}`}
            >
              <div className="text-2xl">{choice.emoji}</div>
              <span className="text-xs">{choice.label}</span>
            </Button>
          ))}
        </motion.div>
      )}

      {/* Next Round Button */}
      {result && (
        <div className="text-center">
          <Button
            onClick={resetRound}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-button"
            data-testid="button-next-round"
          >
            Next Round
          </Button>
        </div>
      )}
    </div>
  );
}

// Cosmic Cards Component
export function CosmicCards({ game, currentUserId, onMove }: GameComponentProps) {
  const [playerCards, setPlayerCards] = useState<any[]>(game.gameState?.playerCards || []);
  const [opponentCards, setOpponentCards] = useState<any[]>(game.gameState?.opponentCards || []);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [battleResult, setBattleResult] = useState<string | null>(null);
  const [playerScore, setPlayerScore] = useState(game.gameState?.playerScore || 0);
  const [opponentScore, setOpponentScore] = useState(game.gameState?.opponentScore || 0);

  const cardTypes = [
    { suit: '♠', color: 'text-primary', values: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] },
    { suit: '♥', color: 'text-red-500', values: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] },
    { suit: '♦', color: 'text-red-500', values: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] },
    { suit: '♣', color: 'text-primary', values: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] }
  ];

  const getCardValue = (card: any) => {
    if (card.value === 'A') return 14;
    if (card.value === 'K') return 13;
    if (card.value === 'Q') return 12;
    if (card.value === 'J') return 11;
    return parseInt(card.value) || 0;
  };

  const generateRandomCard = () => {
    const suit = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    const value = suit.values[Math.floor(Math.random() * suit.values.length)];
    return {
      suit: suit.suit,
      value,
      color: suit.color,
      id: Math.random().toString()
    };
  };

  const initializeGame = () => {
    if (!playerCards.length) {
      const newPlayerCards = Array.from({ length: 3 }, generateRandomCard);
      const newOpponentCards = Array.from({ length: 3 }, generateRandomCard);
      
      setPlayerCards(newPlayerCards);
      setOpponentCards(newOpponentCards);
    }
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardPlay = (card: any) => {
    if (selectedCard || battleResult) return;

    setSelectedCard(card);
    
    // Opponent plays a random card
    const opponentCard = opponentCards[Math.floor(Math.random() * opponentCards.length)];
    
    setTimeout(() => {
      const playerValue = getCardValue(card);
      const opponentValue = getCardValue(opponentCard);
      
      let result = '';
      let newPlayerScore = playerScore;
      let newOpponentScore = opponentScore;
      
      if (playerValue > opponentValue) {
        result = 'You Win This Round!';
        newPlayerScore += 1;
      } else if (playerValue < opponentValue) {
        result = 'Opponent Wins This Round!';
        newOpponentScore += 1;
      } else {
        result = 'Draw!';
      }
      
      setBattleResult(result);
      setPlayerScore(newPlayerScore);
      setOpponentScore(newOpponentScore);
      
      // Remove played cards and add new ones
      setTimeout(() => {
        const newPlayerCards = playerCards.filter(c => c.id !== card.id);
        newPlayerCards.push(generateRandomCard());
        
        const newOpponentCards = opponentCards.filter(c => c.id !== opponentCard.id);
        newOpponentCards.push(generateRandomCard());
        
        setPlayerCards(newPlayerCards);
        setOpponentCards(newOpponentCards);
        setSelectedCard(null);
        setBattleResult(null);
      }, 2000);

      onMove({
        playerCards: playerCards,
        opponentCards: opponentCards,
        playerScore: newPlayerScore,
        opponentScore: newOpponentScore
      }, game.currentTurn);
    }, 1000);
  };

  const renderCard = (card: any, onClick?: () => void, isOpponent = false) => (
    <motion.div
      whileHover={{ scale: onClick ? 1.05 : 1 }}
      whileTap={{ scale: onClick ? 0.95 : 1 }}
    >
      <Button
        variant="outline"
        onClick={onClick}
        disabled={!onClick || !!selectedCard}
        className={`w-16 h-24 glassmorphism border-border hover:bg-muted/50 flex flex-col items-center justify-center ${
          isOpponent ? 'cursor-default' : ''
        }`}
        data-testid={`card-${card.id}`}
      >
        <span className={`text-lg font-bold ${card.color}`}>
          {isOpponent && !battleResult ? '?' : card.value}
        </span>
        <span className={`text-xl ${card.color}`}>
          {isOpponent && !battleResult ? '?' : card.suit}
        </span>
      </Button>
    </motion.div>
  );

  return (
    <div className="space-y-6" data-testid="cosmic-cards-game">
      <div className="text-center">
        <div className="flex justify-center space-x-8 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Your Score</p>
            <p className="text-2xl font-bold text-primary" data-testid="player-score">{playerScore}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Opponent Score</p>
            <p className="text-2xl font-bold text-accent" data-testid="opponent-score">{opponentScore}</p>
          </div>
        </div>
        
        {battleResult && (
          <Badge variant={battleResult.includes('You Win') ? "default" : battleResult.includes('Opponent') ? "destructive" : "secondary"}>
            {battleResult}
          </Badge>
        )}
      </div>

      {/* Battle Area */}
      {selectedCard && (
        <motion.div
          className="text-center py-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          data-testid="battle-area"
        >
          <p className="text-sm text-muted-foreground mb-4">Battle!</p>
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">Your Card</p>
              {renderCard(selectedCard)}
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">VS</p>
              <div className="w-16 h-24 flex items-center justify-center text-2xl text-muted-foreground">
                ⚔️
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">Opponent</p>
              {renderCard(generateRandomCard(), undefined, true)}
            </div>
          </div>
        </motion.div>
      )}

      {/* Player Cards */}
      {!selectedCard && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">Choose your card:</p>
            <div className="flex justify-center space-x-2">
              {playerCards.map((card) => 
                renderCard(card, () => handleCardPlay(card))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-muted-foreground">
        First to 5 points wins the game!
      </div>
    </div>
  );
}
