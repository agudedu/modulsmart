
import React, { useState } from 'react';
import { X, Save, LoaderCircle } from 'lucide-react';
import { ModuleDisplay } from './ModuleDisplay';

declare const html2pdf: any;

interface PrintPreviewProps {
  content: string;
  onClose: () => void;
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({ content, onClose }) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePdf = () => {
    // We get the element that includes the visual padding.
    // This padding will become the margin in the PDF.
    const element = document.getElementById('pdf-printable-area'); 
    if (!element) {
      console.error("Printable area not found.");
      return;
    }
    
    setIsSaving(true);
    
    const opt = {
      // Set margin to 0 because our element already has padding that acts as the margin.
      margin: 0,
      filename: 'modul-ajar.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true 
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      // Give CSS hints for page breaking.
      pagebreak: { mode: ['css', 'avoid-all'] }
    };

    html2pdf().from(element).set(opt).save().then(() => {
      setIsSaving(false);
    }).catch(err => {
      console.error("PDF generation failed:", err);
      setIsSaving(false);
      alert("Maaf, terjadi kesalahan saat membuat PDF. Silakan coba lagi.");
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-200 z-50 flex flex-col items-center">
      {/* Toolbar */}
      <div className="w-full bg-white shadow-md flex justify-between items-center p-3 sticky top-0 z-10">
        <h2 className="text-xl font-bold text-gray-800">Pratinjau PDF</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSavePdf}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:bg-indigo-400 disabled:cursor-wait"
          >
            {isSaving ? (
              <><LoaderCircle className="w-5 h-5 mr-2 animate-spin" />Menyimpan...</>
            ) : (
              <><Save className="w-5 h-5 mr-2" />Save as PDF</>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
            aria-label="Tutup Pratinjau"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable area for preview */}
      <div className="w-full flex-grow overflow-y-auto p-4 md:p-8">
        {/* This is the element we will print. It's styled to look like a page with margins (padding). */}
        <div 
          id="pdf-printable-area"
          className="bg-white mx-auto my-8 shadow-2xl" 
          style={{ 
            width: '210mm',
            padding: '20mm', // This padding acts as the page margin.
            boxSizing: 'border-box' // Important for width calculation to include padding.
          }}
        >
          <ModuleDisplay content={content} />
        </div>
      </div>
    </div>
  );
};