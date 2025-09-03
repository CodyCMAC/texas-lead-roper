-- Create a function to handle new user registration and workspace assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    default_workspace_id UUID;
BEGIN
    -- Create profile for the new user
    INSERT INTO public.profiles (user_id, display_name)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1))
    );
    
    -- Get the Fort Worth workspace (default for new users)
    SELECT id INTO default_workspace_id 
    FROM public.workspaces 
    WHERE slug = 'fort-worth-tx' 
    LIMIT 1;
    
    -- Assign user to default workspace with 'rep' role
    IF default_workspace_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, workspace_id, role)
        VALUES (NEW.id, default_workspace_id, 'rep');
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger to handle new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create a function to generate address hash for deduplication
CREATE OR REPLACE FUNCTION public.generate_address_hash(
    address_line_1 TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    RETURN encode(
        digest(
            lower(trim(address_line_1)) || '|' || 
            lower(trim(city)) || '|' || 
            lower(trim(state)) || '|' || 
            regexp_replace(zip_code, '[^0-9]', '', 'g'),
            'sha256'
        ),
        'hex'
    );
END;
$$;

-- Create a function to normalize addresses (fixed parameter order)
CREATE OR REPLACE FUNCTION public.normalize_address(
    address_line_1 TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    address_line_2 TEXT DEFAULT NULL
)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
    RETURN trim(address_line_1) || 
           CASE WHEN address_line_2 IS NOT NULL AND trim(address_line_2) != '' 
                THEN ', ' || trim(address_line_2) 
                ELSE '' 
           END ||
           ', ' || trim(city) || ', ' || trim(state) || ' ' || trim(zip_code);
END;
$$;