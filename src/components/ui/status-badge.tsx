import { cn } from "@/lib/utils";

export type StatusType = 'new' | 'active' | 'won' | 'lost' | 'pending' | 'closed';

interface StatusBadgeProps {
  status: StatusType;
  children: React.ReactNode;
  className?: string;
}

export const StatusBadge = ({ status, children, className }: StatusBadgeProps) => {
  return (
    <span className={cn(
      "status-chip",
      {
        'status-new': status === 'new',
        'status-active': status === 'active' || status === 'pending',
        'status-won': status === 'won' || status === 'closed',
        'status-lost': status === 'lost',
      },
      className
    )}>
      {children}
    </span>
  );
};