'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Search,
  Eye,
  Trash2,
  Plus,
  BarChart3,
  PieChart,
  TrendingUp,
  FileSpreadsheet,
  FilePieChart,
  FileBarChart,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Printer,
  Share2,
  Mail,
} from 'lucide-react';

type ReportStatus = 'completed' | 'pending' | 'failed';
type ReportType = 'collection' | 'financial' | 'performance' | 'compliance';

interface Report {
  id: string;
  name: string;
  type: ReportType;
  status: ReportStatus;
  createdDate: string;
  generatedBy: string;
  fileSize: string;
  format: string;
}

const reportsData: Report[] = [
  {
    id: 'RPT-001',
    name: 'Monthly Collection Summary',
    type: 'collection',
    status: 'completed',
    createdDate: '2026-03-10',
    generatedBy: 'Admin User',
    fileSize: '2.4 MB',
    format: 'PDF',
  },
  {
    id: 'RPT-002',
    name: 'Financial Performance Q1',
    type: 'financial',
    status: 'completed',
    createdDate: '2026-03-09',
    generatedBy: 'Manager User',
    fileSize: '1.8 MB',
    format: 'XLSX',
  },
  {
    id: 'RPT-003',
    name: 'Driver Performance Analysis',
    type: 'performance',
    status: 'pending',
    createdDate: '2026-03-08',
    generatedBy: 'Admin User',
    fileSize: '-',
    format: 'PDF',
  },
  {
    id: 'RPT-004',
    name: 'Environmental Compliance',
    type: 'compliance',
    status: 'completed',
    createdDate: '2026-03-07',
    generatedBy: 'System',
    fileSize: '3.2 MB',
    format: 'PDF',
  },
  {
    id: 'RPT-005',
    name: 'Weekly Operations Summary',
    type: 'collection',
    status: 'failed',
    createdDate: '2026-03-06',
    generatedBy: 'Manager User',
    fileSize: '-',
    format: 'CSV',
  },
];

const reportTemplates = [
  {
    name: 'Collection Summary',
    type: 'collection',
    icon: BarChart3,
    color: 'green',
    description: 'Overview of collection activities',
  },
  {
    name: 'Financial Report',
    type: 'financial',
    icon: PieChart,
    color: 'blue',
    description: 'Revenue and expense analysis',
  },
  {
    name: 'Performance Metrics',
    type: 'performance',
    icon: TrendingUp,
    color: 'purple',
    description: 'KPIs and performance tracking',
  },
  {
    name: 'Compliance Report',
    type: 'compliance',
    icon: FileText,
    color: 'orange',
    description: 'Regulatory compliance status',
  },
];

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | ReportStatus>('all');
  const [filterType, setFilterType] = useState<'all' | ReportType>('all');
  const [showNewReportModal, setShowNewReportModal] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-blue-100 text-blue-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
    }
  };

  const getTypeIcon = (type: ReportType) => {
    switch (type) {
      case 'collection':
        return <FileBarChart className="w-5 h-5" />;
      case 'financial':
        return <FilePieChart className="w-5 h-5" />;
      case 'performance':
        return <FileSpreadsheet className="w-5 h-5" />;
      case 'compliance':
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: ReportType) => {
    switch (type) {
      case 'collection':
        return 'text-green-600 bg-green-50';
      case 'financial':
        return 'text-blue-600 bg-blue-50';
      case 'performance':
        return 'text-purple-600 bg-purple-50';
      case 'compliance':
        return 'text-orange-600 bg-orange-50';
    }
  };

  const filteredReports = reportsData.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesType = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and view system reports</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewReportModal(!showNewReportModal)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          New Report
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total Reports', value: 248, icon: FileText, color: 'green' },
          { label: 'This Month', value: 42, icon: Calendar, color: 'blue' },
          { label: 'Pending', value: 5, icon: Clock, color: 'orange' },
          { label: 'Completed', value: 235, icon: CheckCircle, color: 'purple' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          const colorMap: Record<string, string> = {
            green: 'bg-green-100 text-green-600',
            blue: 'bg-blue-100 text-blue-600',
            orange: 'bg-orange-100 text-orange-600',
            purple: 'bg-purple-100 text-purple-600',
          };

          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorMap[stat.color]}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Report Templates */}
      <AnimatePresence>
        {showNewReportModal && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportTemplates.map((template) => {
                const Icon = template.icon;
                const colorMap: Record<string, { bg: string; text: string; hover: string }> = {
                  green: { bg: 'bg-green-50', text: 'text-green-600', hover: 'hover:bg-green-100' },
                  blue: { bg: 'bg-blue-50', text: 'text-blue-600', hover: 'hover:bg-blue-100' },
                  purple: { bg: 'bg-purple-50', text: 'text-purple-600', hover: 'hover:bg-purple-100' },
                  orange: { bg: 'bg-orange-50', text: 'text-orange-600', hover: 'hover:bg-orange-100' },
                };

                return (
                  <motion.button
                    key={template.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-lg border-2 border-gray-200 ${colorMap[template.color].hover} transition-all text-left`}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${colorMap[template.color].bg} ${colorMap[template.color].text} mb-3`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="all">All Types</option>
          <option value="collection">Collection</option>
          <option value="financial">Financial</option>
          <option value="performance">Performance</option>
          <option value="compliance">Compliance</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </motion.div>

      {/* Reports Table */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Generated By
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReports.map((report, index) => (
                <motion.tr
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: '#F9FAFB' }}
                  className="transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(report.type)}`}>
                        {getTypeIcon(report.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{report.name}</p>
                        <p className="text-sm text-gray-500">{report.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium capitalize">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full font-medium inline-flex items-center gap-1 ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      <span className="capitalize">{report.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {report.createdDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {report.generatedBy}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">
                      {report.fileSize} {report.status === 'completed' && `(${report.format})`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {report.status === 'completed' && (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Share"
                          >
                            <Share2 className="w-4 h-4" />
                          </motion.button>
                        </>
                      )}
                      {report.status === 'failed' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Retry"
                        >
                          <AlertCircle className="w-4 h-4" />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          {
            title: 'Schedule Report',
            description: 'Set up automated report generation',
            icon: Calendar,
            color: 'blue',
          },
          {
            title: 'Email Reports',
            description: 'Send reports to stakeholders',
            icon: Mail,
            color: 'green',
          },
          {
            title: 'Export Data',
            description: 'Download raw data for analysis',
            icon: Download,
            color: 'purple',
          },
        ].map((action, index) => {
          const Icon = action.icon;
          const colorMap: Record<string, { bg: string; text: string; hover: string }> = {
            blue: { bg: 'bg-blue-50', text: 'text-blue-600', hover: 'hover:bg-blue-100' },
            green: { bg: 'bg-green-50', text: 'text-green-600', hover: 'hover:bg-green-100' },
            purple: { bg: 'bg-purple-50', text: 'text-purple-600', hover: 'hover:bg-purple-100' },
          };

          return (
            <motion.button
              key={action.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-6 rounded-xl border-2 border-gray-200 ${colorMap[action.color].hover} transition-all text-left`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${colorMap[action.color].bg} ${colorMap[action.color].text} mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}