import {
  Avatar,
  Badge,
  Box,
  Button,
  Flex,
  Menu,
  MenuGroup,
  MenuItem,
  MenuList,
  MenuTrigger,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalTitle,
  Text,
  ThemeColorScheme,
  Toast,
} from '@disruptive-labs/ui';
import DotsVerticalIcon from '@disruptive-labs/ui/dist/icons/DotsVertical';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RspClientList, RspClientStatus } from '@two/shared';
import { useAppDispatch, useErrorIndicator } from '@app/hooks';
import { formatPhoneNumber } from '@app/utils';
import { declineClient } from './actions';

const statusColor: { [key in RspClientStatus]: ThemeColorScheme } = {
  [RspClientStatus.pending]: 'yellow',
  [RspClientStatus.active]: 'green',
  [RspClientStatus.closed]: 'grey',
};

const statusLabel: { [key in RspClientStatus]: string } = {
  [RspClientStatus.pending]: 'pending',
  [RspClientStatus.active]: 'assigned',
  [RspClientStatus.closed]: 'closed',
};

export const ClientsListItem = (client: RspClientList) => {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const showError = useErrorIndicator();
  const {
    id,
    status,
    rspId,
    user: { firstName, lastName, email, client: userClient, avatar },
    caseManagerId,
    caseManagerFirstName,
    caseManagerLastName,
  } = client;

  const caseManagerName = caseManagerId ? `${caseManagerFirstName} ${caseManagerLastName}` : '';

  const handleDecline = () => {
    dispatch(declineClient({ rspId, clientId: id as string }))
      .unwrap()
      .catch((e) => showError(e))
      .then(() => {
        Toast.success('Client status changed to closed.');
        setModalOpen(false);
      });
  };

  const statusIncludeCaseManager =
    status === RspClientStatus.active && !caseManagerId ? RspClientStatus.pending : status;

  return (
    <Flex direction="row" borderBottom alignItems="center">
      <Flex
        direction="row"
        width="1/5"
        alignItems="center"
        pv={5}
        style={{ cursor: 'pointer' }}
        onClick={() => router.push(`/rsp/clients/${id}`)}
      >
        <Avatar size="xs" name={`${firstName} ${lastName}`} src={avatar} mr={3} />
        <Text fontWeight="700">{`${firstName} ${lastName}`}</Text>
      </Flex>
      <Text width="1/5" whiteSpace="nowrap" overflow="hidden" style={{ textOverflow: 'ellipsis' }}>
        {email}
      </Text>
      <Text width="1/5">{userClient?.phone ? formatPhoneNumber(userClient.phone) : ''}</Text>
      <Text width="1/5">{caseManagerName}</Text>
      <Box width="1/5">
        <Badge colorScheme={statusColor[statusIncludeCaseManager]}>
          {statusLabel[statusIncludeCaseManager]}
        </Badge>
      </Box>
      <Flex width={12}>
        <Menu>
          <MenuTrigger>
            <DotsVerticalIcon height={6} width={6} cursor="pointer" data-testid="menu" />
          </MenuTrigger>
          <MenuList>
            <MenuGroup>
              <MenuItem minWidth={40}>
                <Text as="a" href={`mailto:${email}`} color="text">
                  Email
                </Text>
              </MenuItem>
              <MenuItem minWidth={40} onClick={() => setModalOpen(true)}>
                Delete
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </Flex>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent rounded="xl" p={8}>
          <ModalCloseButton color="primary" />
          <ModalTitle mb={8} f="s1">
            Are you sure you want to delete Case Manager?
          </ModalTitle>
          <ModalFooter pt={0}>
            <Button colorScheme="primary" onClick={handleDecline}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
