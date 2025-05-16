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
      user_type text check (user_type in ('individual', 'corporate')) default 'individual',
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
      plan_type text not null check (plan_type in ('free', 'premium', 'professional', 'corporate')),
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

  // Create profiles table
  const { error: profilesError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "profiles",
    columns: `
      id uuid primary key default uuid_generate_v4(),
      user_id uuid references auth.users(id) on delete cascade unique,
      profile_data jsonb not null default '{}',
      profile_score integer default 0,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    `,
  })

  if (profilesError) {
    console.error("Error creating profiles table:", profilesError)
  }

  // Create resume_templates table
  const { error: templatesError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "resume_templates",
    columns: `
      id uuid primary key default uuid_generate_v4(),
      name text not null,
      description text,
      html_content text not null,
      css_content text not null,
      category text not null,
      thumbnail_url text,
      is_premium boolean default false,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    `,
  })

  if (templatesError) {
    console.error("Error creating resume_templates table:", templatesError)
  }

  // Create resumes table
  const { error: resumesError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "resumes",
    columns: `
      id uuid primary key default uuid_generate_v4(),
      user_id uuid references auth.users(id) on delete cascade,
      template_id uuid references resume_templates(id),
      resume_data jsonb not null default '{}',
      html_content text,
      name text not null,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    `,
  })

  if (resumesError) {
    console.error("Error creating resumes table:", resumesError)
  }

  // Create jobs table
  const { error: jobsError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "jobs",
    columns: `
      id uuid primary key default uuid_generate_v4(),
      company_id uuid references auth.users(id) on delete cascade,
      title text not null,
      company_name text not null,
      location text not null,
      job_type text not null,
      salary_range text,
      description text not null,
      requirements text not null,
      is_active boolean default true,
      is_premium boolean default false,
      application_url text,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    `,
  })

  if (jobsError) {
    console.error("Error creating jobs table:", jobsError)
  }

  // Create job_applications table
  const { error: applicationsError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "job_applications",
    columns: `
      id uuid primary key default uuid_generate_v4(),
      job_id uuid references jobs(id) on delete cascade,
      user_id uuid references auth.users(id) on delete cascade,
      resume_id uuid references resumes(id),
      cover_letter_id uuid,
      status text not null default 'pending' check (status in ('pending', 'reviewed', 'interview', 'rejected', 'accepted')),
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    `,
  })

  if (applicationsError) {
    console.error("Error creating job_applications table:", applicationsError)
  }

  // Create companies table
  const { error: companiesError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "companies",
    columns: `
      id uuid primary key default uuid_generate_v4(),
      user_id uuid references auth.users(id) on delete cascade unique,
      name text not null,
      industry text,
      size text,
      website text,
      logo_url text,
      description text,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    `,
  })

  if (companiesError) {
    console.error("Error creating companies table:", companiesError)
  }

  // Create interviews table
  const { error: interviewsError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "interviews",
    columns: `
      id uuid primary key default uuid_generate_v4(),
      job_application_id uuid references job_applications(id) on delete cascade,
      scheduled_date timestamp with time zone not null,
      interview_type text not null,
      notes text,
      status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    `,
  })

  if (interviewsError) {
    console.error("Error creating interviews table:", interviewsError)
  }

  console.log("Schema creation completed")
}

// Uncomment to run
// createSchema()
