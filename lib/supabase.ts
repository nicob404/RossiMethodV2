import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { type CookieOptions } from '@supabase/auth-helpers-shared'
import { type Database } from '@/types/supabase'

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const createClientComponentClient = () => createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const createServerClient = (cookies: () => CookieOptions) =>
  createServerComponentClient<Database>({ cookies })

export const createActionClient = (cookies: () => CookieOptions) =>
  createServerActionClient<Database>({ cookies })
