import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import {
  useListContentBlocks,
  useUpdateContentBlock,
  getListContentBlocksQueryKey,
  ContentBlock,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';

type ContentContextType = {
  get: (key: string, fallback: string) => string;
  save: (key: string, value: string) => void;
};

const ContentContext = createContext<ContentContextType>({
  get: (_key, fallback) => fallback,
  save: () => {},
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data: blocks } = useListContentBlocks();
  const { mutate: updateBlock } = useUpdateContentBlock();

  const map = new Map<string, string>(
    (blocks ?? []).map((b: ContentBlock) => [b.key, b.value]),
  );

  const get = useCallback(
    (key: string, fallback: string) => {
      const v = map.get(key);
      return v !== undefined && v !== '' ? v : fallback;
    },
    [blocks],
  );

  const save = useCallback(
    (key: string, value: string) => {
      updateBlock(
        { key, data: { value } },
        {
          onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: getListContentBlocksQueryKey() }),
        },
      );
    },
    [updateBlock, queryClient],
  );

  return <ContentContext.Provider value={{ get, save }}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
