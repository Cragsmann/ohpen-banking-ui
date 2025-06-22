export type TenantConfig = {
  id: number;
  subdomain: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  accessRules: string[];
  labels: LabelConfig[];
  createdAt: string;
};

export type LabelConfig = {
  id: number;
  name: string;
  color?: string;
  description?: string;
};
