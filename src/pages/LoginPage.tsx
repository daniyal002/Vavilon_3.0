import React, { useState } from 'react';
import { PhoneInput } from '../components/booking/PhoneInput';
import { CodeInput } from '../components/auth/CodeInput';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState(['', '', '', '']);
  const { loginMutation } = useAuth();

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { phone: phoneNumber.replace(/[^\d]/g, ''), password: code.join('') },
      {
        onSuccess: () => {
          navigate('/admin');
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-900/20">
      <div className="w-full max-w-md p-8 bg-purple-950/50 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Вход
        </h2>

        <form onSubmit={handleSendCode} className="space-y-6">
          <PhoneInput
            value={phoneNumber}
            onChange={setPhoneNumber}
            label="Номер телефона"
          />

          <div className="space-y-4">
            <label className="block text-sm font-medium text-purple-200">
              Введите код
            </label>
            <CodeInput code={code} onChange={setCode} />
          </div>

          <button
            type="submit"
            disabled={code.join('').length !== 4}
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg 
              font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 
              transition-all duration-300 active:scale-95 hover:scale-[1.02]
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
