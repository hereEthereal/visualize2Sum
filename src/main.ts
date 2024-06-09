import './style.css';
import { createMapComponent, MapComponent } from './components/MapComponent.ts';
import { createMathComponent, MathComponent } from './components/MathComponent.ts';
import { createNumericComponent } from './components/NumericComponent';
import { generateTwoSumList, twoSum } from './make2Sum.ts';


const setupApp = () => {
  const targetNumber = 25;
  const ourNumberObject = generateTwoSumList(targetNumber);
  const ourNumberList = ourNumberObject.numbers;
  const ourSolution = ourNumberObject.uniquePair;
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>
      <canvas id="mainCanvas" width="800" height="400"></canvas>
      <div id="controls">
        <button id="advanceButton">Advance Step</button>
      </div>
      <div id="targetNumber">Target Number: <span id="targetValue">${targetNumber}</span></div>
      <div id="stepInfo">Step: <span id="stepValue">0</span>, Substep: <span id="substepValue">0</span></div>
      <div id="status">Status: <span id="statusText"></span></div>
    </div>
  `;

  const canvas = document.getElementById('mainCanvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')!;

  const numericComponent = createNumericComponent( ourNumberList, 50, 50);
  const mathComponent = createMathComponent(300, 150, targetNumber);
  const mapComponent = createMapComponent(500, 50);

  console.log('Our Number List:', ourNumberList);
  console.log('Our solution', ourSolution);

  const components = [numericComponent, mathComponent, mapComponent];

  components.forEach(component => component.updateGlobalPosition(component.getGlobalPosition().x, component.getGlobalPosition().y));

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
      const textOffset = 10; // Offset to move the text away from the line
      const textX = (fromX + toX) / 2 + textOffset * Math.sin(angle);
      const textY = (fromY + toY) / 2 - textOffset * Math.cos(angle);
      ctx.fillText(text, textX, textY);
    }
  };


  const drawLines = () => {
    const numGlobalPos = numericComponent.getGlobalPosition();
    const numLocalPos = numericComponent.getLocalPosition(ctx, numericComponent.getCurrentIndex());
    const numFinalPos = {
      x: numGlobalPos.x + numLocalPos.x,
      y: numGlobalPos.y + 15 // Adjust this value to match the list's y-coordinate offset
    };
  
    const mapGlobalPos = mapComponent.getGlobalPosition();
    const mapFinalPos = {
      x: mapGlobalPos.x + 100,
      y: mapGlobalPos.y + 75
    };
  
    const mathGlobalPos = mathComponent.getGlobalPosition();
    const mathNumberPos = mathComponent.getNumberPosition();
    const mathFinalPos = {
      x: mathGlobalPos.x + mathNumberPos.x,
      y: mathGlobalPos.y + mathNumberPos.y - 10 // Drawing above the number
    };
  
    if (substep === 0) {
      drawArrow(numFinalPos.x, numFinalPos.y, mapFinalPos.x, mapFinalPos.y, 'inquire');
      updateStatus(`Checking if ${numericComponent.getCurrentNumber()} is in the map.`);
      mathComponent.showCalculation(false); // Hide calculation during inquiry
    } else if (substep === 1) {
      const responseText = mapComponent.hasKey(numericComponent.getCurrentNumber().toString()) ? 'yes' : 'no';
      drawArrow(mapFinalPos.x, mapFinalPos.y, numFinalPos.x, numFinalPos.y, responseText);
      updateStatus(`${numericComponent.getCurrentNumber()} ${responseText === 'yes' ? 'is' : 'is not'} in the map.`);
      mathComponent.showCalculation(false); // Hide calculation during map response
    } else if (substep === 2) {
      drawArrow(numFinalPos.x, numFinalPos.y, mathComponent.getGlobalPosition().x, mathComponent.getGlobalPosition().y, 'calculate');
      updateStatus(`Calculating complement of ${numericComponent.getCurrentNumber()}.`);
      mathComponent.updateNumber(numericComponent.getCurrentNumber()); // Update math component with the current number
      mathComponent.showCalculation(true);  // Show math calculation
    } else if (substep === 3) {
      const complement = mathComponent.getCurrentResult();
      const keyPosition = { x: mapGlobalPos.x + 10, y: mapGlobalPos.y + (mapComponent.getNextKeyPosition() * 20) + 10 };
      drawArrow(mathFinalPos.x, mathFinalPos.y, keyPosition.x, keyPosition.y, 'add');
      updateStatus(`Adding complement ${complement} to the map.`);
      mathComponent.showCalculation(true); // Show math calculation during addition to map
      mapComponent.addPair(complement.toString(), step); // Add complement to the map with the step number - 1
    }
  };
  
  
  const updateStatus = (text: string) => {
    document.getElementById('statusText')!.innerText = text;
  };

  const updateStepInfo = () => {
    document.getElementById('stepValue')!.innerText = step.toString();
    document.getElementById('substepValue')!.innerText = substep.toString();
  };

  const stepLogic = () => {
    const currentNumber = numericComponent.getCurrentNumber();
    const numGlobalPos = numericComponent.getGlobalPosition();
    const numLocalPos = numericComponent.getLocalPosition(ctx, numericComponent.getCurrentIndex());
    const numFinalPos = {
      x: numGlobalPos.x + numLocalPos.x,
      y: numGlobalPos.y + numLocalPos.y
    };

    if (substep === 0) {
      // Inquire if the number is in the map
      updateStatus(`Checking if ${currentNumber} is in the map.`);
      substep = 1;
    } else if (substep === 1) {
      // Respond from the map
      const keyPos = mapComponent.getKeyPosition(currentNumber.toString());
      if (keyPos) {
        // Solution found
        updateStatus(`Solution found: ${currentNumber} + ${targetNumber - currentNumber} = ${targetNumber}`);
        substep = 0; // Reset substep for next iteration
      } else {
        substep = 2;
        updateStatus(`${currentNumber} not in the map.`);
      }
    } else if (substep === 2) {
      updateStatus(`Calculating complement of ${currentNumber}.`);
      substep = 3;
    } else if (substep === 3) {
      // Calculate complement and add to the map
      mathComponent.updateNumber(currentNumber);
      const complement = mathComponent.getCurrentResult();
      mapComponent.addPair(complement.toString(), step); // Update here to store the index as value
      updateStatus(`Complement calculated: ${complement}. Added ${complement}: ${step} to the map.`);
      substep = 0;
      step++;
      numericComponent.advance();
    }
    updateStepInfo();
  };

  document.getElementById('advanceButton')!.addEventListener('click', () => {
    stepLogic();
    render(); // Re-render on step change
  });

  render();
};

setupApp();
