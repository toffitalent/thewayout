import { UserType } from '@two/shared';
import { CreatorLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { CreateProfilePage } from '@app/features/rsp';
import { NextPageWithLayout } from '@app/types';

const CreateProfilePageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Rsp}>
    <CreateProfilePage />
  </AuthGuard>
);

CreateProfilePageWithLayout.getLayout = (page) => <CreatorLayout>{page}</CreatorLayout>;

export default CreateProfilePageWithLayout;
