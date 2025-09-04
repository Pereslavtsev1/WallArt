import { redirect } from 'next/navigation';

const SettingsPage = () => {
  redirect('/settings/profile');
  return <div></div>;
};

export default SettingsPage;
