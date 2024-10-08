import React, { useState, useEffect } from 'react';
import { X, Edit2, Save } from 'lucide-react';
import { isLoggedIn, getValidToken, refreshToken } from '/utils/auth.js';
import '/pages/styles/NoteModal.css';

const NotesModal = ({ isOpen, onClose, plantId, plantName }) => {
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && plantId && isLoggedIn()) {
      fetchNotes();
    }
  }, [isOpen, plantId]);

  const fetchNotes = async () => {
    try {
      const token = await getValidToken();
      if (!token) {
        throw new Error('No valid authentication token found');
      }

      const response = await fetch(`/api/notes/${plantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || '');
      } else if (response.status === 401) {
        // Token might be expired, try to refresh
        const newToken = await refreshToken();
        if (newToken) {
          // Retry the fetch with the new token
          return fetchNotes();
        } else {
          throw new Error('Session expired. Please login again.');
        }
      } else {
        const errorData = await response.text();
        throw new Error(`Failed to fetch notes: ${errorData}`);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError(`Failed to load notes: ${error.message}`);
    }
  };

  const saveNotes = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const token = await getValidToken();
      if (!token) {
        throw new Error('No valid authentication token found');
      }

      const response = await fetch(`/api/notes/${plantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes);
        setIsEditing(false);
      } else if (response.status === 401) {
        // Token might be expired, try to refresh
        const newToken = await refreshToken();
        if (newToken) {
          // Retry the save with the new token
          return saveNotes();
        } else {
          throw new Error('Session expired. Please login again.');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save notes');
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      setError(`Failed to save notes: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notes-modal-overlay">
      <div className="notes-modal">
        <div className="notes-modal-header">
          <h2>Notes for {plantName}</h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>
        <div className="notes-modal-content">
          {error && <p className="error-message">{error}</p>}
          {isEditing ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="notes-textarea"
            />
          ) : (
            <p className="notes-text">{notes || 'No notes yet.'}</p>
          )}
        </div>
        <div className="notes-modal-footer">
          {isEditing ? (
            <button onClick={saveNotes} className="save-button" disabled={isSaving}>
              <Save size={20} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="edit-button">
              <Edit2 size={20} />
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesModal;