import { useState } from 'react';

export default function DynamicForm({ fields, onSubmit, buttonText = "Enviar" }) {
  // Aquí guardaremos todo lo que el usuario escriba
  const [formData, setFormData] = useState({});

  // Esta función actualiza el estado cada vez que se teclea algo
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Esta función envía el objeto completo cuando le dan a "Enviar"
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-lg p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      {fields.map((field, index) => (
        <div key={index} className="flex flex-col">
          <label htmlFor={field.id} className="mb-1 text-sm font-bold text-gray-700">
            {field.label}
          </label>
          
          {field.type === 'textarea' ? (
            <textarea
              id={field.id}
              placeholder={field.placeholder}
              required={field.required}
              onChange={handleChange}
              rows="4"
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009000] focus:border-transparent outline-none transition-all resize-none"
            />
          ) : (
            <input
              type={field.type}
              id={field.id}
              placeholder={field.placeholder}
              required={field.required}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#009000] focus:border-transparent outline-none transition-all"
            />
          )}
        </div>
      ))}

      <button 
        type="submit" 
        className="mt-2 w-full py-3 bg-yellow-electric text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
      >
        {buttonText}
      </button>
    </form>
  );
}