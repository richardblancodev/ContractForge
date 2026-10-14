import React from 'react';
import { FileText, Download, Eye, Loader2 } from 'lucide-react';

export default function PDFPreview({ pdfUrl, isGenerating, onDownload, formData }) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col h-full min-h-[550px] shadow-2xl relative overflow-hidden">
      {/* Top Controls */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-semibold text-slate-200">Interactive Document Preview</h2>
        </div>

        {pdfUrl && (
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-600/25 transition-all transform active:scale-95"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
        )}
      </div>

      {/* Preview Main Viewport */}
      <div className="flex-1 bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center relative">
        {isGenerating ? (
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-xs font-medium tracking-wide">Compiling Jinja2 template & rendering PDF...</p>
          </div>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            className="w-full h-full min-h-[500px] border-none rounded-xl"
          />
        ) : (
          <div className="max-w-md text-center p-6 space-y-4">
            <div className="w-12 h-12 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-300">No PDF Generated Yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                Fill in the required information on the form and click <span className="text-blue-400">"Compile & Preview Document"</span> to trigger the FastAPI rendering service.
              </p>
            </div>
            
            {/* Realtime HTML visual approximation card */}
            <div className="mt-4 p-4 bg-slate-900/90 rounded-lg border border-slate-800 text-left text-xs text-slate-400 space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-1 font-mono text-[11px] text-blue-400">
                <span>{formData.contract.contract_title || 'Untitled Agreement'}</span>
                <span>{formData.contract.effective_date || 'YYYY-MM-DD'}</span>
              </div>
              <p><strong className="text-slate-300">Client:</strong> {formData.client.full_name || 'Not specified'}</p>
              <p><strong className="text-slate-300">Amount:</strong> {formData.contract.currency} ${formData.contract.total_amount || '0.00'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}