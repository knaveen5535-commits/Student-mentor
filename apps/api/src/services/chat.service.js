import { getSupabaseAdmin } from './supabase.service.js';
import { generateChatCompletion } from './ai.service.js';

// In-memory store for chat threads (fallback if Supabase not available)
const inMemoryThreads = new Map();

/**
 * Get or create user by email (with Supabase fallback)
 */
async function getOrCreateUserByEmail(email) {
  const trimmedEmail = email.trim();

  try {
    const supabase = getSupabaseAdmin();

    // Try to find existing user
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('id, email, name')
      .eq('email', trimmedEmail)
      .maybeSingle();

    if (!selectError && existingUser) {
      return existingUser;
    }

    // Try to create user if doesn't exist
    const userName = trimmedEmail.split('@')[0];
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email: trimmedEmail,
        name: userName,
        avatar_url: null
      })
      .select('id, email, name')
      .single();

    if (!insertError && newUser) {
      return newUser;
    }

    // If Supabase fails, return a mock user
    return {
      id: `user_${Date.now()}`,
      email: trimmedEmail,
      name: userName
    };
  } catch (err) {
    // Fallback to mock user if Supabase is unavailable
    console.warn('Supabase user lookup failed, using mock user:', err.message);
    return {
      id: `user_${Date.now()}`,
      email: trimmedEmail,
      name: trimmedEmail.split('@')[0]
    };
  }
}

/**
 * Get user by email
 */
async function getUserByEmail(email) {
  return getOrCreateUserByEmail(email);
}

/**
 * Get or create a chat thread for a user
 */
async function getOrCreateThread(userId, threadId) {
  // If threadId provided, try to get it or create it if missing
  if (threadId) {
    // Check in-memory store first
    let thread = inMemoryThreads.get(threadId);
    if (thread) {
      return thread;
    }

    // If not in memory and no Supabase, create it in memory
    thread = {
      id: threadId,
      userId,
      messages: [],
      createdAt: new Date()
    };
    inMemoryThreads.set(threadId, thread);
    return thread;
  }

  // If no threadId provided, create a new one
  const newThreadId = `thread_${Date.now()}`;
  const thread = {
    id: newThreadId,
    userId,
    messages: [],
    createdAt: new Date()
  };
  inMemoryThreads.set(newThreadId, thread);
  return thread;
}

/**
 * Get messages for a thread
 */
async function getThreadMessages(threadId) {
  // Check in-memory store first
  const thread = inMemoryThreads.get(threadId);
  if (thread) {
    return thread.messages;
  }

  // Try Supabase as fallback
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, role, content, created_at')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn('Supabase message fetch failed:', err.message);
  }

  return [];
}

/**
 * Add message to thread
 */
async function addMessageToThread(threadId, userId, role, content) {
  // Add to in-memory store
  const thread = inMemoryThreads.get(threadId);
  if (thread) {
    const message = {
      id: `msg_${Date.now()}`,
      role,
      content,
      created_at: new Date()
    };
    thread.messages.push(message);
    return message;
  }

  // Try Supabase as fallback
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        thread_id: threadId,
        user_id: userId,
        role,
        content
      })
      .select('id, role, content, created_at')
      .single();

    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.warn('Supabase message insert failed:', err.message);
  }

  // Just return the message for in-memory use
  return {
    id: `msg_${Date.now()}`,
    role,
    content,
    created_at: new Date()
  };
}

/**
 * Process and save a chat message
 */
export async function processChatMessage({ userEmail, threadId, userMessage }) {
  try {
    // Get or create user
    const user = await getUserByEmail(userEmail);
    const userId = user.id;

    // Get or create thread
    const thread = await getOrCreateThread(userId, threadId);

    // Add user message to thread
    await addMessageToThread(thread.id, userId, 'user', userMessage);

    // Get all messages in thread for context
    const messages = await getThreadMessages(thread.id);

    // Generate AI response
    const assistantMessage = await generateChatCompletion({
      messages: messages.map((m) => ({ role: m.role, content: m.content }))
    });

    // Add assistant message to thread
    await addMessageToThread(thread.id, userId, 'assistant', assistantMessage.content);

    return {
      threadId: thread.id,
      message: assistantMessage
    };
  } catch (err) {
    console.error('Chat message processing error:', err);
    throw err;
  }
}

/**
 * Get all threads for a user
 */
export async function getUserThreads(userEmail) {
  try {
    const user = await getUserByEmail(userEmail);
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('chat_threads')
      .select('id, title, created_at, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      throw Object.assign(new Error(error.message), { status: 400 });
    }

    return data || [];
  } catch (err) {
    throw err;
  }
}

/**
 * Get thread details with messages
 */
export async function getThreadDetails(userEmail, threadId) {
  try {
    const user = await getUserByEmail(userEmail);
    const supabase = getSupabaseAdmin();

    // Verify thread belongs to user
    const { data: thread, error: threadError } = await supabase
      .from('chat_threads')
      .select('id, title, created_at')
      .eq('id', threadId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (threadError) {
      throw Object.assign(new Error(threadError.message), { status: 400 });
    }

    if (!thread) {
      throw Object.assign(new Error('Thread not found'), { status: 404 });
    }

    // Get messages
    const messages = await getThreadMessages(threadId);

    return {
      ...thread,
      messages
    };
  } catch (err) {
    throw err;
  }
}

export { getOrCreateThread, getThreadMessages, addMessageToThread, getUserByEmail };
