export type OperationLogsBase = {
  target_table?: string | null;
  target_id?: number | null;
  operation_type?: string | null;
  operation_user?: string | null;
  operation_datetime?: string | null;
};

export type OperationLogsCreate = {
  employee_id: number | null;
} & OperationLogsBase;

export type OperationLogsUpdate = Partial<OperationLogsBase>;

export type OperationLogsOut = {
  id: number;
  employee_id: number;
} & OperationLogsBase;
