import * as React from 'react';
import { ReactMic } from 'react-mic';
import { MicrophoneContainer, StartButton, StopButton } from './microphone.styled';

export const Microphone = () => {
  const [recordingAudio, setRecordingAudio] = React.useState<boolean>(false);
  const [audioExists, setAudioExists] = React.useState<boolean>(false);

  const startRecording = () => {
    setRecordingAudio(true);
    setAudioExists(false);
  };

  const stopRecording = () => {
    setRecordingAudio(false);
  };

  const onStopRecording = (recordedBlob: any) => {
    console.log('recordedBlob is: ', recordedBlob);
    setAudioExists(true);
    // TODO: make Ajax request to express server and save file as .wav to pass to python module.
  };

  const onData = (recordedBlob: any) => {
    console.log('chunk of real-time data is: ', recordedBlob);
  };

  return (
    <>
      <MicrophoneContainer>
        <ReactMic
          record={recordingAudio}
          className="sound-wave"
          onStop={onStopRecording}
          onData={onData}
          backgroundColor="#fff"
          mimeType="audio/wav"
        />
      </MicrophoneContainer>
      <StartButton recording={recordingAudio} onClick={startRecording} type="button">Start</StartButton>
      <StopButton onClick={stopRecording} type="button">Stop</StopButton>
      {audioExists ? <label>We recorded something</label> : null}
    </>
  );
};