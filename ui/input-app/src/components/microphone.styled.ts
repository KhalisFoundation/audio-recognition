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

export const MicrophoneContainer = styled.div<{ recording?: boolean }>`
  border: solid 2px #000;
  border-radius: 100px;
  width: 100px;
  height: 100px;

  canvas {
    ${({ recording }) => recording ? 'visibility: visiable;' : 'visibility: hidden;'}
    border-radius: 100px;
    width: 100px;
    height: 100px;
  }
`;