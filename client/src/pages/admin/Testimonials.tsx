import AdminLayout from "@/components/admin/Layout";

const TestimonialsPage = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Testimonials Management</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">All Testimonials</h2>
            <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition">
              Add New Testimonial
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">ID</th>
                  <th className="border p-3 text-left">Author</th>
                  <th className="border p-3 text-left">Content</th>
                  <th className="border p-3 text-left">Rating</th>
                  <th className="border p-3 text-left">Status</th>
                  <th className="border p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3">1</td>
                  <td className="border p-3">Priya Singh</td>
                  <td className="border p-3">My visit to ISKCON Juhu was spiritually transformative. The temple atmosphere was peaceful and divine.</td>
                  <td className="border p-3">5 ⭐</td>
                  <td className="border p-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      Published
                    </span>
                  </td>
                  <td className="border p-3">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border p-3">2</td>
                  <td className="border p-3">Rajiv Malhotra</td>
                  <td className="border p-3">The prasadam was delicious and the kirtan sessions were soul-stirring. Will definitely visit again.</td>
                  <td className="border p-3">4 ⭐</td>
                  <td className="border p-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      Published
                    </span>
                  </td>
                  <td className="border p-3">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TestimonialsPage;