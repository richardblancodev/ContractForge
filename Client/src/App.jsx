import React, { useState } from 'react';
import TopBar from './components/TopBar';
import FormInput from './components/FormInput';
import PDFPreview from './components/PDFPreview';
import { generateContractPDF } from './services/api';
import { User, Building2, FileCheck, Play, AlertCircle } from 'lucide-react';

const INITIAL_STATE = {
  provider: {
    full_name: 'Richard Blanco',
    email: 'richard@developer.io',
    company_name: 'Blanco Tech Solutions',
    tax_id: 'US-123456789',
    address: '742 Evergreen Terrace, Springfield, OR'
  },
  client: {
    full_name: 'Sarah Connor',
    email: 'sarah@cyberdyne.com',
    company_name: 'Cyberdyne Systems',
    tax_id: 'US-987654321',
    address: '100 Cyberdyne Road, Los Angeles, CA'
  },
  contract: {
    contract_title: 'Full Stack Web Engineering Agreement',
    effective_date: '2026-11-01',
    expiration_date: '2027-11-01',
    service_description: 'Engineering and architecture of a scalable microservices infrastructure, React dynamic dashboard implementation, and automated PDF delivery microservice integration.',
    total_amount: 8500.00,
    currency: 'USD',
    payment_terms: '50% deposit due upon signing, 50% upon final production deployment and acceptance testing.'
  }
};

export default function App() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);

    try {
      const blob = await generateContractPDF(formData);
      const url = URL.createObjectURL(blob);
      setPdfBlob(blob);
      setPdfUrl(url);
    } catch (err) {
      setError(err.message || 'An error occurred while compiling the PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `Contract_${formData.client.full_name.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      <TopBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Panel */}
          <div className="lg:col-span-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Provider Info */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <h2 className="text-sm font-semibold text-slate-200">1. Service Provider Information</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Company Name"
                    value={formData.provider.company_name}
                    onChange={(e) => handleNestedChange('provider', 'company_name', e.target.value)}
                  />
                  <FormInput
                    label="Representative Name"
                    value={formData.provider.full_name}
                    onChange={(e) => handleNestedChange('provider', 'full_name', e.target.value)}
                  />
                  <FormInput
                    label="Email"
                    type="email"
                    value={formData.provider.email}
                    onChange={(e) => handleNestedChange('provider', 'email', e.target.value)}
                  />
                  <FormInput
                    label="Tax ID"
                    value={formData.provider.tax_id}
                    onChange={(e) => handleNestedChange('provider', 'tax_id', e.target.value)}
                  />
                </div>
                <FormInput
                  label="Business Address"
                  value={formData.provider.address}
                  onChange={(e) => handleNestedChange('provider', 'address', e.target.value)}
                />
              </div>

              {/* Client Info */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <User className="w-4 h-4 text-indigo-400" />
                  <h2 className="text-sm font-semibold text-slate-200">2. Client Metadata</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Client / Company Name"
                    value={formData.client.company_name}
                    onChange={(e) => handleNestedChange('client', 'company_name', e.target.value)}
                  />
                  <FormInput
                    label="Full Name"
                    value={formData.client.full_name}
                    onChange={(e) => handleNestedChange('client', 'full_name', e.target.value)}
                  />
                  <FormInput
                    label="Email"
                    type="email"
                    value={formData.client.email}
                    onChange={(e) => handleNestedChange('client', 'email', e.target.value)}
                  />
                  <FormInput
                    label="Tax ID"
                    value={formData.client.tax_id}
                    onChange={(e) => handleNestedChange('client', 'tax_id', e.target.value)}
                  />
                </div>
                <FormInput
                  label="Address"
                  value={formData.client.address}
                  onChange={(e) => handleNestedChange('client', 'address', e.target.value)}
                />
              </div>

              {/* Contract Terms */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-semibold text-slate-200">3. Contract Specifics</h2>
                </div>
                <FormInput
                  label="Agreement Title"
                  value={formData.contract.contract_title}
                  onChange={(e) => handleNestedChange('contract', 'contract_title', e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Effective Date"
                    type="date"
                    value={formData.contract.effective_date}
                    onChange={(e) => handleNestedChange('contract', 'effective_date', e.target.value)}
                  />
                  <FormInput
                    label="Expiration Date"
                    type="date"
                    value={formData.contract.expiration_date}
                    onChange={(e) => handleNestedChange('contract', 'expiration_date', e.target.value)}
                  />
                  <FormInput
                    label="Total Amount"
                    type="number"
                    value={formData.contract.total_amount}
                    onChange={(e) => handleNestedChange('contract', 'total_amount', parseFloat(e.target.value) || 0)}
                  />
                  <FormInput
                    label="Currency"
                    value={formData.contract.currency}
                    onChange={(e) => handleNestedChange('contract', 'currency', e.target.value)}
                  />
                </div>
                <FormInput
                  label="Payment Schedule & Terms"
                  value={formData.contract.payment_terms}
                  onChange={(e) => handleNestedChange('contract', 'payment_terms', e.target.value)}
                />
                <FormInput
                  label="Detailed Scope of Work"
                  isTextArea={true}
                  value={formData.contract.service_description}
                  onChange={(e) => handleNestedChange('contract', 'service_description', e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                {isGenerating ? 'Compiling PDF via FastAPI...' : 'Compile & Preview Document'}
              </button>
            </form>
          </div>

          {/* Interactive Live PDF Preview Column */}
          <div className="lg:col-span-6">
            <div className="sticky top-24">
              <PDFPreview
                pdfUrl={pdfUrl}
                isGenerating={isGenerating}
                onDownload={handleDownload}
                formData={formData}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}