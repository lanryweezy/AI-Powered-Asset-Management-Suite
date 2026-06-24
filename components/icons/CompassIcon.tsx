
import React from 'react';

const CompassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.12-11.88-3.76 1.51 1.51 3.76 3.76-1.51-1.51-3.76zM12 12l-1.5-3.75L6.75 9.75 9.75 13.5l2.25-1.5z"/>
    <path d="M14.12 8.12l3.76-1.51-1.51-3.76-3.76 1.51 1.51 3.76zM12 12l1.5 3.75 3.75-1.5L14.25 10.5 12 12z" opacity=".3"/>
  </svg>
);

export default CompassIcon;