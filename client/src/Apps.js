import React, { useEffect, useState } from 'react'
import App from './App'
import SpinnerDemarage from './component/SpinnerDemarage/SpinnerDemarage'
function Apps() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <SpinnerDemarage />}
      <App />
    </>
  )
}

export default Apps;
