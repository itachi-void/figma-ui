export const exportToCSV = (data: any[], filename: string) => {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add headers
  csvRows.push(headers.join(','));

  // Add data
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      // Escape quotes
      const escaped = ('' + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const exportToPDF = (elementId: string = 'root', title: string = 'Report') => {
  // A simple browser print trigger for PDF saving
  // In a real robust app, html2canvas and jsPDF are recommended, 
  // but for a lightweight native solution, window.print() serves well.
  
  const originalTitle = document.title;
  document.title = title;
  
  // Optional: add a 'print-mode' class to body to hide sidebars
  document.body.classList.add('print-mode');
  
  window.print();
  
  document.title = originalTitle;
  document.body.classList.remove('print-mode');
};
