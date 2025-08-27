import { UserType } from '@two/shared';
import { CreatorLayout } from '@app/components/Layout';
import { AuthGuard } from '@app/features/auth';
import { CreateJobPage } from '@app/features/employer';
import { NextPageWithLayout } from '@app/types';

const CreateJobPageWithLayout: NextPageWithLayout = () => (
  <AuthGuard type={UserType.Employer}>
    <CreateJobPage />
  </AuthGuard>
);

CreateJobPageWithLayout.getLayout = (page) => <CreatorLayout>{page}</CreatorLayout>;

export default CreateJobPageWithLayout;
