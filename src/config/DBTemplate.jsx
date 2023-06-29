import { firestore } from './firebase';
import { addDoc, collection, onSnapshot, limit, query } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

const dataRef = collection(firestore, 'Links');

function DBTemplate() {
  const [data, setData] = useState();
  useEffect(()=>{
    const unsubscribe = onSnapshot(dataRef, (querySnapshot) => {
      const cities = [];
      querySnapshot.forEach((doc) => {
          cities.push(doc.data());
      });
      //console.log(cities);
      setData(cities);
    });
  },[] );


  //const [datae, load, error] = useCollection(dataRef);
  //console.log(data)
  return (
    <div >
        <div>{data && data.map( data => <Test collection={data}/>)}</div>
        <WritingTemplate/>
    </div>

  )
}

function Test(props) {
  console.log(props.collection)
  const { link } = props.collection;
  return(<div>{link}</div>)
}

function WritingTemplate(){
    const [formValue, setFormValue] = useState('');

    const sendData = async(e) => {
        e.preventDefault();

        //const { uid } = auth.currentUser;

        await addDoc( dataRef, {
            link: formValue,
            //uid
        });

        setFormValue('');
    }

    return(
        <form onSubmit={sendData}>
            <input className='bg-slate-300' value={formValue} onChange={val => setFormValue(val.target.value)}/>
            <button className='bg-slate-700' type='submit'>Submit</button>
        </form>
    )
}

export default DBTemplate

