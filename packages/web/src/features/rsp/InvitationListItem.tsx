import {
  Avatar,
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
  Toast,
} from '@disruptive-labs/ui';
import DotsVerticalIcon from '@disruptive-labs/ui/dist/icons/DotsVertical';
import { useState } from 'react';
import { RspInvitation } from '@two/shared';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import { formatPhoneNumber } from '@app/utils';
import { removeInvitation } from './actions';
import { selectRsp } from './reducer';

export const InvitationListItem = (invitation: RspInvitation) => {
  const rsp = useAppSelector(selectRsp);
  const showError = useErrorIndicator();
  const dispatch = useAppDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const { firstName, lastName, phone, email, id } = invitation;

  const handleRemove = async () => {
    if (rsp) {
      dispatch(removeInvitation({ rspId: rsp.id, invitationId: id }))
        .unwrap()
        .then(() => {
          setModalOpen(false);
          Toast.success('Invitation removed!');
        })
        .catch((e) => showError(e));
    }
  };

  return (
    <Flex direction="row" borderBottom alignItems="center">
      <Flex direction="row" width="1/3" alignItems="center" pv={5}>
        <Avatar size="xs" name={`${firstName} ${lastName}`} mr={3} />
        <Text fontWeight="700">{`${firstName} ${lastName}`}</Text>
      </Flex>
      <Text width="1/3" whiteSpace="nowrap" overflow="hidden" style={{ textOverflow: 'ellipsis' }}>
        {email}
      </Text>
      <Text width="1/3">{formatPhoneNumber(phone)}</Text>
      <Flex width={12}>
        <Menu>
          <MenuTrigger>
            <DotsVerticalIcon height={6} width={6} cursor="pointer" data-testid="menu" />
          </MenuTrigger>
          <MenuList>
            <MenuGroup>
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
            Are you sure you want to delete this invitation?
          </ModalTitle>
          <ModalFooter pt={0}>
            <Button colorScheme="primary" onClick={handleRemove}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
