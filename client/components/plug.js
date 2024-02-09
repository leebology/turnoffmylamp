import { db, collection, onSnapshot, doc, getDoc, updateDoc } from '../firebase';
import React, { useState, useEffect, useRef } from 'react';

const Plug = () => {

  console.log('Plug re-rendered!!!!')

  const plugCol = collection(db, 'lamp');
  const plugDoc = doc(db, 'lamp', 'R3EoXUVxaRX4Vy1IK0Yo');

  async function fetchLastFlip() {
    try {
      const data = await getDoc(plugDoc);
      return data.data().lastflip;
    } catch (error) {
      console.log('error in fetchLastFlip: ', error)
    }
  }

  //REF for last time the plug was flipped (value coming from firebase)
  const lastFlipRef = useRef(fetchLastFlip())
  useEffect(() => {
    fetchLastFlip().then(x => {
      lastFlipRef.current = x;
    });
  }, [])

  //STATE
  const [PlugInfo, setPlugInfo] = useState({
    lastFlipText: '-',
    lastFlipLabel: 'Lamp has been on for:',
    currentLampState: '-',
    onButtonDisable: false,
    offButtonDisable: false
  });

  const handlePlugInfoChange = (key, value) => {
      setPlugInfo(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const refreshLastFlip = () => {
    let ms = Date.now() - lastFlipRef.current;
    const weeks = Math.floor(ms / 604800000);
    ms -= weeks * 604800000;
    const days = Math.floor(ms / 86400000);
    ms -= days * 86400000;
    const hours = Math.floor(ms / 3600000);
    ms -= hours * 3600000;
    const minutes = Math.floor(ms / 60000);
    ms -= minutes * 60000;
    const seconds = Math.floor(ms / 1000);

    let timeStr = '';
    if (weeks) {
      if (weeks > 1) timeStr += `${weeks} weeks, `;
      else timeStr += '1 week, ';
    }
    if (days) {
      if (days > 1) timeStr += `${days} days, `;
      else timeStr += '1 day, ';
    }
    if (hours) {
      if (hours > 1) timeStr += `${hours} hours, `;
      else timeStr += '1 hour, ';
    }
    if (minutes) {
      if (minutes > 1) timeStr += `${minutes} minutes, `;
      else timeStr += '1 minute, ';
    }
    if (seconds === 1) timeStr += `1 second`;
    else timeStr += `${seconds} seconds`;

    handlePlugInfoChange('lastFlipText', timeStr);

  };

  //HOW OFTEN THE 'lamp has been on for' TEXT IS REFRESHED
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshLastFlip();
      //console.log('just refreshed lastFlip')
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);


  useEffect(() => {
    const unsubscribe = onSnapshot(plugDoc, (snapshot) => {
      handlePlugInfoChange('lastButtonPress', snapshot.data().lastflip);
      const lampLit = snapshot.data().lit;
      lastFlipRef.current = snapshot.data().lastflip;
      refreshLastFlip();
      
      if (lampLit === 'on') {
        handlePlugInfoChange('lastFlipLabel', 'Lamp has been on for:');
        handlePlugInfoChange('onButtonDisable', true);
        setTimeout(() => handlePlugInfoChange('offButtonDisable', false), 0);
      } else if (lampLit === 'off') {
        handlePlugInfoChange('lastFlipLabel', 'Lamp has been off for:');
        setTimeout(() => handlePlugInfoChange('onButtonDisable', false), 0);
        handlePlugInfoChange('offButtonDisable', true);
      }
      handlePlugInfoChange('currentLampState', lampLit)

      console.log('finished onSnapshot')
    });
    return () => unsubscribe();
  }, []);

  //should this be upgraded to try/catch?
  async function asyncFlip(data) {
    console.log('pressed: ', data.value);
    handlePlugInfoChange('onButtonDisable', true);
    handlePlugInfoChange('offButtonDisable', true);
    fetch('/flip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error in asyncFLip! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('response from server: ', data);
      })
      .catch((err) => console.log('Error in flip request to server: ', err));
  }

  return (
    <div>
      <h3>smart outlet</h3>
      <div>
        <button className="lampbutton" disabled={PlugInfo.onButtonDisable} onClick={() => asyncFlip({ value: true, alias: 'bilbo' })}>turn on my lamp</button>
        <button className="lampbutton" disabled={PlugInfo.offButtonDisable} onClick={() => asyncFlip({ value: false, alias: 'baggypants' })}>turn off my lamp</button>
      </div>
      <br/>
      <div>
        <div className="datalabel">{PlugInfo.lastFlipLabel}</div><div className="lastflip">{PlugInfo.lastFlipText}</div>
        <br/>
        <div className="datalabel">Current state: </div> <div className="currentlampstate">{PlugInfo.currentLampState}</div>
      </div>
    </div>
  );
}

export default Plug;