import AdminLayout from "@/components/admin/Layout";

const GalleryPage = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Gallery Management</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">All Gallery Items</h2>
            <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition">
              Add New Image
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border rounded-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://via.placeholder.com/600x400" 
                  alt="Temple Entrance" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium">Temple Entrance</h3>
                <p className="text-sm text-gray-500 mt-1">Beautiful entrance to the temple</p>
                <div className="flex justify-between mt-4">
                  <button className="text-blue-600 hover:text-blue-800">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://via.placeholder.com/600x400" 
                  alt="Lord Krishna Deity" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium">Lord Krishna Deity</h3>
                <p className="text-sm text-gray-500 mt-1">Beautiful deity of Lord Krishna</p>
                <div className="flex justify-between mt-4">
                  <button className="text-blue-600 hover:text-blue-800">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GalleryPage;