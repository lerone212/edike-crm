import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

interface ExportButtonProps {
  data: any[];
  filename: string;
  columns: {
    key: string;
    label: string;
    width?: number;
  }[];
  title?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({ data, filename, columns, title }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    if (title) {
      doc.setFontSize(16);
      doc.text(title, 14, 22);
      doc.setFontSize(12);
      doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 14, 30);
    }

    // Prepare data for table
    const tableData = data.map(item => 
      columns.map(col => {
        const value = item[col.key];
        if (typeof value === 'object' && value !== null) {
          return JSON.stringify(value);
        }
        return String(value || '');
      })
    );

    const tableColumns = columns.map(col => col.label);

    // Add table
    autoTable(doc, {
      head: [tableColumns],
      body: tableData,
      startY: title ? 40 : 20,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: columns.reduce((styles, col, index) => {
        if (col.width) {
          styles[index] = { cellWidth: col.width };
        }
        return styles;
      }, {} as any)
    });

    // Save the PDF
    doc.save(`${filename}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const exportToExcel = () => {
    // Prepare data with column headers
    const worksheetData = [
      columns.map(col => col.label),
      ...data.map(item => 
        columns.map(col => {
          const value = item[col.key];
          if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value);
          }
          return value || '';
        })
      )
    ];

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    const colWidths = columns.map(col => ({ wch: col.width || 20 }));
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Data');

    // Save the file
    XLSX.writeFile(wb, `${filename}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const exportToCSV = () => {
    const csvContent = [
      columns.map(col => col.label).join(','),
      ...data.map(item => 
        columns.map(col => {
          const value = item[col.key];
          let cellValue = '';
          if (typeof value === 'object' && value !== null) {
            cellValue = JSON.stringify(value);
          } else {
            cellValue = String(value || '');
          }
          // Escape quotes and wrap in quotes if contains comma
          if (cellValue.includes(',') || cellValue.includes('"')) {
            cellValue = `"${cellValue.replace(/"/g, '""')}"`;
          }
          return cellValue;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="animate-fade-in">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="animate-scale-in">
        <DropdownMenuItem onClick={exportToPDF} className="hover-scale">
          <FileText className="mr-2 h-4 w-4 text-destructive" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel} className="hover-scale">
          <FileSpreadsheet className="mr-2 h-4 w-4 text-success" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToCSV} className="hover-scale">
          <FileSpreadsheet className="mr-2 h-4 w-4 text-info" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;