# audio-recognition
Data Collection

    Pre requisite
        1. To get original training data: youtube-dl
        2. To create labelled training data - Audacity
        Configure audacity to point to 64 bit ffmpeg
        Mac: https://manual.audacityteam.org/man/installing_ffmpeg_for_mac.html
        Windows: https://manual.audacityteam.org/man/installing_ffmpeg_for_windows.html

1. Download youtube videos as audio format - m4a
https://medium.com/@jsaluja/download-audio-m4a-with-youtube-dl-957791ff6f7a
2. Open downloaded file in Audacity, zoom in on waveform
3. Play, select clip, export as .wav
4. Upload to KhalisMoolMantarClips https://drive.google.com/drive/folders/1wuorveZ00eHpns1vcMk7_CESM2TX5xBo


Training

    Pre requisite
        1. To convert media files to wav - ffmpeg

1. Download KhalisMoolMantarClips from https://drive.google.com/drive/folders/1wuorveZ00eHpns1vcMk7_CESM2TX5xBo
2. mkdir dataset
3. unzip KhalisMoolMantarClips.zip dataset
4. python prepare_dataset
5. python train


Inference
1. mkdir test
2. Create samples in test folder
3. python audio_classification_service
