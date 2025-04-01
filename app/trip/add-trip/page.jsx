"use client";
import { useState } from "react";
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

const TripPlanForm = () => {
  const router = useRouter();
  const token = getToken();
  const [tripPlan, setTripPlan] = useState({
    slug: "",
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

  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: "",
    errors: null,
  });

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
      if (
        !tripPlan.slug ||
        !tripPlan.name ||
        !tripPlan.route ||
        !tripPlan.minPrice
      ) {
        throw new Error("Please fill all required fields");
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
      console.log("response:", response.data);
      setSubmitStatus({
        success: true,
        message: "Trip plan created successfully!",
        errors: null,
      });

      // Redirect to trip plans list after 2 seconds
      // setTimeout(() => {
      //   router.push("/admin/trip-plans");
      // }, 2000);
    } catch (error) {
      console.error("Error submitting trip plan:", error);

      let errorMessage = "Failed to create trip plan";
      let validationErrors = null;

      if (error.response) {
        // Handle backend validation errors
        if (error.response.data?.error?.details) {
          validationErrors = error.response.data.error.details;
          errorMessage = "Validation errors occurred";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSubmitStatus({
        success: false,
        message: errorMessage,
        errors: validationErrors,
      });
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
    <ProtectedRoute adminOnly={true}>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-xl rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Create Trip Plan
            </h1>

            {/* Status Messages */}
            {submitStatus.message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  submitStatus.success
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
