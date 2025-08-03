export interface Customer {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  portalAccess?: boolean;
  password?: string; // only used during registration, not returned by API
}
