'use client';
import type { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type SettingSectionProps = {
  children?: ReactNode;
  className?: string;
};
export const SettingsSection = ({ className, children }: SettingSectionProps) => {
  return <Card className={`w-full space-y-2 bg-background ${className}`}>{children}</Card>;
};

type SettingsSectionContentProps = {
  children?: ReactNode;
  className?: string;
};
export const SettingsSectionContent = ({ className, children }: SettingsSectionContentProps) => {
  return <CardContent className={`space-y-6 ${className}`}>{children}</CardContent>;
};

interface SettingsHeaderProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export const SettingsSectionHeader = ({
  title,
  description,
  className,
  children,
}: SettingsHeaderProps) => (
  <CardHeader className={`font-semibold ${className}`}>
    {children ? (
      children
    ) : (
      <>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </>
    )}
  </CardHeader>
);

interface SettingsFooterProps {
  children: ReactNode;
  className?: string;
}

export const SettingsSectionFooter = ({ children, className }: SettingsFooterProps) => (
  <CardFooter className={className}>{children}</CardFooter>
);
