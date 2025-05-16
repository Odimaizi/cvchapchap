-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  user_type TEXT CHECK (user_type IN ('individual', 'corporate')) DEFAULT 'individual',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'premium', 'professional', 'corporate')),
  active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_billing_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage table
CREATE TABLE IF NOT EXISTS usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resumes_used INTEGER DEFAULT 0,
  cover_letters_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resume templates table
CREATE TABLE IF NOT EXISTS resume_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  html_content TEXT NOT NULL,
  css_content TEXT,
  category TEXT NOT NULL,
  thumbnail_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES resume_templates(id),
  resume_data JSONB NOT NULL DEFAULT '{}',
  html_content TEXT,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  industry TEXT,
  size TEXT,
  website TEXT,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  location TEXT NOT NULL,
  job_type TEXT NOT NULL,
  salary_range TEXT,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_premium BOOLEAN DEFAULT FALSE,
  application_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES resumes(id),
  cover_letter_id UUID,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'interview', 'rejected', 'accepted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample data for resume_templates
INSERT INTO resume_templates (id, name, description, html_content, css_content, category, thumbnail_url, is_premium)
VALUES 
(
  uuid_generate_v4(),
  'Modern Professional',
  'A clean and modern template for professionals',
  '<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: "Helvetica Neue", Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
      line-height: 1.5;
    }
    .resume-header {
      text-align: center;
      margin-bottom: 20px;
    }
    h1 {
      margin: 0;
      color: #2a3f5f;
      font-size: 28px;
    }
    .contact-info {
      margin: 10px 0;
      font-size: 14px;
    }
    .section {
      margin-bottom: 20px;
    }
    .section-title {
      border-bottom: 2px solid #2a3f5f;
      padding-bottom: 5px;
      margin-bottom: 10px;
      color: #2a3f5f;
      font-size: 18px;
    }
    .job-title, .institution {
      font-weight: bold;
    }
    .employer, .degree {
      font-style: italic;
    }
    .dates {
      float: right;
      font-size: 14px;
    }
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      list-style-type: none;
      padding: 0;
    }
    .skill {
      background-color: #f0f0f0;
      padding: 5px 10px;
      border-radius: 3px;
      font-size: 14px;
    }
    .experience-item, .education-item {
      margin-bottom: 15px;
    }
    .reference-item {
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="resume-header">
    <h1>{FULL_NAME}</h1>
    <p class="contact-info">{CITY}, {COUNTY}, {POSTCODE} | {PHONE} | {EMAIL}</p>
    <p>{TAGLINE}</p>
  </div>
  
  <div class="section">
    <h2 class="section-title">Professional Summary</h2>
    <p>{PROFESSIONAL_SUMMARY}</p>
  </div>
  
  <div class="section">
    <h2 class="section-title">Work Experience</h2>
    {WORK_EXPERIENCE}
  </div>
  
  <div class="section">
    <h2 class="section-title">Education</h2>
    {EDUCATION}
  </div>
  
  <div class="section">
    <h2 class="section-title">Skills</h2>
    <div class="skills-list">
      {SKILLS}
    </div>
  </div>
  
  <div class="section">
    <h2 class="section-title">Achievements</h2>
    <ul>
      {ACHIEVEMENTS}
    </ul>
  </div>
  
  <div class="section">
    <h2 class="section-title">References</h2>
    {REFERENCES}
  </div>
</body>
</html>',
  '',
  'professional',
  '/placeholder.svg?height=400&width=300&text=Modern Professional',
  false
),
(
  uuid_generate_v4(),
  'Creative Portfolio',
  'Stand out with this creative design',
  '<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: "Roboto", Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
      background-color: #f9f9f9;
    }
    .resume-container {
      max-width: 800px;
      margin: 0 auto;
      background-color: white;
      padding: 30px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    .resume-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      border-bottom: 3px solid #ff6b6b;
      padding-bottom: 20px;
    }
    .header-left h1 {
      margin: 0;
      color: #ff6b6b;
      font-size: 32px;
    }
    .header-left p {
      margin: 5px 0;
      font-size: 18px;
      color: #666;
    }
    .header-right {
      text-align: right;
    }
    .contact-info {
      font-size: 14px;
      line-height: 1.6;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      color: #ff6b6b;
      font-size: 22px;
      margin-bottom: 15px;
      position: relative;
    }
    .section-title::after {
      content: "";
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 50px;
      height: 3px;
      background-color: #ff6b6b;
    }
    .experience-item, .education-item {
      margin-bottom: 20px;
      position: relative;
      padding-left: 20px;
    }
    .experience-item::before, .education-item::before {
      content: "";
      position: absolute;
      left: 0;
      top: 5px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #ff6b6b;
    }
    .job-title, .degree {
      font-weight: bold;
      font-size: 18px;
      margin-bottom: 5px;
    }
    .employer, .institution {
      font-style: italic;
      color: #666;
      margin-bottom: 5px;
    }
    .dates {
      color: #999;
      font-size: 14px;
      margin-bottom: 10px;
    }
    .description {
      font-size: 15px;
      line-height: 1.5;
    }
    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .skill {
      background-color: #f0f0f0;
      color: #ff6b6b;
      padding: 8px 15px;
      border-radius: 20px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="resume-container">
    <div class="resume-header">
      <div class="header-left">
        <h1>{FULL_NAME}</h1>
        <p>{TAGLINE}</p>
      </div>
      <div class="header-right">
        <div class="contact-info">
          <p>{PHONE}</p>
          <p>{EMAIL}</p>
          <p>{CITY}, {COUNTY}, {POSTCODE}</p>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title">About Me</h2>
      <p class="description">{PROFESSIONAL_SUMMARY}</p>
    </div>
    
    <div class="section">
      <h2 class="section-title">Experience</h2>
      {WORK_EXPERIENCE}
    </div>
    
    <div class="section">
      <h2 class="section-title">Education</h2>
      {EDUCATION}
    </div>
    
    <div class="section">
      <h2 class="section-title">Skills</h2>
      <div class="skills-container">
        {SKILLS}
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title">Achievements</h2>
      <ul>
        {ACHIEVEMENTS}
      </ul>
    </div>
  </div>
</body>
</html>',
  '',
  'creative',
  '/placeholder.svg?height=400&width=300&text=Creative Portfolio',
  true
),
(
  uuid_generate_v4(),
  'Minimalist',
  'Simple and elegant design focusing on content',
  '<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: "Inter", sans-serif;
      margin: 0;
      padding: 30px;
      color: #333;
      line-height: 1.6;
    }
    .resume-header {
      margin-bottom: 30px;
    }
    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    .contact-info {
      margin-top: 10px;
      font-size: 14px;
      color: #666;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 15px;
      color: #000;
    }
    .experience-item, .education-item {
      margin-bottom: 20px;
    }
    .job-title, .degree {
      font-weight: 600;
      margin-bottom: 5px;
    }
    .employer, .institution {
      display: inline;
    }
    .dates {
      display: inline;
      color: #666;
      font-size: 14px;
    }
    .location {
      color: #666;
      font-size: 14px;
      margin-bottom: 5px;
    }
    .description {
      font-size: 14px;
    }
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      list-style-type: none;
      padding: 0;
    }
    .skill {
      font-size: 14px;
      background-color: #f5f5f5;
      padding: 4px 10px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="resume-header">
    <h1>{FULL_NAME}</h1>
    <p class="contact-info">{EMAIL} · {PHONE} · {CITY}, {COUNTY}</p>
  </div>
  
  <div class="section">
    <h2 class="section-title">Profile</h2>
    <p class="description">{PROFESSIONAL_SUMMARY}</p>
  </div>
  
  <div class="section">
    <h2 class="section-title">Experience</h2>
    {WORK_EXPERIENCE}
  </div>
  
  <div class="section">
    <h2 class="section-title">Education</h2>
    {EDUCATION}
  </div>
  
  <div class="section">
    <h2 class="section-title">Skills</h2>
    <div class="skills-list">
      {SKILLS}
    </div>
  </div>
</body>
</html>',
  '',
  'minimal',
  '/placeholder.svg?height=400&width=300&text=Minimalist',
  false
);

-- Create RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view resume templates" ON resume_templates
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own resumes" ON resumes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes" ON resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes" ON resumes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes" ON resumes
  FOR DELETE USING (auth.uid() = user_id);

-- Create functions for usage tracking
CREATE OR REPLACE FUNCTION increment_resume_usage(user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO usage (user_id, resumes_used)
  VALUES (user_id, 1)
  ON CONFLICT (user_id)
  DO UPDATE SET resumes_used = usage.resumes_used + 1, updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_cover_letter_usage(user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO usage (user_id, cover_letters_used)
  VALUES (user_id, 1)
  ON CONFLICT (user_id)
  DO UPDATE SET cover_letters_used = usage.cover_letters_used + 1, updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
