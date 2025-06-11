import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/Layout";
import { DonationCategory, DonationCard, insertDonationCategorySchema, insertDonationCardSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Pencil, Trash2, CreditCard, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const DonationCategoriesPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DonationCategory | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [isCardCreateOpen, setIsCardCreateOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<DonationCard | null>(null);
  const [selectedCategoryForCard, setSelectedCategoryForCard] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery<DonationCategory[]>({
    queryKey: ['/api/donation-categories'],
  });

  const { data: donationCards = [] } = useQuery<DonationCard[]>({
    queryKey: ['/api/donation-cards'],
  });

  const createForm = useForm({
    resolver: zodResolver(insertDonationCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  const editForm = useForm({
    resolver: zodResolver(insertDonationCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  const cardCreateForm = useForm({
    resolver: zodResolver(insertDonationCardSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: 0,
      categoryId: 0,
      isActive: true,
    },
  });

  const cardEditForm = useForm({
    resolver: zodResolver(insertDonationCardSchema),
    defaultValues: {
      title: "",
      description: "",
      amount: 0,
      categoryId: 0,
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/donation-categories', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/donation-categories'] });
      setIsCreateOpen(false);
      createForm.reset();
      toast({ title: "Success", description: "Category created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create category", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/donation-categories/${id}`, 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/donation-categories'] });
      setEditingCategory(null);
      editForm.reset();
      toast({ title: "Success", description: "Category updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update category", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/donation-categories/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/donation-categories'] });
      toast({ title: "Success", description: "Category deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete category", variant: "destructive" });
    },
  });

  const createCardMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/donation-cards', 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/donation-cards'] });
      setIsCardCreateOpen(false);
      cardCreateForm.reset();
      toast({ title: "Success", description: "Donation card created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create donation card", variant: "destructive" });
    },
  });

  const updateCardMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      apiRequest(`/api/donation-cards/${id}`, 'PUT', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/donation-cards'] });
      setEditingCard(null);
      cardEditForm.reset();
      toast({ title: "Success", description: "Donation card updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update donation card", variant: "destructive" });
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/donation-cards/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/donation-cards'] });
      toast({ title: "Success", description: "Donation card deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete donation card", variant: "destructive" });
    },
  });

  const handleCreate = (data: any) => {
    createMutation.mutate(data);
  };

  const handleEdit = (category: DonationCategory) => {
    setEditingCategory(category);
    editForm.reset({
      name: category.name,
      description: category.description || "",
      isActive: category.isActive,
    });
  };

  const handleUpdate = (data: any) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreateCard = (categoryId: number) => {
    setSelectedCategoryForCard(categoryId);
    cardCreateForm.reset({
      title: "",
      description: "",
      amount: 0,
      categoryId: categoryId,
      isActive: true,
    });
    setIsCardCreateOpen(true);
  };

  const handleEditCard = (card: DonationCard) => {
    setEditingCard(card);
    cardEditForm.reset({
      title: card.title,
      description: card.description || "",
      amount: card.amount,
      categoryId: card.categoryId,
      isActive: card.isActive,
    });
  };

  const handleSubmitCard = (data: any) => {
    createCardMutation.mutate(data);
  };

  const handleUpdateCard = (data: any) => {
    if (editingCard) {
      updateCardMutation.mutate({ id: editingCard.id, data });
    }
  };

  const handleDeleteCard = (id: number) => {
    if (confirm('Are you sure you want to delete this donation card?')) {
      deleteCardMutation.mutate(id);
    }
  };

  const toggleCategoryExpansion = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getCategoryCards = (categoryId: number) => {
    return donationCards.filter(card => card.categoryId === categoryId);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Donation Categories</h1>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Category name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Category description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Creating..." : "Create Category"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => {
              const categoryCards = getCategoryCards(category.id);
              const isExpanded = expandedCategories.has(category.id);
              
              return (
                <Card key={category.id} className="border border-gray-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                        </div>
                        <Badge variant={category.isActive ? "default" : "secondary"}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCreateCard(category.id)}
                          className="flex items-center space-x-1"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Add Card</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        
                        <Collapsible open={isExpanded} onOpenChange={() => toggleCategoryExpansion(category.id)}>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </Collapsible>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <Collapsible open={isExpanded} onOpenChange={() => toggleCategoryExpansion(category.id)}>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium flex items-center">
                              <CreditCard className="w-4 h-4 mr-2" />
                              Donation Cards ({categoryCards.length})
                            </h4>
                          </div>
                          
                          {categoryCards.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                              <p>No donation cards created yet</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCreateCard(category.id)}
                                className="mt-2"
                              >
                                Create First Card
                              </Button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {categoryCards.map((card) => (
                                <Card key={card.id} className="bg-gray-50">
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h5 className="font-medium text-sm">{card.title}</h5>
                                      <Badge variant={card.isActive ? "default" : "secondary"} className="text-xs">
                                        {card.isActive ? 'Active' : 'Inactive'}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-600 mb-3">{card.description}</p>
                                    <div className="flex justify-between items-center">
                                      <span className="font-semibold text-orange-600">₹{card.amount}</span>
                                      <div className="flex space-x-1">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleEditCard(card)}
                                        >
                                          <Pencil className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleDeleteCard(card.id)}
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              );
            })}
          </div>
        )}

        {/* Edit Category Dialog */}
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Category name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Category description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Updating..." : "Update Category"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Create Donation Card Dialog */}
        <Dialog open={isCardCreateOpen} onOpenChange={setIsCardCreateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Donation Card</DialogTitle>
            </DialogHeader>
            <Form {...cardCreateForm}>
              <form onSubmit={cardCreateForm.handleSubmit(handleSubmitCard)} className="space-y-4">
                <FormField
                  control={cardCreateForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Card title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={cardCreateForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Card description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={cardCreateForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={cardCreateForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Make this card available for donations
                        </div>
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
                <Button type="submit" disabled={createCardMutation.isPending}>
                  {createCardMutation.isPending ? "Creating..." : "Create Card"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Donation Card Dialog */}
        <Dialog open={!!editingCard} onOpenChange={() => setEditingCard(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Donation Card</DialogTitle>
            </DialogHeader>
            <Form {...cardEditForm}>
              <form onSubmit={cardEditForm.handleSubmit(handleUpdateCard)} className="space-y-4">
                <FormField
                  control={cardEditForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Card title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={cardEditForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Card description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={cardEditForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (₹)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={cardEditForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Make this card available for donations
                        </div>
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
                <Button type="submit" disabled={updateCardMutation.isPending}>
                  {updateCardMutation.isPending ? "Updating..." : "Update Card"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default DonationCategoriesPage;