import {
  Box,
  Button,
  Field,
  Flex,
  Heading,
  Spinner,
  Text,
  Toast,
  useForm,
} from '@disruptive-labs/ui';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SEO } from '@app/components/SEO';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import { selectAuthUser } from '../auth';
import { applyJob, retrieveJob } from './actions';
import { selectJobById } from './reducer';

export const JobQuestionsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const user = useAppSelector(selectAuthUser);
  const job = useAppSelector((state) => selectJobById(state, String(id)));
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator({
    RequestThrottled:
      "You've reached your application limit for today. Check back tomorrow to continue applying.",
  });

  useEffect(() => {
    if (user?.id && id) {
      dispatch(
        retrieveJob({
          jobId: id as string,
          ...(job && job.applications && { since: job.updatedAt }),
        }),
      )
        .unwrap()
        .catch((e: any) => {
          if (e.code === 'ResourceNotFound') {
            router.replace('/client/jobs');
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, id, dispatch]);

  const {
    submitForm,
    control,
    formState: { isSubmitting, isDirty, isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: { ...Array(job?.questions?.length).fill('') } as { [key: number]: string },
    onSubmit: (data: { [key: number]: string }) => {
      if (job?.questions) {
        const questionsWitAnswers = Object.entries(data).map(([index, answer]) => ({
          [(job.questions as string[])[Number(index)]]: answer,
        }));
        dispatch(
          applyJob({
            jobId: id as string,
            questions: questionsWitAnswers,
          }),
        )
          .unwrap()
          .then(() => {
            Toast.success('Your application was successful!');
            router.replace('/client/');
          })
          .catch((e) => showError(e));
      }
    },
  });

  if (!job || !job.questions) {
    return (
      <Box pv={20} textAlign="center">
        <Spinner color="primary" />
      </Box>
    );
  }

  const fields = job.questions.map((question, index) => ({
    name: index.toString(),
    label: question,
    type: 'text',
    multiline: true,
    placeholder: 'Your summary goes here.',
    fluid: true,
    helperText: 'Max 1,000 characters.',
    validate: { required: true, maxLength: 1000 },
  }));

  return (
    <>
      <SEO title="Job Questions" />
      <Flex maxWidth={96} ml="auto" mr="auto">
        <Heading>Job Specific Questions</Heading>
        <Text pt={2}>
          Ask qualifying questions that will help identify the most fit candidates.
        </Text>
        <Box pt={10} textAlign="left">
          <form onSubmit={submitForm}>
            {fields.map((field) => (
              <Field
                key={field.name}
                {...field}
                type="text"
                multiline
                placeholder="Your summary goes here."
                fluid
                helperText="Max 1,000 characters."
                validate={{ required: true, maxLength: 1000 }}
                control={control}
              />
            ))}
            <Button
              colorScheme="primary"
              fluid
              type="submit"
              maxWidth={96}
              mt={8}
              disabled={isSubmitting || !isDirty || !isValid}
            >
              Submit Application
            </Button>
          </form>
        </Box>
      </Flex>
    </>
  );
};
