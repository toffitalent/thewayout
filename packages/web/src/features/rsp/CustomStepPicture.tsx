import { Avatar, Box, Button, Flex, Text, useWizardContext, WizardStep } from '@disruptive-labs/ui';
import { ChangeEvent, useRef, useState } from 'react';
import { MediaType } from '@two/shared';
import { API } from '@app/api';
import { useAppSelector } from '@app/hooks';
import { selectAuthUser } from '../auth';
import type { WizardRspData } from './rspData';

export const CustomStepPicture = (props: Partial<WizardStep>) => {
  const { next, data } = useWizardContext<WizardRspData>();
  const user = useAppSelector(selectAuthUser);
  const ref = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState<string>(data.avatarUrl || '');

  const { nextButtonLabel } = props;

  const handleSubmit = async () => {
    let avatar;
    if (file) {
      const { key } = await API.uploads.create(MediaType.Avatar, file);
      avatar = key;
    }
    await next({
      ...data,
      ...(avatar && { avatar }),
      ...(url && { avatarUrl: url }),
    });
  };

  const handleImgChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setUrl(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <Flex>
      <Avatar size="2xl" name={`${user?.firstName} ${user?.lastName}`} src={url} />
      <Box mt={5}>
        <Button variant="outline" mb={2} onClick={() => ref.current?.click()}>
          Edit Picture
        </Button>
        <input
          type="file"
          accept="image/jpg, image/png, image/gif"
          hidden
          ref={ref}
          onChange={handleImgChange}
        />
      </Box>
      <Text fontSize="sm" color="grey.600">
        JPG, GIF or PNG. 1MB max.
      </Text>
      <Button colorScheme="primary" fluid width={96} mt={8} onClick={handleSubmit}>
        {nextButtonLabel}
      </Button>
    </Flex>
  );
};
