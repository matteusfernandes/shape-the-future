'use client';

import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

import { http } from '@/lib/http';
import { Modal } from '@/components/Modal';

import {
  ContentForm,
  FormLine,
  HeaderButton,
  HeaderContent,
  RemoveButton,
  WrapperContent
} from '../style';

type Space = { id: number; name: string };

type Judget = {
  id: number;
  username: string;
  password: string;
  role: string;
  spaceId: number;
};

export default function Judget() {
  const [showModal, setShowModal] = useState<Judget | null>(null);
  const [judget, setJudget] = useState<Judget[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const { data: session } = useSession();

  const handleJudgeAndSpaces = useCallback(async () => {
    const [user, spaces] = await Promise.all([
      http.get<Judget[]>('/user'),
      http.get<Space[]>('/spaces')
    ]);

    setJudget(user.data as Judget[]);
    setSpaces(spaces.data as Space[]);
  }, []);

  const handleRemoveSpace = useCallback(
    async (user: Judget) => {
      await http.delete(`/user/${user.id}`);
      toast.success(`${user.username} - removido com sucesso!`);
      handleJudgeAndSpaces();
    },
    [handleJudgeAndSpaces]
  );

  const handleVotesDetails = useCallback((user: Judget | null) => {
    setShowModal(user);
  }, []);

  useEffect(() => {
    handleJudgeAndSpaces();
  }, [handleJudgeAndSpaces]);

  return (
    <>
      {!_.isEmpty(showModal) ? (
        <Modal judge={showModal} onClose={() => handleVotesDetails(null)} />
      ) : null}

      <WrapperContent>
        <HeaderContent>
          <h3>Todos os Jurados</h3>

          <HeaderButton href="/dashboard/judget/create">
            Adicionar Jurado
          </HeaderButton>
        </HeaderContent>

        <ContentForm>
          {judget?.map((judge) => {
            const spaceProject = spaces.find((s) => s?.id === judge?.id);
            const isLoggedAndIsAdmin =
              !_.isEqual(session?.user?.id, judge?.id?.toString()) &&
              _.isEqual(session?.user?.role, 'admin');

            return (
              <FormLine key={judge?.id?.toString()}>
                <div>
                  <span>{judge?.username} | </span>

                  <span>{spaceProject?.name}</span>
                </div>

                {isLoggedAndIsAdmin && (
                  <>
                    <RemoveButton onClick={() => handleVotesDetails(judge)}>
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        stroke="#0066ff"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </RemoveButton>

                    <RemoveButton onClick={() => handleRemoveSpace(judge)}>
                      <svg
                        viewBox="0 0 24 24"
                        width="18"
                        height="18"
                        stroke="red"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </RemoveButton>
                  </>
                )}
              </FormLine>
            );
          })}
        </ContentForm>
      </WrapperContent>
    </>
  );
}
