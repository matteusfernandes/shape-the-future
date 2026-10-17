'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useTimeline } from '@/hooks/useTimeline';
import {
  ALL,
  TIMELINE_SESSIONS,
  buildEntries,
  applyFilters
} from '@/lib/timeline';

import { MapPinIcon, SearchIcon, StarIcon, UsersIcon } from './icons';
import {
  Card,
  CardText,
  Cards,
  ClearButton,
  Dot,
  EmptyBox,
  FinalistTag,
  Hero,
  HeroHeading,
  HeroRow,
  HeroTitle,
  Interval,
  Kicker,
  Main,
  Page,
  People,
  PrimaryButton,
  SearchField,
  SearchInput,
  SessionBody,
  SessionButton,
  SessionEmpty,
  SessionGroup,
  SessionHeader,
  SessionLabel,
  SessionSwitch,
  ShowAllLink,
  SpaceBar,
  SpaceLabel,
  SpacePill,
  SpacePills,
  SpaceTag,
  StatusBox,
  Summary,
  SummaryRow,
  Tags
} from './style';

const SESSION_OPTIONS = [
  {
    value: ALL,
    label: 'Dia todo',
    short: 'Tudo',
    dot: '#fff'
  },
  ...TIMELINE_SESSIONS.map((session, index) => ({
    value: index,
    label: session.label,
    short: session.label,
    dot: session.color
  }))
];

// Busca na URL (?q=ana) para poder compartilhar o link
const readParam = (name: string) => {
  try {
    return new URLSearchParams(window.location.search).get(name);
  } catch {
    return null;
  }
};

const writeQuery = (query: string) => {
  try {
    const url = new URL(window.location.href);
    query ? url.searchParams.set('q', query) : url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
  } catch {
    // sem acesso ao histórico: a busca só não fica no link
  }
};

const useIsMobile = () => {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return mobile;
};

export default function Timeline() {
  const { spaces: data, error, reload } = useTimeline();
  const isMobile = useIsMobile();

  const [query, setQuery] = useState('');
  const [session, setSession] = useState(ALL);
  const [spaceId, setSpaceId] = useState(ALL);

  useEffect(() => {
    setQuery(readParam('q') ?? '');
  }, []);

  const changeQuery = useCallback((value: string) => {
    setQuery(value);
    writeQuery(value.trim());
  }, []);

  const reset = useCallback(() => {
    changeQuery('');
    setSession(ALL);
    setSpaceId(ALL);
  }, [changeQuery]);

  const { entries, spaces } = useMemo(() => buildEntries(data ?? []), [data]);

  const { shown } = applyFilters(entries, {
    query,
    session,
    spaceId
  });

  const spaceName = spaces.find((space) => space.id === spaceId)?.name;
  const where = spaceName ? ` em ${spaceName}` : '';
  const trimmed = query.trim();
  const anyFilter = !!trimmed || session !== ALL || spaceId !== ALL;

  if (error) {
    return (
      <Page>
        <StatusBox>
          Não foi possível carregar o cronograma.
          <PrimaryButton type="button" onClick={reload}>
            Tentar novamente
          </PrimaryButton>
        </StatusBox>
      </Page>
    );
  }

  return (
    <Page>
      <Hero>
        <HeroHeading>
          <Kicker>CRONOGRAMA</Kicker>
          <HeroTitle>Encontre sua sessão e sua sala</HeroTitle>
        </HeroHeading>

        <HeroRow>
          <SearchField>
            <SearchIcon size={28} />
            <SearchInput
              type="search"
              value={query}
              aria-label="Buscar por nome ou projeto"
              placeholder={
                isMobile
                  ? 'Seu nome ou projeto'
                  : 'Digite seu nome ou o nome do projeto'
              }
              onChange={(event) => changeQuery(event.target.value)}
            />
            {query ? (
              <ClearButton type="button" onClick={() => changeQuery('')}>
                Limpar
              </ClearButton>
            ) : null}
          </SearchField>

          <SessionSwitch role="group" aria-label="Sessão">
            {SESSION_OPTIONS.map((option) => (
              <SessionButton
                key={option.value}
                type="button"
                aria-pressed={session === option.value}
                $active={session === option.value}
                onClick={() => setSession(option.value)}
              >
                <SessionLabel>
                  <Dot $color={option.dot} />
                  <span className="long">{option.label}</span>
                  <span className="short">{option.short}</span>
                </SessionLabel>
              </SessionButton>
            ))}
          </SessionSwitch>
        </HeroRow>
      </Hero>

      <SpaceBar>
        <SpaceLabel>Onde?</SpaceLabel>
        <SpacePills role="group" aria-label="Espaço">
          {[{ id: ALL, name: 'Todos' }, ...spaces].map((space) => {
            const active = space.id === spaceId;

            return (
              <SpacePill
                key={space.id}
                type="button"
                aria-pressed={active}
                $active={active}
                onClick={() => setSpaceId(space.id)}
              >
                {space.name}
              </SpacePill>
            );
          })}
        </SpacePills>
      </SpaceBar>

      <Main>
        {data === null ? (
          <StatusBox>Carregando...</StatusBox>
        ) : (
          <>
            <SummaryRow>
              <Summary aria-live="polite">
                {/* Sem quantidades: o público não precisa saber quantos
                    projetos há em cada sala ou sessão */}
                {trimmed
                  ? `Resultados para "${trimmed}"${where}`
                  : spaceName
                  ? `Apresentações em ${spaceName}`
                  : 'Todas as apresentações'}
              </Summary>
              {anyFilter ? (
                <ShowAllLink type="button" onClick={reset}>
                  Mostrar tudo
                </ShowAllLink>
              ) : null}
            </SummaryRow>

            {shown.length ? (
              TIMELINE_SESSIONS.map((item, index) => ({ item, index }))
                .filter(({ index }) => session === ALL || session === index)
                .map(({ item, index }, position) => {
                  const sessionEntries = shown.filter(
                    (entry) => entry.session === index
                  );

                  return (
                    <SessionGroup key={item.label}>
                      {position > 0 ? <Interval>Intervalo</Interval> : null}

                      <SessionBody>
                        <SessionHeader $color={item.color}>
                          <span className="label">{item.label}</span>
                        </SessionHeader>

                        {sessionEntries.length ? (
                          <Cards>
                            {sessionEntries.map((entry) => (
                              <Card key={entry.id}>
                                <Tags>
                                  <SpaceTag>
                                    <MapPinIcon size={18} />
                                    {entry.spaceName}
                                  </SpaceTag>
                                  {entry.finalist ? (
                                    <FinalistTag>
                                      <StarIcon size={16} />
                                      Finalista
                                    </FinalistTag>
                                  ) : null}
                                </Tags>

                                <CardText>
                                  <h3>{entry.title}</h3>
                                  {entry.subtitle ? (
                                    <p>{entry.subtitle}</p>
                                  ) : null}
                                </CardText>

                                {entry.people ? (
                                  <People>
                                    <UsersIcon size={20} />
                                    {entry.people}
                                  </People>
                                ) : null}
                              </Card>
                            ))}
                          </Cards>
                        ) : null}

                        {!sessionEntries.length ? (
                          <SessionEmpty>
                            Nenhuma apresentação nesta sessão com esses filtros.
                          </SessionEmpty>
                        ) : null}
                      </SessionBody>
                    </SessionGroup>
                  );
                })
            ) : (
              <EmptyBox>
                <strong>
                  {trimmed
                    ? `Não encontramos "${trimmed}"${where}.`
                    : `Nenhuma apresentação${where}.`}
                </strong>
                {trimmed ? (
                  <p>
                    Confira se o nome está escrito certo ou tente só o primeiro
                    nome.
                  </p>
                ) : null}
                {anyFilter ? (
                  <PrimaryButton type="button" onClick={reset}>
                    Mostrar tudo
                  </PrimaryButton>
                ) : null}
              </EmptyBox>
            )}
          </>
        )}
      </Main>
    </Page>
  );
}
