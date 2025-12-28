
import { createClient } from 'npm:@supabase/supabase-js';


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}


Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing auth header' }), { status: 401, headers: corsHeaders })
    }

    const token = authHeader.replace('Bearer ', '')

    // Get request body first (before auth check to avoid parsing issues)
    let body
    try {
      body = await req.json()
    } catch (parseError) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAdmin = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create client with anon key and user's token for verification
    // Anon key is available in Edge Functions environment
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader }
      }
    })

    // Verify JWT token by getting current user
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser()

    if (authError || !user) {
      console.error('Token verification error:', authError)
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token', details: authError?.message }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if user is admin
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('role, email, id')
      .eq('id', user.id)
      .single()

    console.log('User profile check:', { 
      userId: user.id, 
      userEmail: user.email,
      profileError: profileError?.message,
      userProfile: userProfile,
      role: userProfile?.role
    })

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      return new Response(
        JSON.stringify({ 
          error: 'Error checking user permissions',
          details: profileError.message 
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (!userProfile) {
      return new Response(
        JSON.stringify({ 
          error: 'User profile not found',
          details: 'User exists in auth but not in users table'
        }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (userProfile.role !== 'admin') {
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized: Admin access required',
          details: `User role is '${userProfile.role}', expected 'admin'`
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Extract data from body
    const { email, password, full_name, role = 'user' } = body

    // Validate input
    if (!email || !password || !full_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, password, full_name' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create user in auth.users
    const { data: authData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name,
        role
      }
    })

    if (createUserError) {
      return new Response(
        JSON.stringify({ error: createUserError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Upsert user profile in public.users (INSERT ... ON CONFLICT DO UPDATE)
    // This handles race conditions with the trigger and ensures all fields (including role) are set correctly
    const { error: upsertError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: authData.user.id,
        email: authData.user.email,
        full_name,
        role,
        active: 0 // New users start inactive, admin can activate later
      }, {
        onConflict: 'id'
      })

    if (upsertError) {
      console.error('Error upserting user profile:', upsertError)
      return new Response(
        JSON.stringify({ error: `User created but profile update failed: ${upsertError.message}` }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({
        user: {
          id: authData.user.id,
          email: authData.user.email,
          full_name,
          role
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in add-user function:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: errorMessage
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})