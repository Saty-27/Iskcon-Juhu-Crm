import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/admin/Layout';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign
} from 'lucide-react';

const AdminDashboard = () => {
  // Fetch real donation data from API
  const { data: donations = [] } = useQuery({ 
    queryKey: ['/api/admin/donations'],
    retry: false
  });

  // Calculate real donation statistics
  const completedDonations = donations.filter(d => d.status === 'success');
  const pendingDonations = donations.filter(d => d.status === 'pending');
  const totalAmount = completedDonations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <Layout>
      <Helmet>
        <title>Admin Dashboard - ISKCON Juhu</title>
      </Helmet>
      
      <div className="bg-gray-50 min-h-screen">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor and manage your temple's digital presence</p>
          </div>

          {/* Real-time Donation Statistics Grid */}
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

          {/* Recent Donations Table */}
          <Card className="rounded-xl shadow-sm border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Donations</h2>
                <a href="/admin/donations" className="text-purple-600 hover:text-purple-700 font-medium">
                  View All →
                </a>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Donor</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.slice(0, 5).map((donation) => (
                      <tr key={donation.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">#{donation.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{donation.name}</div>
                            <div className="text-sm text-gray-500">{donation.email}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-gray-900">₹{donation.amount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
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
                      </tr>
                    ))}
                    {donations.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 px-4 text-center text-gray-500">
                          No donations found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;