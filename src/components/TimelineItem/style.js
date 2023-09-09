import styled from 'styled-components';

export const Container = styled.div`
  border: 1px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  min-width: 200px;
  cursor: pointer;
`;

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

  ${({ show, theme }) =>
    show &&
    `
    background-color: ${theme.COLORS.WHITE[900]}
  `}
`;

export const Title = styled.h2`
  color: ${({ theme, show }) =>
    show ? theme.COLORS.BLUE[200] : theme.COLORS.WHITE[900]};
  font-size: 22px;
  font-weight: 700;
  transition: all ease-in-out 0.5s;
`;

export const WrapperContent = styled.div`
  border-top: 1px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  position: relative;
  overflow: hidden;
  transition: all ease-in-out 0.5s;
  height: 410px;
  background: #717cba;

  ${({ show }) =>
    show &&
    `
    overflow-y: auto;
  `}
`;

export const Image = styled.div`
  width: 100%;
  display: block;
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
`;

export const Content = styled.div`
  background: #717cba;
  max-height: 408px;
  width: 100%;
`;

export const ContentHourSpeak = styled.div`
  color: ${({ theme }) => theme.COLORS.WHITE[900]};
  margin: 20px 10px;
  border-bottom: 2px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  padding-bottom: 20px;
  text-align: center;
`;

export const WrapperHour = styled.div`
  display: flex;
  align-items: center;
`;

export const Hour = styled.h3`
  font-size: 14px;
  font-weight: 700;
  margin-right: 5px;
`;

export const TitleSpeak = styled.span`
  font-size: 12px;
  text-transform: uppercase;
`;

export const Speaker = styled.span`
  display: block;
  font-size: 10px;
  margin-top: 10px;
`;
