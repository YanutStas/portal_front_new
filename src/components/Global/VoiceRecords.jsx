import React, { useState } from 'react';

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Преобразуем в base64
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result; // "data:audio/webm;base64,..."
          console.log('Base64 аудио:', base64data);

          // Отправляем на бэкенд
          fetch('/api/upload-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ voice: base64data }),
          })
            .then((res) => res.json())
            .then((data) => console.log('Успешно отправлено:', data))
            .catch((err) => console.error('Ошибка отправки:', err));
        };
        reader.readAsDataURL(blob);
      };

      recorder.start();
      setIsRecording(true);
      setMediaRecorder(recorder);
    } catch (err) {
      console.error('Не удалось получить доступ к микрофону:', err);
      alert('Ошибка: не удалось получить доступ к микрофону.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  return (
    <div >
      
      {!isRecording ? (
        <button onClick={startRecording} style={{ padding: 5, fontSize: '16px' }}>
          🎙️
        </button>
      ) : (
        <button onClick={stopRecording} style={{ padding: 5, fontSize: '16px' }}>
          ⏹️
        </button>
      )}

      {/* {audioUrl && (
        <div style={{ marginTop: '15px' }}>
          <p>Предпросмотр:</p>
          <audio controls src={audioUrl} />
        </div>
      )} */}
    </div>
  );
};

export default VoiceRecorder;