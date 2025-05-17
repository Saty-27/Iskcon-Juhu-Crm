import AdminLayout from "@/components/admin/Layout";

const VideosPage = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Video Management</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">All Videos</h2>
            <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition">
              Add New Video
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border rounded-lg overflow-hidden">
              <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                <iframe 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                  title="Jagannath Rath Yatra 2024"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="font-medium">Jagannath Rath Yatra 2024</h3>
                <p className="text-sm text-gray-500 mt-1">Annual Rath Yatra celebration at ISKCON Juhu</p>
                <div className="flex justify-between mt-4">
                  <button className="text-blue-600 hover:text-blue-800">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                <iframe 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                  title="Gaura Purnima Celebration"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="font-medium">Gaura Purnima Celebration</h3>
                <p className="text-sm text-gray-500 mt-1">Special kirtan and festivities</p>
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

export default VideosPage;