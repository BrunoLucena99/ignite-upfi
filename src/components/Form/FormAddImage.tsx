import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface SaveImagePayload {
  description: string;
  url: string;
  title: string;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: 'Campo obrigatório',
      validate: {
        lessThan10MB: file =>
          file[0].size < 10485760 || 'O arquivo deve ser menor que 10MB',
        test: file => {
          const re = new RegExp('image/(gif|png|jpeg)');
          return (
            re.test(file[0].type) ||
            'Somente são aceitos arquivos PNG, JPEG e GIF'
          );
        },
      },
    },
    title: {
      required: 'Título obrigatório',
      maxLength: { value: 20, message: 'Máximo de 20 caracteres' },
      minLength: { value: 2, message: 'Mínimo de 2 caracteres' },
    },
    description: {
      required: 'Descrição obrigatória',
      maxLength: { value: 60, message: 'Máximo de 60 caracteres' },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (data: SaveImagePayload) => api.post('api/images', data),
    {
      onSuccess: () => queryClient.invalidateQueries('images'),
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, string>): Promise<void> => {
    try {
      if (!imageUrl.trim()) {
        toast({
          status: 'error',
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
        });
      }

      mutation.mutate({
        description: data.description,
        url: imageUrl,
        title: data.title,
      });

      toast({
        status: 'success',
        title: 'Sucesso',
        description: 'Imagem adicionada com sucesso',
      });
    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
    } finally {
      reset();
      setLocalImageUrl('');
      setImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', formValidations.image)}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          {...register('title', formValidations.title)}
          error={errors.title}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          {...register('description', formValidations.description)}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
