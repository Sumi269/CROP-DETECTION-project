import SpeechRecognition, {
  useSpeechRecognition
} from "react-speech-recognition";

export default function VoiceInput({
  setInput
}) {

  const {
    transcript,
    listening,
    resetTranscript
  } = useSpeechRecognition();

  const startListening = () => {

    resetTranscript();

    SpeechRecognition.startListening({
      continuous: true
    });
  };

  const stopListening = () => {

    SpeechRecognition.stopListening();

    setInput(transcript);
  };

  return (

    <div>

      <button
        onClick={startListening}
      >
        🎤 Start
      </button>

      <button
        onClick={stopListening}
      >
        ⏹ Stop
      </button>

      <p>{listening ? "Listening..." : ""}</p>

    </div>
  );
}