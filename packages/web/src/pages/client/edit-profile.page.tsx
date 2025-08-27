import { UserType } from '@two/shared';
import { SidebarLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { EditProfilePage } from '@app/features/client';
import { NextPageWithLayout } from '@app/types';

const EditProfilePageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Client}>
    <EditProfilePage />
  </AuthGuard>
);

EditProfilePageWithLayout.getLayout = (page) => (
  <SidebarLayout type={UserType.Client}>{page}</SidebarLayout>
);

export default EditProfilePageWithLayout;
