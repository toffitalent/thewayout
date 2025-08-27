export enum RspPosition {
  hrDirector = 'hrDirector',
  operationManager = 'operationManager',
  supervisor = 'supervisor',
  caseManager = 'caseManager',
}

export enum RspRole {
  owner = 'owner',
  member = 'member',
}

export enum RspClientStatus {
  pending = 'pending',
  active = 'active',
  closed = 'closed',
}

export const rspPositionText = {
  [RspPosition.hrDirector]: 'HR Director',
  [RspPosition.operationManager]: 'Operation Manager',
  [RspPosition.supervisor]: 'Supervisor',
  [RspPosition.caseManager]: 'Case Manager',
};

export const needReentryPipeline = { label: 'I need a reentry pipeline', value: 'reentryPipeline' };
