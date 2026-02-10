import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="text-sm font-semibold text-slate-700 mb-1">{label}</label>
      <input 
        className="border border-slate-300 rounded p-2 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none transition"
        {...props}
      />
    </div>
  );
};

export default Input;