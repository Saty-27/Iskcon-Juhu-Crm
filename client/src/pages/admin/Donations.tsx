import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/Layout";
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Search, 
  Eye, 
  Trash2,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Donation {
  id: number;
  name: string;
  email: string;
  phone: string;
  amount: number;
  status: string;
  createdAt: Date;
  paymentId?: string;
  categoryId?: number;
  eventId?: number;
}

const DonationsPage = () => {
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: donations = [], isLoading } = useQuery<Donation[]>({
    queryKey: ['/api/admin/donations'],
  });

  const deleteDonationMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/donations/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/donations'] });
      toast({ title: "Success", description: "Donation deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete donation", variant: "destructive" });
    },
  });

  // Calculate real donation statistics
  const completedDonations = donations.filter(d => d.status === 'success');
  const pendingDonations = donations.filter(d => d.status === 'pending');
  const totalAmount = completedDonations.reduce((sum, d) => sum + d.amount, 0);

  // Filter donations based on search and filters
  const filteredDonations = donations.filter(donation => {
    const matchesSearch = searchQuery === "" || 
      donation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.phone.includes(searchQuery) ||
      (donation.paymentId && donation.paymentId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || donation.status === statusFilter;
    
    const matchesType = typeFilter === "all" || 
      (typeFilter === "category" && donation.categoryId) ||
      (typeFilter === "event" && donation.eventId);
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewDonation = (donation: Donation) => {
    setSelectedDonation(donation);
    setIsViewDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this donation?")) {
      deleteDonationMutation.mutate(id);
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
        <div className="bg-gray-50 min-h-screen p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="p-6">
          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="rounded-xl shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-green-600">Total</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{donations.length}</div>
                <p className="text-sm text-gray-600">Total Donations</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-blue-600">Success</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{completedDonations.length}</div>
                <p className="text-sm text-gray-600">Completed</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <span className="text-sm font-medium text-yellow-600">Waiting</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{pendingDonations.length}</div>
                <p className="text-sm text-gray-600">Pending</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl shadow-sm border-0 bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-purple-600">Revenue</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">₹{totalAmount.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Total Amount</p>
              </CardContent>
            </Card>
          </div>

          {/* Search + Filters Bar */}
          <Card className="rounded-xl shadow-sm border-0 bg-white mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by donor name, email, phone, or payment ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                
                <div className="flex gap-4">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 border-gray-200">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="success">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40 border-gray-200">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donations Table */}
          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">ID</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Donor</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Category</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredDonations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 px-6 text-center text-gray-500">
                          No donations found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredDonations.map((donation) => (
                        <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 text-sm font-medium text-gray-900">#{donation.id}</td>
                          <td className="py-4 px-6">
                            <div>
                              <div className="font-medium text-gray-900">{donation.name}</div>
                              <div className="text-sm text-gray-500">{donation.email}</div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {donation.categoryId ? 'Category' : donation.eventId ? 'Event' : 'General'}
                          </td>
                          <td className="py-4 px-6 font-semibold text-gray-900">₹{donation.amount.toLocaleString()}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {formatDate(donation.createdAt)}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                              donation.status === 'success'
                                ? 'bg-green-100 text-green-700'
                                : donation.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {donation.status === 'success' ? 'Completed' : 
                               donation.status === 'pending' ? 'Pending' : 'Failed'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleViewDonation(donation)}
                                className="text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDelete(donation.id)}
                                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Donation Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Donation Details</DialogTitle>
            </DialogHeader>
            
            {selectedDonation && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Donor Name</label>
                    <p className="text-sm mt-1 font-medium">{selectedDonation.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-sm mt-1">{selectedDonation.email}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <p className="text-sm mt-1">{selectedDonation.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Amount</label>
                    <p className="text-sm mt-1 font-bold text-green-600">₹{selectedDonation.amount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date</label>
                    <p className="text-sm mt-1">{formatDate(selectedDonation.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                      selectedDonation.status === 'success'
                        ? 'bg-green-100 text-green-700'
                        : selectedDonation.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedDonation.status === 'success' ? 'Completed' : 
                       selectedDonation.status === 'pending' ? 'Pending' : 'Failed'}
                    </span>
                  </div>
                </div>
                
                {selectedDonation.paymentId && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Payment ID</label>
                    <p className="text-sm mt-1 font-mono bg-gray-100 p-2 rounded">{selectedDonation.paymentId}</p>
                  </div>
                )}
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

export default DonationsPage;