import React from 'react';
import type { UserInput } from '../types.ts';

interface InputFormProps {
  userInput: UserInput;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const InputField: React.FC<{ label: string; name: keyof UserInput; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; required?: boolean; }> = ({ label, name, value, onChange, placeholder, required }) => (
  <div>
    <label htmlFor={name as string} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      id={name as string}
      name={name as string}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
    />
  </div>
);

const TextAreaField: React.FC<{ label: string; name: keyof UserInput; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; required?: boolean; rows?: number; }> = ({ label, name, value, onChange, placeholder, required, rows = 3 }) => (
  <div>
    <label htmlFor={name as string} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <textarea
      id={name as string}
      name={name as string}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
    />
  </div>
);


export const InputForm: React.FC<InputFormProps> = ({ userInput, onInputChange }) => {
  return (
    <form className="space-y-4">
       <details className="space-y-4" open>
        <summary className="text-lg font-semibold cursor-pointer text-gray-700 hover:text-indigo-600">Identitas Modul</summary>
        <div className="pl-4 pt-2 border-l-2 border-gray-200 space-y-4">
            <InputField label="Penulis" name="author" value={userInput.author} onChange={onInputChange} />
            <InputField label="Institusi" name="institution" value={userInput.institution} onChange={onInputChange} />
            <InputField label="Jenjang Sekolah" name="schoolLevel" value={userInput.schoolLevel} onChange={onInputChange} />
            <InputField label="Kelas/Fase" name="classPhase" value={userInput.classPhase} onChange={onInputChange} />
            <InputField label="Mata Pelajaran" name="subject" value={userInput.subject} onChange={onInputChange} />
            <InputField label="Alokasi Waktu" name="timeAllocation" value={userInput.timeAllocation} onChange={onInputChange} />
        </div>
      </details>
      
      <TextAreaField 
        label="Capaian Pembelajaran" 
        name="learningOutcomes" 
        value={userInput.learningOutcomes} 
        onChange={onInputChange} 
        placeholder="Tuliskan capaian pembelajaran umum fase..." 
        required 
        rows={4} 
      />
      <TextAreaField 
        label="Tujuan Pembelajaran" 
        name="learningObjectives" 
        value={userInput.learningObjectives} 
        onChange={onInputChange} 
        placeholder="Contoh: Peserta didik dapat menunjukkan kemampuan..." 
        required 
        rows={4} 
      />
    </form>
  );
};