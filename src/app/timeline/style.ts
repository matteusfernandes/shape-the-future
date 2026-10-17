'use client';

import styled, { css } from 'styled-components';

// Tokens do redesign do cronograma (design_handoff_cronograma)
const T = {
  navy: '#141E53',
  heroFrom: '#717cba',
  heroTo: '#5a6699',
  page: '#f5f5f5',
  surface: '#fff',
  tint: '#EEF0FA',
  tintHover: '#dfe2f3',
  ring: '#d6daf0',
  border: '#e3e5f0',
  borderSoft: '#f0f1f6',
  dashed: '#c9cde3',
  text2: '#4a5280',
  meta: '#5a6699',
  placeholder: '#7a80a8',
  focus: '#EC72A1'
};

const MOBILE = '@media (max-width: 768px)';

const focusRing = css`
  &:focus-visible {
    outline: 3px solid ${T.focus};
    outline-offset: 2px;
  }
`;

const resetButton = css`
  appearance: none;
  border: none;
  background: none;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  ${focusRing}
`;

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${T.page};
  color: ${T.navy};
  line-height: normal;
`;

/* ---------- 1. Hero ---------- */

export const Hero = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 44px 48px 40px;
  background: linear-gradient(135deg, ${T.heroFrom} 0%, ${T.heroTo} 100%);
  color: #fff;

  ${MOBILE} {
    gap: 16px;
    padding: 24px 16px;
  }
`;

export const HeroHeading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  ${MOBILE} {
    gap: 4px;
  }
`;

export const Kicker = styled.div`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.08em;

  ${MOBILE} {
    font-size: 14px;
  }
`;

export const HeroTitle = styled.h1`
  margin: 0;
  font-size: 44px;
  font-weight: 800;
  line-height: 1.15;
  text-wrap: pretty;

  ${MOBILE} {
    font-size: 28px;
    line-height: 1.2;
  }
`;

export const HeroRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 20px;
  align-items: stretch;

  ${MOBILE} {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
`;

export const SearchField = styled.label`
  display: flex;
  align-items: center;
  gap: 14px;
  height: 68px;
  padding: 0 20px;
  background: #fff;
  border-radius: 14px;
  color: ${T.navy};

  svg {
    flex: none;
  }

  ${MOBILE} {
    gap: 10px;
    height: 56px;
    padding: 0 14px;
    border-radius: 12px;

    svg {
      width: 22px;
      height: 22px;
    }
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  appearance: none;
  font: inherit;
  font-size: 21px;
  font-weight: 500;
  color: ${T.navy};
  ${focusRing}

  &::placeholder {
    color: ${T.placeholder};
  }

  /* Remove o "x" nativo do campo de busca */
  &::-webkit-search-cancel-button {
    display: none;
  }

  ${MOBILE} {
    font-size: 18px;
  }
`;

export const ClearButton = styled.button`
  ${resetButton}
  flex: none;
  padding: 10px 14px;
  border-radius: 10px;
  background: ${T.tint};
  font-size: 15px;
  font-weight: 700;

  &:hover {
    background: ${T.tintHover};
  }

  ${MOBILE} {
    padding: 8px 10px;
    border-radius: 8px;
    font-size: 14px;
  }
`;

export const SessionSwitch = styled.div`
  display: flex;
  gap: 8px;
  padding: 6px;
  background: rgba(20, 30, 83, 0.25);
  border-radius: 14px;

  ${MOBILE} {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
    padding: 5px;
    border-radius: 12px;
  }
`;

export const SessionButton = styled.button<{ $active: boolean }>`
  ${resetButton}
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  min-width: 150px;
  min-height: 56px;
  padding: 0 18px;
  border-radius: 10px;
  text-align: left;
  background: ${({ $active }) => ($active ? '#fff' : 'transparent')};
  color: ${({ $active }) => ($active ? T.navy : '#fff')};

  &:hover {
    filter: brightness(1.06);
  }

  ${MOBILE} {
    min-width: 0;
    padding: 6px 10px;
    border-radius: 9px;
  }
`;

export const SessionLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 700;

  /* Rótulo curto ("Tudo") só no mobile */
  .short {
    display: none;
  }

  ${MOBILE} {
    gap: 6px;
    font-size: 15px;

    .long {
      display: none;
    }

    .short {
      display: inline;
    }
  }
`;

export const Dot = styled.span<{ $color: string }>`
  flex: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $color }) => $color};

  ${MOBILE} {
    width: 10px;
    height: 10px;
  }
`;

/* ---------- 2. Filtro de espaços ---------- */

export const SpaceBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 18px 48px;
  background: #fff;
  border-bottom: 2px solid ${T.border};

  ${MOBILE} {
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: 8px;
    padding: 12px 16px;
  }
`;

export const SpaceLabel = styled.span`
  margin-right: 6px;
  font-size: 16px;
  font-weight: 700;

  ${MOBILE} {
    margin-right: 0;
    font-size: 15px;
  }
`;

export const SpacePills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  ${MOBILE} {
    flex-wrap: nowrap;
    gap: 8px;
    padding-bottom: 4px;
    overflow-x: auto;
  }
`;

export const SpacePill = styled.button<{ $active: boolean }>`
  ${resetButton}
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 18px;
  border: 2px solid ${T.navy};
  border-radius: 999px;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  background: ${({ $active }) => ($active ? T.navy : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : T.navy)};

  &:hover {
    box-shadow: 0 0 0 3px ${T.ring};
  }

  ${MOBILE} {
    flex: none;
    gap: 6px;
    padding: 0 14px;
    font-size: 15px;
  }
`;

/* ---------- 3. Lista ---------- */

// Ocupa só o espaço restante do contêiner do site, sem altura mínima própria
export const Main = styled.main`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 28px;
  padding: 32px 48px 56px;

  ${MOBILE} {
    gap: 20px;
    padding: 20px 16px 40px;
  }
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  ${MOBILE} {
    gap: 12px;
  }
`;

export const Summary = styled.div`
  font-size: 20px;
  font-weight: 700;

  ${MOBILE} {
    font-size: 17px;
  }
`;

export const ShowAllLink = styled.button`
  ${resetButton}
  flex: none;
  font-size: 16px;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;

  &:hover {
    color: ${T.meta};
  }

  ${MOBILE} {
    padding: 12px 0;
    font-size: 15px;
  }
`;

export const SessionGroup = styled.section`
  display: flex;
  flex-direction: column;
  gap: 28px;

  ${MOBILE} {
    gap: 20px;
  }
`;

export const Interval = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  color: ${T.meta};
  font-size: 18px;
  font-weight: 700;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-top: 3px dashed ${T.dashed};
  }

  ${MOBILE} {
    gap: 10px;
    font-size: 15px;
  }
`;

export const SessionBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  ${MOBILE} {
    gap: 14px;
  }
`;

export const SessionHeader = styled.h2<{ $color: string }>`
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin: 0;
  padding: 16px 24px;
  border-radius: 14px;
  background: ${({ $color }) => $color};
  color: ${T.navy};
  font-weight: inherit;

  .label {
    font-size: 26px;
    font-weight: 800;
  }

  ${MOBILE} {
    flex-wrap: wrap;
    gap: 4px 10px;
    padding: 14px 16px;
    border-radius: 12px;

    .label {
      font-size: 21px;
    }
  }
`;

export const SessionEmpty = styled.p`
  margin: 0;
  padding: 24px 4px;
  font-size: 18px;
  color: ${T.meta};

  ${MOBILE} {
    padding: 4px;
    font-size: 16px;
  }
`;

export const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;

  ${MOBILE} {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }
`;

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 22px;
  background: #fff;
  border: 2px solid ${T.border};
  border-radius: 16px;

  ${MOBILE} {
    gap: 10px;
    padding: 16px;
    border-radius: 14px;
  }
`;

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  ${MOBILE} {
    gap: 6px;
  }
`;

export const SpaceTag = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 10px;
  background: ${T.tint};
  font-size: 16px;
  font-weight: 700;

  ${MOBILE} {
    padding: 5px 10px;
    border-radius: 9px;
    font-size: 15px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export const FinalistTag = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 10px;
  background: ${T.navy};
  color: #fff;
  font-size: 14px;
  font-weight: 700;

  ${MOBILE} {
    gap: 5px;
    padding: 5px 10px;
    border-radius: 9px;
    font-size: 13px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

export const CardText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  h3 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.3;
    text-wrap: pretty;
  }

  p {
    margin: 0;
    font-size: 16px;
    line-height: 1.45;
    color: ${T.text2};
  }

  ${MOBILE} {
    gap: 3px;

    h3 {
      font-size: 19px;
    }

    p {
      font-size: 15px;
    }
  }
`;

export const People = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-top: 12px;
  border-top: 2px solid ${T.borderSoft};
  font-size: 16px;
  line-height: 1.5;

  ${MOBILE} {
    gap: 8px;
    padding-top: 10px;
    font-size: 15px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

export const EmptyBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding: 40px;
  border: 3px dashed ${T.dashed};
  border-radius: 16px;

  strong {
    font-size: 24px;
    font-weight: 700;
  }

  p {
    margin: 0;
    font-size: 17px;
    line-height: 1.5;
    color: ${T.text2};
  }

  ${MOBILE} {
    padding: 24px;

    strong {
      font-size: 20px;
    }
  }
`;

export const PrimaryButton = styled.button`
  ${resetButton}
  margin-top: 8px;
  height: 48px;
  padding: 0 22px;
  border-radius: 12px;
  background: ${T.navy};
  color: #fff;
  font-size: 17px;
  font-weight: 700;

  &:hover {
    background: #2a3577;
  }
`;

export const StatusBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 16px;
  padding: 40px 16px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: ${T.meta};
`;

// Usado também pela página de avaliações
export const LoadingContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 600px;
  font-size: 18px;
  color: #666;
`;
