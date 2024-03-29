import React, { useState } from "react";
import "./App.css";
import { eventNames } from "process";

type Note = {
  id: number;
  title: string;
  content: string;
};

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleAddNote = (event: React.FormEvent) => {
    event.preventDefault();

    const newNote: Note = {
      id: Date.now(),
      title: title,
      content: content,
    };

    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
  };

  const handleUpdateNote = (event: React.FormEvent) => {
    event.preventDefault();

    if(!selectedNote){
      return;
    }

    const updatedNote: Note ={
      id: selectedNote.id,
      title: title,
      content: content,
    };

    const updatedNoteList = notes.map((note)=> (note.id=== selectedNote.id? updatedNote: note));

    setNotes(updatedNoteList);
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const handleCancel = () =>{
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const deleteNote = (event: React.MouseEvent, noteId: number) =>{
    event.stopPropagation();

    const updatedNotes = notes.filter((note)=> note.id!==noteId);

    setNotes(updatedNotes);
  };

  return (
    <div className="app--container">
      <form className="note--form" onSubmit={(event) => (selectedNote? handleUpdateNote(event): handleAddNote(event))}>
        <input
          type="text"
          required
          placeholder="Title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <textarea
          placeholder="Content"
          rows={10}
          required
          value={content}
          onChange={(event) => setContent(event.target.value)}
        ></textarea>
        {/* <button type="submit">Add Note</button> */}
        {selectedNote?(
          <div className="edit-buttons">
            <button type="submit">Save </button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ):(
          <button type="submit">Add Note</button>
        )}
      </form>
      <div className="notes--grid">
        {notes.map((note) => (
          <div
            className="note--item"
            key={note.id}
            onClick={() => handleNoteClick(note)}
          >
            <div key={note.id} className="note-item" onClick={()=> handleNoteClick(note)}>
            <div className="notes--header">
              <button onClick={(event) => deleteNote(event, note.id)}>x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
          </div>
        ))}
      </div>
    </div>
  );
}