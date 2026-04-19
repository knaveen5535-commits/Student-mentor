# How to Create & Modify Features

## Quick Start: Adding a New Feature

### Example: Creating a "Notes" Feature

---

## Backend Setup

### 1. Create Directory Structure

```bash
mkdir -p packages/api/src/features/notes
cd packages/api/src/features/notes
```

### 2. Create `service.js` (Business Logic)

```javascript
// packages/api/src/features/notes/service.js
const supabase = require('../../core/config/supabase');

class NotesService {
  async createNote(userId, title, content) {
    const { data, error } = await supabase
      .from('notes')
      .insert([{ user_id: userId, title, content }])
      .select();
    
    if (error) throw error;
    return data;
  }

  async getNotes(userId) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }

  async updateNote(noteId, updates) {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', noteId)
      .select();
    
    if (error) throw error;
    return data;
  }

  async deleteNote(noteId) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', noteId);
    
    if (error) throw error;
    return { success: true };
  }
}

module.exports = new NotesService();
```

### 3. Create `controller.js` (Request Handlers)

```javascript
// packages/api/src/features/notes/controller.js
const notesService = require('./service');

const NotesController = {
  async createNote(req, res) {
    try {
      const { title, content } = req.body;
      const userId = req.user.id;
      
      const note = await notesService.createNote(userId, title, content);
      res.json({ success: true, data: note });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getNotes(req, res) {
    try {
      const userId = req.user.id;
      const notes = await notesService.getNotes(userId);
      res.json({ success: true, data: notes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateNote(req, res) {
    try {
      const { noteId } = req.params;
      const updates = req.body;
      
      const note = await notesService.updateNote(noteId, updates);
      res.json({ success: true, data: note });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteNote(req, res) {
    try {
      const { noteId } = req.params;
      await notesService.deleteNote(noteId);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = NotesController;
```

### 4. Create `routes.js` (API Endpoints)

```javascript
// packages/api/src/features/notes/routes.js
const express = require('express');
const authMiddleware = require('../../core/middleware/auth');
const NotesController = require('./controller');

const router = express.Router();

router.post('/notes', authMiddleware, NotesController.createNote);
router.get('/notes', authMiddleware, NotesController.getNotes);
router.put('/notes/:noteId', authMiddleware, NotesController.updateNote);
router.delete('/notes/:noteId', authMiddleware, NotesController.deleteNote);

module.exports = router;
```

### 5. Register Routes in `server.js`

```javascript
// packages/api/src/server.js
const notesRoutes = require('./features/notes/routes');

app.use('/api', notesRoutes);
```

---

## Frontend Setup

### 1. Create Directory Structure

```bash
mkdir -p packages/web/src/features/notes/{components,pages,hooks}
```

### 2. Create Zustand Store (`store.ts`)

```typescript
// packages/web/src/features/notes/store.ts
import { create } from 'zustand';

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface NotesStore {
  notes: Note[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchNotes: () => Promise<void>;
  addNote: (title: string, content: string) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export const useNotesStore = create<NotesStore>((set) => ({
  notes: [],
  loading: false,
  error: null,

  fetchNotes: async () => {
    set({ loading: true });
    try {
      const response = await fetch('/api/notes');
      const data = await response.json();
      set({ notes: data.data, error: null });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  addNote: async (title, content) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      const data = await response.json();
      set((state) => ({ notes: [...state.notes, data.data] }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  updateNote: async (id, updates) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      set((state) => ({
        notes: state.notes.map((note) => (note.id === id ? data.data : note)),
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  deleteNote: async (id) => {
    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      set((state) => ({ notes: state.notes.filter((note) => note.id !== id) }));
    } catch (error) {
      set({ error: error.message });
    }
  },
}));
```

### 3. Create Components

```typescript
// packages/web/src/features/notes/components/NoteCard.tsx
import React from 'react';
import styles from './NoteCard.module.css';

interface NoteCardProps {
  title: string;
  content: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  title,
  content,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <p>{content.substring(0, 100)}...</p>
      <div className={styles.actions}>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};
```

### 4. Create Page

```typescript
// packages/web/src/features/notes/pages/NotesPage.tsx
'use client';
import React, { useEffect } from 'react';
import { useNotesStore } from '../store';
import { NoteCard } from '../components/NoteCard';

export default function NotesPage() {
  const { notes, fetchNotes, deleteNote } = useNotesStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <div>
      <h1>My Notes</h1>
      <div>
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            title={note.title}
            content={note.content}
            onEdit={() => {}}
            onDelete={() => deleteNote(note.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## File Organization Checklist

- [ ] Service (`service.js`) - Business logic
- [ ] Controller (`controller.js`) - Request handlers
- [ ] Routes (`routes.js`) - Endpoints
- [ ] Frontend Store (`store.ts`) - State management
- [ ] Components (`components/`) - React components
- [ ] Page (`pages/`) - Main page component
- [ ] Types (`types.ts`) - TypeScript interfaces
- [ ] Tests (`__tests__/`) - Unit tests
- [ ] README.md - Feature documentation
- [ ] Registered in main server/app
