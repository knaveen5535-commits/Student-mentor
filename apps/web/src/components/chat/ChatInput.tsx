'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useUpload } from '../../hooks/useUpload';

type Props = {
  onSend: (text: string) => Promise<void>;
  disabled?: boolean;
};

export function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('');
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [rows, setRows] = useState(1);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const attachmentsRef = useRef<HTMLDivElement | null>(null);

  const { upload, loading: uploadLoading } = useUpload();
  const busy = !!disabled || uploadLoading;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      const lineCount = (text.match(/\n/g) || []).length + 1;
      setRows(Math.min(Math.max(lineCount, 2), 8));
    }
  }, [text]);

  useEffect(() => {
    // Close attachments on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (attachmentsRef.current && !attachmentsRef.current.contains(e.target as Node)) {
        setAttachmentsOpen(false);
      }
    };
    if (attachmentsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [attachmentsOpen]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  async function handleSend() {
    setError(null);
    const value = text.trim();
    if (!value) return;
    setText('');
    setRows(1);
    await onSend(value);
  }

  async function onPickFile(file: File | null) {
    if (!file) return;
    setError(null);
    try {
      const uploaded = await upload(file);
      setText((t) => `${t}\n[Uploaded: ${uploaded.originalName}] ${uploaded.url}`.trim());
    } catch (e: any) {
      setError(e?.message || 'Upload failed');
    }
  }

  async function startCamera() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch (e: any) {
      setError(e?.message || 'Camera permission denied');
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
  }

  const canCapture = useMemo(() => !!cameraOn && !!videoRef.current, [cameraOn]);

  async function capture() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return;
    const file = new File([blob], `capture_${Date.now()}.png`, { type: 'image/png' });
    await onPickFile(file);
  }

  const canSend = text.trim().length > 0 && !busy;

  return (
    <div
      style={{
        borderRadius: 14,
        background: isFocused
          ? 'rgba(30, 33, 44, 0.6)'
          : 'rgba(22, 24, 31, 0.5)',
        backdropFilter: 'blur(30px) brightness(1.05)',
        WebkitBackdropFilter: 'blur(30px) brightness(1.05)',
        border: `1.5px solid ${
          isFocused
            ? 'rgba(99,102,241,0.6)'
            : 'rgba(255,255,255,0.12)'
        }`,
        boxShadow: isFocused
          ? 'inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 4px rgba(99,102,241,0.15), 0 12px 32px rgba(0,0,0,0.3)'
          : 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.2)',
        transition: 'all 0.25s ease',
        overflow: attachmentsOpen ? 'visible' : 'hidden',
      }}
    >
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        id="chat-input-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (canSend) handleSend();
          }
        }}
        rows={rows}
        placeholder="Ask AI Mentor anything… (Enter to send, Shift+Enter for new line)"
        disabled={busy}
        style={{
          width: '100%',
          padding: '18px 20px 12px',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'rgba(240,242,255,0.9)',
          fontSize: 16,
          lineHeight: 1.7,
          resize: 'none',
          fontFamily: "'Inter', sans-serif",
          boxSizing: 'border-box',
          minHeight: 75,
          transition: 'all 0.2s ease',
        }}
      />

      {/* Action bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px 10px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(0,0,0,0.1)',
        }}
      >
        {/* Left actions */}
        <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap', position: 'relative', alignItems: 'center' }}>
          {/* Attachments dropdown */}
          <div style={{ position: 'relative' }} ref={attachmentsRef}>
            <button
              id="chat-attachments-btn"
              type="button"
              onClick={() => setAttachmentsOpen(!attachmentsOpen)}
              disabled={busy}
              title="Add attachments"
              style={{
                padding: '7px 12px',
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                border: attachmentsOpen ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.15)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
                color: attachmentsOpen ? '#a5b4fc' : 'rgba(240,242,255,0.65)',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                cursor: busy ? 'not-allowed' : 'pointer',
                opacity: busy ? 0.5 : 1,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!busy) {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'rgba(255,255,255,0.15)';
                  el.style.borderColor = 'rgba(99,102,241,0.4)';
                  el.style.color = 'rgba(240,242,255,0.9)';
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.08)';
                el.style.borderColor = attachmentsOpen ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.15)';
                el.style.color = attachmentsOpen ? '#a5b4fc' : 'rgba(240,242,255,0.65)';
              }}
            >
              📎 Attach
            </button>

            {/* Dropdown menu */}
            {attachmentsOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: 4,
                  background: 'rgba(30, 33, 44, 0.95)',
                  backdropFilter: 'blur(20px) brightness(1.1)',
                  WebkitBackdropFilter: 'blur(20px) brightness(1.1)',
                  border: '1px solid rgba(99,102,241,0.4)',
                  borderRadius: 10,
                  padding: '8px',
                  zIndex: 1000,
                  minWidth: 200,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                  animation: 'slideDown 0.2s ease-out',
                }}
              >
                {/* File option */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 8,
                    cursor: busy ? 'not-allowed' : 'pointer',
                    background: 'transparent',
                    transition: 'all 0.2s ease',
                    opacity: busy ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!busy) e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ fontSize: 16 }}>📄</span>
                  <span style={{ fontSize: 13, color: 'rgba(240,242,255,0.8)' }}>File</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: 'none' }}
                    disabled={busy}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onPickFile(file);
                        setAttachmentsOpen(false);
                      }
                    }}
                  />
                </label>

                {/* Document option */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 8,
                    cursor: busy ? 'not-allowed' : 'pointer',
                    background: 'transparent',
                    transition: 'all 0.2s ease',
                    opacity: busy ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!busy) e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ fontSize: 16 }}>📑</span>
                  <span style={{ fontSize: 13, color: 'rgba(240,242,255,0.8)' }}>Document</span>
                  <input
                    type="file"
                    accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                    style={{ display: 'none' }}
                    disabled={busy}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onPickFile(file);
                        setAttachmentsOpen(false);
                      }
                    }}
                  />
                </label>

                {/* Image option */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 8,
                    cursor: busy ? 'not-allowed' : 'pointer',
                    background: 'transparent',
                    transition: 'all 0.2s ease',
                    opacity: busy ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!busy) e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ fontSize: 16 }}>🖼️</span>
                  <span style={{ fontSize: 13, color: 'rgba(240,242,255,0.8)' }}>Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    disabled={busy}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onPickFile(file);
                        setAttachmentsOpen(false);
                      }
                    }}
                  />
                </label>

                {/* Camera option */}
                <button
                  type="button"
                  onClick={() => {
                    startCamera();
                    setAttachmentsOpen(false);
                  }}
                  disabled={busy}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 8,
                    cursor: busy ? 'not-allowed' : 'pointer',
                    background: 'transparent',
                    transition: 'all 0.2s ease',
                    opacity: busy ? 0.5 : 1,
                    border: 'none',
                    width: '100%',
                    color: 'inherit',
                    fontSize: 'inherit',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (!busy) e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ fontSize: 16 }}>📷</span>
                  <span style={{ fontSize: 13, color: 'rgba(240,242,255,0.8)' }}>Camera</span>
                </button>
              </div>
            )}
          </div>

          {uploadLoading && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                color: 'rgba(240,242,255,0.4)',
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  border: '2px solid rgba(99,102,241,0.3)',
                  borderTop: '2px solid #6366f1',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                }}
              />
              Uploading...
            </div>
          )}
        </div>

        {/* Char hint */}
        {text.length > 0 && (
          <div style={{ fontSize: 11, color: 'rgba(240,242,255,0.2)', whiteSpace: 'nowrap' }}>
            {text.length} chars
          </div>
        )}

        {/* Send button */}
        <button
          id="chat-send-btn"
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          style={{
            padding: '8px 18px',
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 10,
            border: canSend ? '1px solid rgba(255,255,255,0.2)' : 'none',
            background: canSend
              ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
              : 'rgba(99,102,241,0.15)',
            backdropFilter: canSend ? 'none' : 'blur(15px)',
            WebkitBackdropFilter: canSend ? 'none' : 'blur(15px)',
            color: canSend ? '#fff' : 'rgba(240,242,255,0.3)',
            cursor: canSend ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            boxShadow: canSend 
              ? 'inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 16px rgba(99,102,241,0.35)'
              : 'inset 0 1px 0 rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (canSend) {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(-1px) scale(1.03)';
              el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.3), 0 8px 24px rgba(99,102,241,0.5)';
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(0) scale(1)';
            el.style.boxShadow = canSend ? 'inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 16px rgba(99,102,241,0.35)' : 'inset 0 1px 0 rgba(255,255,255,0.05)';
          }}
        >
          {busy ? (
            <>
              <span
                style={{
                  width: 13,
                  height: 13,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid #fff',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                }}
              />
              Sending
            </>
          ) : (
            <>Send ↑</>
          )}
        </button>
      </div>

      {/* Camera preview */}
      {cameraOn && (
        <div
          style={{
            padding: '0 12px 12px',
          }}
        >
          <video
            ref={videoRef}
            playsInline
            style={{
              width: '100%',
              borderRadius: 10,
              background: '#000',
              maxHeight: 200,
              objectFit: 'cover',
              border: '1px solid rgba(99,102,241,0.2)',
            }}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            margin: '0 12px 10px',
            padding: '10px 14px',
            borderRadius: 8,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#fca5a5',
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
