'use client';

import styled from 'styled-components';

export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  color: #141e53;

  p {
    line-height: 1.5;
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`;

export const ActionButton = styled.button<{ variant?: 'secondary' | 'danger' }>`
  border: none;
  border-radius: 4.5px;
  padding: 10px 20px;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  color: #fff;
  background: ${({ variant }) =>
    variant === 'secondary'
      ? '#141e53'
      : variant === 'danger'
      ? '#dc3545'
      : '#00c1ce'};

  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export const DropZone = styled.label<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 20px;
  border: 2px dashed ${({ active }) => (active ? '#00c1ce' : '#c5c9dc')};
  border-radius: 8px;
  background: ${({ active }) => (active ? '#e6fafb' : '#f7f8fc')};
  cursor: pointer;
  text-align: center;

  input {
    display: none;
  }
`;

export const Summary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;

  strong {
    display: block;
    font-size: 24px;
  }

  span {
    font-size: 13px;
    color: #666;
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
  align-items: start;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div<{ invalid?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border: 2px solid ${({ invalid }) => (invalid ? '#dc3545' : 'transparent')};
  color: #141e53;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #666;
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #141e53;

  input,
  select {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    font-weight: normal;
    text-transform: none;
    background: #fff;
    box-sizing: border-box;
  }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

export const StudentLine = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6px;
`;

export const LinkButton = styled.button`
  border: none;
  background: none;
  padding: 0;
  color: #00a3ae;
  font-weight: bold;
  font-size: 13px;
  cursor: pointer;
  text-align: left;

  &:hover {
    text-decoration: underline;
  }
`;

export const IconButton = styled.button`
  border: none;
  background: none;
  color: #dc3545;
  font-size: 18px;
  cursor: pointer;
  padding: 0 6px;

  &:hover {
    opacity: 0.7;
  }
`;

export const Messages = styled.ul<{ kind: 'error' | 'warning' }>`
  margin: 0;
  padding: 8px 12px;
  list-style: none;
  border-radius: 6px;
  font-size: 13px;
  background: ${({ kind }) => (kind === 'error' ? '#ffe6e9' : '#fff7e0')};
  color: ${({ kind }) => (kind === 'error' ? '#b02a37' : '#8a6100')};

  li + li {
    margin-top: 4px;
  }
`;
