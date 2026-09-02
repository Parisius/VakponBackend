// Central definition of staff roles and which ones can access which section.
// "customer" is never a staff role — it's the espace-client account type.
export const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  operations: "Responsable des opérations",
  service_client: 'Service client',
  support: 'Support',
  financial: 'Financial manager',
  marketing: 'Marketing & communication',
};

export const STAFF_ROLES = ['admin', 'operations', 'service_client', 'support', 'financial', 'marketing'] as const;

// Admin + Opérations: full access, including team/settings.
export const TEAM_ROLES = ['admin', 'operations'] as const;
export const LOGS_ROLES = ['admin', 'operations'] as const;

// Service client + Support: reservations and customer CRM, not offers/team/financial.
// Financial: reservations, view-only.
export const RESERVATIONS_MANAGE_ROLES = ['admin', 'operations', 'service_client', 'support'] as const;
export const RESERVATIONS_VIEW_ROLES = ['admin', 'operations', 'service_client', 'support', 'financial'] as const;
export const CUSTOMERS_ROLES = ['admin', 'operations', 'service_client', 'support'] as const;

// Marketing: offers + landing content only.
export const OFFERS_ROLES = ['admin', 'operations', 'marketing'] as const;

export function isStaffRole(role: string): boolean {
  return (STAFF_ROLES as readonly string[]).includes(role);
}
