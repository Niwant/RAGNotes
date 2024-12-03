"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect , useRef} from "react";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar"
import { AppSidebar } from "../../components/ui/app-sidebar"
import { useState } from "react";
import MarkdownEditor from "@/components/markdownEditor";




export default function DashboardPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const editorRef = useRef()
  const [notes, setNotes] = useState([
    { id: 1, title: "Meeting Notes", content: "Discuss project timeline and deliverables." },
    { id: 2, title: "Grocery List", content: "Milk, Bread, Eggs, Butter." },
    { id: 3, title: "Project Ideas", content: "AI-driven chatbot for customer support." },
  ]);
  const [selectedNote, setSelectedNote] = useState(notes[0]);

  useEffect(() => {
    if (!isSignedIn) {
      // Redirect unauthenticated users to the home page
      router.push("/");
    }
  }, [isSignedIn, router]);

  const handleSelectNote = (note) => {
    // console.log(note)
    setSelectedNote(note);
  };

  const handleContentChange = (newContent) => {
    const updatedNote = { ...selectedNote, content: newContent };
    setSelectedNote(updatedNote);
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
  };



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
  
            {/* Markdown Editor */}
            <MarkdownEditor note={selectedNote} handleContentChange={handleContentChange} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
  
}
