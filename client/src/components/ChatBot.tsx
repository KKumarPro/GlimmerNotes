import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Bot, Send, X, MessageCircle, Sparkles, Loader2 } from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Hello! I'm your Cosmic Assistant. I can help you navigate Glimmer, provide insights about your memories, or suggest activities with friends. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: memoryInsights } = useQuery({
    queryKey: ["/api/memories/insights"],
    enabled: isOpen && !!user,
  });

  const chatbotMutation = useMutation({
    mutationFn: async ({ message, context }: { message: string; context?: string }) => {
      const response = await apiRequest("POST", "/api/chatbot", { message, context });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = {
        id: Date.now().toString() + "_assistant",
        type: "assistant",
        content: data.response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: () => {
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + "_error",
        type: "assistant",
        content: "I'm having trouble connecting to my cosmic wisdom right now. Please try again in a moment!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + "_user",
      type: "user",
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Provide context about user's insights if available
    const context = memoryInsights ? `User insights: ${JSON.stringify(memoryInsights)}` : undefined;
    
    chatbotMutation.mutate({ 
      message: message.trim(),
      context 
    });
    
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "How do I create a memory?",
    "Show me my friendship stats",
    "What games can I play?",
    "How do I care for my pet?",
    "Tell me about my memory insights"
  ];

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg glow-button"
          data-testid="button-open-chatbot"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </motion.div>

      {/* Chat Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="glassmorphism border-border/50 max-w-md h-[600px] flex flex-col p-0"
          data-testid="dialog-chatbot"
        >
          <DialogHeader className="p-4 border-b border-border/50">
            <DialogTitle className="text-foreground flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mr-3">
                <Bot className="w-4 h-4 text-white" />
              </div>
              Cosmic Assistant
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="ml-auto p-2 hover:bg-muted/50"
                data-testid="button-close-chatbot"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto" data-testid="chatbot-messages">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    data-testid={`message-${msg.type}-${msg.id}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl ${
                        msg.type === 'user'
                          ? "bg-gradient-to-r from-primary to-accent text-white rounded-tr-sm"
                          : "glassmorphism text-foreground rounded-tl-sm"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {msg.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Loading indicator */}
              {chatbotMutation.isPending && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  data-testid="chatbot-loading"
                >
                  <div className="glassmorphism p-3 rounded-2xl rounded-tl-sm">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <motion.div
                className="mt-6 space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                data-testid="suggested-questions"
              >
                <p className="text-xs text-muted-foreground mb-3">Try asking:</p>
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMessage(question);
                      handleSendMessage();
                    }}
                    className="w-full text-left justify-start h-auto p-2 glassmorphism hover:bg-muted/50 text-xs"
                    data-testid={`suggested-question-${index}`}
                  >
                    <Sparkles className="w-3 h-3 mr-2 text-primary" />
                    {question}
                  </Button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border/50">
            <div className="flex space-x-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Glimmer..."
                className="flex-1 bg-input border-border text-foreground placeholder-muted-foreground"
                disabled={chatbotMutation.isPending}
                data-testid="input-chatbot-message"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || chatbotMutation.isPending}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-button"
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
