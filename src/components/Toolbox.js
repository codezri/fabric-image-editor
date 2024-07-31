import { useEffect, useState } from 'react';
import { Image, IText, filters } from 'fabric';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Toolbox = ({ canvas, currentFilter, setCurrentFilter }) => {
  const [drawingMode, setDrawingMode] = useState(false);

  useEffect(() => {
    if(!canvas || 
      !canvas.getActiveObject() || 
      !canvas.getActiveObject().isType('image')) return;
    
    function getSelectedFilter() {
      switch(currentFilter) {
        case 'sepia':
          return new filters.Sepia();
        case 'vintage':
          return new filters.Vintage();
        case 'invert':
          return new filters.Invert();
        case 'polaroid':
          return new filters.Polaroid();
        case 'grayscale':
          return new filters.Grayscale();
        default:
          return null;
      }
    }
    const filter = getSelectedFilter();
    const img = canvas.getActiveObject();
    
    img.filters=filter ? [filter] : [];
    img.applyFilters();
    canvas.renderAll();
  }, [currentFilter, canvas]);

  function fileHandler(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = async (e) => {               
      const image = await Image.fromURL(e.target.result);
      image.scale(0.5);
      canvas.add(image);
      canvas.centerObject(image);
      canvas.setActiveObject(image); 
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function addText() {
    const text = new IText('Edit this text');
    canvas.add(text);
    canvas.centerObject(text);
    canvas.setActiveObject(text); 
  }

  function toggleDrawingMode() {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    setDrawingMode(canvas.isDrawingMode);
  }

  function downloadImage() {
    const link = document.createElement('a');
    link.download = 'photo_editor_image.png';
    link.href = canvas.toDataURL();
    link.click();
  }

  function clearAll() {
    if(window.confirm('Are you sure you want to clear all?')) {
      canvas.remove(...canvas.getObjects());
    }
  }
  
  return (
    <div className="toolbox">
      <button title="Add image">
        <FontAwesomeIcon icon="image" />
        <input
          type="file"
          accept=".png, .jpg, .jpeg"
          onChange={fileHandler}/>
      </button>
      <button title="Add text" onClick={addText}>
        <FontAwesomeIcon icon="font" />
      </button>
      <button title="Drawing mode" onClick={toggleDrawingMode} className={drawingMode ? 'active' : ''}>
        <FontAwesomeIcon icon="pencil" />
      </button>
      <button title="Filters" 
        onClick={() => setCurrentFilter(currentFilter ? null : 'sepia')} 
        className={currentFilter ? 'active' : ''}>
        <FontAwesomeIcon icon="filter" />
      </button>
      {currentFilter && 
        <select onChange={(e) => setCurrentFilter(e.target.value)} value={currentFilter}>
          <option value="sepia">Sepia</option>
          <option value="vintage">Vintage</option>
          <option value="invert">Invert</option>
          <option value="polaroid">Polaroid</option>
          <option value="grayscale">Grayscale</option>
        </select>
      }
      <button title="Clear all" onClick={clearAll}>
        <FontAwesomeIcon icon="trash" />
      </button>
      <button title="Download as image" onClick={downloadImage}>
        <FontAwesomeIcon icon="download" />
      </button>
    </div>
  );
};

export default Toolbox;
