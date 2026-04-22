'use client';

import type { ChatMessage as Msg } from '../../store/chatStore';

export function ChatMessage({ msg }: { msg: Msg }) {
  const isUser = msg.role === 'user';
  const time = new Date(msg.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
        gap: 10,
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
            overflow: 'hidden'
          }}
        >
          <img src="/assets/ai_logo.png" alt="AI Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Bubble + timestamp */}
      <div
        style={{
          maxWidth: 'min(620px, 78%)',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          alignItems: isUser ? 'flex-end' : 'flex-start',
        }}
      >
        {/* Sender label */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.05em',
            color: isUser
              ? 'rgba(165,180,252,0.7)'
              : 'rgba(139,92,246,0.7)',
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          {isUser ? 'You' : 'AI Mentor'}
        </div>

        {/* Bubble */}
        <div
          style={{
            padding: '12px 16px',
            borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            background: isUser
              ? 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)'
              : 'rgba(30, 33, 44, 0.5)',
            backdropFilter: isUser ? 'none' : 'blur(30px)',
            WebkitBackdropFilter: isUser ? 'none' : 'blur(30px)',
            border: isUser
              ? '1px solid rgba(255,255,255,0.2)'
              : '1px solid rgba(255,255,255,0.15)',
            boxShadow: isUser
              ? 'inset 0 1px 0 rgba(255,255,255,0.3), 0 8px 20px rgba(99,102,241,0.3)'
              : 'inset 0 1px 0 rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.2)',
            color: isUser ? '#fff' : 'rgba(240,242,255,0.95)',
            lineHeight: 1.65,
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            fontSize: 14,
          }}
        >
          {(() => {
            try {
              const parsed = JSON.parse(msg.content);
              if (parsed.text !== undefined || parsed.attachments !== undefined) {
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {parsed.text && <div>{parsed.text}</div>}
                    {parsed.attachments && Array.isArray(parsed.attachments) && parsed.attachments.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: parsed.text ? 4 : 0 }}>
                        {parsed.attachments.map((att: any, idx: number) => {
                          const isImage = att.mimeType && att.mimeType.startsWith('image/');
                          const src = `data:${att.mimeType || 'application/octet-stream'};base64,${att.data}`;
                          return (
                            <div
                              key={idx}
                              style={{
                                borderRadius: 8,
                                overflow: 'hidden',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: isImage ? 0 : '8px 12px',
                                maxWidth: '100%'
                              }}
                            >
                              {isImage ? (
                                <img
                                  src={src}
                                  alt="attachment"
                                  style={{
                                    maxWidth: 240,
                                    maxHeight: 240,
                                    objectFit: 'contain',
                                    borderRadius: 8
                                  }}
                                />
                              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>
                                  <span style={{ fontSize: 24 }}>📄</span>
                                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 500 }}>Document Attached</span>
                                    <span style={{ fontSize: 11, opacity: 0.7 }}>File format: {att.mimeType?.split('/')[1] || 'Unknown'}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              return msg.content;
            } catch {
              return msg.content;
            }
          })()}
        </div>

        {/* Timestamp */}
        <div
          style={{
            fontSize: 11,
            color: 'rgba(240,242,255,0.25)',
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          {time}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))',
            border: '1px solid rgba(99,102,241,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            flexShrink: 0,
          }}
        >
          👤
        </div>
      )}
    </div>
  );
}
