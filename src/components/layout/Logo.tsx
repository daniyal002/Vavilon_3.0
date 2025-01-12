import { Link } from 'react-router-dom';
import logo from '../../../public/icon/logo.svg'

export function Logo() {
  return (
    <Link
      to="/"
      className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg relative group"
    >
      <img src={logo} alt="Logo" className='w-16 md:w-24'/>
      {/* Контент */}
      <div className="relative flex items-center gap-2">
        <span className="text-3xl md:text-5xl font-bold relative">
          {/* Неоновый текст */}
          <span className={`absolute inset-0 blur-[2px] bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient `}>
          VAVILON
          </span>
          {/* Основной текст */}
          <span className={`relative text-[#fff6a9] animate-neonBlink`}>
          VAVILON
          </span>
        </span>
      </div>
    </Link>
  );
}
