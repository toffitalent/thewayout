import { Box, Flex, FlexComponentProps, Text } from '@disruptive-labs/ui';

interface SectionInfoItemProps extends FlexComponentProps {
  icon: any;
  title: string;
  text1: string;
  text2: string;
  text3?: string;
  description?: string;
}

export const SectionInfoItem = ({
  icon,
  title,
  text1,
  text2,
  text3,
  description,
  ...props
}: SectionInfoItemProps) => (
  <Flex direction="row" {...props}>
    <Box color="primary" mr={5} display="flex">
      {icon}
    </Box>
    <Box>
      <Text fontWeight="700">{title}</Text>
      <Text fontSize="sm">{text1}</Text>
      <Text fontSize="sm" color="grey.500">
        {text2}
      </Text>
      {text3 && (
        <Text fontSize="sm" color="grey.500">
          {text3}
        </Text>
      )}
      <Text fontSize="sm" pt={2}>
        {description}
      </Text>
    </Box>
  </Flex>
);
