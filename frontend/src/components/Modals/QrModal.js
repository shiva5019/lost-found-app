import React from 'react';

const QrModal = ({ onClose }) => {
  const handleDownloadOrPrint = () => {
    const link = document.createElement('a');
    link.href = '/assets/campusfind_qr_poster.png';
    link.download = 'CampusFind_QR_Poster.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 🖨️ Optional: trigger print preview
    const printWin = window.open('/assets/campusfind_qr_poster.png', '_blank');
    if (printWin) {
      printWin.onload = () => printWin.print();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full text-center relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-black text-xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-purple-700 mb-4">📱 Scan to Access CampusFind</h2>
        <p className="text-gray-700 mb-4">
          Scan this QR code to visit the Lost & Found portal on your phone.
        </p>
        <img
          src="/assets/campusfind_qr_poster.png"
          alt="CampusFind QR Poster"
          className="w-full max-w-xs mx-auto rounded-lg border border-gray-300"
        />

        <button
          onClick={handleDownloadOrPrint}
          className="mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow"
        >
          📥 Download / 🖨️ Print
        </button>
      </div>
    </div>
  );
};

export default QrModal;
