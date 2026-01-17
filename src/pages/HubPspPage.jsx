import React, { useEffect } from 'react';
import HubPspApp from '../modules/hub-psp-profesional/App';
import themeCssUrl from '../modules/hub-psp-profesional/styles/theme.css?url';

export default function HubPspPage() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = themeCssUrl;
    link.setAttribute('data-hub-psp-theme', 'true');
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, []);

  return <HubPspApp />;
}
