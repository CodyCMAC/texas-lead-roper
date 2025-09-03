-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; 
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create enum types
CREATE TYPE app_role AS ENUM ('admin', 'manager', 'rep', 'backoffice');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'disqualified');
CREATE TYPE opportunity_stage AS ENUM ('discovery', 'inspection', 'estimate', 'proposal_sent', 'negotiation', 'won', 'lost');
CREATE TYPE project_type AS ENUM ('roofing', 'garage_door', 'remodel'); 
CREATE TYPE project_status AS ENUM ('planned', 'in_progress', 'on_hold', 'closed');
CREATE TYPE service_status AS ENUM ('new', 'triage', 'scheduled', 'onsite', 'resolved', 'closed');
CREATE TYPE task_status AS ENUM ('open', 'done', 'snoozed');
CREATE TYPE interest_level AS ENUM ('none', 'low', 'medium', 'high');

-- Create workspaces (markets/regions)
CREATE TABLE public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user roles table (separate from profiles to avoid RLS recursion)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, workspace_id)
);

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Properties (Accounts) - Address-first anchor
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    county TEXT,
    normalized_address TEXT NOT NULL,
    address_hash TEXT NOT NULL, -- For deduplication
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    home_type TEXT,
    year_built INTEGER,
    owner_occupancy TEXT DEFAULT 'unknown',
    source TEXT DEFAULT 'door_knock',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(workspace_id, address_hash)
);

-- Contacts linked to properties
CREATE TABLE public.contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    mobile TEXT,
    role_in_household TEXT DEFAULT 'owner',
    contact_preference TEXT DEFAULT 'phone',
    consent_given BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Leads - generated from canvassing or forms
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    assigned_rep UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status lead_status DEFAULT 'new',
    source TEXT DEFAULT 'door_knock',
    interest_level interest_level DEFAULT 'none',
    ai_score INTEGER DEFAULT 0 CHECK (ai_score >= 0 AND ai_score <= 100),
    next_followup_date DATE,
    disqual_reason TEXT,
    notes TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Opportunities (Deals) - qualified leads
CREATE TABLE public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    stage opportunity_stage DEFAULT 'discovery',
    opportunity_type project_type,
    estimated_value DECIMAL(10, 2),
    probability_percent INTEGER DEFAULT 50 CHECK (probability_percent >= 0 AND probability_percent <= 100),
    expected_close_date DATE,
    assigned_owner UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    competitor TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Sales - auto-created when opportunity is won
CREATE TABLE public.sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE NOT NULL,
    sale_type project_type NOT NULL,
    contract_value DECIMAL(10, 2) NOT NULL,
    contract_signed_date DATE NOT NULL,
    sold_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Projects/Jobs - spawned from sales
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    sale_id UUID REFERENCES public.sales(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    project_type project_type NOT NULL,
    status project_status DEFAULT 'planned',
    manager UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    start_date DATE,
    end_date DATE,
    permit_number TEXT,
    insurance_claim BOOLEAN DEFAULT false,
    carrier_name TEXT,
    claim_number TEXT,
    notes TEXT,
    -- Type-specific fields as JSONB for flexibility
    roofing_details JSONB,
    garage_door_details JSONB,
    remodel_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Service Tickets - warranty, maintenance, repairs
CREATE TABLE public.service_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    status service_status DEFAULT 'new',
    ticket_type TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    description TEXT NOT NULL,
    assigned_owner UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    target_date DATE,
    outcome_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tasks and Activities
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status task_status DEFAULT 'open',
    priority TEXT DEFAULT 'medium',
    due_date DATE,
    assigned_owner UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    -- Polymorphic relationship to any entity
    related_entity_type TEXT,
    related_entity_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Updates/Activity Feed - Monday.com style updates
CREATE TABLE public.updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    update_type TEXT NOT NULL, -- 'comment', 'system', 'ai', 'file'
    content TEXT,
    metadata JSONB,
    embedding vector(1536), -- For semantic search
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- File attachments
CREATE TABLE public.attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    storage_path TEXT NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_properties_workspace ON public.properties(workspace_id);
CREATE INDEX idx_properties_hash ON public.properties(address_hash);
CREATE INDEX idx_contacts_property ON public.contacts(property_id);
CREATE INDEX idx_leads_property ON public.leads(property_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_opportunities_stage ON public.opportunities(stage);
CREATE INDEX idx_projects_type ON public.projects(project_type);
CREATE INDEX idx_updates_entity ON public.updates(entity_type, entity_id);
CREATE INDEX idx_updates_embedding ON public.updates USING ivfflat (embedding vector_cosine_ops);

-- Insert default workspaces
INSERT INTO public.workspaces (name, slug) VALUES 
    ('Fort Worth TX', 'fort-worth-tx'),
    ('Oklahoma', 'oklahoma'),
    ('Arkansas', 'arkansas'),
    ('Atlanta', 'atlanta');

-- Enable Row Level Security on all tables
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;