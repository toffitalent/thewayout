import { UserType } from '@two/shared';
import { SidebarLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { JobsListPage } from '@app/features/client';
import { NextPageWithLayout } from '@app/types';

const JobsListPageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Client}>
    <JobsListPage />
  </AuthGuard>
);

JobsListPageWithLayout.getLayout = (page) => (
  <SidebarLayout type={UserType.Client}>{page}</SidebarLayout>
);

export default JobsListPageWithLayout;
