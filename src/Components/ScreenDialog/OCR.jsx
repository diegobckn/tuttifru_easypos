import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { createWorker } from 'tesseract.js';
import Tesseract from 'tesseract.js';


export default () => {
  const webcamRef = useRef(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // Función para capturar y procesar
  const captureAndRecognize = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot(); // Captura en base64
    if (imageSrc) {
      setLoading(true);
      const worker = await createWorker('spa'); // Carga idioma español
      const { data: { text } } = await worker.recognize(imageSrc);
      setText(text);
      await worker.terminate();
      setLoading(false);
    }
  }, [webcamRef]);



  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const recognizeText = () => {
    setLoading(true);
    Tesseract.recognize(
      image,
      'spa', // Configuración de idioma: Español
      { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
      setText(text);
      setLoading(false);
    });
  };


  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "environment" }} // Usa cámara trasera en móviles
      />
      <button onClick={captureAndRecognize} disabled={loading}>
        {loading ? "Procesando..." : "Capturar y Leer Texto"}
      </button>
      <p>Resultado: {text}</p>


      <hr />


      <div>
        <input type="file" onChange={handleImageChange} />
        {image && <img src={image} alt="Imagen" width="300" />}
        <button onClick={recognizeText} disabled={!image || loading}>
          {loading ? 'Procesando...' : 'Extraer texto en Español'}
        </button>
        <textarea value={text} rows="10" cols="50" readOnly />
      </div>
    </div>
  );
};