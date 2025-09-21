import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '../ui/card';

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
  return (
    <Card className={`${className} bg-background`}>
      {children}
    </Card>
  );
}

export function ProfileHeader({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <CardHeader
      className={`${className} flex items-center gap-x-2`}
    >
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
    <CardDescription
      className={`${className} flex items-center gap-x-4`}
    >
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
    <nav
      className={`${className} flex w-full items-center gap-x-2 px-6`}
    >
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
  return (
    <CardContent className={`${className}`}>
      {children}
    </CardContent>
  );
}
