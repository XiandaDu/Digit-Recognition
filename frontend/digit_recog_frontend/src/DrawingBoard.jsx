import { useRef, useState, useEffect } from 'react';


const DrawingBoard = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    setPrediction(null)
    context.clearRect(0, 0, canvas.width, canvas.height);
  };



  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const gridSize = 10;

    const startDrawing = (event) => {
      setDrawing(true);
      draw(event);
    };

    const endDrawing = () => {
      setDrawing(false);
      context.beginPath();
    };

    const draw = (event) => {
      if (!drawing) return;

      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) / gridSize) * gridSize;
      const y = Math.floor((event.clientY - rect.top) / gridSize) * gridSize;

      context.fillStyle = '#000';
      context.fillRect(x, y, gridSize, gridSize);
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
  }, [drawing]);

  const handleSubmit = () => {

    const gridSize = 10;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;

    // Convert image data to a 2D matrix (28x28)
    const matrix = [];
    for (let i = 0; i < canvas.height; i += gridSize) {
      const row = [];
      for (let j = 0; j < canvas.width; j += gridSize) {
        const pixelIndex = (i * canvas.width + j) * 4;
        const isFilled = imageData[pixelIndex] > 0; // Check if pixel is filled (not transparent)
        row.push(isFilled ? 1 : 0);
      }
      matrix.push(row);
    }
    setPrediction(6)

    // Call your backend API with the matrix
    // Replace 'YOUR_API_ENDPOINT' with the actual endpoint of your backend API
    fetch('YOUR_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ matrix }),
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response from the backend
        setPrediction(data.prediction);
      })
      .catch(error => {
        console.error('Error calling backend API:', error);
        // Handle the error
      });
  };

  return (
      <div className="flex-row">
        <div className="flex flex-col items-center mt-5">
          <canvas
            ref={canvasRef}
            width={280}
            height={280}
            className="w-280 h-280 border-2 border-solid border-gray-300 cursor-crosshair"
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
