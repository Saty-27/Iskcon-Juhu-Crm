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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Testimonial {
  id: number;
  name: string;
  content: string;
  position: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: Date;
}

const testimonialFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  position: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
  isActive: z.boolean().default(true),
});

type TestimonialFormData = z.infer<typeof testimonialFormSchema>;

const TestimonialsPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/admin/testimonials'],
  });

  const createTestimonialMutation = useMutation({
    mutationFn: async (data: TestimonialFormData) => {
      return await apiRequest("/api/testimonials", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
      toast({ title: "Success", description: "Testimonial created successfully" });
      setIsCreateDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create testimonial", variant: "destructive" });
    },
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<TestimonialFormData> }) => {
      return await apiRequest(`/api/testimonials/${id}`, "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
      toast({ title: "Success", description: "Testimonial updated successfully" });
      setIsEditDialogOpen(false);
      setSelectedTestimonial(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update testimonial", variant: "destructive" });
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/testimonials/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
      toast({ title: "Success", description: "Testimonial deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete testimonial", variant: "destructive" });
    },
  });

  const createForm = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      content: "",
      position: "",
      imageUrl: "",
      isActive: true,
    },
  });

  const editForm = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      name: "",
      content: "",
      position: "",
      imageUrl: "",
      isActive: true,
    },
  });

  const handleCreateSubmit = (data: TestimonialFormData) => {
    createTestimonialMutation.mutate(data);
  };

  const handleEditSubmit = (data: TestimonialFormData) => {
    if (!selectedTestimonial) return;
    updateTestimonialMutation.mutate({ id: selectedTestimonial.id, data });
  };

  const handleEdit = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    editForm.reset({
      name: testimonial.name,
      content: testimonial.content,
      position: testimonial.position || "",
      imageUrl: testimonial.imageUrl || "",
      isActive: testimonial.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      deleteTestimonialMutation.mutate(id);
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
          <h1 className="text-2xl font-semibold">Testimonials Management</h1>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => createForm.reset({ name: "", content: "", position: "", imageUrl: "", isActive: true })}>
                <Plus size={16} className="mr-2" />
                Add New Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Testimonial</DialogTitle>
              </DialogHeader>
              
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter person's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Testimonial Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter the testimonial content..." 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position/Title (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Devotee, Volunteer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Active</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createTestimonialMutation.isPending}>
                      {createTestimonialMutation.isPending ? "Creating..." : "Create Testimonial"}
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
                <TableHead>Name</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No testimonials found. Create your first testimonial!
                  </TableCell>
                </TableRow>
              ) : (
                testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>{testimonial.id}</TableCell>
                    <TableCell>{testimonial.name}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate" title={testimonial.content}>
                        {testimonial.content.length > 100 ? `${testimonial.content.substring(0, 100)}...` : testimonial.content}
                      </div>
                    </TableCell>
                    <TableCell>{testimonial.position || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={testimonial.isActive ? "default" : "secondary"} className={testimonial.isActive ? "bg-green-100 text-green-800" : ""}>
                        {testimonial.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(testimonial)} className="text-blue-600 hover:text-blue-700">
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(testimonial.id)}
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
              <DialogTitle>Edit Testimonial</DialogTitle>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter person's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Testimonial Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter the testimonial content..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position/Title (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Devotee, Volunteer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Active</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateTestimonialMutation.isPending}>
                    {updateTestimonialMutation.isPending ? "Updating..." : "Update Testimonial"}
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

export default TestimonialsPage;