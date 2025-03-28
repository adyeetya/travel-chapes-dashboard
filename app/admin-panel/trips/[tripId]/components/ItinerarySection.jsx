"use client";

export const ItinerarySection = ({ 
  itinerary, 
  editMode, 
  onItineraryChange 
}) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Itinerary</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {itinerary.map((day, index) => (
          <ItineraryDay
            key={index}
            day={day}
            index={index}
            editMode={editMode}
            onChange={onItineraryChange}
          />
        ))}
      </div>
    </div>
  );
};

const ItineraryDay = ({ day, index, editMode, onChange }) => {
  if (editMode) {
    return (
      <div className="px-6 py-4">
        <div className="space-y-3">
          <ItineraryField
            label={`Day ${day.day} Title`}
            value={day.title}
            onChange={(value) => onChange(index, "title", value)}
          />
          <ItineraryTextarea
            label="Description"
            value={day.description}
            onChange={(value) => onChange(index, "description", value)}
            rows={2}
          />
          <ItineraryTextarea
            label="Activities (one per line)"
            value={day.activities.join("\n")}
            onChange={(value) => onChange(index, "activities", value.split("\n"))}
            rows={4}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <h3 className="font-medium text-gray-900">
        Day {day.day}: {day.title}
      </h3>
      <p className="text-gray-600 mt-1">{day.description}</p>
      {day.activities.length > 0 && (
        <ActivitiesList activities={day.activities} />
      )}
    </div>
  );
};

const ItineraryField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border rounded-md"
    />
  </div>
);

const ItineraryTextarea = ({ label, value, onChange, rows }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border rounded-md"
      rows={rows}
    />
  </div>
);

const ActivitiesList = ({ activities }) => (
  <ul className="mt-2 space-y-1">
    {activities.map((activity, i) => (
      <li key={i} className="flex items-start">
        <svg
          className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span className="text-gray-700">{activity}</span>
      </li>
    ))}
  </ul>
);