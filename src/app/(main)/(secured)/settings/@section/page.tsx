'use client';
import { redirect } from 'next/navigation';
import { SectionIDs, useSettingsStore } from '@/stores/settings-store';

const SettingsPage = () => {
  const { setActiveSection } = useSettingsStore();
  setActiveSection(SectionIDs.PROFILE);
  redirect('/settings/profile');
};

export default SettingsPage;
