// Root layout — minimal shell required by Next.js App Router
// Actual locale-aware layout lives in app/[locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
