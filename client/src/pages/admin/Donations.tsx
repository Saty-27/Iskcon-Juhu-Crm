import AdminLayout from "@/components/admin/Layout";

const DonationsPage = () => {
  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Donation Management</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-medium">All Donations</h2>
            <button className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition">
              Export Donations
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">ID</th>
                  <th className="border p-3 text-left">Donor</th>
                  <th className="border p-3 text-left">Category</th>
                  <th className="border p-3 text-left">Amount</th>
                  <th className="border p-3 text-left">Date</th>
                  <th className="border p-3 text-left">Status</th>
                  <th className="border p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-3">1</td>
                  <td className="border p-3">John Doe</td>
                  <td className="border p-3">Temple Renovation</td>
                  <td className="border p-3">₹5,000</td>
                  <td className="border p-3">May 15, 2025</td>
                  <td className="border p-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      Completed
                    </span>
                  </td>
                  <td className="border p-3">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border p-3">2</td>
                  <td className="border p-3">Jane Smith</td>
                  <td className="border p-3">Prasadam Distribution</td>
                  <td className="border p-3">₹2,500</td>
                  <td className="border p-3">May 10, 2025</td>
                  <td className="border p-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      Completed
                    </span>
                  </td>
                  <td className="border p-3">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">View</button>
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

export default DonationsPage;