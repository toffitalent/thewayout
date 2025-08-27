import { UserType } from '@two/shared';
import { SidebarLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { ClientPage } from '@app/features/employer';
import { NextPageWithLayout } from '@app/types';

const ClientPageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Employer}>
    <ClientPage />
  </AuthGuard>
);

ClientPageWithLayout.getLayout = (page) => (
  <SidebarLayout type={UserType.Employer}>{page}</SidebarLayout>
);

export default ClientPageWithLayout;
