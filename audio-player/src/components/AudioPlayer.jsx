import React, { useState, useEffect } from "react";

function AudioPlayer() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audio, setAudio] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const lastPlayedAudio = localStorage.getItem("lastPlayedAudio");
    const lastPosition = parseFloat(localStorage.getItem("lastPosition"));

    if (lastPlayedAudio) {
      setAudio(new Audio(lastPlayedAudio));
      audio.currentTime = lastPosition;
      setCurrentTrackIndex(
        audioFiles.findIndex((file) => file === lastPlayedAudio)
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lastPlayedAudio", audio.src);
    localStorage.setItem("lastPosition", audio.currentTime.toString());

    return () => {
      audio.removeEventListener("ended", playNextTrack);
    };
  }, [audio.src, audio.currentTime]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const newAudioFiles = [];

    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith("audio/")) {
        newAudioFiles.push(URL.createObjectURL(files[i]));
      }
    }

    setAudioFiles([...audioFiles, ...newAudioFiles]);
  };

  const playNextTrack = () => {
    if (currentTrackIndex < audioFiles.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      const nextAudio = new Audio(audioFiles[currentTrackIndex + 1]);
      nextAudio.addEventListener("ended", playNextTrack);
      setAudio(nextAudio);
      nextAudio.play();
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    audio.play();
  };

  const handlePause = () => {
    setIsPlaying(false);
    audio.pause();
  };

  return (
    <div>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        multiple
      />
      <h2>Playlist</h2>
      <ul>
        {audioFiles.map((file, index) => (
          <li key={index}>
            {file}
            <button
              onClick={() => {
                setCurrentTrackIndex(index);
                if (isPlaying) audio.pause();
                const newAudio = new Audio(file);
                newAudio.addEventListener("ended", playNextTrack);
                setAudio(newAudio);
                newAudio.play();
              }}
            >
              Play
            </button>
          </li>
        ))}
      </ul>
      <h2>Now Playing</h2>
      <div>
        {isPlaying ? (
          <button onClick={handlePause}>Pause</button>
        ) : (
          <button onClick={handlePlay}>Play</button>
        )}
        <button onClick={playNextTrack}>Next</button>
      </div>
    </div>
  );
}

export default AudioPlayer;
