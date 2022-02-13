import styled from 'styled-components';

const buttonCommon = `
margin-top: 8px;
margin-bottom: 4px;
padding: 8px;
border-radius: 6px;
background-color: #fff;
font-weight: bold;
cursor: pointer;
`;

export const StartButton = styled.button<{ recording?: boolean }>`
  ${buttonCommon}
  &:hover {
    background-color: #DAF7A6;
  }
  ${({ recording }) => recording ? 'background-color: #DAF7A6' : 'background-color: #fff;'}
`;

export const StopButton = styled.button<{ recording?: boolean }>`
${buttonCommon}
  &:hover {
    background-color: #FF5233;
  }
  background-color: #fff;
`;

export const MicrophoneContainer = styled.div`
  border: solid 2px #000;
`;