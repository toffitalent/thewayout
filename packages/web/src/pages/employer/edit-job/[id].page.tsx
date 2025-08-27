import { UserType } from '@two/shared';
import { SidebarLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { EditJobPage } from '@app/features/employer';
import { NextPageWithLayout } from '@app/types';

const EditJobPageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Employer}>
    <EditJobPage />
  </AuthGuard>
);

EditJobPageWithLayout.getLayout = (page) => (
  <SidebarLayout type={UserType.Employer}>{page}</SidebarLayout>
);

export default EditJobPageWithLayout;
