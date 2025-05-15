import { createClient } from "@supabase/supabase-js"

// This file is for reference only and should be run once to set up the database schema
// It's not used in the application code

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createSchema() {
  // Create users table
  const { error: usersError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "users",
    columns: `
      id uuid primary key references auth.users(id) on delete cascade,
      email text unique not null,
      name text,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    `,
  })

  if (usersError) {
    console.error("Error creating users table:", usersError)
  }

  // Create subscriptions table
  const { error: subscriptionsError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "subscriptions",
    columns: `
      id uuid primary key default uuid_generate_v4(),
      user_id uuid references auth.users(id) on delete cascade,
      plan_type text not null check (plan_type in ('free', 'premium', 'professional')),
      active boolean default true,
      start_date timestamp with time zone default now(),
      next_billing_date timestamp with time zone,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    `,
  })

  if (subscriptionsError) {
    console.error("Error creating subscriptions table:", subscriptionsError)
  }

  // Create usage table
  const { error: usageError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "usage",
    columns: `
      id uuid primary key default uuid_generate_v4(),
      user_id uuid references auth.users(id) on delete cascade,
      resumes_used integer default 0,
      cover_letters_used integer default 0,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    `,
  })

  if (usageError) {
    console.error("Error creating usage table:", usageError)
  }

  // Create functions for incrementing usage
  const incrementResumeUsageFunction = `
    create or replace function increment_resume_usage(user_id uuid)
    returns void as $$
    begin
      insert into usage (user_id, resumes_used)
      values (user_id, 1)
      on conflict (user_id)
      do update set resumes_used = usage.resumes_used + 1, updated_at = now();
    end;
    $$ language plpgsql;
  `

  const { error: resumeFunctionError } = await supabase.rpc("run_sql", {
    sql: incrementResumeUsageFunction,
  })

  if (resumeFunctionError) {
    console.error("Error creating increment_resume_usage function:", resumeFunctionError)
  }

  const incrementCoverLetterUsageFunction = `
    create or replace function increment_cover_letter_usage(user_id uuid)
    returns void as $$
    begin
      insert into usage (user_id, cover_letters_used)
      values (user_id, 1)
      on conflict (user_id)
      do update set cover_letters_used = usage.cover_letters_used + 1, updated_at = now();
    end;
    $$ language plpgsql;
  `

  const { error: coverLetterFunctionError } = await supabase.rpc("run_sql", {
    sql: incrementCoverLetterUsageFunction,
  })

  if (coverLetterFunctionError) {
    console.error("Error creating increment_cover_letter_usage function:", coverLetterFunctionError)
  }

  console.log("Schema creation completed")
}

// Uncomment to run
// createSchema()
