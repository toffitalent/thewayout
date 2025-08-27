import { UserType } from '@two/shared';
import { SidebarLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { AddCaseManagerPage } from '@app/features/rsp';
import { NextPageWithLayout } from '@app/types';

const AddCaseManagerPageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Rsp}>
    <AddCaseManagerPage />
  </AuthGuard>
);

AddCaseManagerPageWithLayout.getLayout = (page) => (
  <SidebarLayout type={UserType.Rsp}>{page}</SidebarLayout>
);

export default AddCaseManagerPageWithLayout;
