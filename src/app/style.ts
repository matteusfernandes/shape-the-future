import styled from 'styled-components';

export const Container = styled.div`
  border: 1px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  display: flex;
  flex-flow: column nowrap;
  margin: 80px auto;
  max-width: 1210px;
  min-height: 670px;

  @media (max-width: 585px) {
    margin: 0 auto;
  }
`;

export const Header = styled.div`
  display: flex;
  padding: 10px;
  height: 30px;
  width: 100%;
`;

export const Options = styled.div`
  background-color: ${({ theme }) => theme.COLORS.WHITE[900]};
  border-radius: 7px;
  height: 14px;
  width: 14px;
  margin-right: 8px;
`;

export const Columns = styled.div`
  display: grid;
  grid-template-areas: 'content image';
  grid-template-columns: repeat(2, 1fr);

  @media (max-width: 910px) {
    grid-template-areas: 'image' 'content';
    grid-template-columns: 1fr;
  }
`;

export const Content = styled.div`
  color: ${({ theme }) => theme.COLORS.WHITE[900]};
  padding: 40px 30px;
  grid-area: content;
`;

export const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 20px;
`;

export const Description = styled.p`
  font-size: 18px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.COLORS.WHITE[100]}db;
`;

export const ContentRight = styled.div`
  grid-area: image;
  overflow: hidden;

  @media (max-width: 910px) {
    height: 100px;
  }
`;

export const ImageRight = styled.img`
  background-color: ${({ theme }) => theme.COLORS.WHITE[900]};
  height: 100%;

  @media (max-width: 910px) {
    height: auto !important;
    width: 100%;
  }
`;

export const LeftFooter = styled.div`
  background-color: ${({ theme }) => theme.COLORS.WHITE[900]};
  display: flex;
  align-items: center;
  justify-content: center;
  grid-area: content;
`;

export const ImageFooter = styled.img`
  background-color: ${({ theme }) => theme.COLORS.WHITE[900]};
  max-width: 70%;
`;

export const RightFooter = styled.div`
  grid-area: image;
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const RightBlock = styled.span`
  color: ${({ theme }) => theme.COLORS.WHITE[900]};
  border: 1px ${({ theme }) => theme.COLORS.WHITE[900]} solid;
  font-weight: 500;
  font-size: 20px;
  text-transform: uppercase;
  text-align: center;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  min-height: 100px;

  span {
    font-size: 24px;
  }
`;
