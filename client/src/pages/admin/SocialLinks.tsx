import AdminLayout from "@/components/admin/Layout";

const SocialLinksPage = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Social Links Management</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">All Social Links</h2>
            <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition">
              Add New Social Link
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">ID</th>
                  <th className="border p-3 text-left">Platform</th>
                  <th className="border p-3 text-left">URL</th>
                  <th className="border p-3 text-left">Icon</th>
                  <th className="border p-3 text-left">Status</th>
                  <th className="border p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3">1</td>
                  <td className="border p-3">Facebook</td>
                  <td className="border p-3">https://facebook.com/iskconjuhu</td>
                  <td className="border p-3">
                    <span className="bg-blue-500 text-white p-1 rounded">
                      <i className="text-lg">fb</i>
                    </span>
                  </td>
                  <td className="border p-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      Active
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
                  <td className="border p-3">Instagram</td>
                  <td className="border p-3">https://instagram.com/iskconjuhu</td>
                  <td className="border p-3">
                    <span className="bg-pink-500 text-white p-1 rounded">
                      <i className="text-lg">ig</i>
                    </span>
                  </td>
                  <td className="border p-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      Active
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

export default SocialLinksPage;