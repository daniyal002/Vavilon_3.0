interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
  required?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  label,
  disabled,
  required,
}: PhoneInputProps) {
  const formatPhoneNumber = (input: string) => {
    // Убираем все нецифровые символы
    const numbers = input.replace(/\D/g, '');

    // Ограничиваем длину до 11 цифр
    const limitedNumbers = numbers.slice(0, 11);

    // Если пользователь стирает всё, возвращаем пустую строку
    if (limitedNumbers.length === 0) return '';

    // Убираем лишнюю 7 в начале, если она есть
    const trimmed = limitedNumbers.startsWith('7')
      ? limitedNumbers.substring(1)
      : limitedNumbers;

    // Форматируем номер
    if (trimmed.length === 0) return '';
    if (trimmed.length <= 3) return `+7 (${trimmed}`;
    if (trimmed.length <= 6)
      return `+7 (${trimmed.substring(0, 3)}) ${trimmed.substring(3)}`;
    if (trimmed.length <= 8)
      return `+7 (${trimmed.substring(0, 3)}) ${trimmed.substring(
        3,
        6
      )}-${trimmed.substring(6)}`;
    return `+7 (${trimmed.substring(0, 3)}) ${trimmed.substring(
      3,
      6
    )}-${trimmed.substring(6, 8)}-${trimmed.substring(8, 10)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onChange(formatted);
  };

  // Проверка на валидность номера (11 цифр)
  const isValid = value.replace(/\D/g, '').length === 11;

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
        className={`w-full px-4 py-2 bg-purple-900/50 border rounded-lg text-purple-100 
            placeholder-purple-400 focus:outline-none transition-colors
            ${
              isValid
                ? 'border-purple-700/30 focus:border-purple-500'
                : 'border-red-500/50 focus:border-red-500'
            }`}
        disabled={disabled}
        required={required}
      />
      {required && !isValid && value && (
        <p className="mt-1 text-sm text-red-400">
          Номер телефона должен содержать 11 цифр
        </p>
      )}
    </div>
  );
}
