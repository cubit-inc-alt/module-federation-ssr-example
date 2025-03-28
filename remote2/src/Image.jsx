import React from 'react';

// Using named function component for better hot reloading
const Image = () => {
  // Adding a console log to verify when the component is reloaded
  console.log('Image component rendered', new Date().toISOString());
  
  return (
    <div
      style={{
        backgroundColor: 'red',
        color: 'lightgrey',
        padding: '1rem',
        width: '500px',
      }}
    >
      <h2>Remote 2: Image Component</h2>
      <button style={{ marginBottom: '1rem' }} onClick={() => alert('Client side Javascript works!')}>
        Click me 
      </button>
      <img
        src="https://i.ibb.co/jfTvC6Q/serge.jpg"
        style={{ width: '100%' }}
        alt="serge"
        border="0"
      />
    </div>
  );
};

// This is crucial for module federation HMR
if (module.hot) {
  module.hot.accept();
}

export default Image;
