import { UserType } from '@two/shared';
import { SidebarLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { ClientPage } from '@app/features/rsp';
import { NextPageWithLayout } from '@app/types';

const ClientPageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Rsp}>
    <ClientPage />
  </AuthGuard>
);

ClientPageWithLayout.getLayout = (page) => (
  <SidebarLayout type={UserType.Rsp}>{page}</SidebarLayout>
);

export default ClientPageWithLayout;
