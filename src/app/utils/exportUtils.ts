/**
 * Export Utilities for RecycleHub
 * Helper functions for exporting data to CSV and PDF formats
 */

/**
 * Export data to CSV format
 * @param data - Array of objects to export
 * @param filename - Name of the CSV file (without extension)
 */
export function exportToCSV(data: Record<string, any>[], filename: string = 'export') {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  try {
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
      // Headers row
      headers.join(','),
      // Data rows
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle values that might contain commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? '';
        }).join(',')
      )
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
}

/**
 * Export data to PDF format (basic implementation)
 * For production, consider using jsPDF or similar library
 * @param data - Array of objects to export
 * @param filename - Name of the PDF file (without extension)
 * @param title - Title for the PDF document
 */
export function exportToPDF(
  data: Record<string, any>[], 
  filename: string = 'export',
  title: string = 'Report'
) {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  try {
    // For now, we'll create a simple HTML table and use print functionality
    // In a real app, you'd use a library like jsPDF
    
    const headers = Object.keys(data[0]);
    
    // Create HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h1 {
              color: #10b981;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #10b981;
              color: white;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                ${headers.map(h => `<th>${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${headers.map(h => `<td>${row[h] ?? ''}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>RecycleHub - Smart Recycling System</p>
          </div>
        </body>
      </html>
    `;

    // Open in new window and trigger print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load, then print
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
}

/**
 * Export data to JSON format
 * @param data - Data to export (can be object or array)
 * @param filename - Name of the JSON file (without extension)
 */
export function exportToJSON(data: any, filename: string = 'export') {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw error;
  }
}

/**
 * Format data for export
 * Useful for cleaning/transforming data before export
 * @param data - Raw data
 * @param columns - Columns to include (optional)
 */
export function formatForExport<T extends Record<string, any>>(
  data: T[],
  columns?: string[]
): Record<string, any>[] {
  if (!columns) return data;
  
  return data.map(row => {
    const formatted: Record<string, any> = {};
    columns.forEach(col => {
      if (col in row) {
        formatted[col] = row[col];
      }
    });
    return formatted;
  });
}
