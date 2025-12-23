import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSocket } from "@/hooks/use-socket";
import { useAuth } from "@/hooks/use-auth";
import { MessageCircle, Send, Users } from "lucide-react";
import type { Friend, ChatMessage } from "@shared/schema";
import Snowfall from "react-snowfall";


interface FriendWithDetails extends Friend {
  friend?: {
    id: string;
    username: string;
    displayName: string | null;
  };
}

export default function Chat() {
  const { user } = useAuth();
  const { friendId } = useParams();
  const { socket, sendMessage } = useSocket();
  const [selectedChat, setSelectedChat] = useState<string | null>(friendId || null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: friendsData = [] } = useQuery<FriendWithDetails[]>({
    queryKey: ["/api/friends"],
  });

  const friends = friendsData as FriendWithDetails[];

  const { data: conversationsData = [] } = useQuery<any[]>({
    queryKey: ["/api/friends/conversations"],
    refetchInterval: 5000,
  });

  const { data: chatMessagesData = [] } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat", selectedChat],
    enabled: !!selectedChat,
  });

  useEffect(() => {
    if (chatMessagesData && Array.isArray(chatMessagesData)) {
      setMessages(chatMessagesData);
    }
  }, [chatMessagesData]);

  useEffect(() => {
    if (socket) {
      const handleMessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.type === 'chat') {
          setMessages(prev => [...prev, data.message]);
        }
      };

      socket.addEventListener('message', handleMessage);
      return () => socket.removeEventListener('message', handleMessage);
    }
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat || !user) return;

    const messageData = {
      type: 'chat',
      senderId: user.id,
      receiverId: selectedChat,
      content: message.trim(),
    };

    sendMessage(messageData);
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: selectedChat,
      content: message.trim(),
      type: 'text',
      roomId: null,
      createdAt: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const acceptedFriends = friends.filter(f => f.status === "accepted");
  const selectedFriend = acceptedFriends.find(f => 
    f.userId === selectedChat || f.friendId === selectedChat
  );

  return (
    <Layout>
      <Snowfall color="#82C3D9"/>
      <div className="py-12">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">Cosmic Chat</h1>
            <p className="text-lg text-muted-foreground">Connect across the universe</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="glassmorphism h-96" data-testid="card-chat-list">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Conversations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {acceptedFriends.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground text-sm">No friends to chat with yet</p>
                        <p className="text-muted-foreground text-xs mt-2">Add friends to start chatting!</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {conversationsData && conversationsData.length > 0 ? (
                          conversationsData.map((conversation: any, index: number) => {
                            const friendUserId = conversation.friendship.userId === user?.id ? conversation.friendship.friendId : conversation.friendship.userId;
                            const isSelected = selectedChat === friendUserId;
                            const friendDetails = friends.find(f => {
                              const fid = f.userId === user?.id ? f.friendId : f.userId;
                              return fid === friendUserId;
                            })?.friend;
                            
                            return (
                              <motion.div
                                key={conversation.friendship.id}
                                className={`p-3 rounded-xl cursor-pointer transition-colors ${
                                  isSelected 
                                    ? "bg-primary/20 border border-primary/30" 
                                    : "bg-muted/30 hover:bg-muted/50"
                                }`}
                                onClick={() => setSelectedChat(friendUserId)}
                                whileHover={{ scale: 1.02 }}
                                data-testid={`chat-item-${index}`}
                              >
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-8 h-8 bg-gradient-to-r from-primary to-accent">
                                    <AvatarFallback className="bg-transparent text-white text-sm">
                                      {friendDetails?.displayName?.[0] || friendDetails?.username?.[0] || "F"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate" data-testid={`chat-name-${index}`}>
                                      {friendDetails?.displayName || friendDetails?.username || "Friend"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {conversation.lastMessage?.content?.substring(0, 30) || "No messages yet"}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })
                        ) : (
                          acceptedFriends.map((friend, index) => {
                            const friendUserId = friend.userId === user?.id ? friend.friendId : friend.userId;
                            const isSelected = selectedChat === friendUserId;
                            
                            return (
                              <motion.div
                                key={friend.id}
                                className={`p-3 rounded-xl cursor-pointer transition-colors ${
                                  isSelected 
                                    ? "bg-primary/20 border border-primary/30" 
                                    : "bg-muted/30 hover:bg-muted/50"
                                }`}
                                onClick={() => setSelectedChat(friendUserId)}
                                whileHover={{ scale: 1.02 }}
                                data-testid={`chat-item-${index}`}
                              >
                                <div className="flex items-center space-x-3">
                                  <Avatar className="w-8 h-8 bg-gradient-to-r from-primary to-accent">
                                    <AvatarFallback className="bg-transparent text-white text-sm">
                                      {friend.friend?.displayName?.[0] || friend.friend?.username?.[0] || "F"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate" data-testid={`chat-name-${index}`}>
                                      {friend.friend?.displayName || friend.friend?.username || "Friend"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      Click to start chatting
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="glassmorphism h-96 flex flex-col" data-testid="card-chat-window">
                  {selectedChat && selectedFriend ? (
                    <>
                      <CardHeader className="border-b border-border/50">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10 bg-gradient-to-r from-primary to-accent">
                            <AvatarFallback className="bg-transparent text-white">
                              {selectedFriend.friend?.displayName?.[0] || selectedFriend.friend?.username?.[0] || "F"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground" data-testid="text-chat-partner">
                              {selectedFriend.friend?.displayName || selectedFriend.friend?.username || "Friend"}
                            </p>
                            <p className="text-sm text-muted-foreground">Online</p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-4" data-testid="messages-container">
                          {messages.length === 0 ? (
                            <div className="text-center py-8">
                              <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                              <p className="text-muted-foreground">Start a conversation!</p>
                            </div>
                          ) : (
                            messages.map((msg, index) => {
                              const isOwnMessage = msg.senderId === user?.id;
                              
                              return (
                                <motion.div
                                  key={msg.id || index}
                                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                  data-testid={`message-${index}`}
                                >
                                  <div
                                    className={`max-w-xs p-3 rounded-2xl ${
                                      isOwnMessage
                                        ? "bg-gradient-to-r from-primary to-accent text-white rounded-tr-sm"
                                        : "bg-muted text-foreground rounded-tl-sm"
                                    }`}
                                  >
                                    <p className="text-sm">{msg.content}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      }) : ''}
                                    </p>
                                  </div>
                                </motion.div>
                              );
                            })
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </CardContent>

                      <div className="p-4 border-t border-border/50">
                        <div className="flex space-x-3">
                          <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type a cosmic message..."
                            className="flex-1 bg-input border-border text-foreground placeholder-muted-foreground"
                            data-testid="input-message"
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!message.trim()}
                            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-button"
                            data-testid="button-send"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <CardContent className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-foreground text-lg font-medium mb-2">Select a conversation</p>
                        <p className="text-muted-foreground">Choose a friend to start chatting</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
