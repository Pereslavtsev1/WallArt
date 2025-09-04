import { Card, CardContent, CardDescription, CardHeader } from '../ui/card';

type ProfileRootChild =
  | React.ReactElement<typeof ProfileHeader>
  | React.ReactElement<typeof ProfileStats>
  | React.ReactElement<typeof ProfileTabs>
  | React.ReactElement<typeof ProfileContent>;

export function Profile({
  children,
  className,
}: {
  children: ProfileRootChild | ProfileRootChild[];
  className?: string;
}) {
  return <Card className={`bg-background ${className}`}>{children}</Card>;
}

export function ProfileHeader({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <CardHeader className={`flex items-center gap-x-2 ${className}`}>
      {children}
    </CardHeader>
  );
}

export function ProfileStats({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <CardDescription className={`flex gap-x-4 items-center ${className}`}>
      {children}
    </CardDescription>
  );
}

export function ProfileTabs({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <nav className={`flex w-full items-center px-6 gap-x-2 ${className}`}>
      {children}
    </nav>
  );
}

export function ProfileContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <CardContent className={`${className}`}>{children}</CardContent>;
}
