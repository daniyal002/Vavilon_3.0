import React, { useState } from 'react';
import { PhoneInput } from '../components/booking/PhoneInput';
import { useNavigate } from 'react-router-dom';

export function RegisterPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки кода
    navigate('/verify', { state: { phoneNumber, isRegistration: true } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-900/20">
      <div className="w-full max-w-md p-8 bg-purple-950/50 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Регистрация
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <PhoneInput
            value={phoneNumber}
            onChange={setPhoneNumber}
            label="Номер телефона"
          />

          <button
            type="submit"
            disabled={phoneNumber.length < 16}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg 
              font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 
              transition-all duration-300 active:scale-95 hover:scale-[1.02]
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Получить код
          </button>
        </form>
      </div>
    </div>
  );
} 