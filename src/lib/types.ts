export type TenantConfig = {
  id: number;
  subdomain: string;
  accessRules: string[];
  labels: LabelConfig[];
  createdAt: string;
};

export type LabelConfig = {
  id: number;
  name: string;
  description?: string;
};

export type User = { name: string } | null;
