import Image from "next/image";
import { MdCardTravel, MdBarChart, MdAttachMoney, MdPerson } from "react-icons/md";
import { FaFileAlt, FaRegCommentAlt, FaUsers, FaUserShield, FaCalendarAlt, FaNewspaper } from "react-icons/fa";
import { RiHotelFill } from "react-icons/ri";
import Link from "next/link";
import { RevenueChart, TripTypesChart } from "@/components/Charts";

export default function Home() {
  // Dummy data for charts
  const revenueData = [
    { name: 'Jan', revenue: 4000, bookings: 24 },
    { name: 'Feb', revenue: 3000, bookings: 13 },
    { name: 'Mar', revenue: 5000, bookings: 28 },
    { name: 'Apr', revenue: 2780, bookings: 19 },
    { name: 'May', revenue: 5890, bookings: 31 },
    { name: 'Jun', revenue: 6390, bookings: 35 },
  ];

  const salesTeamData = [
    { name: 'adityasingh', bookings: 35, fill: '#8884d8' },
    { name: 'shruti233', bookings: 28, fill: '#83a6ed' },
    { name: 'chiragchn', bookings: 22, fill: '#8dd1e1' },
    { name: 'sidd_tch', bookings: 18, fill: '#82ca9d' },
  ];

  const tripTypesData = [
    { name: 'Adventure', value: 35, fill: '#FF8042' },
    { name: 'Cultural', value: 25, fill: '#FFBB28' },
    { name: 'Beach', value: 20, fill: '#00C49F' },
    { name: 'Luxury', value: 15, fill: '#0088FE' },
    { name: 'Family', value: 5, fill: '#FF6666' },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 font-[family-name:var(--font-geist-sans)] p-8">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-800">Dashboard Overview</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
            <FaCalendarAlt className="text-blue-600 mr-2" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-8 space-y-8">
        {/* Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <MdCardTravel className="text-2xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Trips</p>
              <h3 className="text-2xl font-bold">52</h3>
              <p className="text-xs text-green-500">+12% from last month</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <MdAttachMoney className="text-2xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">₹24,780</h3>
              <p className="text-xs text-green-500">+8.5% from last month</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <FaUsers className="text-2xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Customers</p>
              <h3 className="text-2xl font-bold">800</h3>
              <p className="text-xs text-green-500">+23 new today</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex items-center">
            <div className="p-3 rounded-full bg-orange-100 mr-4">
              <FaRegCommentAlt className="text-2xl text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Leads</p>
              <h3 className="text-2xl font-bold">120</h3>
              <p className="text-xs text-red-500">-5 from yesterday</p>
            </div>
          </div>
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue & Bookings Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Revenue & Bookings</h2>
              <select className="bg-gray-100 border border-gray-300 text-gray-700 py-1 px-3 rounded-lg focus:outline-none">
                <option>Last 6 Months</option>
                <option>Last 3 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-80">
              <RevenueChart data={revenueData} />
            </div>
          </div>

        
          {/* Quick Navigation */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Quick Navigation</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin-panel/trips" className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <MdCardTravel className="text-2xl text-blue-600 mb-2" />
                <span className="text-sm font-medium">Manage Batches</span>
              </Link>
              <Link href="#" className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <FaUsers className="text-2xl text-purple-600 mb-2" />
                <span className="text-sm font-medium">Customers</span>
              </Link>
              <Link href="/leads" className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                <FaRegCommentAlt className="text-2xl text-orange-600 mb-2" />
                <span className="text-sm font-medium">Leads</span>
              </Link>
              <Link href="/subadmins" className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <FaUserShield className="text-2xl text-green-600 mb-2" />
                <span className="text-sm font-medium">Subadmins</span>
              </Link>
              <Link href="/trips" className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <FaFileAlt className="text-2xl text-red-600 mb-2" />
                <span className="text-sm font-medium">Website Content</span>
              </Link>
              <Link href="blogs" className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                <FaNewspaper className="text-2xl text-yellow-600 mb-2" />
                <span className="text-sm font-medium">Blogs</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Navigation & Sales Performance */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Performance */}
          <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Sales Team Performance</h2>
            <div className="space-y-4">
              {salesTeamData.map((person, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <MdPerson className="text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{person.name}</span>
                      <span className="text-sm font-medium">{person.bookings} bookings</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${(person.bookings / 35) * 100}%`,
                          backgroundColor: person.fill
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Top Performer</h3>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <MdPerson className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="font-medium">adityasingh</p>
                  <p className="text-sm text-gray-600">35 bookings this month</p>
                </div>
                <div className="ml-auto bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  +15.8%
                </div>
              </div>
            </div>
          </div>
          <section className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { id: 1, action: 'New booking', details: 'Adventure trip to Nepal', time: '10 minutes ago', user: 'Sarah Johnson' },
                { id: 2, action: 'Payment received', details: '₹1,200 for luxury resort', time: '25 minutes ago', user: 'Mike Brown' },
                { id: 3, action: 'New lead', details: 'Family vacation inquiry', time: '1 hour ago', user: 'Emily Davis' },
                { id: 4, action: 'Trip updated', details: 'Changed dates for cultural tour', time: '2 hours ago', user: 'Admin' },
              ].map(activity => (
                <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time} • by {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>

        {/* Recent Activity */}

      </main>
    </div>
  );
}