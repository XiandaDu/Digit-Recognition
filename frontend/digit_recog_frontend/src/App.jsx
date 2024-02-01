import { useRef, useState, useEffect } from 'react';
import './DrawingBoard.css';

const DrawingBoard = () => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
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

  return (
    <div className="drawing-board-container">
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        className="drawing-canvas"
      />
      <button className="clear-button" onClick={clearCanvas}>
        Clear Canvas
      </button>
    </div>
  );
};

export default DrawingBoard;
