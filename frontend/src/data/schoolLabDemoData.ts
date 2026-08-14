import { Project, Milestone, Risk, Issue, ProjectEvent } from '../types';

export const schoolLabProjectDemo: Project = {
  id: 101,
  uuid: 'proj-cs-lab-001',
  code: 'SCH-LAB-2026',
  name: 'Computer Science Laboratory Implementation',
  description: 'Setup and rollout of a 40-workstation Computer Science laboratory at Example International School.',
  status: 'ACTIVE',
  healthStatus: 'AT_RISK',
  overallHealthScore: 64.5,
  plannedStartDate: '2026-08-01',
  plannedEndDate: '2026-09-30',
  actualStartDate: '2026-08-01',
  overallProgress: 42.0,
  scheduleVarianceDays: -9,
};

export const schoolLabMilestones: Milestone[] = [
  {
    id: 1,
    projectId: 101,
    name: '1. Planning & Budget Approval',
    orderIndex: 1,
    plannedStartDate: '2026-08-01',
    plannedEndDate: '2026-08-07',
    progress: 100,
    status: 'COMPLETED',
    activities: [
      {
        id: 11,
        milestoneId: 1,
        name: 'Approve Lab Budget & Specifications',
        status: 'COMPLETED',
        plannedStartDate: '2026-08-01',
        plannedEndDate: '2026-08-07',
        plannedDurationDays: 6,
        progress: 100,
        isCriticalPath: true,
        assignedTo: 'Principal / Admin Board',
        deliverableTitle: 'Signed Procurement Specs & Budget Sign-off',
        evidenceStatus: 'APPROVED'
      }
    ]
  },
  {
    id: 2,
    projectId: 101,
    name: '2. Procurement Phase',
    orderIndex: 2,
    plannedStartDate: '2026-08-08',
    plannedEndDate: '2026-08-20',
    progress: 60,
    status: 'DELAYED',
    activities: [
      {
        id: 21,
        milestoneId: 2,
        name: 'Purchase Workstation PCs (40 Units)',
        status: 'IN_PROGRESS',
        plannedStartDate: '2026-08-08',
        plannedEndDate: '2026-08-18',
        plannedDurationDays: 10,
        progress: 50,
        isCriticalPath: true,
        assignedTo: 'Procurement Manager',
        deliverableTitle: 'PC Vendor Purchase Order & Receipt',
        evidenceStatus: 'SUBMITTED'
      },
      {
        id: 22,
        milestoneId: 2,
        name: 'Purchase Networking Equipment & Rack Switch',
        status: 'COMPLETED',
        plannedStartDate: '2026-08-08',
        plannedEndDate: '2026-08-15',
        plannedDurationDays: 7,
        progress: 100,
        isCriticalPath: false,
        assignedTo: 'IT Lead',
        deliverableTitle: 'Switch Delivery Waybill',
        evidenceStatus: 'APPROVED'
      }
    ]
  },
  {
    id: 3,
    projectId: 101,
    name: '3. Room Preparation',
    orderIndex: 3,
    plannedStartDate: '2026-08-15',
    plannedEndDate: '2026-08-25',
    progress: 30,
    status: 'IN_PROGRESS',
    activities: [
      {
        id: 31,
        milestoneId: 3,
        name: 'Electrical Wiring & Power Outlets Installation',
        status: 'IN_PROGRESS',
        plannedStartDate: '2026-08-15',
        plannedEndDate: '2026-08-22',
        plannedDurationDays: 7,
        progress: 40,
        isCriticalPath: true,
        assignedTo: 'Electrical Contractor',
        deliverableTitle: 'Electrical Safety Inspection Certificate',
        evidenceStatus: 'PENDING'
      }
    ]
  },
  {
    id: 4,
    projectId: 101,
    name: '4. Equipment Installation',
    orderIndex: 4,
    plannedStartDate: '2026-08-23',
    plannedEndDate: '2026-09-05',
    progress: 0,
    status: 'PENDING',
    activities: [
      {
        id: 41,
        milestoneId: 4,
        name: 'Unpack & Mount Workstations',
        status: 'BLOCKED',
        plannedStartDate: '2026-08-23',
        plannedEndDate: '2026-08-30',
        plannedDurationDays: 7,
        progress: 0,
        isCriticalPath: true,
        predecessorIds: [21],
        assignedTo: 'Hardware Installer',
        deliverableTitle: 'Workstation Installation Sign-off',
        evidenceStatus: 'PENDING'
      }
    ]
  }
];

export const schoolLabRisks: Risk[] = [
  {
    id: 1,
    title: 'PC Supplier Customs Clearing Delay',
    probability: 'HIGH',
    impact: 'HIGH',
    severityScore: 25,
    status: 'MATERIALIZED'
  },
  {
    id: 2,
    title: 'Power Grid Fluctuation damaging equipment',
    probability: 'MEDIUM',
    impact: 'HIGH',
    severityScore: 15,
    status: 'IDENTIFIED'
  }
];

export const schoolLabIssues: Issue[] = [
  {
    id: 101,
    title: 'PC Vendor shipment delayed by 9 days at customs port',
    severity: 'CRITICAL',
    description: 'Computer supplier shipment of 40 PCs is held up at port customs clearance, delaying equipment installation and blocking network configuration.',
    status: 'OPEN',
    createdAt: '2026-08-12 10:30:00'
  }
];

export const schoolLabEvents: ProjectEvent[] = [
  {
    id: 901,
    eventType: 'DEPENDENCY_BLOCKAGE_DETECTED',
    payload: {
      message: "'Purchase Workstation PCs' delay of 9 days is blocking 'Unpack & Mount Workstations'."
    },
    createdAt: '2026-08-14 09:15:00'
  },
  {
    id: 902,
    eventType: 'PROJECT_HEALTH_CHANGED',
    payload: {
      old_status: 'WARNING',
      new_status: 'AT_RISK',
      old_score: 78.0,
      new_score: 64.5
    },
    createdAt: '2026-08-14 09:16:00'
  }
];
