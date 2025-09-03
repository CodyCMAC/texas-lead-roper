import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Calendar, User, CheckSquare, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  related_entity_type?: string;
  related_entity_id?: string;
  created_at: string;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: completed ? 'done' : 'open' })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, status: completed ? 'done' : 'open' }
            : task
        )
      );
      
      toast.success(completed ? 'Task completed!' : 'Task reopened');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-amber-500';
      case 'low': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && tasks.find(t => t.due_date === dueDate)?.status !== 'done';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage your to-do list and assignments</p>
        </div>
        <AddTaskDialog onTaskAdded={fetchTasks}>
          <Button className="btn-copper gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </AddTaskDialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks by title, description, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <Card 
            key={task.id} 
            className={`board-card hover:shadow-copper transition-all duration-300 ${
              task.status === 'done' ? 'opacity-75' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.status === 'done'}
                  onCheckedChange={(checked) => updateTaskStatus(task.id, !!checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <CardTitle className={`text-lg ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={task.status as any}>{task.status}</StatusBadge>
                    <div className={`flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                      <AlertCircle className="h-3 w-3" />
                      <span className="text-xs capitalize">{task.priority}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {task.description && (
                <p className={`text-sm line-clamp-3 ${task.status === 'done' ? 'text-muted-foreground' : ''}`}>
                  {task.description}
                </p>
              )}

              {task.due_date && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className={`${isOverdue(task.due_date) ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                    Due: {new Date(task.due_date).toLocaleDateString()}
                    {isOverdue(task.due_date) && ' (Overdue)'}
                  </span>
                </div>
              )}

              {task.related_entity_type && (
                <Badge variant="outline" className="text-xs">
                  {task.related_entity_type}
                </Badge>
              )}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{new Date(task.created_at).toLocaleDateString()}</span>
                <CheckSquare className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Start by adding your first task.'}
          </p>
          <Button className="btn-copper gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      )}
    </div>
  );
};

export default Tasks;