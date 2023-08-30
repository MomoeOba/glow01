$(document).ready(function() {
  console.log("document ready");

  $('#output-container div').draggable();

  const outputContainer = document.querySelector('#output-container');
  const observer = new MutationObserver(mutations => {
    console.log("mutation observed");
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('output')) {
          console.log("new output added");
          $(node).draggable();
        }
      });
    });
  });
  observer.observe(outputContainer, { childList: true });
});

const inputBox = document.querySelector(".input-box");
const plusIcon = document.querySelector(".icon");
const closeIcon = document.querySelector(".close-icon");
const plusBtn = document.querySelector('.plus-icon');
const input = document.querySelector('input');
const outputContainer = document.querySelector('#output-container');

console.log("variables set");

const savedOutputs = JSON.parse(localStorage.getItem('outputs')) || [];

console.log("savedOutputs:", savedOutputs);

savedOutputs.forEach(outputData => {
  console.log("outputData:", outputData);
  const newOutput = createOutput(outputData.text, outputData.position, outputData.backgroundColor);
  outputContainer.appendChild(newOutput);
});

plusIcon.addEventListener("click", () => inputBox.classList.add("open"));
closeIcon.addEventListener("click", () => inputBox.classList.remove("open"));

plusBtn.addEventListener('click', function() {
  const inputValue = input.value.trim();
  if (inputValue) {
    const outputText = inputValue.replace(/\[object\sObject\]/g, '');
    const newOutput = createOutput(outputText);
    outputContainer.appendChild(newOutput);
    savedOutputs.push({
      text: outputText,
      position: { x: newOutput.offsetLeft, y: newOutput.offsetTop },
      backgroundColor: newOutput.style.backgroundColor
    });
    localStorage.setItem('outputs', JSON.stringify(savedOutputs));
    input.value = '';
  }
});

function createOutput(outputText, position = { x: 0, y: 0 }, backgroundColor = getRandomColor()) {
  console.log("createOutput:", outputText, position, backgroundColor);
  const newOutput = document.createElement('div');
  newOutput.classList.add('output');
  newOutput.textContent = outputText;
  newOutput.style.backgroundColor = backgroundColor;
  newOutput.style.left = position.x + 'px';
  newOutput.style.top = position.y + 'px';

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-btn');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', () => {
    newOutput.remove();
    const index = savedOutputs.findIndex(output => output.text === outputText);
    if (index > -1) {
      savedOutputs.splice(index, 1);
      localStorage.setItem('outputs', JSON.stringify(savedOutputs));
    }
  });
  newOutput.appendChild(deleteButton);

  $(newOutput).draggable();

  return newOutput;
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}