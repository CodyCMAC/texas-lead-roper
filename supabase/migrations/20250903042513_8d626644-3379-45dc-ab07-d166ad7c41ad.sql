-- Fix search_path for functions (security improvement)
CREATE OR REPLACE FUNCTION public.generate_address_hash(
    address_line_1 TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
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

-- Fix search_path for normalize_address function
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
SECURITY DEFINER
SET search_path = public
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