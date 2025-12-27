import { Download, FileText, Table } from 'lucide-react'
import Button from '../common/Button'

const ExportReports = ({ onExport }) => {
  const reports = [
    {
      id: 'users',
      name: 'Users Report',
      description: 'Complete list of all users',
      icon: FileText,
      formats: ['CSV', 'PDF'],
    },
    {
      id: 'orders',
      name: 'Orders Report',
      description: 'All orders with details',
      icon: Table,
      formats: ['CSV', 'PDF'],
    },
    {
      id: 'revenue',
      name: 'Revenue Report',
      description: 'Revenue breakdown by month',
      icon: FileText,
      formats: ['CSV', 'PDF'],
    },
    {
      id: 'deliveries',
      name: 'Deliveries Report',
      description: 'Delivery statistics',
      icon: Table,
      formats: ['CSV', 'PDF'],
    },
  ]

  const handleExport = (reportId, format) => {
    if (onExport) {
      onExport(reportId, format)
    } else {
      alert(`Exporting ${reportId} as ${format}...`)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Reports</h3>
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <report.icon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{report.name}</p>
                <p className="text-sm text-gray-500">{report.description}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {report.formats.map((format) => (
                <button
                  key={format}
                  onClick={() => handleExport(report.id, format)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 inline mr-1" />
                  {format}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExportReports