"use client";
import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoutes";
import BasicInfo from "./components/BasicInfo";
import Categories from "./components/Categories";
import FullItinerary from "./components/FullItinerary";
import Banners from "./components/Banners";
import Inclusions from "./components/Inclusions";
import Exclusions from "./components/Exclusions";
import ImportantPoints from "./components/ImportantPoints";
import Images from "./components/Images";

const TripPlanForm = () => {
  const [tripPlan, setTripPlan] = useState({
    id: "",
    name: "",
    title: "",
    route: "",
    category: [],
    ageGroup: "",
    minPrice: "",
    banners: { phone: "", web: "" },
    images: [],
    metaTitle: "",
    metaDescription: "",
    headline: "",
    description: "",
    fullItinerary: [],
    inclusions: [],
    exclusions: [],
    importantPoints: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", tripPlan);
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Create Trip Plan
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              <BasicInfo tripPlan={tripPlan} setTripPlan={setTripPlan} />

              <Categories tripPlan={tripPlan} setTripPlan={setTripPlan} />
              <FullItinerary tripPlan={tripPlan} setTripPlan={setTripPlan} />

              <Inclusions tripPlan={tripPlan} setTripPlan={setTripPlan} />
              <Exclusions tripPlan={tripPlan} setTripPlan={setTripPlan} />
              <ImportantPoints tripPlan={tripPlan} setTripPlan={setTripPlan} />
              <Banners tripPlan={tripPlan} setTripPlan={setTripPlan} />
              <Images tripPlan={tripPlan} setTripPlan={setTripPlan} />

              <div className="text-center">
                <button
                  type="submit"
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Submit Trip Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default TripPlanForm;
