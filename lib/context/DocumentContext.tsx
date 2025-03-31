"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our context data
type DocumentData = {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'task' | 'page' | 'meeting';
  lastUpdated: Date;
};

// Context interface
interface DocumentContextType {
  documents: DocumentData[];
  addDocument: (document: DocumentData) => void;
  removeDocument: (id: string) => void;
  getDocumentById: (id: string) => DocumentData | undefined;
  getDocumentByTitle: (title: string) => DocumentData | undefined;
  getRecentDocuments: (limit?: number) => DocumentData[];
  getCurrentContext: () => string | null;
  setCurrentContext: (documentId: string | null) => void;
}

// Create the context with a default value
const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

// Provider component
export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [currentContextId, setCurrentContextId] = useState<string | null>(null);

  // Add a new document
  const addDocument = (document: DocumentData) => {
    setDocuments(prev => [...prev, document]);
  };

  // Remove a document
  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  // Get a document by ID
  const getDocumentById = (id: string) => {
    return documents.find(doc => doc.id === id);
  };

  // Get a document by title
  const getDocumentByTitle = (title: string) => {
    return documents.find(doc => doc.title.toLowerCase() === title.toLowerCase());
  };

  // Get recent documents, sorted by lastUpdated
  const getRecentDocuments = (limit = 5) => {
    return [...documents]
      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
      .slice(0, limit);
  };

  // Get the current context content
  const getCurrentContext = (): string | null => {
    if (!currentContextId) return null;
    const doc = getDocumentById(currentContextId);
    if (!doc) return null;
    
    return `${doc.title} (${doc.type})\n\n${doc.content}`;
  };

  // Set the current context
  const setCurrentContext = (documentId: string | null) => {
    setCurrentContextId(documentId);
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        addDocument,
        removeDocument,
        getDocumentById,
        getDocumentByTitle,
        getRecentDocuments,
        getCurrentContext,
        setCurrentContext
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

// Custom hook to use the document context
export function useDocuments() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
} 