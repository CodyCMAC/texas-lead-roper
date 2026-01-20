-- Fix: Sales Reps Can View Competitors' Leads and Performance
-- Modify leads SELECT policy to only show leads assigned to the user OR if user is manager/admin

-- Drop the existing permissive SELECT policy
DROP POLICY IF EXISTS "Users can view leads in their workspaces" ON public.leads;

-- Create a more restrictive SELECT policy
-- Reps can only see their assigned leads; managers/admins can see all leads in workspace
CREATE POLICY "Users can view their leads or all if manager/admin"
ON public.leads
FOR SELECT
USING (
  workspace_id = ANY (public.get_user_workspaces(auth.uid()))
  AND (
    -- Reps can only see leads assigned to them (or unassigned leads for claiming)
    assigned_rep = auth.uid()
    OR assigned_rep IS NULL
    -- Managers and admins can see all leads in their workspace
    OR public.get_user_role(auth.uid(), workspace_id) = ANY (ARRAY['admin'::app_role, 'manager'::app_role])
  )
);