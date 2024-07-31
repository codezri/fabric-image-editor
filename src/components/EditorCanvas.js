import { useEffect, forwardRef } from 'react';

const EditorCanvas = forwardRef(({ canvas, setCurrentFilter }, ref) =>{

  useEffect(() => {
    if(!canvas) return;
  
    function handleKeyDown(e) {
      if(e.key === 'Delete') {
        for(const obj of canvas.getActiveObjects()) {
          canvas.remove(obj);
          canvas.discardActiveObject();
        }
      }
    }

    function handleSelection(e) {
      const obj = e.selected?.length === 1 ? e.selected[0] : null;
      const filter = obj?.filters?.at(0);
      setCurrentFilter(filter ? filter.type.toLowerCase() : null);
    }

    document.addEventListener('keydown', handleKeyDown, false);
    canvas.on({
      'selection:created': handleSelection,
      'selection:updated': handleSelection,
      'selection:cleared': handleSelection
    });
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, false);
      canvas.off({
        'selection:created': handleSelection,
        'selection:updated': handleSelection,
        'selection:cleared': handleSelection
      });
    }
    
  }, [canvas, setCurrentFilter]);

  return(
    <div className="canvasbox">
      <canvas ref={ref} width="1000" height="500"></canvas>
    </div>
  );
});

export default EditorCanvas;
