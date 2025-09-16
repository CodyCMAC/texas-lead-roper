-- Allow users to view profiles of all members in their workspaces
-- Keeps existing INSERT/UPDATE policies intact

-- Create a permissive SELECT policy for profiles that grants access to any profile
-- whose user shares at least one workspace with the current user
CREATE POLICY "Users can view profiles in their workspaces"
ON public.profiles
FOR SELECT
USING (
  -- Always allow viewing your own profile
  profiles.user_id = auth.uid()
  OR
  -- Allow viewing profiles of users who are in any of the current user's workspaces
  profiles.user_id IN (
    SELECT ur.user_id
    FROM public.user_roles ur
    WHERE ur.workspace_id = ANY (public.get_user_workspaces(auth.uid()))
  )
);
