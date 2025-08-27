import { Flex, Text } from '@disruptive-labs/ui';
import type { StaticImageData } from 'next/image';
import Image from 'next/legacy/image';
import starIcon from '@app/assets/images/icons/star.svg';
import styles from './Testimonial.module.scss';

export interface TestimonialProps {
  author: string;
  title: string;
  body: string;
  image: StaticImageData;
  imageAlt?: string;
}

export function Testimonial({ author, body, image, imageAlt = '', title }: TestimonialProps) {
  return (
    <Flex>
      <Flex>
        <div className={styles.image}>
          <Image src={image} alt={imageAlt} layout="fill" objectFit="cover" />
        </div>
      </Flex>
      <Flex color="light" ph={8} textAlign="left" mt={12}>
        <div>
          <div className={styles.stars}>
            <div>
              <Image src={starIcon} width={0} height={0} alt="star" />
            </div>
            <div>
              <Image src={starIcon} width={0} height={0} alt="star" />
            </div>
            <div>
              <Image src={starIcon} width={0} height={0} alt="star" />
            </div>
            <div>
              <Image src={starIcon} width={0} height={0} alt="star" />
            </div>
            <div>
              <Image src={starIcon} width={0} height={0} alt="star" />
            </div>
          </div>
          <Text mv={4} fontWeight="700" fontSize="lg">
            {title}
          </Text>
          <Text className={styles.quote}>{body}</Text>
          <Text fontWeight="500" mt={4}>
            {author}
          </Text>
        </div>
      </Flex>
    </Flex>
  );
}
