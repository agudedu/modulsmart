
import React, { useState, useCallback } from 'react';
import { generateModule } from './services/geminiService.ts';
import type { UserInput } from './types.ts';
import { InputForm } from './components/InputForm.tsx';
import { ModuleDisplay } from './components/ModuleDisplay.tsx';
import { PrintPreview } from './components/PrintPreview.tsx';
import { Sparkles, FileText, Printer, LoaderCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({
    author: 'Tim Guru Kreatif',
    institution: 'Sekolah Maju Jaya',
    schoolLevel: 'SD',
    classPhase: 'I/A',
    subject: 'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
    timeAllocation: '2 JP (2 x 35 menit) / 1 Pertemuan',
    learningOutcomes: '',
    learningObjectives: '',
  });
  const [generatedModule, setGeneratedModule] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserInput(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateClick = useCallback(async () => {
    if (!userInput.learningOutcomes || !userInput.learningObjectives) {
      setError('Capaian dan Tujuan Pembelajaran harus diisi.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedModule('');
    try {
      const moduleContent = await generateModule(userInput);
      setGeneratedModule(moduleContent);
    } catch (err) {
      setError('Gagal menghasilkan modul. Silakan coba lagi.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userInput]);

  if (isPreviewing) {
    return (
      <PrintPreview 
        content={generatedModule} 
        onClose={() => setIsPreviewing(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-800">Generator Modul Ajar Otomatis</h1>
        </div>
      </header>
      
      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 main-grid">
          <div className="lg:col-span-1 space-y-6 form-container">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Parameter Modul Ajar</h2>
              <InputForm
                userInput={userInput}
                onInputChange={handleInputChange}
              />
              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
              <button
                onClick={handleGenerateClick}
                disabled={isLoading}
                className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 ease-in-out flex items-center justify-center disabled:bg-indigo-300 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="animate-spin mr-2" />
                    Menyusun Modul...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" />
                    Buat Modul Ajar
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="lg:col-span-2 content-container">
            <div id="module-content" className="relative bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
              {generatedModule && (
                <div className="absolute top-4 right-4 z-20 print-button-container">
                  <button
                    onClick={() => setIsPreviewing(true)}
                    className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-colors duration-300 flex items-center"
                  >
                    <Printer className="mr-2" />
                    Cetak / Simpan PDF
                  </button>
                </div>
              )}
              {isLoading ? (
                 <div className="flex flex-col items-center justify-center h-96">
                    <LoaderCircle className="w-12 h-12 text-indigo-600 animate-spin" />
                    <p className="mt-4 text-lg text-gray-600">AI sedang merancang modul ajar Anda...</p>
                    <p className="text-sm text-gray-500">Ini mungkin memakan waktu beberapa saat.</p>
                 </div>
              ) : generatedModule ? (
                <ModuleDisplay content={generatedModule} />
              ) : (
                <div className="text-center text-gray-500 py-20">
                    <FileText size={48} className="mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">Modul Ajar Anda Akan Tampil di Sini</h3>
                    <p className="mt-2">Isi form di samping dan klik "Buat Modul Ajar" untuk memulai.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};