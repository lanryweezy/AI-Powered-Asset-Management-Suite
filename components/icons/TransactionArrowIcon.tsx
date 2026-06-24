
import React from 'react';

interface TransactionArrowIconProps extends React.SVGProps<SVGSVGElement> {
  type: 'Buy' | 'Sell';
}

const TransactionArrowIcon: React.FC<TransactionArrowIconProps> = ({ type, ...props }) => {
  const isBuy = type === 'Buy';
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" {...props}>
      {isBuy ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" />
      )}
    </svg>
  );
};

export default TransactionArrowIcon;
