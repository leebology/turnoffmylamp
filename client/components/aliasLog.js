import React, {useState, useEffect} from 'react';
import moment from 'moment';
import {
  db,
  collection,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from '../firebase';

const AliasLog = (props) => {
  //use typewriter library to diaplsy them all cool-like

  //initialize a blank useState
  //in a useEffect that runs once at startup, get an array of objects using onSnapshot of my firestore colection
  //save them to state with useState setter function
  //map over the state object within the html in the return statement, creating an individual list items for each item in state
  //when firebase collection updates, the onsnapshot will add the new item to state by calling its setter

  const [ActionLog, setActionLog] = useState([]);

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
        setActionLog(updatedMessages);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <>
      <p className='datalabel'>Alias Log:</p>
      <ul>
        {ActionLog.map((action) => (
          <li key={action.id}>
            <strong>{action.alias}</strong> turned my lamp {action.action} - {' '}
            <em>{moment(action.time).format('MMMM Do YYYY, h:mm:ss a')}</em>
          </li>
        ))}
      </ul>
    </>
  );
};

export default AliasLog;
