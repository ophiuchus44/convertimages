import './App.css';
import { useState, useRef } from 'react';
import { FileUploader } from 'react-drag-drop-files';

const fileTypes = ["JPG", "PNG", "JPEG"];


function App() {

  const [file, setFile] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const handleDrop = (file: File) => {

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        setFile(event.target.result as string);
      }

    };

    reader.readAsDataURL(file);
  }

  const handleConversion = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!ctx) {
      return;
    }
    const image = new Image();
    image.src = file
    image.onload = () => {
      const pixelSize = .15
      const scaledWidth = image.width * pixelSize;
      const scaledHeight = image.height * pixelSize;

      canvas!.width = image.width
      canvas!.height = image.height
      
      ctx.imageSmoothingEnabled = false

      ctx.drawImage(image, 0, 0,scaledWidth, scaledHeight);
      ctx.drawImage(canvas!, 0, 0, scaledWidth, scaledHeight, 0, 0, image.width, image.height);

      const imageData = ctx.getImageData(0, 0, canvas!.width, canvas!.height);
      const pixelData = imageData.data;
  
      console.log("pixel data: ", pixelData);

      const hexColors = [];
      for (let i = 0; i < pixelData.length; i += 4) {
        const red = pixelData[i];
        const green = pixelData[i + 1];
        const blue = pixelData[i + 2];
        const alpha = pixelData[i + 3];
  
        const hex = rgbToHex(red, green, blue);
        hexColors.push(hex);
      }
  
      console.log(hexColors);

    };
    console.log("button clicked!")
  }

  return (
    <div className="App">
      <header className="App-header">

        <FileUploader handleChange={handleDrop} name="file" types={fileTypes} />

        {file && 
        <div>
          <p>
            <img src={file} alt="file" />
          </p>
          <button onClick={handleConversion}>CONVERT TO PIXELS</button>
          <div>
          
          <canvas ref={canvasRef} />
          </div>
        </div>
}
        

      </header>
    </div>
  );
}

const rgbToHex = (red: number, green: number, blue: number) => {
  const r = red.toString(16).padStart(2, '0');
  const g = green.toString(16).padStart(2, '0');
  const b = blue.toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
};



export default App;
