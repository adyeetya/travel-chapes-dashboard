"use client";
import { useState, useEffect } from "react";
import { ServerUrl } from "@/app/config";
import { getToken } from "@/utils/auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiAlertCircle, FiCheckCircle, FiLoader } from "react-icons/fi";
import ProtectedRoute from "@/components/ProtectedRoutes";
import BasicInfo from "./components/BasicInfo";
import Categories from "./components/Categories";
import FullItinerary from "./components/FullItinerary";
import Banners from "./components/Banners";
import Inclusions from "./components/Inclusions";
import Exclusions from "./components/Exclusions";
import ImportantPoints from "./components/ImportantPoints";
import Images from "./components/Images";
import Link from "next/link";
const TripPlanForm = () => {
  const router = useRouter();
  const token = getToken();
  const [tripPlan, setTripPlan] = useState({
    slug: "",
    
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

  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: "",
    errors: null,
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus({
      success: false,
      message: "",
      errors: null,
    });

    try {
      // Validate required fields before submission
      const requiredFields = {
        'Trip Title': tripPlan.title,
        'Trip Route': tripPlan.route,
        'Trip Slug': tripPlan.slug,
        'Minimum Price': tripPlan.minPrice,
        'Phone Banner': tripPlan.banners.phone,
        'Web Banner': tripPlan.banners.web
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([field]) => field);

      if (missingFields.length > 0) {
        throw new Error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      }

      const response = await axios.post(
        `${ServerUrl}/tripPlans/createTripPlans`,
        tripPlan,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setSubmitStatus({
        success: true,
        message: "Trip plan created successfully!",
        errors: null,
      });

      scrollToTop();
      
      // Redirect to trip plans list after 2 seconds
      setTimeout(() => {
        router.push("/trips");
      }, 2000);

    } catch (error) {
      console.error("Error submitting trip plan:", error);

      let errorMessage = "Failed to create trip plan";
      let validationErrors = null;

      if (error.response?.data) {
        const responseData = error.response.data;
        
        // Handle specific backend validation messages
        if (responseData.responseMessage) {
          errorMessage = responseData.responseMessage
            .replace('"', '')
            .replace('"', '')
            .replace('.', '')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }

        if (responseData.error?.details) {
          validationErrors = responseData.error.details;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSubmitStatus({
        success: false,
        message: errorMessage,
        errors: validationErrors,
      });

      scrollToTop();
    } finally {
      setSubmitting(false);
    }
  };

  const renderErrorMessages = () => {
    if (!submitStatus.errors) return null;

    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiAlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              There were {submitStatus.errors.length} validation errors
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <ul className="list-disc pl-5 space-y-1">
                {submitStatus.errors.map((err, index) => (
                  <li key={index}>{err.message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute allowedAdminTypes={['ADMIN', 'CONTENT']}>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-lg p-8">
            <Link href='/trips' className="flex items-center mb-6">
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg><p>Trips</p>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Create Trip Plan
            </h1>

            {/* Status Messages */}
            {submitStatus.message && (
              <div
                className={`mb-6 p-4 rounded-lg ${submitStatus.success
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                  }`}
              >
                <div className="flex items-center">
                  {submitStatus.success ? (
                    <FiCheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <FiAlertCircle className="h-5 w-5 mr-2" />
                  )}
                  <p>{submitStatus.message}</p>
                </div>
                {renderErrorMessages()}
              </div>
            )}

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
