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

export async function getUserSessions(userId: string) {
  const url = `https://api.clerk.com/v1/sessions?user_id=${userId}&status=active&paginated=false`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  console.log(response);

  if (!response.ok) {
    throw new Error('Failed to fetch sessions');
  }

  return response.json();
}
