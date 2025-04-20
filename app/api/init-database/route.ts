import { NextResponse } from "next/server"
import { createSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createSupabaseClient()

    // Check if tables exist
    const { data: tablesData, error: tablesError } = await supabase.from("users").select("count").limit(1)

    if (tablesError) {
      console.log("Tables don't exist yet, creating schema...")

      // Create tables based on the schema
      const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          role VARCHAR(50) DEFAULT 'user',
          subscription_tier VARCHAR(50) DEFAULT 'free',
          subscription_expires_at TIMESTAMP WITH TIME ZONE
        );
      `

      const createTemplatesTable = `
        CREATE TABLE IF NOT EXISTS templates (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          html TEXT NOT NULL,
          css TEXT,
          js TEXT,
          category VARCHAR(100) DEFAULT 'resume',
          is_premium BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          created_by INTEGER REFERENCES users(id)
        );
      `

      const createFilesTable = `
        CREATE TABLE IF NOT EXISTS files (
          id SERIAL PRIMARY KEY,
          filename VARCHAR(255) NOT NULL,
          original_filename VARCHAR(255) NOT NULL,
          file_path VARCHAR(512) NOT NULL,
          file_type VARCHAR(100) NOT NULL,
          file_size INTEGER NOT NULL,
          user_id INTEGER REFERENCES users(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `

      const createUserDocumentsTable = `
        CREATE TABLE IF NOT EXISTS user_documents (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) NOT NULL,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          document_type VARCHAR(50) NOT NULL,
          template_id INTEGER REFERENCES templates(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          is_public BOOLEAN DEFAULT false
        );
      `

      const createJobApplicationsTable = `
        CREATE TABLE IF NOT EXISTS job_applications (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) NOT NULL,
          company_name VARCHAR(255) NOT NULL,
          job_title VARCHAR(255) NOT NULL,
          job_description TEXT,
          application_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(50) DEFAULT 'applied',
          resume_id INTEGER REFERENCES user_documents(id),
          cover_letter_id INTEGER REFERENCES user_documents(id),
          notes TEXT
        );
      `

      const createUserProfilesTable = `
        CREATE TABLE IF NOT EXISTS user_profiles (
          user_id INTEGER PRIMARY KEY REFERENCES users(id),
          profile_picture VARCHAR(512),
          headline VARCHAR(255),
          summary TEXT,
          location VARCHAR(255),
          phone VARCHAR(50),
          website VARCHAR(255),
          linkedin VARCHAR(255),
          github VARCHAR(255),
          twitter VARCHAR(255)
        );
      `

      const createIndexes = `
        CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
        CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_documents_type ON user_documents(document_type);
        CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);
        CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
        CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
      `

      // Execute the SQL statements
      const { error: usersError } = await supabase.rpc("exec_sql", { sql: createUsersTable })
      if (usersError) return NextResponse.json({ error: usersError.message }, { status: 500 })

      const { error: templatesError } = await supabase.rpc("exec_sql", { sql: createTemplatesTable })
      if (templatesError) return NextResponse.json({ error: templatesError.message }, { status: 500 })

      const { error: filesError } = await supabase.rpc("exec_sql", { sql: createFilesTable })
      if (filesError) return NextResponse.json({ error: filesError.message }, { status: 500 })

      const { error: documentsError } = await supabase.rpc("exec_sql", { sql: createUserDocumentsTable })
      if (documentsError) return NextResponse.json({ error: documentsError.message }, { status: 500 })

      const { error: applicationsError } = await supabase.rpc("exec_sql", { sql: createJobApplicationsTable })
      if (applicationsError) return NextResponse.json({ error: applicationsError.message }, { status: 500 })

      const { error: profilesError } = await supabase.rpc("exec_sql", { sql: createUserProfilesTable })
      if (profilesError) return NextResponse.json({ error: profilesError.message }, { status: 500 })

      const { error: indexesError } = await supabase.rpc("exec_sql", { sql: createIndexes })
      if (indexesError) return NextResponse.json({ error: indexesError.message }, { status: 500 })

      return NextResponse.json({
        success: true,
        message: "Database schema created successfully",
      })
    }

    return NextResponse.json({
      success: true,
      message: "Database schema already exists",
    })
  } catch (error: any) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Error initializing database",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

