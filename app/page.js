import Image from "next/image";
import { MdCardTravel } from "react-icons/md";
import { FaClipboardList, FaRegCommentAlt } from "react-icons/fa";
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 font-[family-name:var(--font-geist-sans)] p-8">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-md rounded-lg">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-9 8v5m-6-5l1.7-1.02a4 4 0 013.6 0L12 15m0 0l1.7-1.02a4 4 0 013.6 0L21 15"
            />
          </svg>
          <h1 className="text-xl font-semibold">Travel Dashboard</h1>
        </div>
        <nav className="hidden sm:flex gap-4">
          <a href="#" className="hover:text-blue-600">Home</a>
          <a href="#" className="hover:text-blue-600">Trips</a>
          <a href="#" className="hover:text-blue-600">Bookings</a>
          <a href="#" className="hover:text-blue-600">Profile</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-12 space-y-16">
        {/* Welcome Banner */}
        <section className="flex flex-col items-center text-center bg-white shadow-md rounded-lg p-8">
          <h2 className="text-3xl font-bold text-blue-600">Welcome Back, Alex!</h2>
          <p className="mt-4 text-gray-600">
            Explore the world and keep track of your travel bookings, analytics, and more.
          </p>
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
            Explore Destinations
          </button>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6">
          <MdCardTravel className="text-5xl text-blue-700"/>
            <h3 className="mt-4 text-xl font-bold">52</h3>
            <p className="text-gray-600">Trips</p>
          </div>
          <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6">
          <FaClipboardList className="text-5xl text-blue-700"/>
            <h3 className="mt-4 text-xl font-bold">8</h3>
            <p className="text-gray-600">Itineraries</p>
          </div>
          <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6">
          <FaRegCommentAlt className="text-5xl text-blue-700"/>
            <h3 className="mt-4 text-xl font-bold">120</h3>
            <p className="text-gray-600">Leads</p>
          </div>
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
