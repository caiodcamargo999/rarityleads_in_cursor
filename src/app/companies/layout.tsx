// src/app/companies/layout.tsx

import DashboardLayout from '../(dashboard)/layout'

export default function CompaniesLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>
} 