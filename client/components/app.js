import React from 'react';
import '../styles.css';

import Bulb from './bulb';
import Plug from './plug';
import AliasLog from './aliasLog';
import Header from './header';

const App = () => {
  return (
    <>
      <Header />
      <div className="device-container">
        <Bulb />
        <AliasLog device='OISe4EzjNkVwfyebkdcv'/>
      </div>
      <div className="device-container">
        <Plug />
        <AliasLog device='R3EoXUVxaRX4Vy1IK0Yo'/>
      </div>
      <footer>
        <div id="footer">
          <p>hi uh let me get uhhhh</p>
        </div> 
      </footer>
    </>
  );
};

export default App;