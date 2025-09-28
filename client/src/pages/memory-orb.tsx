import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { MemoryOrb3D } from "@/components/MemoryOrb3D";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Plus, Star } from "lucide-react";

const createMemorySchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.string().default("text"),
  isPublic: z.boolean().default(false),
});

type CreateMemoryData = z.infer<typeof createMemorySchema>;

export default function MemoryOrb() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMemory, setSelectedMemory] = useState<any>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: memories = [], isLoading } = useQuery({
    queryKey: ["/api/memories"],
  });

  const createMemoryMutation = useMutation({
    mutationFn: async (data: CreateMemoryData) => {
      const response = await apiRequest("POST", "/api/memories", {
        ...data,
        starPosition: {
          x: (Math.random() - 0.5) * 80,
          y: (Math.random() - 0.5) * 80,
          z: (Math.random() - 0.5) * 80,
        },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      setCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Memory Created",
        description: "Your memory has been added to the cosmic universe!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create memory. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<CreateMemoryData>({
    resolver: zodResolver(createMemorySchema),
    defaultValues: {
      title: "",
      content: "",
      type: "text",
      isPublic: false,
    },
  });

  const onCreateMemory = (data: CreateMemoryData) => {
    createMemoryMutation.mutate(data);
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Memory Orb Universe</h1>
            <p className="text-lg text-muted-foreground">Your memories, scattered like stars across the cosmos</p>
          </motion.div>

          {/* 3D Memory Orb */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Card className="glassmorphism" data-testid="card-memory-orb">
              <CardContent className="p-8">
                <MemoryOrb3D
                  memories={memories}
                  onStarClick={(memory) => setSelectedMemory(memory)}
                />
                {memories.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Star className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-foreground text-lg font-medium mb-2">Your universe awaits</p>
                      <p className="text-muted-foreground">Create your first memory to see stars appear</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="px-8 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-button"
                  data-testid="button-add-memory"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Memory
                </Button>
              </DialogTrigger>
              <DialogContent className="glassmorphism border-border/50" data-testid="dialog-create-memory">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Create New Memory</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onCreateMemory)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Give your memory a title..." 
                              {...field} 
                              className="bg-input border-border text-foreground"
                              data-testid="input-memory-title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your memory..."
                              rows={4}
                              {...field} 
                              className="bg-input border-border text-foreground"
                              data-testid="textarea-memory-content"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                      disabled={createMemoryMutation.isPending}
                      data-testid="button-save-memory"
                    >
                      {createMemoryMutation.isPending ? "Creating..." : "Create Memory"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Button 
              variant="outline" 
              className="px-8 py-3 glassmorphism text-foreground border-border hover:bg-muted/50"
              data-testid="button-view-all"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              View All Memories
            </Button>
          </motion.div>

          {/* Memory Grid */}
          {memories.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {memories.map((memory: any, index: number) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card 
                    className="glassmorphism cursor-pointer hover:bg-muted/20 transition-colors"
                    onClick={() => setSelectedMemory(memory)}
                    data-testid={`memory-card-${index}`}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground flex items-center">
                        <Star className="w-5 h-5 mr-2 text-primary" />
                        {memory.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3">
                        {memory.content}
                      </p>
                      <div className="mt-4 text-xs text-muted-foreground">
                        {new Date(memory.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Memory Detail Dialog */}
          <Dialog open={!!selectedMemory} onOpenChange={() => setSelectedMemory(null)}>
            <DialogContent className="glassmorphism border-border/50" data-testid="dialog-memory-detail">
              <DialogHeader>
                <DialogTitle className="text-foreground flex items-center">
                  <Star className="w-5 h-5 mr-2 text-primary" />
                  {selectedMemory?.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-foreground whitespace-pre-wrap">
                  {selectedMemory?.content}
                </p>
                <div className="text-sm text-muted-foreground">
                  Created: {selectedMemory && new Date(selectedMemory.createdAt).toLocaleString()}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
}
