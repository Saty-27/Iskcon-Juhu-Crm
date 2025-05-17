import { Helmet } from 'react-helmet';
import Layout from '@/components/admin/Layout';

const EventsManagement = () => {
  return (
    <Layout>
      <Helmet>
        <title>Events Management - ISKCON Juhu Admin</title>
      </Helmet>
      
      <div className="p-6">
        <h1 className="text-3xl font-bold text-primary mb-8">Events Management</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p>Events management interface will be implemented here.</p>
        </div>
      </div>
    </Layout>
  );
};

export default EventsManagement;