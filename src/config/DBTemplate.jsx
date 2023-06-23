import { firestore } from './firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const dataRef = collection(firestore, 'users');

function DBTemplate() {
  
  const [data] = useCollectionData(dataRef);
  

  return (
    <div >
        <div>{data && data.map( data => <Test collection={data}/>)}</div>
        <WritingTemplate/>
    </div>
  )
}

function Test(props) {
  const { text } = props.collection;
  return(<div>{text}</div>)
}

function WritingTemplate(){
    const [formValue, setFormValue] = useState('');

    const sendData = async(e) => {
        e.preventDefault();

        //const { uid } = auth.currentUser;

        await addDoc( dataRef, {
            text: formValue,
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

