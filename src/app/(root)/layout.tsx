export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="px-2 sm:px-4 lg:px-6 xl:px-8">{children}</div>;
}
