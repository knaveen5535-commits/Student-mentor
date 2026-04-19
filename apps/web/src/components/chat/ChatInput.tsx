'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useUpload } from '../../hooks/useUpload';

type Props = {
  onSend: (text: string) => Promise<void>;
  disabled?: boolean;
};

type Attachment = {
  data: string;
  mimeType: string;
  name: string;
  previewUrl: string;
};

export function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
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
      setRows(Math.min(Math.max(lineCount, 1), 6));
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
    if (!value && attachments.length === 0) return;

    let payloadString = value;
    if (attachments.length > 0) {
      payloadString = JSON.stringify({
        text: value,
        attachments: attachments.map(a => ({ data: a.data, mimeType: a.mimeType }))
      });
    }

    setText('');
    setAttachments([]);
    setRows(1);
    await onSend(payloadString);
  }

  async function onPickFile(file: File | null) {
    if (!file) return;
    setError(null);

    // Limit attachment size approx (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string; 
      // result is a data URL like "data:image/png;base64,iVBORw0KGgo..."
      const split = result.split(',');
      const base64Data = split[1];
      const mimeType = file.type || 'application/octet-stream';

      setAttachments(prev => [
        ...prev,
        {
          data: base64Data,
          mimeType,
          name: file.name,
          previewUrl: result
        }
      ]);
    };
    reader.onerror = () => {
      setError('Failed to read file locally');
    };
    reader.readAsDataURL(file);
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

  const canSend = (text.trim().length > 0 || attachments.length > 0) && !busy;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 800,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* Interactive Chat Input Area */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 12,
          padding: '12px 16px',
          borderRadius: 32,
          background: isFocused
            ? 'rgba(30, 33, 44, 0.8)'
            : 'rgba(22, 24, 31, 0.6)',
          backdropFilter: 'blur(30px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(30px) saturate(1.5)',
          border: `1px solid ${
            isFocused
              ? 'rgba(99,102,241,0.6)'
              : 'rgba(255,255,255,0.1)'
          }`,
          boxShadow: isFocused
            ? '0 10px 40px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.05), 0 0 20px rgba(99,102,241,0.2)'
            : '0 4px 20px rgba(0,0,0,0.3)',
          transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          position: 'relative',
        }}
      >
        {/* Attachments Trigger */}
        <div style={{ position: 'relative' }} ref={attachmentsRef}>
          <button
            type="button"
            onClick={() => setAttachmentsOpen(!attachmentsOpen)}
            disabled={busy}
            title="Attach a file"
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: attachmentsOpen ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
              border: attachmentsOpen ? '1px solid rgba(99,102,241,0.5)' : '1px solid transparent',
              color: attachmentsOpen ? '#a5b4fc' : 'rgba(240,242,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: busy ? 'not-allowed' : 'pointer',
              opacity: busy ? 0.5 : 1,
              transition: 'all 0.2s',
              fontSize: 20,
            }}
            onMouseEnter={(e) => {
              if (!busy && !attachmentsOpen) {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.1)';
                el.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              if (!attachmentsOpen) {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.05)';
                el.style.color = 'rgba(240,242,255,0.5)';
              }
            }}
          >
            +
          </button>

          {/* Attachments Dropup Menu */}
          {attachmentsOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                marginBottom: 16,
                background: 'rgba(20, 22, 28, 0.95)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20,
                padding: '8px',
                zIndex: 1000,
                minWidth: 180,
                boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                animation: 'slideUp 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              {[
                { icon: '📄', label: 'Document', input: true, accept: '.pdf,.doc,.docx,.txt' },
                { icon: '🖼️', label: 'Image', input: true, accept: 'image/*' },
                { icon: '📷', label: 'Camera', input: false, action: () => { startCamera(); setAttachmentsOpen(false); } },
              ].map((item, idx) => (
                item.input ? (
                  <label
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      borderRadius: 12,
                      cursor: busy ? 'not-allowed' : 'pointer',
                      background: 'transparent',
                      transition: 'all 0.2s ease',
                      opacity: busy ? 0.5 : 1,
                      color: 'rgba(240,242,255,0.8)'
                    }}
                    onMouseEnter={(e) => {
                      if (!busy) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                    <input
                      type="file"
                      accept={item.accept}
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
                ) : (
                  <button
                    key={idx}
                    type="button"
                    onClick={item.action}
                    disabled={busy}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      borderRadius: 12,
                      cursor: busy ? 'not-allowed' : 'pointer',
                      background: 'transparent',
                      transition: 'all 0.2s ease',
                      opacity: busy ? 0.5 : 1,
                      border: 'none',
                      color: 'rgba(240,242,255,0.8)',
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      if (!busy) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                  </button>
                )
              ))}
            </div>
          )}
        </div>

        {/* Text Area and Attachments Stack */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <textarea
            ref={textareaRef}
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
            placeholder="Message AI Mentor..."
            disabled={busy}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'rgba(240,242,255,0.95)',
              fontSize: 16,
              lineHeight: 1.5,
              resize: 'none',
              fontFamily: "'Inter', sans-serif",
              padding: '8px 4px',
              minHeight: 40,
              maxHeight: 150,
            }}
          />

          {/* Attachments Preview Row */}
          {attachments.length > 0 && (
            <div style={{ display: 'flex', gap: 8, padding: '4px', overflowX: 'auto' }}>
              {attachments.map((att, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden'
                  }}
                  title={att.name}
                >
                  {att.mimeType.startsWith('image/') ? (
                    <img src={att.previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 20 }}>📄</span>
                  )}
                  <button
                    onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                    style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      border: 'none',
                      fontSize: 10,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Loading Indicator */}
        {uploadLoading && (
          <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center' }}>
            <span style={{ width: 16, height: 16, border: '2px solid rgba(99,102,241,0.3)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        )}

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          title="Send message"
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            background: canSend ? '#e0e7ff' : 'rgba(255,255,255,0.05)',
            color: canSend ? '#312e81' : 'rgba(255,255,255,0.2)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: canSend ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
            transform: canSend ? 'scale(1)' : 'scale(0.9)',
            boxShadow: canSend ? '0 4px 12px rgba(224,231,255,0.3)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (canSend) {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.05) translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (canSend) {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1) translateY(0)';
            }
          }}
        >
          {busy && !uploadLoading ? (
            <span style={{ width: 16, height: 16, border: '2px solid rgba(49, 46, 129, 0.3)', borderTopColor: '#312e81', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5"></line>
              <polyline points="5 12 12 5 19 12"></polyline>
            </svg>
          )}
        </button>
      </div>

      {/* Camera preview */}
      {cameraOn && (
        <div style={{ padding: '0 12px 12px' }}>
          <div style={{ position: 'relative', width: 'fit-content' }}>
            <video
              ref={videoRef}
              playsInline
              style={{
                borderRadius: 16,
                background: '#000',
                maxHeight: 240,
                objectFit: 'cover',
                border: '1px solid rgba(99,102,241,0.3)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
              }}
            />
            <button
              onClick={stopCamera}
              style={{
                position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ margin: '0 auto', padding: '10px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
          ⚠️ {error}
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
