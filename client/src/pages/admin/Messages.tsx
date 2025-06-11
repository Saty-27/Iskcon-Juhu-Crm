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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog";
import { Mail, Eye, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const MessagesPage = () => {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery<ContactMessage[]>({
    queryKey: ['/api/contact-messages'],
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/contact-messages/${id}/read`, "PUT");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact-messages'] });
      toast({ title: "Success", description: "Message marked as read" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to mark message as read", variant: "destructive" });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/contact-messages/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact-messages'] });
      toast({ title: "Success", description: "Message deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete message", variant: "destructive" });
    },
  });

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);
    
    if (!message.isRead) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMessageMutation.mutate(id);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">Contact Messages</h1>
            {unreadCount > 0 && (
              <Badge className="bg-red-100 text-red-800">
                {unreadCount} Unread
              </Badge>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No messages found.
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((message) => (
                  <TableRow key={message.id} className={!message.isRead ? "bg-blue-50" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!message.isRead ? (
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        ) : (
                          <Mail size={16} className="text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.phone || "N/A"}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate" title={message.subject}>
                        {message.subject.length > 50 ? `${message.subject.substring(0, 50)}...` : message.subject}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(message.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewMessage(message)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye size={16} className="mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDelete(message.id)}
                          className="text-red-600 hover:text-red-700"
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

        {/* View Message Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Contact Message Details</DialogTitle>
            </DialogHeader>
            
            {selectedMessage && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-sm mt-1">{selectedMessage.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm mt-1">{selectedMessage.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-sm mt-1">{selectedMessage.phone || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date</label>
                    <p className="text-sm mt-1">{formatDate(selectedMessage.createdAt)}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Subject</label>
                  <p className="text-sm mt-1">{selectedMessage.subject}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Message</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={selectedMessage.isRead ? "default" : "secondary"} 
                         className={selectedMessage.isRead ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                    {selectedMessage.isRead ? "Read" : "Unread"}
                  </Badge>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default MessagesPage;