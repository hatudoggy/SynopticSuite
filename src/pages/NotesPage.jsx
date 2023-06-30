import "../App.css";
import { useState } from "react";
import {nanoid} from 'nanoid';
import deleteButton from "../assets/delete-button.svg";
import {MdDeleteForever} from 'react-icons/md';
// import plusButton from "../assets/plus-button.svg";

function NotesPage() {
    const [notes, setNotes] = useState([
        {
            id: nanoid(),
            text: 'First Note',
            date: '01/01/2023',
        },
        {
            id: nanoid(),
            text: 'Second Note',
            date: '02/01/2023',
        },
        {
            id: nanoid(),
            text: 'Third Note',
            date: '03/01/2023',
        },
        {
            id: nanoid(),
            text: 'Fourth Note',
            date: '04/01/2023',
        },
    ]);

    const addNote = (text) => {
        const date = new Date();
        const newNote = {
            id: nanoid(),
            text: text,
            date: date.toLocaleDateString()
        };
        const newNotes = [...notes, newNote];
        setNotes(newNotes);
    };

    const deleteNote = (id) => {
        const newNotes = notes.filter((note)=> note.id !== id);
        setNotes(newNotes);
    };

    return (
        <div className="mx-auto px-4 max-w-screen-xl">
            <NotesList 
                notes={notes} 
                handleAddNote={addNote}
                handleDeleteNote={deleteNote}
            />
        </div>
    );
}

function NotesList({notes, handleAddNote, handleDeleteNote}) {

    return (
        <div className="grid gap-4 grid-cols-4 my-4">
            {notes.map((note)=> (
                <Note 
                    id={note.id} 
                    text={note.text} 
                    date={note.date}
                    handleDeleteNote={handleDeleteNote}
                />
            ))}
            <AddNote handleAddNote={handleAddNote}/>
        </div>
   );
}

function Note({id, text, date, handleDeleteNote}) {

    return (
        <div className="bg-amber-200 rounded-xl p-4 h-72 min-h-full flex flex-col justify-between whitespace-pre-wrap">
            <span>{text}</span>
            <div className="flex flex-row items-center justify-between">
                <small>{date}</small>
                {/* <button className="hover:cursor-pointer" onclick={() => handleDeleteNote(id)}>
                <img src = {deleteButton} />
                </button> */}
                <MdDeleteForever onClick={() => handleDeleteNote(id)} className="hover:cursor-pointer" size='1.3em'/>
            </div>
        </div>
    );
}

function AddNote({handleAddNote}) {
    const [noteText, setNoteText] = useState('');
    const characterLimit = 200;

    const handleChange = (event) => {
        if(characterLimit - event.target.value.length >= 0) {
            setNoteText(event.target.value);
        }
    };

    const handleSaveClick = () => {
        if(noteText.trim().length > 0) {
            handleAddNote(noteText);
            setNoteText('');
        }
    };

    return (
        <div className="bg-cyan-300 rounded-xl p-4 h-72 min-h-full flex flex-col justify-between">
            <textarea className="border-none border-transparent border-0 resize-none bg-cyan-300 outline-none" 
                rows="8" 
                cols="10" 
                placeholder="Type to add a new note..."
                value={noteText}
                onChange={handleChange}
                ></textarea>
            <div className="flex flex-row items-center justify-between">
                <small>{characterLimit - noteText.length} Remaining</small>
                {/* <img src={plusButton} onClick={handleSaveClicked}/> */}
                <button className="bg-zinc-200 border-none rounded-2xl py-1.5 px-2.5 hover:bg-neutral-100 hover:cursor-pointer" 
                        onClick={handleSaveClick}>Save</button>
            </div>
        </div>
    );
}

export default NotesPage;