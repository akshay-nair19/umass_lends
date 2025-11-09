/**
 * Borrow Request API Route
 * POST /api/items/:id/borrow - Submit a borrow request for an item
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseClient';
import { getUser } from '@/lib/getUser';
import { itemIdParamSchema, createBorrowRequestSchema } from '@/lib/schemas';
import { BorrowRequest, ApiResponse } from '@/lib/types';
import { addCorsHeaders, handleOptionsRequest } from '@/lib/cors';

/**
 * Handle OPTIONS request for CORS preflight
 */
export async function OPTIONS() {
  return handleOptionsRequest();
}

/**
 * POST /api/items/:id/borrow
 * Submit a borrow request for an item
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser(request);
    const body = await request.json();
    
    // Validate item ID
    const { id: itemId } = itemIdParamSchema.parse({ id: params.id });
    
    // Validate request body
    const validatedData = createBorrowRequestSchema.parse(body);
    
    const supabase = getSupabaseClient();
    
    // First, check if item exists and get owner
    const { data: item, error: itemError } = await supabase
      .from('items')
      .select('owner_id, available')
      .eq('id', itemId)
      .single();
    
    if (itemError || !item) {
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Item not found' },
        { status: 404 }
      );
      return addCorsHeaders(response);
    }
    
    // Check if item is available
    if (!item.available) {
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Item is not available for borrowing' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }
    
    // Check if user is trying to borrow their own item
    if (item.owner_id === user.id) {
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Cannot borrow your own item' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }
    
    // Check if there's already a pending request for this item by this user
    const { data: existingRequest } = await supabase
      .from('borrow_requests')
      .select('id')
      .eq('item_id', itemId)
      .eq('borrower_id', user.id)
      .eq('status', 'pending')
      .single();
    
    if (existingRequest) {
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'You already have a pending request for this item' },
        { status: 400 }
      );
      return addCorsHeaders(response);
    }
    
    // Note: We no longer calculate return_deadline_datetime here
    // The return deadline will be calculated when the lender marks the item as "picked up"
    // This ensures the countdown starts from the actual pickup time, not the requested start time
    // For now, we'll store the duration components and calculate the deadline when picked_up_at is set

    // Prepare insert data
    const insertData: any = {
      item_id: itemId,
      borrower_id: user.id,
      owner_id: item.owner_id,
      status: 'pending',
      borrow_start_date: validatedData.borrow_start_date,
      borrow_end_date: validatedData.borrow_end_date,
    };

    // Add optional duration fields if provided
    if (validatedData.startTime) {
      insertData.borrow_start_time = validatedData.startTime + ':00'; // Add seconds
    }
    if (validatedData.hours !== undefined) {
      insertData.borrow_duration_hours = validatedData.hours;
    }
    if (validatedData.minutes !== undefined) {
      insertData.borrow_duration_minutes = validatedData.minutes;
    }
    // Note: return_deadline_datetime will be calculated when the item is marked as picked up

    // Create borrow request
    const { data, error } = await supabase
      .from('borrow_requests')
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating borrow request:', error);
      const response = NextResponse.json<ApiResponse<null>>(
        { success: false, error: error.message },
        { status: 500 }
      );
      return addCorsHeaders(response);
    }
    
    const response = NextResponse.json<ApiResponse<BorrowRequest>>(
      { success: true, data: data as BorrowRequest },
      { status: 201 }
    );
    return addCorsHeaders(response);
  } catch (error: any) {
    console.error('Error in POST /api/items/:id/borrow:', error);
    
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
      { success: false, error: error.message || 'Failed to create borrow request' },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}

