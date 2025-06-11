import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/Layout";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, ExternalLink } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string | null;
  isActive: boolean;
  createdAt: Date;
}

const socialLinkFormSchema = z.object({
  platform: z.string().min(2, "Platform name must be at least 2 characters"),
  url: z.string().url("Must be a valid URL"),
  icon: z.string().optional(),
  isActive: z.boolean().default(true),
});

type SocialLinkFormData = z.infer<typeof socialLinkFormSchema>;

const SocialLinksPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSocialLink, setSelectedSocialLink] = useState<SocialLink | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: socialLinks = [], isLoading } = useQuery<SocialLink[]>({
    queryKey: ['/api/social-links'],
  });

  const createSocialLinkMutation = useMutation({
    mutationFn: async (data: SocialLinkFormData) => {
      return await apiRequest("/api/social-links", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social-links'] });
      toast({ title: "Success", description: "Social link created successfully" });
      setIsCreateDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create social link", variant: "destructive" });
    },
  });

  const updateSocialLinkMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<SocialLinkFormData> }) => {
      return await apiRequest(`/api/social-links/${id}`, "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social-links'] });
      toast({ title: "Success", description: "Social link updated successfully" });
      setIsEditDialogOpen(false);
      setSelectedSocialLink(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update social link", variant: "destructive" });
    },
  });

  const deleteSocialLinkMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/social-links/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social-links'] });
      toast({ title: "Success", description: "Social link deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete social link", variant: "destructive" });
    },
  });

  const createForm = useForm<SocialLinkFormData>({
    resolver: zodResolver(socialLinkFormSchema),
    defaultValues: {
      platform: "",
      url: "",
      icon: "",
      isActive: true,
    },
  });

  const editForm = useForm<SocialLinkFormData>({
    resolver: zodResolver(socialLinkFormSchema),
    defaultValues: {
      platform: "",
      url: "",
      icon: "",
      isActive: true,
    },
  });

  const handleCreateSubmit = (data: SocialLinkFormData) => {
    createSocialLinkMutation.mutate(data);
  };

  const handleEditSubmit = (data: SocialLinkFormData) => {
    if (!selectedSocialLink) return;
    updateSocialLinkMutation.mutate({ id: selectedSocialLink.id, data });
  };

  const handleEdit = (socialLink: SocialLink) => {
    setSelectedSocialLink(socialLink);
    editForm.reset({
      platform: socialLink.platform,
      url: socialLink.url,
      icon: socialLink.icon || "",
      isActive: socialLink.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this social link?")) {
      deleteSocialLinkMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Social Links Management</h1>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => createForm.reset({ platform: "", url: "", icon: "", isActive: true })}>
                <Plus size={16} className="mr-2" />
                Add New Social Link
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Social Link</DialogTitle>
              </DialogHeader>
              
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Facebook, Instagram, YouTube" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://facebook.com/iskconjuhu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon Class (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., fab fa-facebook, fab fa-instagram" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createSocialLinkMutation.isPending}>
                      {createSocialLinkMutation.isPending ? "Creating..." : "Create Social Link"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {socialLinks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No social links found. Create your first social link!
                  </TableCell>
                </TableRow>
              ) : (
                socialLinks.map((socialLink) => (
                  <TableRow key={socialLink.id}>
                    <TableCell>{socialLink.id}</TableCell>
                    <TableCell className="font-medium">{socialLink.platform}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="truncate" title={socialLink.url}>
                          {socialLink.url.length > 50 ? `${socialLink.url.substring(0, 50)}...` : socialLink.url}
                        </span>
                        <a 
                          href={socialLink.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>{socialLink.icon || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(socialLink)} className="text-blue-600 hover:text-blue-700">
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(socialLink.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Social Link</DialogTitle>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Facebook, Instagram, YouTube" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://facebook.com/iskconjuhu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Class (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., fab fa-facebook, fab fa-instagram" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateSocialLinkMutation.isPending}>
                    {updateSocialLinkMutation.isPending ? "Updating..." : "Update Social Link"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default SocialLinksPage;