import React from 'react';

const Select = ({ id, label, value, onChange, error, children, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={`block w-full pl-3 pr-10 py-2 text-base border rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Select;