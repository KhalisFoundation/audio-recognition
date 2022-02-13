import * as React from 'react';
import { ReactMic } from 'react-mic';
import { MicrophoneContainer, StartButton, StopButton } from './microphone.styled';
import axios from 'axios';

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

  const onStopRecording = async (recordedBlob: { blob: Blob, startTime: number, stopTime: number, blobURL: string } ) => {
    const timeLength = (recordedBlob.stopTime - recordedBlob.startTime) / 1000;
    // console.log('recordedBlob is: ', recordedBlob);
    console.log('Recording length (s): ', timeLength);
    
    
    const data = new FormData();
    data.append('recording', recordedBlob.blob, "recordedAudio");
    const response = await axios.post('http://localhost:4000/classify', data, {
      headers : {
        'Content-Type' : 'audio/wav'
      }
    });
    console.log(response.data);
    // TODO: do something with the response. 

    setAudioExists(true);
  };


  const onData = (recordedBlob: any) => {
    // console.log('chunk of real-time data is: ', recordedBlob);
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