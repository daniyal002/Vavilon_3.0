import { Link } from 'react-router-dom';

export function Logo({text,size}:{text:string, size:string}) {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 p-2 rounded-lg relative group"
    >

      {/* Контент */}
      <div className="relative flex items-center gap-2">
        <span className="text-6xl font-bold relative">
          {/* Неоновый текст */}
          <span className={`absolute inset-0 blur-[2px] bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient text-${size}`}>
          {text}
          </span>
          {/* Основной текст */}
          <span className={`relative text-${size} text-[#fff6a9] animate-neonBlink`}>
            {text}
          </span>
        </span>
      </div>
    </Link>
  );
}
