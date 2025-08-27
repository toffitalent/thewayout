import { DefaultLayout } from '@app/components/Layout/DefaultLayout';
import { JobPage } from '@app/features/jobs';
import { NextPageWithLayout } from '@app/types';

const JobPageWithLayout: NextPageWithLayout = () => <JobPage />;

JobPageWithLayout.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export default JobPageWithLayout;
