import * as React from 'react';
import { ReactMic } from 'react-mic';
import { MicrophoneContainer, StartButton, StopButton } from './microphone.styled';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";

export const Microphone = () => {
  const [recordingAudio, setRecordingAudio] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [audioExists, setAudioExists] = React.useState<boolean>(false);
  const [match, setMatch] = React.useState<string>('');
  const [confidence, setConfidence] = React.useState<number>();

  const startRecording = () => {
    setRecordingAudio(true);
    setAudioExists(false);
  };

  const stopRecording = () => {
    setRecordingAudio(false);
  };

  const onStopRecording = async (recordedBlob: { blob: Blob, startTime: number, stopTime: number, blobURL: string }) => {
    setIsLoading(true);
    const timeLength = (recordedBlob.stopTime - recordedBlob.startTime) / 1000;
    console.log('Recording length (s): ', timeLength);


    const data = new FormData();
    data.append('recording', recordedBlob.blob, "recordedAudio");
    const response = await axios.post('http://localhost:4000/classify', data, {
      headers: {
        'Content-Type': 'audio/webm'
      }
    });
    console.log(response.data.message);
    setAudioExists(true);
    setConfidence(response.data.confidence);
    setMatch(response.data.match);
    setIsLoading(false);
  };


  const onData = (recordedBlob: Blob) => {
    console.log('chunk of real-time data is: ', recordedBlob);
  };

  return (
    <>
      <MicrophoneContainer recording={recordingAudio}>
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
      {isLoading && <ClipLoader/>}
      {audioExists ? <><label>We got a match:</label>{match} with {confidence}% confidence</> : null}
    </>
  );
};