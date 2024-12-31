import React from 'react';
import { X } from 'lucide-react';
import { generateQRCode } from '../../utils/qrcode';

interface QRCodeProps {
  data: string;
  onClose: () => void;
  ticketInfo: {
    title: string;
    showtime: string;
    seat: string;
  };
}

export function QRCode({ data, onClose, ticketInfo }: QRCodeProps) {
  const qrCodeUrl = generateQRCode(data);

  return (
    <div className="bg-purple-950/50 rounded-xl p-6 shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-purple-200">Ваш билет</h3>
        <button
          onClick={onClose}
          className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center">
        <img
          src="https://qr.io/qr-svg/oru2eM.svg?1735542945614"
          alt="QR Code"
          className="w-48 h-48 mb-4  p-2 rounded-lg"
        />
        
        <div className="text-sm text-purple-300 text-center">
          <p className="font-semibold text-purple-200 mb-1">{ticketInfo.title}</p>
          <p>Сеанс: {ticketInfo.showtime}</p>
          <p>Место: {ticketInfo.seat}</p>
        </div>
      </div>
    </div>
  );
}