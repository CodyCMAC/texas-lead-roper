-- Security Definer function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID, _workspace_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id AND workspace_id = _workspace_id
  LIMIT 1;
$$;

-- Helper function to get user workspaces
CREATE OR REPLACE FUNCTION public.get_user_workspaces(_user_id UUID)
RETURNS UUID[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ARRAY_AGG(workspace_id)
  FROM public.user_roles
  WHERE user_id = _user_id;
$$;

-- RLS Policies for workspaces
CREATE POLICY "Users can view their assigned workspaces"
ON public.workspaces
FOR SELECT
TO authenticated
USING (id = ANY(public.get_user_workspaces(auth.uid())));

-- RLS Policies for user_roles
CREATE POLICY "Users can view roles in their workspaces"
ON public.user_roles
FOR SELECT
TO authenticated
USING (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "Admins can manage roles in their workspaces"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  public.get_user_role(auth.uid(), workspace_id) = 'admin'
);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- RLS Policies for properties
CREATE POLICY "Users can view properties in their workspaces"
ON public.properties
FOR SELECT
TO authenticated
USING (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "Users can create properties in their workspaces"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "Users can update properties in their workspaces"
ON public.properties
FOR UPDATE
TO authenticated
USING (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "Admins can delete properties in their workspaces"
ON public.properties
FOR DELETE
TO authenticated
USING (
  workspace_id = ANY(public.get_user_workspaces(auth.uid())) AND
  public.get_user_role(auth.uid(), workspace_id) IN ('admin', 'manager')
);

-- RLS Policies for contacts
CREATE POLICY "Users can view contacts in their workspaces"
ON public.contacts
FOR SELECT
TO authenticated
USING (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "Users can manage contacts in their workspaces"
ON public.contacts
FOR ALL
TO authenticated
USING (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

-- RLS Policies for leads
CREATE POLICY "Users can view leads in their workspaces"
ON public.leads
FOR SELECT
TO authenticated
USING (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "Users can create leads in their workspaces"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "Users can update their assigned leads or if manager/admin"
ON public.leads
FOR UPDATE
TO authenticated
USING (
  workspace_id = ANY(public.get_user_workspaces(auth.uid())) AND
  (assigned_rep = auth.uid() OR 
   public.get_user_role(auth.uid(), workspace_id) IN ('admin', 'manager'))
);

CREATE POLICY "Managers can delete leads in their workspaces"
ON public.leads
FOR DELETE
TO authenticated
USING (
  workspace_id = ANY(public.get_user_workspaces(auth.uid())) AND
  public.get_user_role(auth.uid(), workspace_id) IN ('admin', 'manager')
);

-- RLS Policies for opportunities
CREATE POLICY "Users can view opportunities in their workspaces"
ON public.opportunities
FOR SELECT
TO authenticated
USING (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "Users can create opportunities in their workspaces"
ON public.opportunities
FOR INSERT
TO authenticated
WITH CHECK (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "Users can update their assigned opportunities or if manager/admin"
ON public.opportunities
FOR UPDATE
TO authenticated
USING (
  workspace_id = ANY(public.get_user_workspaces(auth.uid())) AND
  (assigned_owner = auth.uid() OR 
   public.get_user_role(auth.uid(), workspace_id) IN ('admin', 'manager'))
);

CREATE POLICY "Managers can delete opportunities in their workspaces"
ON public.opportunities
FOR DELETE
TO authenticated
USING (
  workspace_id = ANY(public.get_user_workspaces(auth.uid())) AND
  public.get_user_role(auth.uid(), workspace_id) IN ('admin', 'manager')
);

-- RLS Policies for sales
CREATE POLICY "Users can view sales in their workspaces"
ON public.sales
FOR SELECT
TO authenticated
USING (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "System can create sales (from opportunities)"
ON public.sales
FOR INSERT
TO authenticated
WITH CHECK (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "Managers can update sales in their workspaces"
ON public.sales
FOR UPDATE
TO authenticated
USING (
  workspace_id = ANY(public.get_user_workspaces(auth.uid())) AND
  public.get_user_role(auth.uid(), workspace_id) IN ('admin', 'manager')
);

-- RLS Policies for projects
CREATE POLICY "Users can view projects in their workspaces"
ON public.projects
FOR SELECT
TO authenticated
USING (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "System can create projects (from sales)"
ON public.projects
FOR INSERT
TO authenticated
WITH CHECK (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "Project managers can update their projects"
ON public.projects
FOR UPDATE
TO authenticated
USING (
  workspace_id = ANY(public.get_user_workspaces(auth.uid())) AND
  (manager = auth.uid() OR 
   public.get_user_role(auth.uid(), workspace_id) IN ('admin', 'manager'))
);

-- RLS Policies for service_tickets
CREATE POLICY "Users can view service tickets in their workspaces"
ON public.service_tickets
FOR SELECT
TO authenticated
USING (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "Users can create service tickets in their workspaces"
ON public.service_tickets
FOR INSERT
TO authenticated
WITH CHECK (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "Users can update their assigned tickets or if manager/admin"
ON public.service_tickets
FOR UPDATE
TO authenticated
USING (
  workspace_id = ANY(public.get_user_workspaces(auth.uid())) AND
  (assigned_owner = auth.uid() OR 
   public.get_user_role(auth.uid(), workspace_id) IN ('admin', 'manager'))
);

-- RLS Policies for tasks
CREATE POLICY "Users can view tasks in their workspaces"
ON public.tasks
FOR SELECT
TO authenticated
USING (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "Users can create tasks in their workspaces"
ON public.tasks
FOR INSERT
TO authenticated
WITH CHECK (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "Users can update their assigned tasks or if manager/admin"
ON public.tasks
FOR UPDATE
TO authenticated
USING (
  workspace_id = ANY(public.get_user_workspaces(auth.uid())) AND
  (assigned_owner = auth.uid() OR 
   public.get_user_role(auth.uid(), workspace_id) IN ('admin', 'manager'))
);

-- RLS Policies for updates
CREATE POLICY "Users can view updates in their workspaces"
ON public.updates
FOR SELECT
TO authenticated
USING (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "Users can create updates in their workspaces"
ON public.updates
FOR INSERT
TO authenticated
WITH CHECK (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

-- RLS Policies for attachments
CREATE POLICY "Users can view attachments in their workspaces"
ON public.attachments
FOR SELECT
TO authenticated
USING (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

CREATE POLICY "Users can upload attachments in their workspaces"
ON public.attachments
FOR INSERT
TO authenticated
WITH CHECK (workspace_id = ANY(public.get_user_workspaces(auth.uid())));

-- Create trigger function to automatically update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add update triggers to tables with updated_at columns
CREATE TRIGGER update_workspaces_updated_at
    BEFORE UPDATE ON public.workspaces
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON public.properties
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON public.contacts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
    BEFORE UPDATE ON public.opportunities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sales_updated_at
    BEFORE UPDATE ON public.sales
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_service_tickets_updated_at
    BEFORE UPDATE ON public.service_tickets
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();