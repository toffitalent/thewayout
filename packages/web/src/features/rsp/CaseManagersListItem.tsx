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
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RspAccountListItem } from '@two/shared';
import { useAppDispatch, useAppSelector, useErrorIndicator } from '@app/hooks';
import { formatPhoneNumber } from '@app/utils';
import { removeCaseManager } from './actions';
import { selectRsp } from './reducer';

export const CaseManagersListItem = (caseManager: RspAccountListItem) => {
  const rsp = useAppSelector(selectRsp);
  const router = useRouter();
  const showError = useErrorIndicator();
  const dispatch = useAppDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const { firstName, lastName, phone, email, caseLoad, avatar, userId } = caseManager;

  const handleRemove = async () => {
    if (rsp) {
      dispatch(removeCaseManager({ userId, rspId: rsp.id }))
        .unwrap()
        .then(() => {
          setModalOpen(false);
          Toast.success('Case Manager removed!');
        })
        .catch((e) => showError(e));
    }
  };

  return (
    <Flex direction="row" borderBottom alignItems="center">
      <Flex direction="row" width="1/4" alignItems="center" pv={5}>
        <Avatar size="xs" name={`${firstName} ${lastName}`} src={avatar} mr={3} />
        <Text fontWeight="700">{`${firstName} ${lastName}`}</Text>
      </Flex>
      <Text width="1/4" whiteSpace="nowrap" overflow="hidden" style={{ textOverflow: 'ellipsis' }}>
        {email}
      </Text>
      <Text width="1/4">{formatPhoneNumber(phone || '')}</Text>
      <Text width="1/4">{caseLoad}</Text>
      <Flex width={12}>
        <Menu>
          <MenuTrigger>
            <DotsVerticalIcon height={6} width={6} cursor="pointer" data-testid="menu" />
          </MenuTrigger>
          <MenuList>
            <MenuGroup>
              <MenuItem minWidth={40} onClick={() => router.push(`/ssp/case-managers/${userId}`)}>
                Edit
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
            <Button colorScheme="primary" onClick={handleRemove}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
