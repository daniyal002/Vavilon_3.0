import { useRef, KeyboardEvent } from 'react';

interface CodeInputProps {
  code: string[];
  onChange: (code: string[]) => void;
}

export function CodeInput({ code, onChange }: CodeInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key >= '0' && e.key <= '9') {
      const newCode = [...code];
      newCode[index] = e.key;
      onChange(newCode);

      if (index < 3) {
        inputs.current[index + 1]?.focus();
      }
    } else if (e.key === 'Backspace') {
      const newCode = [...code];
      newCode[index] = '';
      onChange(newCode);

      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="flex gap-4 justify-center">
      {[0, 1, 2, 3].map((index) => (
        <input
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          type="tel"
          maxLength={1}
          value={code[index] || ''}
          onChange={() => {}} // Controlled by keyDown
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-12 text-center text-2xl bg-purple-950/50 border-2 border-purple-500/30
            rounded-lg focus:border-purple-400 focus:outline-none text-purple-200"
        />
      ))}
    </div>
  );
}