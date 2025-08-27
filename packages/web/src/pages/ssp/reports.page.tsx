import { UserType } from '@two/shared';
import { SidebarLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { ReportsPage } from '@app/features/rsp';
import { NextPageWithLayout } from '@app/types';

const ReportsPagePageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Rsp}>
    <ReportsPage />
  </AuthGuard>
);

ReportsPagePageWithLayout.getLayout = (page) => (
  <SidebarLayout type={UserType.Rsp}>{page}</SidebarLayout>
);

export default ReportsPagePageWithLayout;
