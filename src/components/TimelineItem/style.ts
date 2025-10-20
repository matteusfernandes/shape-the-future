'use client';

import styled, { keyframes, css } from 'styled-components';

export const Container = styled.div`
  border: 1px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  // min-width: 200px;
  width: 100%;
  cursor: pointer;
`;

// type WrapperTitleProps = {
//   show: boolean;
// };

// export const WrapperTitle = styled.div<WrapperTitleProps>`
//   padding: 10px;
//   min-height: 90px;
//   max-height: 90px;
//   text-align: center;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-weight: 500;
//   text-transform: uppercase;

//   @media (max-width: 460px) {
//     min-height: 0;
//   }

//   ${({ show, theme }) =>
//     show &&
//     `
//     background-color: ${theme.COLORS.WHITE[900]}
//   `}
// `;
export const WrapperTitle = styled.div`
  padding: 10px;
  min-height: 90px;
  max-height: 90px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  text-transform: uppercase;

  @media (max-width: 460px) {
    min-height: 0;
  }
`;

// type TitleProps = {
//   show: boolean;
// };

// export const Title = styled.h2<TitleProps>`
//   color: ${({ theme, show }) =>
//     show ? theme.COLORS.BLUE[200] : theme.COLORS.WHITE[900]};
//   font-size: 18px;
//   font-weight: 700;
//   transition: all ease-in-out 0.5s;
// `;
export const Title = styled.h2`
  color: ${({ theme }) => theme.COLORS.WHITE[900]};
  font-size: 18px;
  font-weight: 700;
  transition: all ease-in-out 0.5s;
`;

const pulsar = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0;
  },
  50% {
    opacity: 1;
  },
  100% {
    transform: scale(1.2);
    opacity: 0;
  }
`;

type WrapperContentProps = {
  show: boolean;
};

export const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

export const EffectDiv = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  height: max-content;
  margin-bottom: 70px;

  @media (max-width: 460px) {
    margin-bottom: 10px;
  }
`;

export const Icon = styled.div`
  &::before {
    content: '';
    display: block;
    position: absolute;
  }

  &::after {
    animation-delay: 0.5s;
  }
  animation: ${pulsar} 1.5s linear infinite;
`;

export const WrapperContent = styled.div<WrapperContentProps>`
  border-top: 1px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  position: relative;
  overflow: hidden;
  transition: all ease-in-out 0.5s;
  height: 410px;
  background: #717cba;

  ${({ show }) =>
    show &&
    css`
      overflow-y: auto;
    `}
`;

type ImageProps = {
  image: string;
  show: boolean;
};

export const ImageDiv = styled.div<ImageProps>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-wrap: wrap;
  background: ${({ image }) => image && `url(${image})`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  transition: all ease-in-out 0.5s;
  height: 100%;

  transform: rotateY(0);

  ${({ show }) =>
    show &&
    `
    transform: rotateY(180deg);
  `}

  span {
    color: ${({ theme }) => theme.COLORS.WHITE[900]};
    font-weight: 600;
    margin-left: 5px;
  }
`;

export const Content = styled.div`
  background: #717cba;
  max-height: 408px;
  width: 100%;
`;

export const ContentHourSpeak = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: ${({ theme }) => theme.COLORS.WHITE[900]};
  border-bottom: 0.5px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  padding: 16px 12px;
  transition: all ease-in-out 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TitleSpeak = styled.span`
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 24px;
  letter-spacing: 0.5px;
`;

export const Speaker = styled.span`
  font-size: 13px;
  line-height: 20px;
  opacity: 0.95;
  font-weight: 400;
`;
