import { UserType } from '@two/shared';
import { SidebarLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { JobPage } from '@app/features/employer';
import { NextPageWithLayout } from '@app/types';

const JobPageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Employer}>
    <JobPage />
  </AuthGuard>
);

JobPageWithLayout.getLayout = (page) => (
  <SidebarLayout type={UserType.Employer}>{page}</SidebarLayout>
);

export default JobPageWithLayout;
