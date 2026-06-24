
import React from 'react';

const QuestionMarkCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75c-.37.37-.68.74-.88 1.12-.2.38-.3.81-.3.81H12.5c0-.05 0-.11.02-.19.02-.08.05-.17.1-.28.09-.19.22-.39.42-.61.22-.25.5-.52.83-.83.37-.37.68-.74.88-1.12.2-.38.3-.81.3-1.34 0-1.38-1.12-2.5-2.5-2.5s-2.5 1.12-2.5 2.5h-2c0-2.48 2.02-4.5 4.5-4.5s4.5 2.02 4.5 4.5c0 .74-.23 1.41-.63 1.97z"/>
    </svg>
);

export default QuestionMarkCircleIcon;
