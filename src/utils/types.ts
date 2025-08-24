type LatestActivity = {
  object: string;
  id: string;
  device_type: string;
  is_mobile: boolean;
  browser_name: string;
  browser_version: string;
  ip_address: string;
  city: string;
  country: string;
};

export type Session = {
  object: string;
  id: string;
  user_id: string;
  client_id: string;
  actor: string | null;
  status: string;
  last_active_organization_id: string | null;
  last_active_at: number;
  latest_activity: LatestActivity;
  expire_at: number;
  abandon_at: number;
  updated_at: number;
  created_at: number;
  tasks: { key: string }[];
};

export const fetchSessions = async (userId: string) => {
  const response = await fetch(`/api/sessions?userId=${userId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch sessions');
  }

  return response.json();
};
