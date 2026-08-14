export type HealthStatus = 'ON_TRACK' | 'WARNING' | 'AT_RISK' | 'CRITICAL';

export type ActivityStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'CANCELLED';

export interface Project {
  id: number;
  uuid: string;
  code: string;
  name: string;
  description: string;
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
  healthStatus: HealthStatus;
  overallHealthScore: number;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  overallProgress: number;
  scheduleVarianceDays: number;
}

export interface Milestone {
  id: number;
  projectId: number;
  name: string;
  orderIndex: number;
  plannedStartDate: string;
  plannedEndDate: string;
  progress: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  activities: Activity[];
}

export interface Activity {
  id: number;
  milestoneId: number;
  name: string;
  status: ActivityStatus;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  plannedDurationDays: number;
  progress: number;
  isCriticalPath: boolean;
  assignedTo?: string;
  predecessorIds?: number[];
  deliverableTitle?: string;
  evidenceStatus?: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
}

export interface Risk {
  id: number;
  title: string;
  probability: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  severityScore: number;
  status: 'IDENTIFIED' | 'MITIGATED' | 'MATERIALIZED' | 'CLOSED';
}

export interface Issue {
  id: number;
  title: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
}

export interface ProjectEvent {
  id: number;
  eventType: string;
  payload: Record<string, any>;
  createdAt: string;
}
