import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalTitle,
  Text,
} from '@disruptive-labs/ui';
import styles from './SubscriptionsPlansLimitModal.module.scss';

interface SubscriptionsPlansLimitModalProps {
  isOpen: boolean;
  type: 'job' | 'uncloak';
  onClose: () => void;
}

export const SubscriptionsPlansLimitModal = ({
  isOpen,
  type,
  onClose,
}: SubscriptionsPlansLimitModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent rounded="xl" p={8} pb={12} className={styles.modalWrapper}>
      <ModalCloseButton color="primary" className={styles.modalCloseButton} />
      <ModalTitle mb={8}>You have exceeded your free {type} quota!</ModalTitle>
      <ModalBody>
        <Text textAlign="center">
          {'Please reach out to '}
          <Text as="a" href="mailto:support@twout.org">
            support@twout.org
          </Text>
          {' to explore package options.'}
        </Text>
      </ModalBody>
    </ModalContent>
  </Modal>
);
