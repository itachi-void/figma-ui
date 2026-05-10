import { MapPin } from 'lucide-react';

export function LiveMapView() {
  return (
    <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
      <div className="text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Map View Placeholder</p>
        <p className="text-sm text-gray-500 mt-2">Integration with maps coming soon</p>
      </div>
    </div>
  );
}
