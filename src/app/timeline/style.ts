import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

/* Dropdown para Mobile */
export const MobileDropdown = styled.div`
  display: none;
  position: relative;
  /* Só precisa abrir por cima dos cards; o menu da navbar fica acima */
  z-index: 2;

  @media (max-width: 768px) {
    display: block;
    padding: 15px;
    background: linear-gradient(135deg, #717cba 0%, #5a6699 100%);
  }
`;

export const MobileDropdownButton = styled.button`
  width: 100%;
  padding: 16px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  span {
    font-size: 12px;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const MobileDropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 15px;
  right: 15px;
  margin-top: 5px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  animation: slideDown 0.2s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Estilização da scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(113, 124, 186, 0.3);
    border-radius: 3px;
  }
`;

type MobileDropdownItemProps = {
  isActive: boolean;
};

export const MobileDropdownItem = styled.div<MobileDropdownItemProps>`
  padding: 14px 16px;
  color: ${({ isActive }) => (isActive ? '#717cba' : '#333')};
  background: ${({ isActive }) => (isActive ? 'rgba(113, 124, 186, 0.1)' : 'transparent')};
  font-weight: ${({ isActive }) => (isActive ? '600' : '400')};
  border-left: 3px solid ${({ isActive }) => (isActive ? '#717cba' : 'transparent')};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(113, 124, 186, 0.05);
  }

  &:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

export const Content = styled.div`
  display: flex;
  gap: 0;
  min-height: 600px;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    min-height: 500px;
  }
`;

export const Sidebar = styled.div`
  width: 280px;
  background: linear-gradient(135deg, #717cba 0%, #5a6699 100%);
  padding: 20px;
  border-right: 2px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  h2 {
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    flex-shrink: 0;
  }

  /* Estilização da scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

type SpaceItemProps = {
  isActive: boolean;
};

export const SpaceItem = styled.div<SpaceItemProps>`
  padding: 16px;
  margin-bottom: 8px;
  background: ${({ isActive }) =>
    isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${({ isActive }) => (isActive ? '600' : '400')};
  border-left: 4px solid ${({ isActive }) => (isActive ? '#fff' : 'transparent')};

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(4px);
  }
`;

export const MainContent = styled.div`
  flex: 1;
  padding: 30px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-shrink: 0;
  flex-wrap: wrap;

  h1 {
    color: #141E53;
    font-size: 32px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
    flex-shrink: 0;
  }

  /* Seletor de sessão */
  > div {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    gap: 15px;
    margin-bottom: 20px;

    h1 {
      font-size: 24px;
      width: 100%;
    }

    > div {
      width: 100%;
    }
  }
`;

export const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  padding-right: 10px;

  /* Estilização da scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(113, 124, 186, 0.3);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(113, 124, 186, 0.5);
  }
`;

export const SessionBanner = styled.div<{ $color: string; $soft: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  padding: 14px 18px;
  background-color: ${({ $soft }) => $soft};
  border-left: 6px solid ${({ $color }) => $color};
  border-radius: 8px;
  color: #141e53;
  font-size: 15px;
  flex-shrink: 0;

  strong {
    font-size: 17px;
  }
`;

export const ProjectCard = styled.div<{ $color: string }>`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 6px solid ${({ $color }) => $color};

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`;

export const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
`;

export const Chip = styled.span<{ $color: string; $bg: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ $color }) => $color};
  background-color: ${({ $bg }) => $bg};
`;

export const ProjectTitle = styled.h3`
  color: #141E53;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  text-transform: uppercase;
  line-height: 1.4;
`;

export const ProjectParticipants = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.6;
`;

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 18px;
  flex: 1;
  min-height: 300px;
`;

export const LoadingContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 600px;
  font-size: 18px;
  color: #666;
`;

export const ErrorBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: #fff;
  text-align: center;

  button {
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    background-color: #fff;
    color: #141e53;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      opacity: 0.85;
    }
  }
`;
