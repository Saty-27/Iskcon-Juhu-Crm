import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/admin/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Users,
  Calendar,
  DollarSign,
  Mail,
  MessageSquare,
  Image
} from 'lucide-react';

const AdminDashboard = () => {
  // Fetch summary data from API
  const { data: users = [] } = useQuery({ 
    queryKey: ['/api/users'],
    retry: false
  });
  
  const { data: events = [] } = useQuery({ 
    queryKey: ['/api/events'],
    retry: false
  });
  
  const { data: donations = [] } = useQuery({ 
    queryKey: ['/api/donations'],
    retry: false
  });
  
  const { data: messages = [] } = useQuery({ 
    queryKey: ['/api/contact-messages'],
    retry: false
  });
  
  const { data: testimonials = [] } = useQuery({ 
    queryKey: ['/api/testimonials'],
    retry: false
  });
  
  const { data: gallery = [] } = useQuery({ 
    queryKey: ['/api/gallery'],
    retry: false
  });

  return (
    <Layout>
      <Helmet>
        <title>Admin Dashboard - ISKCON Juhu</title>
      </Helmet>
      
      <div className="p-6">
        <h1 className="text-3xl font-bold text-primary mb-8">Welcome to ISKCON Juhu Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Array.isArray(users) ? users.length : 0}</div>
              <p className="text-xs text-muted-foreground">
                {Array.isArray(users) && users.length > 0 ? '+1 from last month' : 'No users yet'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Array.isArray(events) ? events.length : 0}</div>
              <p className="text-xs text-muted-foreground">
                {Array.isArray(events) && events.length > 0 ? '+2 from last month' : 'No events yet'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Array.isArray(donations) ? 
                  `₹${donations.reduce((sum, donation) => sum + (donation.amount || 0), 0).toLocaleString('en-IN')}` : 
                  '₹0'}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  {Array.isArray(donations) && donations.length > 0 ? 
                    `${donations.length} donations received` : 
                    'No donations yet'}
                </p>
                <a 
                  href="/admin/donation-stats"
                  className="text-xs text-primary hover:underline"
                >
                  View Statistics →
                </a>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Array.isArray(messages) ? messages.length : 0}</div>
              <p className="text-xs text-muted-foreground">
                {Array.isArray(messages) && messages.length > 0 ? 
                  `${messages.filter(m => !m.isRead).length} unread messages` : 
                  'No messages yet'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Array.isArray(testimonials) ? testimonials.length : 0}</div>
              <p className="text-xs text-muted-foreground">
                {Array.isArray(testimonials) && testimonials.length > 0 ? 
                  'Active testimonials' : 
                  'No testimonials yet'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gallery Items</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Array.isArray(gallery) ? gallery.length : 0}</div>
              <p className="text-xs text-muted-foreground">
                {Array.isArray(gallery) && gallery.length > 0 ? 
                  'Images in gallery' : 
                  'No gallery items yet'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="py-6 px-4 text-center">
                  <p className="text-sm text-muted-foreground">No recent activity to display</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;