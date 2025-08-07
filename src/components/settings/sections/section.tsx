import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ReactNode } from 'react'

interface SettingsSectionProps {
  id: string
  children: ReactNode
  className?: string
}

interface SettingsHeaderProps {
  title: string
  description: string
  children?: ReactNode
  className?: string
}

interface SettingsContentProps {
  children: ReactNode
  className?: string
}

interface SettingsFooterProps {
  children: ReactNode
  className?: string
}

const SettingsSection = ({ children, className, id }: SettingsSectionProps) => (
  <section id={id}>
    <Card className={`${className} w-full space-y-2 bg-background`}>
      {children}
    </Card>
  </section>
)

const SettingsSectionHeader = ({
  title,
  description,
  className,
}: SettingsHeaderProps) => (
  <CardHeader className={`${className} font-semibold`}>
    <CardTitle>{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
)

const SettingsSectionContent = ({
  children,
  className,
}: SettingsContentProps) => (
  <CardContent className={`${className} space-y-6`}>{children}</CardContent>
)

const SettingsSectionFooter = ({
  children,
  className,
}: SettingsFooterProps) => (
  <CardFooter className={className}>{children}</CardFooter>
)

SettingsSection.Header = SettingsSectionHeader
SettingsSection.Content = SettingsSectionContent
SettingsSection.Footer = SettingsSectionFooter

export default SettingsSection
