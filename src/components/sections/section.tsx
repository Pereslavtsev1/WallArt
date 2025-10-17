import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';

export function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className='w-full'>
      <Card className={cn('bg-background', className)}>{children}</Card>
    </section>
  );
}

export function SectionHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <CardHeader className={cn('font-semibold', className)}>
      {children}
    </CardHeader>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <CardTitle className={cn('font-semibold', className)}>{children}</CardTitle>
  );
}

export function SectionDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <CardDescription className={cn('font-semibold', className)}>
      {children}
    </CardDescription>
  );
}

export function SectionContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <CardContent className={cn('font-semibold', className)}>
      {children}
    </CardContent>
  );
}

export function SectionFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <CardFooter className={cn('font-semibold', className)}>
      {children}
    </CardFooter>
  );
}
