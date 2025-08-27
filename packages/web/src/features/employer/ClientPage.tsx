import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalTitle,
  Spinner,
  Text,
  Toast,
} from '@disruptive-labs/ui';
import CheckIcon from '@disruptive-labs/ui/dist/icons/Check';
import XIcon from '@disruptive-labs/ui/dist/icons/X';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { JobApplicationStatus, UserType } from '@two/shared';
import { ClientProfile } from '@app/components/ClientProfile';
import { SEO } from '@app/components/SEO';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import { selectAuthUser } from '../auth';
import { getClient, hireClient, interviewClient, notAFitClient, rejectClient } from './actions';
import styles from './ClientPage.module.scss';
import { SubscriptionsPlansLimitModal } from './components/SubscriptionsPlansLimitModal';
import { selectClient } from './reducer';

const ConfirmModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  submitButtonLabel,
  closeButtonLabel,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  submitButtonLabel: string;
  closeButtonLabel?: string;
  title: string;
  body?: ReactNode;
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent rounded="xl" p={8} className={styles.modalWrapper}>
      <ModalCloseButton color="primary" className={styles.modalCloseButton} />
      <ModalTitle mb={8} f="s1">
        {title}
      </ModalTitle>
      {body && <ModalBody>{body}</ModalBody>}
      <ModalFooter pt={0} className={styles.modalButtons}>
        <Button colorScheme="primary" onClick={onSubmit}>
          {submitButtonLabel}
        </Button>
        {closeButtonLabel && (
          <Button
            colorScheme="primary"
            variant="outline"
            className={styles.modalButton}
            onClick={onClose}
          >
            {closeButtonLabel}
          </Button>
        )}
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export const ClientPage = () => {
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator();
  const user = useAppSelector(selectAuthUser);
  const router = useRouter();
  const [isInterviewModalOpen, setInterviewModalOpen] = useState(false);
  const [isHireModalOpen, setHireModalOpen] = useState(false);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [isLimitModalOpen, setLimitModalOpen] = useState(false);

  const { id, clientId } = router.query;
  const client = useAppSelector(selectClient);

  useEffect(() => {
    if (id && clientId && user?.employer) {
      dispatch(
        getClient({
          employerId: user.employer.id,
          jobId: id as string,
          clientId: clientId as string,
        }),
      )
        .unwrap()
        .catch((e) => showError(e));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch, clientId, user]);

  const handleRequest = () => {
    const employer = user?.employer;
    if (employer && client) {
      dispatch(
        interviewClient({
          employerId: employer.id,
          jobId: id as string,
          applicationId: client.applicationId,
        }),
      )
        .catch((e) => showError(e))
        .then((res) => {
          if ((res as any).error?.code === 'PaymentDeclined') {
            setLimitModalOpen(true);
          } else {
            dispatch(
              getClient({
                employerId: employer.id,
                jobId: id as string,
                clientId: clientId as string,
              }),
            )
              .unwrap()
              .catch((e) => showError(e));
          }
        })
        .finally(() => setInterviewModalOpen(false));
    }
  };

  const handleHire = () => {
    if (user?.employer && client) {
      dispatch(
        hireClient({
          employerId: user.employer.id,
          jobId: id as string,
          applicationId: client.applicationId,
        }),
      )
        .unwrap()
        .catch((e) => showError(e))
        .then(() => {
          Toast.success('Congratulations! Let the candidate know by sending them an email.');
        })
        .finally(() => {
          setHireModalOpen(false);
        });
    }
  };

  const handleReject = () => {
    if (user?.employer && client) {
      dispatch(
        rejectClient({
          employerId: user.employer.id,
          jobId: id as string,
          applicationId: client.applicationId,
        }),
      )
        .unwrap()
        .catch((e) => showError(e))
        .then(() => {
          Toast.success('Thank you for submitting the information to us.');
        })
        .finally(() => {
          setRejectModalOpen(false);
        });
    }
  };

  const handleNotAFit = () => {
    if (user?.employer && client) {
      dispatch(
        notAFitClient({
          employerId: user.employer.id,
          jobId: id as string,
          applicationId: client.applicationId,
        }),
      )
        .unwrap()
        .catch((e) => showError(e))
        .then(() => {
          Toast.success('Client successfully marked as not a fit!');
        })
        .finally(() => {
          setRejectModalOpen(false);
        });
    }
  };

  if (!client) {
    return (
      <Box pv={36} textAlign="center">
        <Spinner data-testid="loading-spinner" />
      </Box>
    );
  }

  const isCloaked = [JobApplicationStatus.applied, JobApplicationStatus.notAFit].includes(
    client?.applicationStatus,
  );

  return (
    <>
      <SEO title={`${isCloaked ? 'Client' : `${client.firstName} ${client.lastName}`} Profile`} />
      <ClientProfile client={client} type={UserType.Employer} isCloaked={isCloaked}>
        <>
          {client.applicationStatus === JobApplicationStatus.applied && (
            <Flex item>
              <Flex container spacing={2}>
                <Flex item width="1/2">
                  <Button
                    colorScheme="primary"
                    accessoryRight={<CheckIcon />}
                    maxHeight={10}
                    onClick={() => setInterviewModalOpen(true)}
                    fluid
                  >
                    Interview
                  </Button>
                </Flex>
                <Flex item width="1/2">
                  <Button
                    colorScheme="grey"
                    variant="outline"
                    accessoryRight={<XIcon />}
                    maxHeight={10}
                    onClick={handleNotAFit}
                    fluid
                  >
                    Not a Fit
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          )}
          {client.applicationStatus === JobApplicationStatus.interview && (
            <Flex item>
              <Flex container spacing={2}>
                <Flex item width="1/2">
                  <Button
                    variant="outline"
                    borderColor="green"
                    color="green"
                    accessoryRight={<CheckIcon color="green" />}
                    onClick={() => setHireModalOpen(true)}
                    fluid
                  >
                    Hire
                  </Button>
                </Flex>
                <Flex item width="1/2">
                  <Button
                    variant="outline"
                    colorScheme="grey"
                    accessoryRight={<XIcon />}
                    onClick={() => setRejectModalOpen(true)}
                    fluid
                  >
                    Reject
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          )}
          {client.applicationStatus === JobApplicationStatus.hired && (
            <Button
              variant="outline"
              borderColor="green"
              color="green"
              accessoryRight={<CheckIcon color="green" />}
              className={styles.infoButton}
            >
              Hired
            </Button>
          )}
          {client.applicationStatus === JobApplicationStatus.rejected && (
            <Button
              variant="outline"
              borderColor="red"
              color="red"
              ml={2}
              accessoryRight={<XIcon color="red" />}
              className={styles.infoButton}
            >
              Rejected
            </Button>
          )}
          {client.applicationStatus === JobApplicationStatus.applied && (
            <ConfirmModal
              isOpen={isInterviewModalOpen}
              onClose={() => setInterviewModalOpen(false)}
              title="Are you sure you want to request an interview?"
              onSubmit={handleRequest}
              submitButtonLabel="Request Interview"
              body={
                <Text color="grey.600" pb={8}>
                  {
                    'Upon acceptance of an interview request, both parties full profiles will become uncloaked. Please comply with all relevant '
                  }
                  <Text as="a" href="/terms/" target="_blank" fontWeight="700">
                    terms and conditions
                  </Text>
                  .
                </Text>
              }
            />
          )}
          {client.applicationStatus === JobApplicationStatus.interview && (
            <>
              <ConfirmModal
                isOpen={isHireModalOpen}
                onClose={() => setHireModalOpen(false)}
                title="Are you sure you want to hire this applicant?"
                onSubmit={handleHire}
                submitButtonLabel="Yes"
                closeButtonLabel="No"
              />
              <ConfirmModal
                isOpen={isRejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                title="Are you sure you want to reject this applicant?"
                onSubmit={handleReject}
                submitButtonLabel="Yes"
                closeButtonLabel="No"
              />
            </>
          )}
          <SubscriptionsPlansLimitModal
            isOpen={isLimitModalOpen}
            type="uncloak"
            onClose={() => setLimitModalOpen(false)}
          />
        </>
      </ClientProfile>
    </>
  );
};
