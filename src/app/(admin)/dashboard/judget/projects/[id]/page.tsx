'use client';

import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';

import { http } from '@/lib/http';
import { Modal } from '@/components/Modal';

import {
  ContentForm,
  FormLine,
  FormName,
  HeaderContent,
  WrapperButtons,
  WrapperContent
} from '../../../style';
import { LoadingContent } from '@/app/timeline/style';

type VoteDetails = {
  id: number;
  projectId: number;
  reqCommunication: number;
  reqCreation: number;
  reqIdentify: number;
  reqInteraction: number;
  reqProject: number;
  userId: number;
  project: {
    id: number;
    title: string;
    subtitle: string;
  };
};

export type Judget = {
  id: number;
  username: string;
  password: string;
  role: string;
  spaceId: number;
  juryVotes: unknown;
};

export default function Project({ params: { id } }) {
  const [projects, setProjects] = useState<VoteDetails[]>([]);
  const [showModal, setShowModal] = useState<VoteDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const handleProjects = useCallback(async () => {
    setLoading(true);
    const { data } = await http.get(`/vote/${id}`);
    setProjects(data);
    setLoading(false);
  }, [id]);

  const handleVotesDetails = useCallback((user: VoteDetails | null) => {
    setShowModal(user);
  }, []);

  useEffect(() => {
    handleProjects();
  }, [handleProjects]);

  return (
    <>
      {!_.isEmpty(showModal) ? (
        <Modal showModal={showModal} onClose={() => handleVotesDetails(null)} />
      ) : null}

      <WrapperContent>
        <HeaderContent>
          <h3>Todos os Projetos Votados</h3>
        </HeaderContent>

        <ContentForm>
          {_.isEmpty(projects) ? (
            <LoadingContent>
              {loading ? 'Carregando...' : 'Juiz ainda não votou'}
            </LoadingContent>
          ) : (
            projects?.map((votes) => {
              const { project } = votes;

              return (
                <FormLine key={project?.id?.toString()}>
                  <FormName>
                    <span>
                      {project?.title.toLowerCase()} |{' '}
                      {project?.subtitle.toLowerCase()}
                    </span>
                  </FormName>

                  <WrapperButtons onClick={() => handleVotesDetails(votes)}>
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
                  </WrapperButtons>
                </FormLine>
              );
            })
          )}
        </ContentForm>
      </WrapperContent>
    </>
  );
}
