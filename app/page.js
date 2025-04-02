import Image from "next/image";
import { MdCardTravel } from "react-icons/md";
import { FaClipboardList, FaRegCommentAlt, FaUsers} from "react-icons/fa";
import Link from "next/link";
export default function Home() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 font-[family-name:var(--font-geist-sans)] p-8">
      {/* Header */}

      {/* Main Content */}
      <main className="mt-12 space-y-16">
        {/* Welcome Banner */}
        <section className="flex flex-col items-center text-center bg-white shadow-md rounded-lg p-8">
          <h2 className="text-3xl font-bold text-blue-600">Welcome Back!</h2>
          <p className="mt-4 text-gray-600">
            Explore the world and keep track of your travel bookings, analytics,
            and more.
          </p>
          <Link href='/trips' className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
            Explore Destinations
          </Link>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <Link href="/admin-panel/trips">
            <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6">
              <MdCardTravel className="text-5xl text-blue-700" />
              <h3 className="mt-4 text-xl font-bold">52</h3>
              <p className="text-gray-600">Trips</p>
            </div>
          </Link>
          <Link href="#">
            <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6">
              <FaUsers className="text-5xl text-blue-700" />
              <h3 className="mt-4 text-xl font-bold">800</h3>
              <p className="text-gray-600">Customers</p>
            </div>
          </Link>
          <Link href="#">
          <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6">
            <FaRegCommentAlt className="text-5xl text-blue-700" />
            <h3 className="mt-4 text-xl font-bold">120</h3>
            <p className="text-gray-600">Leads</p>
          </div>
          </Link>
         
        </section>

        {/* Featured Destinations */}
        {/* <section>
          <h3 className="text-2xl font-semibold text-center text-blue-600 mb-8">
            Featured Destinations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c3.866 0 7 3.134 7 7m0 0h3m-10 0H3m0 0a7 7 0 017-7"
                />
              </svg>
              <h4 className="mt-4 text-lg font-bold">Paris</h4>
              <p className="text-gray-600">City of Love</p>
            </div>
          </div>
        </section> */}
      </main>
    </div>
  );
}
