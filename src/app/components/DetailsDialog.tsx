import { motion, AnimatePresence } from 'motion/react';
import { X, User, MapPin, Phone, Mail, Calendar, Package, TrendingUp, Award } from 'lucide-react';

interface DetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'driver' | 'activity' | 'general';
  data: any;
}

export function DetailsDialog({ isOpen, onClose, type, data }: DetailsDialogProps) {
  if (!data) return null;

  const renderDriverDetails = () => (
    <div className="space-y-6">
      {/* Header with Avatar */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {data.name?.charAt(0) || 'D'}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{data.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-600">Driver ID: #{data.id || '0001'}</span>
            {data.badge && (
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                data.badge === 'gold' ? 'bg-yellow-100 text-yellow-700' :
                data.badge === 'silver' ? 'bg-gray-200 text-gray-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {data.badge.toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-yellow-500">
            ⭐ <span className="font-bold text-gray-900">{data.rating || '4.5'}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Rating</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <Package className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">{data.collections?.toLocaleString() || '0'}</p>
          <p className="text-sm text-gray-600 mt-1">Total Collections</p>
        </div>
        <div className="p-4 bg-emerald-50 rounded-lg">
          <TrendingUp className="w-8 h-8 text-emerald-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">${data.revenue?.toLocaleString() || '0'}</p>
          <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Contact Information</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">+20 123 456 7890</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">{data.name?.toLowerCase().replace(' ', '.')}@recyclehub.com</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">Cairo, Egypt</span>
          </div>
        </div>
      </div>

      {/* Performance */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Performance Metrics</h4>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Completion Rate</span>
              <span className="font-medium text-gray-900">98%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '98%' }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">On-Time Delivery</span>
              <span className="font-medium text-gray-900">95%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '95%' }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivityDetails = () => (
    <div className="space-y-6">
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{data.action}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {data.user}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {data.time}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Location</p>
            <p className="text-sm text-gray-600 mt-1">{data.location}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'driver':
        return renderDriverDetails();
      case 'activity':
        return renderActivityDetails();
      default:
        return <p className="text-gray-600">No details available</p>;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl z-50 p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Details</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            {renderContent()}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-8 pt-6 border-t">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
