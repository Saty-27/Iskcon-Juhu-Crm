import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import AdminLayout from "@/components/admin/Layout";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DonationCategory } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import DonationCategoryModal from '@/components/admin/DonationCategoryModal';

const DonationCategoriesPage = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DonationCategory | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery<DonationCategory[]>({
    queryKey: ['/api/donation-categories'],
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/donation-categories/${id}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/donation-categories'] });
      toast({ title: 'Success', description: 'Category deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete category', variant: 'destructive' });
    },
  });

  const handleEdit = (category: DonationCategory) => {
    setEditingCategory(category);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const getSuggestedAmountsDisplay = (suggestedAmounts: any) => {
    if (!suggestedAmounts) return 'No suggested amounts';
    if (Array.isArray(suggestedAmounts)) {
      return suggestedAmounts.length > 0 ? `${suggestedAmounts.length} suggested amounts` : 'No suggested amounts';
    }
    return 'No suggested amounts';
  };

  const getCustomDonationStatus = (category: DonationCategory) => {
    // For now, assume custom donations are enabled for all categories
    return 'Custom donations enabled';
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Donation Categories</h1>
              <p className="text-gray-600">Create and manage comprehensive donation categories with full control</p>
            </div>
          </div>
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Donation Categories</h1>
            <p className="text-gray-600">Create and manage comprehensive donation categories with full control</p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Category
          </Button>
        </div>

        <div className="grid gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <Badge variant={category.isActive ? "default" : "secondary"}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    
                    <div className="grid grid-cols-3 gap-8 text-sm">
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4 text-gray-400" />
                        <span>{getSuggestedAmountsDisplay(category.suggestedAmounts)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">💰</span>
                        <span>{getCustomDonationStatus(category)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">🏦</span>
                        <span>Payment details configured</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {categories.length === 0 && (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-12 text-center">
                <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No donation categories</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first donation category</p>
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Category
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Category Modal */}
        <DonationCategoryModal
          isOpen={isAddDialogOpen || !!editingCategory}
          onClose={() => {
            setIsAddDialogOpen(false);
            setEditingCategory(null);
          }}
          category={editingCategory}
        />
      </div>
    </AdminLayout>
  );
};

export default DonationCategoriesPage;