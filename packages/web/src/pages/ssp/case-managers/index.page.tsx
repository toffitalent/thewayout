import { UserType } from '@two/shared';
import { SidebarLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { CaseManagersPage } from '@app/features/rsp';
import { NextPageWithLayout } from '@app/types';

const CaseManagersPagePageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Rsp}>
    <CaseManagersPage />
  </AuthGuard>
);

CaseManagersPagePageWithLayout.getLayout = (page) => (
  <SidebarLayout type={UserType.Rsp}>{page}</SidebarLayout>
);

export default CaseManagersPagePageWithLayout;
