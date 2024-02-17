import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { db, collection, onSnapshot } from '../firebase';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';

const AliasLog = (props) => {
  //use typewriter library to diaplsy them all cool-like

  //initialize a blank useState
  //in a useEffect that runs once at startup, get an array of objects using onSnapshot of my firestore colection
  //save them to state with useState setter function
  //map over the state object within the html in the return statement, creating an individual list items for each item in state
  //when firebase collection updates, the onsnapshot will add the new item to state by calling its setter

  const [ActionLog, setActionLog] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  //SAVES THE PLUG INTERACTIONS FROM FIREBASE INTO A USESTATE
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, `lamp/${props.device}/interactions`),
      //collection(db, `lamp/R3EoXUVxaRX4Vy1IK0Yo/interactions`),
      (snap) => {
        const updatedMessages = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('UPDATED MESSAGES: ');
        console.log(updatedMessages);
        updatedMessages.sort((a, b) => b.time - a.time);
        console.log(updatedMessages);
        setActionLog(updatedMessages);
      }
    );
    return () => unsubscribe();
  }, []);

  function toggleExpandedLog() {
    setIsExpanded(!isExpanded);
    console.log('clicked dropdown. result: ', isExpanded);
  }

  return (
    <div>
      <p className='datalabel-action-log'>Action Log</p>
      <div>
        <ul id='action-log' className={`${isExpanded ? 'expanded' : ''}`}>
          {ActionLog.map((action) => (
            <li key={action.id} className='indiv-action'>
              <svg width='24' height='24' className='mui-bulb' focusable='false' viewBox='0 0 24 24'>
                <circle cx="12" cy="12" r="3" fill={!action.action ? '#000000' : '#f6aa38'} stroke={!action.action ? '#000000' : '#f6aa38'}
                    opacity={!action.action ? 0 : 1}></circle>
                <path fill={!action.action ? '#a6a6ff' : '#f6aa38'} d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3-3-1.35-3-3 1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5"></path>
                <path fill='#f6aa38' opacity={!action.action ? 0 : 1} d="M2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1m18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1M11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1m0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1M5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0z"></path>
              </svg>
              <div>
                <em>{moment(action.time).format('MM.DD.YYYY, hh:mm:ss a')}</em>{' '}
                {action.alias.length > 1 ? ' - ' : ''}
                <strong>{action.alias}</strong>
              </div>
            </li>
          ))}
        </ul>

        <button id='toggle-log' onClick={toggleExpandedLog}>
          {' '}
          {isExpanded ? '∧' : '∨'}{' '}
        </button>
      </div>
    </div>
  );
};

export default AliasLog;
