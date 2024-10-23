import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import logo from '@/assets/images/logo_with_title_rounded.svg';

interface QRCodeContainerProps {
  qrCodeValue: string;
}

export const QRCodeContainer: React.FC<QRCodeContainerProps> = ({ qrCodeValue }) => {
  return (
    <div className="relative flex justify-center items-center bg-background-black rounded-lg w-[255px] h-[255px]">
      {/* Top-left corner */}
      <div className="absolute top-[-0px] left-[-0px] w-[75px] h-[75px] border-t-4 border-l-4 border-blue rounded-tl-[8px]" />
      {/* Top-right corner */}
      <div className="absolute top-[-0px] right-[-0px] w-[75px] h-[75px] border-t-4 border-r-4 border-blue rounded-tr-[8px]" />
      {/* Bottom-left corner */}
      <div className="absolute bottom-[-0px] left-[-0px] w-[75px] h-[75px] border-b-4 border-l-4 border-blue rounded-bl-[8px]" />
      {/* Bottom-right corner */}
      <div className="absolute bottom-[-0px] right-[-0px] w-[75px] h-[75px] border-b-4 border-r-4 border-blue rounded-br-[8px]" />

      {/* Blue border around the image */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="w-[71px] h-[71px] border-2 border-blue rounded-md" />
      </div>

      {/* QR Code */}
      <QRCodeSVG
        value={qrCodeValue}
        size={250}
        bgColor="#FFFFFF"
        fgColor="#000000"
        level="Q"
        imageSettings={{
          src: logo,
          height: 70,
          width: 70,
          excavate: true,
        }}
      />
    </div>
  );
};
