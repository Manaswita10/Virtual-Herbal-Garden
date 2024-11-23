// NotesModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { X, Edit2, Save } from 'lucide-react';
import { isLoggedIn, getValidToken } from '/utils/auth.js';
import '/pages/styles/NotesModal.css';

const BackgroundButterflies = () => {
  return (
    <div className="page-butterfly-container">
      {[...Array(12)].map((_, index) => (
        <div key={index} className="page-butterfly" style={{ 
          '--random-start-x': `${Math.random() * 100}%`,
          '--random-start-y': `${Math.random() * 100}%`,
          '--random-scale': `${0.6 + Math.random() * 0.8}`,
          '--random-delay': `-${Math.random() * 20}s`,
          '--flight-duration': `${15 + Math.random() * 10}s`
        }}>
          <div className="wing-left"></div>
          <div className="wing-right"></div>
        </div>
      ))}
    </div>
  );
};

const NotesModal = ({ isOpen, onClose, plantId, plantName }) => {
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotes = useCallback(async (retryCount = 0) => {
    if (!isOpen || !plantId || !isLoggedIn()) return;

    setIsLoading(true);
    setError(null);
    try {
      const token = await getValidToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/notes/${plantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || '');
      } else if (response.status === 401 && retryCount < 1) {
        const newToken = await getValidToken();
        if (newToken) {
          return fetchNotes(retryCount + 1);
        } else {
          throw new Error('Session expired. Please login again.');
        }
      } else {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to fetch notes');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, plantId]);

  const saveNotes = async (retryCount = 0) => {
    if (!plantId || !isLoggedIn()) {
      setError('Authentication required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const token = await getValidToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/notes/${plantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes: notes.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes);
        setIsEditing(false);
      } else if (response.status === 401 && retryCount < 1) {
        const newToken = await getValidToken();
        if (newToken) {
          return saveNotes(retryCount + 1);
        } else {
          throw new Error('Session expired. Please login again.');
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save notes');
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    if (isOpen && plantId) {
      fetchNotes().then(() => {
        if (!mounted) return;
      });
    }

    return () => {
      mounted = false;
    };
  }, [fetchNotes, isOpen, plantId]);

  const handleClose = useCallback(() => {
    setError(null);
    setIsEditing(false);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="notes-modal-overlay">
      <BackgroundButterflies />
      <div className="notes-modal">
        <div className="notes-modal-header">
          <h2>Notes for {plantName}</h2>
          <button 
            onClick={handleClose} 
            className="close-button"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        <div className="notes-modal-content">
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}
          {isLoading ? (
            <div className="loading">Loading notes...</div>
          ) : isEditing ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="notes-textarea"
              placeholder="Enter your notes here..."
              disabled={isSaving}
              aria-label="Notes textarea"
            />
          ) : (
            <div className="notes-text">
              {notes ? (
                <p>{notes}</p>
              ) : (
                <p className="no-notes">No notes yet. Click Edit to add notes.</p>
              )}
            </div>
          )}
        </div>
        <div className="notes-modal-footer">
          {isEditing ? (
            <button 
              onClick={saveNotes} 
              className="save-button" 
              disabled={isSaving || !notes.trim()}
              aria-busy={isSaving}
            >
              <Save size={20} />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(true)} 
              className="edit-button"
              disabled={isLoading}
            >
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