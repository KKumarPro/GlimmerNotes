import { useState, useRef } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Plus, Star, Image as ImageIcon, FileText, X } from "lucide-react";
import type { Memory } from "@shared/schema";
import Snowfall from "react-snowfall";


const createMemorySchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  type: z.enum(["text", "photo"]).default("text"),
  isPublic: z.boolean().default(false),
  photoUrl: z.string().optional(),
});

type CreateMemoryData = z.infer<typeof createMemorySchema>;

export default function MemoryOrb() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: memoriesData = [], isLoading } = useQuery<Memory[]>({
    queryKey: ["/api/memories"],
  });

  const memories = memoriesData as Memory[];

  const createMemoryMutation = useMutation({
    mutationFn: async (data: CreateMemoryData) => {
      const memoryContent = data.type === "photo" && previewImage 
        ? `${data.content}\n\n[Photo: ${previewImage}]`
        : data.content;

      const response = await apiRequest("POST", "/api/memories", {
        title: data.title,
        content: memoryContent,
        type: data.type,
        isPublic: data.isPublic,
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
      setPreviewImage(null);
      form.reset();
      toast({
        title: "Memory Created",
        description: "Your memory has been added to the cosmic universe!",
      });
    },
    onError: () => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCreateMemory = (data: CreateMemoryData) => {
    createMemoryMutation.mutate(data);
  };

  const extractPhotoFromContent = (content: string | null) => {
    if (!content) return null;
    const match = content.match(/\[Photo: (data:image[^\]]+)\]/);
    return match ? match[1] : null;
  };

  const getTextContent = (content: string | null) => {
    if (!content) return '';
    return content.replace(/\n\n\[Photo: data:image[^\]]+\]/, '');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Snowfall color="#82C3D9"/>
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

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
            <h1 className="text-4xl font-bold text-foreground mb-4">Memory Orb Universe</h1>
            <p className="text-lg text-muted-foreground">Your memories, scattered like stars across the cosmos</p>
          </motion.div>

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

          <motion.div
            className="mb-12 p-8 glassmorphism rounded-3xl flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Dialog open={createDialogOpen} onOpenChange={(open) => {
              setCreateDialogOpen(open);
              if (!open) {
                setPreviewImage(null);
                form.reset();
              }
            }}>
              <DialogTrigger asChild>
                <Button 
                  className="px-8 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 glow-button"
                  data-testid="button-add-memory"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Memory
                </Button>
              </DialogTrigger>
              <DialogContent className="glassmorphism border-border/50 max-w-lg" data-testid="dialog-create-memory">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Create New Memory</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onCreateMemory)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Memory Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-input border-border text-foreground" data-testid="select-memory-type">
                                <SelectValue placeholder="Select memory type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="glassmorphism border-border/50">
                              <SelectItem value="text">
                                <div className="flex items-center">
                                  <FileText className="w-4 h-4 mr-2" />
                                  Text Memory
                                </div>
                              </SelectItem>
                              <SelectItem value="photo">
                                <div className="flex items-center">
                                  <ImageIcon className="w-4 h-4 mr-2" />
                                  Photo Memory
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
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

                    {form.watch("type") === "photo" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Photo</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                          className="hidden"
                          data-testid="input-photo-file"
                        />
                        {previewImage ? (
                          <div className="relative">
                            <img 
                              src={previewImage} 
                              alt="Preview" 
                              className="w-full h-48 object-cover rounded-lg border border-border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => setPreviewImage(null)}
                              data-testid="button-remove-photo"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full glassmorphism border-border"
                            onClick={() => fileInputRef.current?.click()}
                            data-testid="button-upload-photo"
                          >
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Upload Photo
                          </Button>
                        )}
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
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
              onClick={() => document.getElementById('memories-grid')?.scrollIntoView({ behavior: 'smooth' })}
              data-testid="button-view-all"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              View All Memories
            </Button>
          </motion.div>

          {memories.length > 0 && (
            <motion.div
              id="memories-grid"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {memories.map((memory, index) => {
                const photoUrl = extractPhotoFromContent(memory.content);
                const textContent = getTextContent(memory.content);

                return (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card 
                      className="glassmorphism cursor-pointer hover:bg-muted/20 transition-colors overflow-hidden"
                      onClick={() => setSelectedMemory(memory)}
                      data-testid={`memory-card-${index}`}
                    >
                      {photoUrl && (
                        <div className="w-full h-32 overflow-hidden">
                          <img 
                            src={photoUrl} 
                            alt={memory.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-lg text-foreground flex items-center">
                          {memory.type === "photo" ? (
                            <ImageIcon className="w-5 h-5 mr-2 text-primary" />
                          ) : (
                            <Star className="w-5 h-5 mr-2 text-primary" />
                          )}
                          {memory.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3">
                          {textContent}
                        </p>
                        <div className="mt-4 text-xs text-muted-foreground">
                          {memory.createdAt ? new Date(memory.createdAt).toLocaleDateString() : ''}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          <Dialog open={!!selectedMemory} onOpenChange={() => setSelectedMemory(null)}>
            <DialogContent className="glassmorphism border-border/50 max-w-lg" data-testid="dialog-memory-detail">
              <DialogHeader>
                <DialogTitle className="text-foreground flex items-center">
                  {selectedMemory?.type === "photo" ? (
                    <ImageIcon className="w-5 h-5 mr-2 text-primary" />
                  ) : (
                    <Star className="w-5 h-5 mr-2 text-primary" />
                  )}
                  {selectedMemory?.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selectedMemory && extractPhotoFromContent(selectedMemory.content) && (
                  <img 
                    src={extractPhotoFromContent(selectedMemory.content)!} 
                    alt={selectedMemory.title} 
                    className="w-full rounded-lg"
                  />
                )}
                <p className="text-foreground whitespace-pre-wrap">
                  {selectedMemory && getTextContent(selectedMemory.content)}
                </p>
                <div className="text-sm text-muted-foreground">
                  Created: {selectedMemory?.createdAt && new Date(selectedMemory.createdAt).toLocaleString()}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
}
