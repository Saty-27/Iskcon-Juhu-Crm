import { Helmet } from 'react-helmet';
import Layout from '@/components/admin/Layout';

const GalleryManagement = () => {
  return (
    <Layout>
      <Helmet>
        <title>Gallery Management - ISKCON Juhu Admin</title>
      </Helmet>
      
      <div className="p-6">
        <h1 className="text-3xl font-bold text-primary mb-8">Gallery Management</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p>Gallery management interface will be implemented here.</p>
        </div>
      </div>
    </Layout>
  );
};

export default GalleryManagement;