export type Tenant = {
  subdomain: string;
  branding: {
    primaryColor: string;
    secondaryColor: string;
  };
  accessRules: string[];
  labels: string[];
  createdAt: string;
};
