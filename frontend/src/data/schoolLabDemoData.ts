import { Project, Milestone, Risk, Issue, ProjectEvent } from '../types';

export const schoolLabProjectDemo: Project = {
  id: 101,
  uuid: 'proj-cs-lab-001',
  code: 'SCH-LAB-2026',
  name: 'Computer Science Laboratory Implementation',
  description: 'Setup and rollout of a 40-workstation Computer Science laboratory at Example International School.',
  status: 'ACTIVE',
  healthStatus: 'ON_TRACK',
  overallHealthScore: 94.5,
  plannedStartDate: '2026-08-01',
  plannedEndDate: '2026-09-30',
  actualStartDate: '2026-08-01',
  overallProgress: 68.0,
  scheduleVarianceDays: 0,
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
    progress: 100,
    status: 'COMPLETED',
    activities: [
      {
        id: 21,
        milestoneId: 2,
        name: 'Purchase Workstation PCs (40 Units)',
        status: 'COMPLETED',
        plannedStartDate: '2026-08-08',
        plannedEndDate: '2026-08-18',
        plannedDurationDays: 10,
        progress: 100,
        isCriticalPath: true,
        assignedTo: 'Procurement Manager',
        deliverableTitle: 'PC Vendor Purchase Order & Receipt',
        evidenceStatus: 'APPROVED'
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
    progress: 80,
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
        progress: 80,
        isCriticalPath: true,
        assignedTo: 'Electrical Contractor',
        deliverableTitle: 'Electrical Safety Inspection Certificate',
        evidenceStatus: 'APPROVED'
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
    progress: 25,
    status: 'IN_PROGRESS',
    activities: [
      {
        id: 41,
        milestoneId: 4,
        name: 'Unpack & Mount Workstations',
        status: 'IN_PROGRESS',
        plannedStartDate: '2026-08-23',
        plannedEndDate: '2026-08-30',
        plannedDurationDays: 7,
        progress: 25,
        isCriticalPath: true,
        predecessorIds: [21],
        assignedTo: 'Hardware Installer',
        deliverableTitle: 'Workstation Installation Sign-off',
        evidenceStatus: 'SUBMITTED'
      }
    ]
  }
];

export const schoolLabRisks: Risk[] = [
  {
    id: 1,
    title: 'PC Supplier Customs Clearing Delay',
    probability: 'LOW',
    impact: 'LOW',
    severityScore: 5,
    status: 'MITIGATED'
  },
  {
    id: 2,
    title: 'Power Grid Fluctuation damaging equipment',
    probability: 'LOW',
    impact: 'MEDIUM',
    severityScore: 8,
    status: 'MITIGATED'
  }
];

export const schoolLabIssues: Issue[] = [];

export const schoolLabEvents: ProjectEvent[] = [
  {
    id: 901,
    eventType: 'PROJECT_HEALTH_CHANGED',
    payload: {
      message: "Health recalculated: Status updated from AT_RISK (64.5) to ON_TRACK (94.5)."
    },
    createdAt: '2026-08-15 11:00:00'
  },
  {
    id: 902,
    eventType: 'DELIVERABLE_APPROVED',
    payload: {
      message: "Workstation PCs deliverable evidence signed off and approved by IT Lead."
    },
    createdAt: '2026-08-15 10:45:00'
  }
];
