-- First, let's see what users we have available
-- Update leads with "unknown User" or null assigned_rep to distribute among real users

WITH available_users AS (
  SELECT user_id 
  FROM profiles 
  WHERE user_id IS NOT NULL
),
leads_to_update AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) as row_num
  FROM leads 
  WHERE assigned_rep IS NULL 
     OR assigned_rep NOT IN (SELECT user_id FROM available_users)
),
user_rotation AS (
  SELECT 
    l.id as lead_id,
    (SELECT user_id FROM available_users OFFSET (l.row_num - 1) % (SELECT COUNT(*) FROM available_users) LIMIT 1) as new_assigned_rep
  FROM leads_to_update l
)
UPDATE leads 
SET assigned_rep = ur.new_assigned_rep
FROM user_rotation ur
WHERE leads.id = ur.lead_id;