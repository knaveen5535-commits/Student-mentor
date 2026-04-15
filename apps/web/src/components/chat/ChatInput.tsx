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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { upload, loading: uploadLoading } = useUpload();
  const busy = !!disabled || uploadLoading;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      const lineCount = (text.match(/\n/g) || []).length + 1;
      setRows(Math.min(Math.max(lineCount, 1), 5));
    }
  }, [text]);

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
          ? 'rgba(30,33,44,0.95)'
          : 'rgba(22,24,31,0.9)',
        border: `1.5px solid ${
          isFocused
            ? 'rgba(99,102,241,0.5)'
            : 'rgba(255,255,255,0.07)'
        }`,
        boxShadow: isFocused
          ? '0 0 0 4px rgba(99,102,241,0.1), 0 12px 32px rgba(0,0,0,0.3)'
          : '0 4px 16px rgba(0,0,0,0.2)',
        transition: 'all 0.25s ease',
        overflow: 'hidden',
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
          padding: '14px 16px 8px',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: 'rgba(240,242,255,0.9)',
          fontSize: 14,
          lineHeight: 1.6,
          resize: 'none',
          fontFamily: "'Inter', sans-serif",
          boxSizing: 'border-box',
          minHeight: 52,
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
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {/* Left actions */}
        <div style={{ display: 'flex', gap: 6, flex: 1, flexWrap: 'wrap' }}>
          {/* File upload */}
          <label
            title="Upload file"
            style={{
              padding: '7px 12px',
              fontSize: 12,
              fontWeight: 500,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(240,242,255,0.55)',
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
                el.style.background = 'rgba(255,255,255,0.1)';
                el.style.color = 'rgba(240,242,255,0.85)';
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(255,255,255,0.05)';
              el.style.color = 'rgba(240,242,255,0.55)';
            }}
          >
            📎 File
            <input
              type="file"
              style={{ display: 'none' }}
              disabled={busy}
              onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
            />
          </label>

          {/* Camera */}
          {!cameraOn ? (
            <button
              id="chat-camera-btn"
              type="button"
              onClick={startCamera}
              disabled={busy}
              style={{
                padding: '7px 12px',
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(240,242,255,0.55)',
                cursor: busy ? 'not-allowed' : 'pointer',
                opacity: busy ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!busy) {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'rgba(255,255,255,0.1)';
                  el.style.color = 'rgba(240,242,255,0.85)';
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = 'rgba(255,255,255,0.05)';
                el.style.color = 'rgba(240,242,255,0.55)';
              }}
            >
              📷 Camera
            </button>
          ) : (
            <>
              <button
                id="chat-capture-btn"
                type="button"
                onClick={capture}
                disabled={busy || !canCapture}
                style={{
                  padding: '7px 12px',
                  fontSize: 12,
                  fontWeight: 500,
                  borderRadius: 8,
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.25)',
                  color: '#34d399',
                  cursor: busy ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!busy) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.18)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.1)';
                }}
              >
                ✅ Capture
              </button>
              <button
                id="chat-stop-camera-btn"
                type="button"
                onClick={stopCamera}
                style={{
                  padding: '7px 12px',
                  fontSize: 12,
                  fontWeight: 500,
                  borderRadius: 8,
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#f87171',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.18)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
                }}
              >
                ❌ Stop
              </button>
            </>
          )}

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
            border: 'none',
            background: canSend
              ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
              : 'rgba(99,102,241,0.15)',
            color: canSend ? '#fff' : 'rgba(240,242,255,0.3)',
            cursor: canSend ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            boxShadow: canSend ? '0 4px 16px rgba(99,102,241,0.35)' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            if (canSend) {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(-1px) scale(1.03)';
              el.style.boxShadow = '0 8px 24px rgba(99,102,241,0.5)';
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(0) scale(1)';
            el.style.boxShadow = canSend ? '0 4px 16px rgba(99,102,241,0.35)' : 'none';
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
