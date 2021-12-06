import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList, ICard } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface FetchImagesParams {
  pageParam?: number;
}

export default function Home(): JSX.Element {
  const fetchImages = async ({ pageParam = null }: FetchImagesParams) => {
    const response = await api.get<{ data: ICard[]; after: string | null }>(
      'api/images',
      pageParam
        ? {
            params: {
              after: pageParam,
            },
          }
        : {}
    );
    return response.data;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => lastPage.after,
  });

  const formattedData = useMemo(() => {
    let cards: ICard[] = [];

    data?.pages.map(page => {
      cards = [...cards, ...page.data];
      return page;
    });

    return cards;
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button
            type="button"
            onClick={() => fetchNextPage()}
            size="lg"
            justifySelf="center"
            w="100%"
            mt="10"
          >
            {isFetchingNextPage ? 'Carregando' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
