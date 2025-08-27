import { UserType } from '@two/shared';
import { SidebarLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { DashboardPage } from '@app/features/client';
import { NextPageWithLayout } from '@app/types';

const ClientHomeWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Client}>
    <DashboardPage />
  </AuthGuard>
);

ClientHomeWithLayout.getLayout = (page) => (
  <SidebarLayout type={UserType.Client}>{page}</SidebarLayout>
);

export default ClientHomeWithLayout;
