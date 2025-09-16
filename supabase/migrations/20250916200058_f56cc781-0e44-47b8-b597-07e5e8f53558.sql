-- Update specific leads with the correct assigned representatives based on email addresses

-- Update 3434 Treadmill to yautjablooded@gmail.com
UPDATE leads 
SET assigned_rep = (
  SELECT au.id 
  FROM auth.users au 
  WHERE au.email = 'yautjablooded@gmail.com'
)
WHERE property_id IN (
  SELECT p.id 
  FROM properties p 
  WHERE p.address_line_1 ILIKE '%3434 Treadmill%'
);

-- Update 8756 Wacko Trail to codyv@cmacroofing.com  
UPDATE leads 
SET assigned_rep = (
  SELECT au.id 
  FROM auth.users au 
  WHERE au.email = 'codyv@cmacroofing.com'
)
WHERE property_id IN (
  SELECT p.id 
  FROM properties p 
  WHERE p.address_line_1 ILIKE '%8756 Wacko Trail%'
);

-- Update 1234 Main Street to yautjablooded@gmail.com
UPDATE leads 
SET assigned_rep = (
  SELECT au.id 
  FROM auth.users au 
  WHERE au.email = 'yautjablooded@gmail.com'
)
WHERE property_id IN (
  SELECT p.id 
  FROM properties p 
  WHERE p.address_line_1 ILIKE '%1234 Main Street%'
);