import { UserType } from '@two/shared';
import { SidebarLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { JobPage } from '@app/features/client/JobPage';
import { NextPageWithLayout } from '@app/types';

const JobPageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Client}>
    <JobPage />
  </AuthGuard>
);

JobPageWithLayout.getLayout = (page) => (
  <SidebarLayout type={UserType.Client}>{page}</SidebarLayout>
);

export default JobPageWithLayout;
