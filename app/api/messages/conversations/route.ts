/**
 * Conversations API Routes
 * GET /api/messages/conversations?itemId=xxx - Get list of conversations for an item (owner only)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { getUser } from '@/lib/getUser';
import { messagesQuerySchema } from '@/lib/schemas';
import { ApiResponse } from '@/lib/types';
import { addCorsHeaders, handleOptionsRequest } from '@/lib/cors';

/**
 * Handle OPTIONS request for CORS preflight
 */
export async function OPTIONS() {
  return handleOptionsRequest();
}

/**
 * GET /api/messages/conversations?itemId=xxx
 * Get list of conversations for an item (owner only)
 * Returns list of borrowers who have messaged, with unread message counts
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getUser(request);
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    
    // Validate query parameter
    if (!itemId) {
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'itemId query parameter is required' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }
    
    const validatedQuery = messagesQuerySchema.parse({ itemId });
    const supabase = getSupabaseClient();
    
    // Get the item owner
    const { data: item, error: itemError } = await supabase
      .from('items')
      .select('owner_id')
      .eq('id', validatedQuery.itemId)
      .single();
    
    if (itemError || !item) {
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
      return addCorsHeaders(response);
    }
    
    // Only owners can see conversations list
    if (user.id !== item.owner_id) {
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Only item owners can view conversations list' },
        { status: 403 }
      );
      return addCorsHeaders(response);
    }
    
    // Get all messages for this item
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('item_id', validatedQuery.itemId)
      .order('created_at', { ascending: false });
    
    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: messagesError.message },
        { status: 500 }
      );
      return addCorsHeaders(response);
    }
    
    if (!messages || messages.length === 0) {
      const response = NextResponse.json<ApiResponse<any[]>>(
        { success: true, data: [] },
        { status: 200 }
      );
      return addCorsHeaders(response);
    }
    
    // Group messages by participant (borrower)
    const conversationsMap = new Map<string, {
      participant_id: string;
      messages: any[];
      last_message_at: string;
      unread_count: number;
    }>();
    
    messages.forEach((msg: any) => {
      // For owner, the participant is the other person (borrower)
      const participantId = msg.sender_id === user.id ? msg.participant_id : msg.sender_id;
      
      if (!conversationsMap.has(participantId)) {
        conversationsMap.set(participantId, {
          participant_id: participantId,
          messages: [],
          last_message_at: msg.created_at,
          unread_count: 0,
        });
      }
      
      const conversation = conversationsMap.get(participantId)!;
      conversation.messages.push(msg);
      
      // Update last message time
      if (new Date(msg.created_at) > new Date(conversation.last_message_at)) {
        conversation.last_message_at = msg.created_at;
      }
    });
    
    // Calculate unread count for each conversation
    // Unread = messages from borrower after the last message from owner
    for (const [participantId, conversation] of conversationsMap.entries()) {
      // Sort messages by created_at descending
      conversation.messages.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      // Find the last message sent by the owner
      const lastOwnerMessage = conversation.messages.find(
        (msg: any) => msg.sender_id === user.id
      );
      
      if (lastOwnerMessage) {
        // Count messages from borrower after the last owner message
        conversation.unread_count = conversation.messages.filter((msg: any) => {
          return msg.sender_id !== user.id && 
                 new Date(msg.created_at) > new Date(lastOwnerMessage.created_at);
        }).length;
      } else {
        // No owner messages yet, all borrower messages are unread
        conversation.unread_count = conversation.messages.filter(
          (msg: any) => msg.sender_id !== user.id
        ).length;
      }
    }
    
    // Get user information for all participants (including profile pictures)
    const participantIds = Array.from(conversationsMap.keys());
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, name, profile_picture_url')
      .in('id', participantIds);
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
    }
    
    // Create a map of user ID to user info
    const usersMap = new Map<string, { name?: string; email?: string; profile_picture_url?: string }>();
    users?.forEach((u: any) => {
      usersMap.set(u.id, { name: u.name, email: u.email, profile_picture_url: u.profile_picture_url });
    });
    
    // Transform conversations to include user info and sort by last message time
    const conversations = Array.from(conversationsMap.values())
      .map((conv) => {
        const userInfo = usersMap.get(conv.participant_id);
        return {
          participant_id: conv.participant_id,
          participant_name: userInfo?.name || userInfo?.email || 'Unknown User',
          participant_email: userInfo?.email || '',
          participant_profile_picture_url: userInfo?.profile_picture_url || null,
          last_message_at: conv.last_message_at,
          unread_count: conv.unread_count,
          last_message_text: conv.messages[0]?.text || '',
        };
      })
      .sort((a, b) => 
        new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
      );
    
    const response = NextResponse.json<ApiResponse<any[]>>(
      { success: true, data: conversations },
      { status: 200 }
    );
    return addCorsHeaders(response);
  } catch (error: any) {
    console.error('Error in GET /api/messages/conversations:', error);
    
    // Handle authentication errors
    if (error.message?.includes('Unauthorized')) {
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: error.message },
        { status: 401 }
      );
      return addCorsHeaders(response);
    }
    
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }
    
    const response = NextResponse.json<ApiResponse<null>>(
      { success: false, error: error.message || 'Failed to fetch conversations' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}

