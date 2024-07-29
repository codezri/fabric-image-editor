import { useRef, useEffect, useState } from 'react';
import { Canvas, PencilBrush } from 'fabric';
import Toolbox from './Toolbox';
import EditorCanvas from './EditorCanvas';
import './App.css';

function App() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [currentFilter, setCurrentFilter] = useState(null);

  useEffect(() => {
    const c = new Canvas(canvasRef.current, {backgroundColor: 'white'}); 
    c.setDimensions({width: 1000, height: 500});
    const brush = new PencilBrush(c);
    brush.color = 'black';
    brush.width = 4;
    c.freeDrawingBrush = brush;
    setCanvas(c);
    
    return () => c.dispose();
    
  }, [canvasRef, setCanvas]);
  
  return (
    <div className="editor">
      <Toolbox canvas={canvas} currentFilter={currentFilter} setCurrentFilter={setCurrentFilter}/>
      <EditorCanvas ref={canvasRef} canvas={canvas} setCurrentFilter={setCurrentFilter}/>
    </div>
  );
}

export default App;
