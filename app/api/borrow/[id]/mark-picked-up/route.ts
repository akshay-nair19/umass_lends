/**
 * Mark Picked Up API Route
 * POST /api/borrow/:id/mark-picked-up - Mark that an item has been picked up
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
 * POST /api/borrow/:id/mark-picked-up
 * Mark that an item has been picked up (only the owner can mark as picked up)
 * This starts the countdown timer by calculating return_deadline_datetime from picked_up_at + duration
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
    
    // Check if user is the owner
    if (borrowRequest.owner_id !== user.id) {
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Only the item owner can mark items as picked up' },
        { status: 403 }
      );
      return addCorsHeaders(response);
    }
    
    // Check if request is approved (can only mark picked up if it was approved)
    if (borrowRequest.status !== 'approved') {
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: `Cannot mark as picked up. Request status is: ${borrowRequest.status}` },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }
    
    // Check if already picked up
    if (borrowRequest.picked_up_at) {
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Item has already been marked as picked up' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }
    
    // Set picked_up_at to current time
    const pickedUpAt = new Date();
    
    // Calculate return deadline from picked_up_at + duration
    // Get duration components
    const hours = borrowRequest.borrow_duration_hours || 0;
    const minutes = borrowRequest.borrow_duration_minutes || 0;
    const days = 0; // For now, we only support hours and minutes
    const months = 0;
    
    // Create return datetime by adding duration to picked_up_at
    const returnDateTime = new Date(pickedUpAt);
    
    // Add duration components
    if (months > 0) {
      returnDateTime.setMonth(returnDateTime.getMonth() + months);
    }
    if (days > 0) {
      returnDateTime.setDate(returnDateTime.getDate() + days);
    }
    returnDateTime.setHours(returnDateTime.getHours() + hours);
    returnDateTime.setMinutes(returnDateTime.getMinutes() + minutes);
    
    // Format as local time string (YYYY-MM-DDTHH:mm:ss) to avoid timezone conversion
    const endYear = returnDateTime.getFullYear();
    const endMonth = String(returnDateTime.getMonth() + 1).padStart(2, '0');
    const endDay = String(returnDateTime.getDate()).padStart(2, '0');
    const endHour = String(returnDateTime.getHours()).padStart(2, '0');
    const endMinute = String(returnDateTime.getMinutes()).padStart(2, '0');
    const endSecond = String(returnDateTime.getSeconds()).padStart(2, '0');
    const returnDeadlineDatetime = `${endYear}-${endMonth}-${endDay}T${endHour}:${endMinute}:${endSecond}`;
    
    // Format picked_up_at as local time string
    const pickedUpYear = pickedUpAt.getFullYear();
    const pickedUpMonth = String(pickedUpAt.getMonth() + 1).padStart(2, '0');
    const pickedUpDay = String(pickedUpAt.getDate()).padStart(2, '0');
    const pickedUpHour = String(pickedUpAt.getHours()).padStart(2, '0');
    const pickedUpMinute = String(pickedUpAt.getMinutes()).padStart(2, '0');
    const pickedUpSecond = String(pickedUpAt.getSeconds()).padStart(2, '0');
    const pickedUpAtString = `${pickedUpYear}-${pickedUpMonth}-${pickedUpDay}T${pickedUpHour}:${pickedUpMinute}:${pickedUpSecond}`;
    
    // Update borrow request with picked_up_at and recalculated return_deadline_datetime
    const { data: updatedRequest, error: updateError } = await supabase
      .from('borrow_requests')
      .update({ 
        picked_up_at: pickedUpAtString,
        return_deadline_datetime: returnDeadlineDatetime
      })
      .eq('id', requestId)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error marking item as picked up:', updateError);
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: updateError.message },
        { status: 500 }
      );
      return addCorsHeaders(response);
    }
    
    const response = NextResponse.json<ApiResponse<BorrowRequest>>(
      { success: true, data: updatedRequest as BorrowRequest },
      { status: 200 }
    );
    return addCorsHeaders(response);
  } catch (error: any) {
    console.error('Error in POST /api/borrow/:id/mark-picked-up:', error);
    
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
      { success: false, error: error.message || 'Failed to mark item as picked up' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}

