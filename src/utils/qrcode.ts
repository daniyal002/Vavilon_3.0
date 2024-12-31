export function generateQRCode(data: string): string {
  // This is a placeholder that generates a QR code using a public API
  // In production, you might want to use a QR code generation library or your own API
  return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
}