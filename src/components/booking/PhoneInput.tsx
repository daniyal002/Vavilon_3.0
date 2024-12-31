interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    disabled?: boolean;
  }
  
  export function PhoneInput({ value, onChange, label, disabled }: PhoneInputProps) {
    const formatPhoneNumber = (input: string) => {
      // Убираем все нецифровые символы
      const numbers = input.replace(/\D/g, '');
      
      // Если пользователь стирает всё, возвращаем пустую строку
      if (numbers.length === 0) return '';
      
      // Убираем лишнюю 7 в начале, если она есть
      const trimmed = numbers.startsWith('7') ? numbers.substring(1) : numbers;
      
      // Форматируем номер
      if (trimmed.length === 0) return '';
      if (trimmed.length <= 3) return `+7 (${trimmed}`;
      if (trimmed.length <= 6) return `+7 (${trimmed.substring(0, 3)}) ${trimmed.substring(3)}`;
      if (trimmed.length <= 8) return `+7 (${trimmed.substring(0, 3)}) ${trimmed.substring(3, 6)}-${trimmed.substring(6)}`;
      return `+7 (${trimmed.substring(0, 3)}) ${trimmed.substring(3, 6)}-${trimmed.substring(6, 8)}-${trimmed.substring(8, 10)}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value);
      onChange(formatted);
    };

    return (
      <div>
        <label className="block text-sm font-medium text-purple-300 mb-2">
          {label}
        </label>
        <input
          type="tel"
          value={value}
          onChange={handleChange}
          placeholder="+7 (999) 999-99-99"
          className="w-full px-4 py-2 bg-purple-900/50 border border-purple-700/30 
            rounded-lg text-purple-100 placeholder-purple-400 focus:outline-none 
            focus:border-purple-500 transition-colors"
          disabled={disabled}
        />
      </div>
    );
  }