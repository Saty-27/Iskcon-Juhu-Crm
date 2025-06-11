import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Download, Search, Filter } from "lucide-react";

interface DonationRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  amount: number;
  categoryName: string | null;
  eventTitle: string | null;
  status: string;
  createdAt: string;
  paymentId: string | null;
  address: string | null;
  panCard: string | null;
  message: string | null;
}

export default function Donations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { data: donations = [], isLoading, error } = useQuery<DonationRecord[]>({
    queryKey: ['/api/admin/donations'],
  });

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = 
      donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.phone.includes(searchTerm) ||
      (donation.paymentId && donation.paymentId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || donation.status === statusFilter;
    
    const matchesType = 
      typeFilter === "all" ||
      (typeFilter === "category" && donation.categoryName) ||
      (typeFilter === "event" && donation.eventTitle);
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const exportDonations = () => {
    const csvContent = [
      ['ID', 'Donor', 'Email', 'Phone', 'Amount', 'Category', 'Date', 'Status'],
      ...filteredDonations.map(donation => [
        donation.id,
        donation.name,
        donation.email,
        donation.phone,
        `₹${donation.amount}`,
        donation.categoryName || donation.eventTitle || 'General',
        format(new Date(donation.createdAt), 'MMM dd, yyyy'),
        donation.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donations-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Donation Management</h1>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Donation Management</h1>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center text-red-600">
            <p>Error loading donations. Please try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Donation Management</h1>
          <Button onClick={exportDonations} className="flex items-center gap-2">
            <Download size={16} />
            Export Donations
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">All Donations</h2>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search by donor name, email, phone, or payment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Donations Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No donations found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDonations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell className="font-medium">{donation.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{donation.name}</div>
                          <div className="text-sm text-gray-500">{donation.email}</div>
                          <div className="text-sm text-gray-500">{donation.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {donation.categoryName || donation.eventTitle || 'General Donation'}
                      </TableCell>
                      <TableCell className="font-medium">₹{donation.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        {format(new Date(donation.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(donation.status)}>
                          {donation.status === 'success' ? 'Completed' : 
                           donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye size={14} />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Total Donations</div>
              <div className="text-2xl font-bold text-green-900">{donations.length}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Completed</div>
              <div className="text-2xl font-bold text-blue-900">
                {donations.filter(d => d.status === 'success').length}
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-yellow-600 font-medium">Pending</div>
              <div className="text-2xl font-bold text-yellow-900">
                {donations.filter(d => d.status === 'pending').length}
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600 font-medium">Total Amount</div>
              <div className="text-2xl font-bold text-purple-900">
                ₹{donations.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}