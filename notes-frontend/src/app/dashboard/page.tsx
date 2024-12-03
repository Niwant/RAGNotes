"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect , useRef} from "react";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar"
import { AppSidebar } from "../../components/ui/app-sidebar"
import { useState } from "react";
import MarkdownEditor from "@/components/markdownEditor";
import { Input } from "@/components/ui/input"
import {NotebookPen } from "lucide-react"
 
import { Button } from "@/components/ui/button" 

import axios from "axios"
import { createNote, getNotes, updateNote } from "@/api/noteApi";




export default function DashboardPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const editorRef = useRef()
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(notes[0]);

  useEffect(() => {
    if (!isSignedIn) {
      // Redirect unauthenticated users to the home page
      // router.push("/");
      fetchNotes()
      
    }
  }, [isSignedIn, router]);

  const fetchNotes = async () => {
    let notes = await getNotes()
    setNotes(notes)
  };

  const handleSelectNote = (note : any) => {
    // console.log(note)
    selectedNote ? saveNote(selectedNote ) : null
    setSelectedNote(note);
  };

  const saveNote = async(note)=>{
   if (note?.ID){
    updateNote(note)
    return
   }
   createNote(note)
  }
  const handleContentChange = (newContent: any) => {
    const updatedNote = { ...selectedNote, content: newContent };
    setSelectedNote(updatedNote);
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.ID === updatedNote.ID ? updatedNote : note))
    );
  };

  const handleTitleChange =(newTitle: string)=>{
    const updatedNote = { ...selectedNote, title: newTitle };
    setSelectedNote(updatedNote);
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.ID === updatedNote.ID ? updatedNote : note))
    );
  }

  const createNewNote = ()=>{
    const newNote = {
      title: "Untitled Note",
      _id: notes.length + 1,
      content: "" // This could be a random ID or fetched from the backend
    }

    setNotes((prevNotes) => [...prevNotes, newNote])
    setSelectedNote(newNote)
  }

  if (!isSignedIn) {
    return <div>Loading...</div>; // Show loading while redirecting
  }

  // Render content for authenticated users
  return (
    <SidebarProvider>
      <div className="flex w-screen">
        {/* Sidebar */}
        <AppSidebar 
        handleSelectNote ={handleSelectNote}
        notes={notes}/>
  
        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Sidebar Trigger (optional) */}
          <SidebarTrigger />
  
          <div className="p-8 flex-1 overflow-auto">
            <h1 className="text-3xl font-bold mb-4">Welcome, {user?.firstName}!</h1>
            <p>Your email: {user?.emailAddresses[0]?.emailAddress}</p>
            <p className="mb-4">Here are your notes:</p>
            <Button onClick={createNewNote}>
            <NotebookPen /> Create a Note 
            </Button>
            {/* Markdown Editor */}
            {selectedNote && <Input placeholder="Email" value={selectedNote.title} onChange={(e)=>handleTitleChange(e.target.value)} /> }
            {selectedNote && <MarkdownEditor note={selectedNote} handleContentChange={handleContentChange} />}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
  
}
