import { UserType } from '@two/shared';
import { SidebarLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { ClientsPage } from '@app/features/rsp';
import { NextPageWithLayout } from '@app/types';

const RspClientsPageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Rsp}>
    <ClientsPage />
  </AuthGuard>
);

RspClientsPageWithLayout.getLayout = (page) => (
  <SidebarLayout type={UserType.Rsp}>{page}</SidebarLayout>
);

export default RspClientsPageWithLayout;
