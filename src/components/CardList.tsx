import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

export interface ICard {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: ICard[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedImage, setSelectedImage] = useState('');

  const handleViewImage = (url: string) => {
    setSelectedImage(url);
    onOpen();
  };

  return (
    <>
      <SimpleGrid columns={[1, 2, 3]} spacing="40px">
        {cards.map(card => {
          return <Card data={card} key={card.id} viewImage={handleViewImage} />;
        })}
      </SimpleGrid>

      <ModalViewImage
        imgUrl={selectedImage}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
