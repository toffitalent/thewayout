import { UserType } from '@two/shared';
import { SidebarLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { EditCaseManagerPage } from '@app/features/rsp';
import { NextPageWithLayout } from '@app/types';

const EditCaseManagerPageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Rsp}>
    <EditCaseManagerPage />
  </AuthGuard>
);

EditCaseManagerPageWithLayout.getLayout = (page) => (
  <SidebarLayout type={UserType.Rsp}>{page}</SidebarLayout>
);

export default EditCaseManagerPageWithLayout;
