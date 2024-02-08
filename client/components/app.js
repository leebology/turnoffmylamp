import React from 'react';
import '../styles.css';

import Bulb from './bulb';
import Plug from './plug';
import Header from './header';

const App = () => {
  return (
    <>
      <Header />
      <div>
        <Bulb />
        <Plug />
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