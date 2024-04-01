import React, { useEffect, useState } from "react";
import "./App.css";

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

  useEffect(()=> {
    const fetchNotes = async () => {
      try{
        const response = await fetch("http://localhost:5000/api/notes");
        const notes: Note[] = await response.json();
        setNotes(notes);
      } catch (e){
        console.log(e);
      }
    };
    fetchNotes();
  }, []);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleAddNote = async(event: React.FormEvent) => {
    event.preventDefault();
    try{
      
      const response = await fetch("http://localhost:5000/api/notes",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      })
      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setTitle("");
      setContent("");
    } catch (e){
      console.log(e);
    }
  };

  const handleUpdateNote = async (event: React.FormEvent,) => {
    event.preventDefault();

    if(!selectedNote){
      return;
    }

    const updatedNote: Note ={
      id: selectedNote.id,
      title: title,
      content: content,
    };

    try {
      await fetch(
        `http://localhost:5000/api/notes/${updatedNote.id}`,
        {
          method:"PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      )
    } catch(e){
      console.log(e);
    }

   

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

  const deleteNote = async (event: React.MouseEvent, noteId: number) =>{
    event.stopPropagation();
    try{
      await fetch(
        `http://localhost:5000/api/notes/${noteId}`,
        {
          method: "DELETE",
        }
      );
      const updatedNotes = notes.filter(
        (note)=> note.id!==noteId
      );
      setNotes(updatedNotes);
    } catch(e){
      console.log(e);
    }
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