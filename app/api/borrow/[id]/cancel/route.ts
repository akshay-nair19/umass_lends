/**
 * Cancel Borrow Request API Route
 * POST /api/borrow/:id/cancel - Cancel a borrow request (only the borrower can cancel their own request)
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { getUser } from '@/lib/getUser';
import { borrowIdParamSchema } from '@/lib/schemas';
import { BorrowRequest, ApiResponse } from '@/lib/types';
import { addCorsHeaders, handleOptionsRequest } from '@/lib/cors';

/**
 * Handle OPTIONS request for CORS preflight
 */
export async function OPTIONS() {
  return handleOptionsRequest();
}

/**
 * POST /api/borrow/:id/cancel
 * Cancel a borrow request (only the borrower can cancel their own request)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser(request);
    
    // Validate borrow request ID
    const { id: requestId } = borrowIdParamSchema.parse({ id: params.id });
    
    const supabase = getSupabaseClient();
    
    // Get the borrow request
    const { data: borrowRequest, error: fetchError } = await supabase
      .from('borrow_requests')
      .select('*')
      .eq('id', requestId)
      .single();
    
    if (fetchError || !borrowRequest) {
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Borrow request not found' },
        { status: 404 }
      );
      return addCorsHeaders(response);
    }
    
    // Check if user is the borrower
    if (borrowRequest.borrower_id !== user.id) {
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Only the borrower can cancel their own request' },
        { status: 403 }
      );
      return addCorsHeaders(response);
    }
    
    // Check if request can be cancelled (only pending requests can be cancelled)
    if (borrowRequest.status !== 'pending') {
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: `Cannot cancel request. Request status is: ${borrowRequest.status}` },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }
    
    // Delete the borrow request (or update status to 'cancelled' if you want to keep history)
    // For now, we'll delete it since it's still pending
    const { error: deleteError } = await supabase
      .from('borrow_requests')
      .delete()
      .eq('id', requestId);
    
    if (deleteError) {
      console.error('Error cancelling borrow request:', deleteError);
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: deleteError.message },
        { status: 500 }
      );
      return addCorsHeaders(response);
    }
    
    const response = NextResponse.json<ApiResponse<null>>(
      { success: true, data: null },
      { status: 200 }
    );
    return addCorsHeaders(response);
  } catch (error: any) {
    console.error('Error in POST /api/borrow/:id/cancel:', error);
    
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
      { success: false, error: error.message || 'Failed to cancel borrow request' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}

