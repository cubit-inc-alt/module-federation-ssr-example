import React from 'react';
import ReactDOM from 'react-dom';
import Image from './Image';

const App = () => (
  <div>
    <h1>Remote 2 Application</h1>
    <Image />
  </div>
);

// Make sure this matches the ID in your index.html
ReactDOM.render(<App />, document.getElementById('app'));

// Add HMR acceptance
if (module.hot) {
  module.hot.accept();
}
