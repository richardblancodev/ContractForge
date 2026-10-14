import React from 'react';

export default function FormInput({ label, name, type = 'text', value, onChange, placeholder, required = true, isTextArea = false }) {
  const inputClasses = "w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all";

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        {label} {required && <span className="text-blue-400">*</span>}
      </label>
      {isTextArea ? (
        <textarea
          name={name}
          rows={3}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClasses}
        />
      )}
    </div>
  );
}