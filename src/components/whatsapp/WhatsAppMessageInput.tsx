"use client";

import { useState, useRef } from "react";

interface WhatsAppMessageInputProps {
  onSendMessage: (content: string, type?: 'text' | 'image' | 'audio' | 'video' | 'document') => void;
  disabled?: boolean;
}

export default function WhatsAppMessageInput({
  onSendMessage,
  disabled = false,
}: WhatsAppMessageInputProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log('File selected:', file);
      // You can implement file upload to your backend here
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement audio recording logic here
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-3">
      {/* Attachment Button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className={`p-2 rounded-lg transition-colors ${
          disabled
            ? 'text-secondary-text cursor-not-allowed'
            : 'text-secondary-text hover:text-primary-text hover:bg-card-bg'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      </button>

      {/* Message Input */}
      <div className="flex-1 bg-card-bg border border-border rounded-lg overflow-hidden">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Selecione uma conta para enviar mensagens" : "Digite sua mensagem..."}
          disabled={disabled}
          className="w-full px-4 py-3 bg-transparent text-primary-text placeholder-secondary-text resize-none outline-none"
          style={{ minHeight: '48px', maxHeight: '120px' }}
        />
      </div>

      {/* Voice/Send Button */}
      {message.trim() ? (
        <button
          type="submit"
          disabled={disabled}
          className={`p-2 rounded-lg transition-colors ${
            disabled
              ? 'text-secondary-text cursor-not-allowed'
              : 'text-blue-400 hover:text-blue-300 hover:bg-card-bg'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={toggleRecording}
          disabled={disabled}
          className={`p-2 rounded-lg transition-colors ${
            disabled
              ? 'text-secondary-text cursor-not-allowed'
              : isRecording
                ? 'text-red-400 hover:text-red-300 bg-red-900/20'
                : 'text-secondary-text hover:text-primary-text hover:bg-card-bg'
          }`}
        >
          {isRecording ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        onChange={handleFileUpload}
        className="hidden"
      />
    </form>
  );
}