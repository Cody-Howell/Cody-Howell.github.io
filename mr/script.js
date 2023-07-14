var currentTitle, currentNum, nextTitle, nextNum, nextSelectedNum, nodes, edges, musicData, playedString, userNum, playedCount;
var prevNum = -1;
var webChoice = 0;
var complexWeb = false;
var audio = []; 
var start = [];
var timeouts = [];
var nodeArray = [];
var complexArray = [];
var userAudio = []; // Lots more variables

import { names } from "./assets/names.js" // Import function for modules!
import { updateComplexArray, updateInitialArray } from "./rules.js"; // Rules are complex and numerous enough they should get their own file. 

// Creates option select in the container
var selectElement = document.getElementById("nameSelector");
for (var i = 0; i < names.length; i++) {
  var option = document.createElement("option");
  option.value = i;  // The value is the index
  if ('complex' in names[i]) {
    option.text = `${names[i].name} (C)`
  } else {
    option.text = names[i].name;  // The displayed text is the name
  }
  selectElement.appendChild(option);
}
selectElement.addEventListener("change", function() {
  webChoice = this.value;
  console.log("SilDEBUG: Selected Web ID is ", webChoice);
  stopAudio();
});


// Enables user requests: checks for verify box (if not, debug mode), verifies, loads into userAudio. 
var submitText = document.querySelector("#textButton");
submitText.addEventListener('click', function() {
  var string = document.querySelector("#stringRequest").value;
  var verify = document.querySelector("#verifyCheckbox").checked;
  console.log(`SilDEBUG: Clicked - ${string}, ${verify}`);
  userNum = 0;
  
  var userConfirmation = document.querySelector("#VerificationStatus");

  if (verify) {
    var followsPath = verifySequence(musicData, string);
    // console.log(musicData);
    // console.log(string);

    if (followsPath) {
      userConfirmation.innerHTML = `True! Press Begin.`;
      userConfirmation.style = 'color: green';

      let titles = string.split(" ");
      for (let i = 0; i < titles.length; i++) {
        let index = musicData.findIndex(song => song.title === titles[i]);
        userAudio.push(index);
      }
    } else {
      userConfirmation.innerHTML = `False! Try again.`;
      userConfirmation.style = 'color: maroon';
    }
  } else {
    userConfirmation.innerHTML = `Debug activated. Press Begin.`;
    userConfirmation.style = 'color: black';

    let titles = string.split(" "); // Splits and uploads into array. 
    for (let i = 0; i < titles.length; i++) {
      let index = musicData.findIndex(song => song.title === titles[i]);
      userAudio.push(index);
    }
  }
  
});

(function() {
  'use strict';
  
	let stateCheck = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(stateCheck);
      console.log('EisDEBUG: Start main js');
      startup();
		}
	}, 100);
})();

async function startup() {
  console.log('EisDEBUG: startup() started.');
  
  audio = [];
  start = [];
  complexArray = [];
  playedString = "";
  playedCount = 0;
  complexWeb = false;
  var checkbox = document.getElementById("userInputCheckbox");
  checkbox.disabled = true; 
  var checkboxLabel = document.getElementById("userInputLabel");
  checkboxLabel.innerHTML = "";
  
  var placeholderText = document.querySelector("#stringRequest"); // author_route defined in assets/names.js
  placeholderText.placeholder = names[webChoice].author_route;
  placeholderText.value = names[webChoice].author_route;
  
  var filepath = `./assets/(${names[webChoice].name}) music-data.json`; // Fetches relative file structure, changes with webChoice.
  await fetch(filepath) // I guess this works. 
  .then(response => response.json())
  .then(data => musicData = data);

  if ('complex' in names[webChoice]){
    // console.log(`  SilDEBUG: Is truly complex.`);
    complexWeb = true;
    complexArray = [...names[webChoice].complex.setArray];
    complexArray = updateInitialArray(complexArray, names[webChoice].complex.rules.init, names[webChoice].complex.arrayRules);
    checkbox.disabled = false;
    checkboxLabel.innerHTML = "For Complex Webs";
  }

  
  loadTable();
  
  currentNum = -1;
  nextNum = start[Math.floor(Math.random() * start.length)];
  nextTitle = musicData[nextNum].title;
  nextSelectedNum = -1;
  updateRightColumn(nextTitle, 'N/A', musicData[nextNum].artist, [], complexArray);
  
  // Added a lot here. Begin button holds details, once pressed, enables stop button, prepares audio AFTER hitting play
  // so the website scrapers don't have to download a bunch of audio when making snapshots (I've been using that doc).
  document.getElementById('controls-container').innerHTML =
  `<button id="begin-btn">Begin</button>\n<p id="details-box">${names[webChoice].info}</p>`; 
  document.querySelector('#begin-btn').addEventListener('click', function(){
    document.getElementById('controls-container').innerHTML =`<button id="stop-btn">Stop</button>\n<p id="details-box">${names[webChoice].info}</p>`;
    document.querySelector('#stop-btn').addEventListener('click', stopAudio);
    if (userAudio.length !== 0) {
      nextNum = userAudio[0];
    }
    prepareAudio();
  });

  console.log('EisDEBUG: startup() completed.');
}

function loadTable() {
  // console.log('  EisDEBUG: loadTable() started.');

  let nodeArray = [];
  let edgeArray = [];

  musicData.forEach((music, index) => {
      // Define color using a switch statement
      let color;
      switch(music.start) {
          case true:
              start.push(index);
              color = "#47d16c";
              break;
          default:
              color = "#DDDDDD";
              break;
      }
      
      // Generate node array
      let node = {
          id: index,
          value: 5,
          label: music.title,
          color: color, 
          title: `Artist: ${music.artist} \nDuration: ${secondsToMS(music.lengthToNext)}`
      };
      nodeArray.push(node);
    
      // Generate edge array
      music.next.forEach((nextNode) => {
          // Get the index of the nextNode from the musicData array
          let toIndex = musicData.findIndex(item => item.title === nextNode.name);
          // If index is implemented (weights change), calculate the weight and create the node. 
          if (toIndex != -1 && 'index' in nextNode) {
            // console.log(nextNode);
            let dashesValue;
            let weight = nextNode.weight[complexArray[nextNode.index]];
            if (weight === 0) { dashesValue = true }
            else { dashesValue = false }
            let edge = {
              from: index,
              to: toIndex,
              value: weight,
              arrows: {to: {enabled: true, type: "arrow"}},
              dashes: dashesValue,
              color: "#000000"
            };
            edgeArray.push(edge);
          }
          else if (toIndex != -1) {
            let edge = {
                from: index,
                to: toIndex,
                value: nextNode.weight,
                arrows: {to: {enabled: true, type: "arrow"}},
                dashes: false,
                color: "#000000"
            };
            edgeArray.push(edge);
          }
      });
  });

  nodes = new vis.DataSet(nodeArray);
  edges = new vis.DataSet(edgeArray);
  
    
  var container = document.getElementById("table-container");
  var data = {
    nodes: nodes,
    edges: edges,
  };
  var options = {
    nodes: {
      shape: "circle",
      scaling: {
        label: {
          enabled: true,
          min: 40, // This changes the letter size, which seems to be the only way to increase size on circles.
          max: 40
        }
      }
    },
    edges: {
      scaling: {
        customScalingFunction: function (min, max, total, value) {
            return (value - min) / (max - min); // Random function that gets me good size arrows, not too large. 
        },
        min: 1,
        max: 5,
      },
    },
    layout: {randomSeed: names[webChoice].seed},
    physics: {
      barnesHut: {
        gravitationalConstant: -8000, // These can be fun to change. I liked what I came up with. 
        centralGravity: 0.3,
        springLength: 200,
        springConstant: 0.08,
        damping: 0.20,
        avoidOverlap: 1
      }
    }
};

  var network = new vis.Network(container, data, options);
  
  // console.log('  EisDEBUG: loadTable() completed.');
}

function prepareAudio() {
  // console.log('  EisDEBUG: prepareAudio() started; musicData.length is ' + musicData.length);
  for(let i = 0; i < musicData.length; i++) {
    audio.push(new Audio(`assets/audio-clips/` + musicData[i].file));
  }

  audio[nextNum].load();

  // console.log('  EisDEBUG: prepareAudio() completed; audio.length is ' + audio.length);
  // console.log('  EisDEBUG: prepareAudio() completed; start.length is ' + start.length);

  waitForAudioLoad(audio[nextNum], 3000)
  .then(function() {
    // console.log('Audio file is loaded and ready to play.'); // Make sure the first audio is loaded before playing. 
    playNext();
  });
  
}

function playNext() {
  // console.log('  EisDEBUG: playNext(); nextNum is ' + nextNum);

  playedCount++;
  
  if (userAudio[userNum] !== undefined) { // If loop for userAudio request, else (or after) goes into randomness again. 
    audio[userAudio[userNum]].play();
    userNum++;
    nextNum = userAudio[userNum];
    if (nextNum === undefined) {nextNum = -1;}
    if (nextNum === -1) {nextTitle = "N/A";}
    else {
      nextTitle = musicData[nextNum].title;
    }
    currentNum = userAudio[userNum-1];
    currentTitle = musicData[currentNum].title;
    
    timeouts.push(setTimeout(playNext, musicData[currentNum].lengthToNext));
    // timeouts.push(setTimeout(playNext, 2000)); //Only use when not listening! Used for node testing.
    
    simulateProgress(musicData[currentNum].lengthToNext); 
    
    if(nextNum !== -1) {
      audio[nextNum].load();
    } else {
      nextSelectedNum = weightedRandomIndex(musicData[currentNum].next); // Stolen code from below to continue playing randomly after user input
        nextTitle = musicData[currentNum].next[nextSelectedNum].name;
        
        for(let i = 0; i < musicData.length; i++) {
          if(musicData[i].title == nextTitle) {
            nextNum = i;
            i = musicData.length;
          }
        }
    }
    
  } else {
    
    if(nextNum === -1) {
      console.log('  EisDEBUG: song ended.');
      nextNum = 0;
      nextTitle = musicData[nextNum].title;
      nextSelectedNum = -1;
    } else {
      audio[nextNum].play();
      // console.log('    EisDEBUG: playing track ' + nextNum);
      
      currentTitle = nextTitle;
      currentNum = nextNum;
      timeouts.push(setTimeout(playNext, musicData[currentNum].lengthToNext)); // Timeouts are an array so they can easily be stopped. 
      
      simulateProgress(musicData[currentNum].lengthToNext); // Function that makes the progress bar; can't be stopped. 
      
      if(musicData[nextNum].next.length === 0) { // Left a lot of this untouched. 
        // console.log('  EisDEBUG: no next song.');
        nextNum = -1;
      } else {
        // choose next
        nextSelectedNum = weightedRandomIndex(musicData[currentNum].next);
        nextTitle = musicData[currentNum].next[nextSelectedNum].name;
        
        for(let i = 0; i < musicData.length; i++) {
          if(musicData[i].title == nextTitle) {
            nextNum = i;
            i = musicData.length;
          }
        }
        
        if(nextNum === currentNum) {
          // console.log('    EisDEBUG: track repeats');
        } else {
          audio[nextNum].load();
        }
      }
    }
  }
  console.log(`    EisDEBUG: currentNum is ${currentNum}, currentTitle is ${currentTitle}, ` +
  `nextNum is ${nextNum}, nextTitle is ${nextTitle}, prevNum is ${prevNum}, and nextSelectedNum is ${nextSelectedNum}`);
  
  updatePlayString(currentTitle);
  
  if (complexWeb) {
    var prevArray = [...complexArray]; // Check if anything was changed in the function. 
    complexArray = updateComplexArray(complexArray, names[webChoice].complex.rules.running, names[webChoice].complex.arrayRules, nodeArray, playedCount);
    if (JSON.stringify(complexArray) !== JSON.stringify(prevArray)) {loadTable();}
    // console.log(`    SilDEBUG: Updated complex web, possibly. `);
  } // Placed before 
  
  if (prevNum > -1){ //Place to color previous, technical for a number of reasons. Finding if prev was a start node for green, and if you're just starting, it can be difficult. 
    var prevColor;
    switch(musicData[prevNum].start) {
      case true:
        prevColor = "#47d16c";
        break;
        default:
          prevColor = "#DDDDDD";
          break;
        }
        nodes.update({id: prevNum, color: prevColor});
      }
      prevNum = currentNum;
      
      if (nextTitle !== "N/A") {
        musicData.findIndex(obj => obj.title === nextTitle);
        nodes.update({id: nextNum, color: '#e0d679'});
      }
      nodes.update({id: currentNum, color: '#5e71c4'}); 
      
      
      updateRightColumn(currentTitle, nextTitle, musicData[currentNum].artist, musicData[currentNum].next, complexArray);
      
      
    }
    
    
// Functions to adjust things, not key functionality
      
function updateRightColumn(current, next, artist, nextList, complexArray = []) {
  var currentNode = document.querySelector("#current .largeBold"); // Things in the column to update
  var nextNode = document.querySelector("#nextNode");
  var artistLine = document.querySelector("#RightArtist");
  var nodeList = document.querySelector("#nodeList");
  var longNodeList = document.querySelector("#secondNodeList"); // Second order down list; all nodes from all possible current nodes. 
  var valueArray = document.querySelector("#valueString");

  if (next !== "N/A"){
    let nextNames = [];
    let node = musicData.find(item => next === item.title); 
    for (let nextNode of node.next) {
      nextNames.push(nextNode.name);
    }
    longNodeList.innerHTML = ``;
    nextNames.forEach((item) => {
      let node = document.createElement('p');
      node.innerHTML = `${item}`;
      longNodeList.appendChild(node);
    });
  } else {
    longNodeList.innerHTML = ``;
  }
  
  nextList = nextList.filter(item => item.name !== next); // Things like filter and find ChatGPT knows how they work, but I don't. 

  currentNode.innerHTML = `${current}`;
  nextNode.innerHTML = `${next}`;
  artistLine.innerHTML = `${artist}`;
  nodeList.innerHTML = ``;
  nextList.forEach((item) => {
    let node = document.createElement('p');
    node.innerHTML = `${item.name} (${item.weight})`; // Can see the weight in first-order next nodes. 
    nodeList.appendChild(node);
  });

  if (complexArray) {
    valueArray.innerHTML = "";
    var arrayIntoString = "";
    complexArray.forEach((value) => {
      arrayIntoString += value + " ";
    });
    valueArray.innerHTML = arrayIntoString;
  }
}

function updatePlayString(current) {
  var playNode = document.querySelector("#Played");

  playedString += current + " "; // Current is a global variable that can be read elsewhere.
  nodeArray.push(current);

  playNode.innerHTML = `${playedString}`;
}

function stopAudio() {
  audio.forEach((audioTrack) => {
    if (!audioTrack.paused) {
      audioTrack.pause();
      audioTrack.currentTime = 0;  // Reset the audio to the start
      clearTimeout(timeouts[i]);
    }
  });
  timeouts.forEach((e, i) => {
    clearTimeout(timeouts[i]);
  });

  var userConfirmation = document.querySelector("#VerificationStatus");
  userConfirmation.innerHTML = "";

  timeouts = []; // Whole bunch of variables to clean after stopping. 
  audio = [];
  userAudio = [];
  prevNum = -1;
  startup();
};

function simulateProgress(totalTime) {
  var progressBar = document.getElementById('progress-bar');
  var startTime = Date.now();
  var endTime = startTime + totalTime;

  var interval = setInterval(updateProgressBar, 100);

  function updateProgressBar() {
    var currentTime = Date.now();
    var elapsedTime = currentTime - startTime;
    var remainingTime = endTime - currentTime;
    var progress = (elapsedTime / totalTime) * 100;
    var remainingProgress = 100 - progress;
    // Attempts to empty/complete progress bar on stop have not worked. Not necessary to function. 
    // *sigh* actually impossible. 

    if (currentTime >= endTime) { 
      clearInterval(interval);
      progressBar.style.width = '100%';
    }  else {
      progressBar.style.width = progress + '%';
    }
  }
};

function weightedRandomIndex(array) {
  let totalWeight = 0;
  
  for(let i = 0; i < array.length; i++) {
    if('index' in array[i] && Array.isArray(array[i].weight)){
      let index = array[i].index;
      if (index < complexArray.length) {
        totalWeight += array[i].weight[complexArray[index]];
      }
    }
    else if('weight' in array[i]){
      totalWeight += array[i].weight;
    }
  }

  let randomNum = Math.random() * totalWeight;
  for(let i = 0; i < array.length; i++) {
      let weight = ('index' in array[i] && Array.isArray(array[i].weight)) 
                  ? array[i].weight[complexArray[array[i].index]] 
                  : array[i].weight;
      if (randomNum <= weight) {
          return i;
      }
      randomNum -= weight;
  }
}



function secondsToMS(num){
  let returnValue = num / 1000;
  return `${returnValue} s`
}

function verifySequence(web, string) {
  let titles = string.split(' '); //Used to be it's own JS file, but it was shortened to put into here. Checks the sequence when asked.
  
  for (let i = 0; i < titles.length - 1; i++) {
      let currentTitle = titles[i];
      let nextTitle = titles[i+1];
      let currentObj = web.find(obj => obj.title === currentTitle);
      
      if (!currentObj) {
          console.log("Title not found in the array: " + currentTitle);
          return false;
      }
      
      let nextObjExists = currentObj.next.some(n => n.name === nextTitle);
      if (!nextObjExists) {
          console.log("Title: " + nextTitle + " is not in the next array of " + currentTitle);
          return false;
      }
  }
  return true;
}

function waitForAudioLoad(audioElement, timeout) {
  return new Promise(function(resolve, reject) {
    var intervalId = setInterval(function() {
      if (audioElement.readyState === 4) {
        clearInterval(intervalId);
        resolve();
      }
    }, 100); // Polling interval of 100ms

    setTimeout(function() {
      clearInterval(intervalId);
      reject(new Error('Timeout: Audio file loading took too long.'));
    }, timeout); // Timeout in milliseconds
  });
}