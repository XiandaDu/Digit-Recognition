import { useRef, useState, useEffect } from 'react';
import * as onnx from 'onnxjs';

const DrawingBoard = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [sess, setSession] = useState(null);

  const [lastX, setLastX] = useState(null);
  const [lastY, setLastY] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      const session = new onnx.InferenceSession();
      await session.loadModel("/src/model.onnx");
      setSession(session);
    };

    loadModel();
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setPrediction(null);
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  async function updatePredictions(imgData) {
    if (!sess) {
      console.error('Model is not yet loaded');
      return;
    }

    const input = new onnx.Tensor(new Float32Array(imgData), "float32");

    const outputMap = await sess.run([input]);
    const outputTensor = outputMap.values().next().value;
    const predictions = outputTensor.data;
    const maxPrediction = Math.max(...predictions);

    for (let i = 0; i < predictions.length; i++) {
      if (predictions[i] === maxPrediction) {
        setPrediction(i);
      }
    }
  }
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = 'true'
    const gridSize = 1; // Adjusted gridSize for more ink and responsiveness

    const startDrawing = (event) => {
      setDrawing(true);
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) / gridSize) * gridSize;
      const y = Math.floor((event.clientY - rect.top) / gridSize) * gridSize;
      setLastX(x);
      setLastY(y);
      draw(event, x, y);
    };

    const endDrawing = () => {
      setDrawing(false);
      context.beginPath();
    };

    const draw = (event, x, y) => {
      if (!drawing) return;

      const rect = canvas.getBoundingClientRect();
      x = Math.floor((event.clientX - rect.left) / gridSize) * gridSize;
      y = Math.floor((event.clientY - rect.top) / gridSize) * gridSize;

      // Ensure coordinates stay within canvas bounds
      x = Math.max(0, Math.min(canvas.width - 1, x));
      y = Math.max(0, Math.min(canvas.height - 1, y));

      context.beginPath();
      context.moveTo(lastX, lastY);
      context.lineTo(x, y);
      context.lineWidth = 6;
      context.closePath();
      context.stroke();

      setLastX(x);
      setLastY(y);
    };

    const handleMouseLeave = () => {
      if (drawing) {
        endDrawing();
      }
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mouseup', endDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [drawing, lastX, lastY]);

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

    setPrediction(6); // Temporary prediction value
    updatePredictions(imageData);
  };

  return (
    <div className="flex-row">
      <div className="flex flex-col items-center mt-5">
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="w-560 h-560 border-2 border-solid border-gray-300 cursor-crosshair"
        />
        <div className="flex-row">
          <button className="btn mt-2 font-bold mr-1" onClick={clearCanvas}>
            Clear
          </button>
          <button className="btn mt-2 font-bold ml-1" onClick={handleSubmit}>
            Let's Guess
          </button>
        </div>
      </div>

      {prediction !== null && (
        <div className="flex flex-row justify-center mt-2 text-2xl font-bold">
          Prediction Result is:&nbsp;
          <span className='blue-gradient_text font-semibold drop-shadow'>
            {prediction}
          </span>
        </div>
      )}
    </div>
  );
};

export default DrawingBoard;
