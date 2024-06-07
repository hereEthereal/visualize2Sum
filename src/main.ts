import './style.css';
import { createMapComponent, MapComponent } from './components/MapComponent';
import { createMathComponent, MathComponent } from './components/MathComponent';
import { createNumericComponent, NumericComponent } from './components/NumericComponent';

const targetNumber = 7;

const setupApp = () => {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>
      <canvas id="mainCanvas" width="800" height="400"></canvas>
      <div id="controls">
        <button id="advanceButton">Advance Step</button>
        <button id="stepBackButton">Step Back</button>
      </div>
      <div id="targetNumber">Target Number: <span id="targetValue">${targetNumber}</span></div>
      <div id="status">Status: <span id="statusText"></span></div>
    </div>
  `;

  const canvas = document.getElementById('mainCanvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  const numericComponent = createNumericComponent([1, 2, 3, 4, 5], 50, 50);
  const mathComponent = createMathComponent(300, 150, targetNumber);
  const mapComponent = createMapComponent(500, 50);

  const components = [numericComponent, mathComponent, mapComponent];

  components.forEach(component => component.updateGlobalPosition(component.getGlobalPosition().x, component.getGlobalPosition().y));

  // For demonstration purposes, add some key-value pairs
  mapComponent.addPair('4', 3); // Example pairs based on target - current number logic
  mapComponent.addPair('5', 2);

  let step = 0;
  let substep = 0;

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    components.forEach(component => component.draw(ctx));
    drawLines();
    requestAnimationFrame(render);
  };

  const drawArrow = (fromX: number, fromY: number, toX: number, toY: number, text?: string) => {
    const headlen = 10; // length of head in pixels
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    ctx.strokeStyle = 'blue'; // Ensure the line color is visible
    ctx.lineWidth = 2; // Ensure the line thickness is visible
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
    if (text) {
      ctx.fillStyle = 'blue';
      ctx.fillText(text, (fromX + toX) / 2, (fromY + toY) / 2);
    }
  };

  const drawLines = () => {
    const numGlobalPos = numericComponent.getGlobalPosition();
    const numLocalPos = numericComponent.getLocalPosition();
    const mathGlobalPos = mathComponent.getGlobalPosition();
    const mathNumberPos = mathComponent.getNumberPosition();
    const mathFinalPos = {
      x: mathGlobalPos.x + mathNumberPos.x,
      y: mathGlobalPos.y + mathNumberPos.y - 10 // Drawing above the number
    };

    const numFinalPos = {
      x: numGlobalPos.x + numLocalPos.x,
      y: numGlobalPos.y + numLocalPos.y
    };

    if (substep === 0 || substep === 1) {
      drawArrow(numFinalPos.x, numFinalPos.y, mapComponent.getGlobalPosition().x + 100, mapComponent.getGlobalPosition().y + 75, 'inquire');
    } else if (substep === 2) {
      drawArrow(numFinalPos.x, numFinalPos.y, mathComponent.getGlobalPosition().x, mathComponent.getGlobalPosition().y, 'calculate');
    } else if (substep === 3) {
      const mathGlobalPos = mathComponent.getGlobalPosition();
      const mathNumberPos = mathComponent.getNumberPosition();
      const mathFinalPos = {
        x: mathGlobalPos.x + mathNumberPos.x,
        y: mathGlobalPos.y + mathNumberPos.y - 10 // Drawing above the number
      };
      drawArrow(mathFinalPos.x, mathFinalPos.y, mapComponent.getGlobalPosition().x + 100, mapComponent.getGlobalPosition().y + 75, 'add');
    }
  };

  const updateStatus = (text: string) => {
    document.getElementById('statusText')!.innerText = text;
  };

  const stepLogic = () => {
    const currentNumber = numericComponent.getCurrentNumber();
    const numGlobalPos = numericComponent.getGlobalPosition();
    const numLocalPos = numericComponent.getLocalPosition();
    const numFinalPos = {
      x: numGlobalPos.x + numLocalPos.x,
      y: numGlobalPos.y + numLocalPos.y
    };

    if (substep === 0) {
      // Inquire if the number is in the map
      updateStatus(`Checking if ${currentNumber} is in the map.`);
      const keyPos = mapComponent.getKeyPosition(currentNumber.toString());
      if (keyPos) {
        // Solution found
        updateStatus(`Solution found: ${currentNumber} + ${targetNumber - currentNumber} = ${targetNumber}`);
        drawArrow(numFinalPos.x, numFinalPos.y, mapComponent.getGlobalPosition().x + 100, mapComponent.getGlobalPosition().y + 75, 'yes');
      } else {
        substep = 1;
        updateStatus(`${currentNumber} not in the map.`);
        drawArrow(numFinalPos.x, numFinalPos.y, mapComponent.getGlobalPosition().x + 100, mapComponent.getGlobalPosition().y + 75, 'no');
      }
    } else if (substep === 1) {
      substep = 2;
      updateStatus(`Calculating complement of ${currentNumber}.`);
    } else if (substep === 2) {
      // Calculate complement
      mathComponent.updateNumber(currentNumber);
      substep = 3;
      updateStatus(`Complement calculated: ${targetNumber - currentNumber}. Adding to map...`);
    } else if (substep === 3) {
      // Add complement to the map
      const complement = mathComponent.getCurrentResult();
      mapComponent.addPair(complement.toString(), currentNumber);
      updateStatus(`Added ${complement}: ${currentNumber} to the map.`);
      substep = 0;
      step++;
      numericComponent.advance();
    }
  };

  document.getElementById('advanceButton')!.addEventListener('click', () => {
    stepLogic();
    render(); // Re-render on step change
  });

  document.getElementById('stepBackButton')!.addEventListener('click', () => {
    numericComponent.stepBack();
    mathComponent.updateNumber(numericComponent.getCurrentNumber());
    render(); // Re-render on step change
  });

  render();
};

setupApp();
