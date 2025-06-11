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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string | null;
  address: string | null;
  role: string;
  isActive: boolean;
}

const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Must be a valid email"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(["admin", "user"], { required_error: "Please select a role" }),
  isActive: z.boolean().default(true),
});

type UserFormData = z.infer<typeof userFormSchema>;

const UsersPage = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<UserFormData> }) => {
      return await apiRequest(`/api/users/${id}`, "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "Success", description: "User updated successfully" });
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update user", variant: "destructive" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/users/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({ title: "Success", description: "User deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
    },
  });

  const editForm = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      phone: "",
      address: "",
      role: "user",
      isActive: true,
    },
  });

  const handleEditSubmit = (data: UserFormData) => {
    if (!selectedUser) return;
    updateUserMutation.mutate({ id: selectedUser.id, data });
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    editForm.reset({
      name: user.name,
      email: user.email,
      username: user.username,
      phone: user.phone || "",
      address: user.address || "",
      role: user.role as "admin" | "user",
      isActive: user.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      deleteUserMutation.mutate(id);
    }
  };

  const toggleActive = (user: User) => {
    updateUserMutation.mutate({
      id: user.id,
      data: { isActive: !user.isActive }
    });
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

  const activeUsers = users.filter(u => u.isActive).length;
  const adminUsers = users.filter(u => u.role === 'admin').length;

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">Users Management</h1>
            <div className="flex gap-2">
              <Badge className="bg-blue-100 text-blue-800">
                {users.length} Total
              </Badge>
              <Badge className="bg-green-100 text-green-800">
                {activeUsers} Active
              </Badge>
              <Badge className="bg-purple-100 text-purple-800">
                {adminUsers} Admins
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.phone || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? "default" : "secondary"} 
                             className={user.role === 'admin' ? "bg-purple-100 text-purple-800" : ""}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.isActive ? "default" : "secondary"} 
                               className={user.isActive ? "bg-green-100 text-green-800" : ""}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActive(user)}
                          className="h-6 px-2"
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-700">
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-700"
                          disabled={user.role === 'admin'}
                        >
                          <Trash2 size={16} className="mr-1" />
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
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={editForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" {...field} />
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
                        <FormLabel>Active Status</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Inactive users cannot log in to the system
                        </p>
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
                  <Button type="submit" disabled={updateUserMutation.isPending}>
                    {updateUserMutation.isPending ? "Updating..." : "Update User"}
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

export default UsersPage;