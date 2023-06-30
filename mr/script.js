var currentTitle, currentNum, nextTitle, nextNum, nextSelectedNum, nodes, edges, musicData, playedString, userNum;
var prevNum = -1;
var webChoice = 0;
var audio = []; 
var start = [];
var timeouts = [];
var userAudio = [];

import {names} from "./assets/names.js"

var selectElement = document.getElementById("nameSelector");
for (var i = 0; i < names.length; i++) {
  var option = document.createElement("option");
  option.value = i;  // The value is the index
  option.text = names[i].name;  // The displayed text is the name
  selectElement.appendChild(option);
}
selectElement.addEventListener("change", function() {
  webChoice = this.value;
  console.log("SilDEBUG: Selected Web ID is ", webChoice);
  stopAudio();
});



var submitText = document.querySelector("#textButton");
submitText.addEventListener('click', function() {
  var string = document.querySelector("#stringRequest").value;
  var verify = document.querySelector("#myCheckbox").checked;
  console.log(`SilDEBUG: Clicked - ${string}, ${verify}`);
  userNum = 0;
  
  var userConfirmation = document.querySelector("#VerificationStatus");

  if (verify) {
    var followsPath = verifySequence(musicData, string);
    console.log(musicData);
    console.log(string);

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

    let titles = string.split(" ");
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
  playedString = "";
  
  var placeholderText = document.querySelector("#stringRequest");
  placeholderText.placeholder = names[webChoice].author_route;
  placeholderText.value = names[webChoice].author_route;
  
  var filepath = `./assets/${names[webChoice].name}/music-data.json`;
  await fetch(filepath)
  .then(response => response.json())
  .then(data => musicData = data);
  
  loadTable();
  
  currentNum = -1;
  nextNum = start[Math.floor(Math.random() * start.length)];
  nextTitle = musicData[nextNum].title;
  nextSelectedNum = -1;
  updateRightColumn(nextTitle, 'N/A', musicData[nextNum].artist, []);
  
  
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
  console.log('  EisDEBUG: loadTable() started.');

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
          if (toIndex != -1) {
              let edge = {
                  from: index,
                  to: toIndex,
                  value: nextNode.weight,
                  arrows: {to: {enabled: true, type: "arrow"}},
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
          min: 40,
          max: 40
        }
      }
    },
    edges: {
      scaling: {
        customScalingFunction: function (min, max, total, value) {
            return (value - min) / (max - min);
        },
        min: 1,
        max: 5,
      },
    },
    layout: {randomSeed: names[webChoice].seed},
    physics: {
      barnesHut: {
        gravitationalConstant: -8000,
        centralGravity: 0.3,
        springLength: 200,
        springConstant: 0.08,
        damping: 0.20,
        avoidOverlap: 1
      }
    }
};

  var network = new vis.Network(container, data, options);
  
  console.log('  EisDEBUG: loadTable() completed.');
}

function prepareAudio() {
  console.log('  EisDEBUG: prepareAudio() started; musicData.length is ' + musicData.length);
  for(let i = 0; i < musicData.length; i++) {
    audio.push(new Audio(`assets/${names[webChoice].name}/audio-clips/` + musicData[i].file));
  }

  audio[nextNum].load();

  console.log('  EisDEBUG: prepareAudio() completed; audio.length is ' + audio.length);
  console.log('  EisDEBUG: prepareAudio() completed; start.length is ' + start.length);

  waitForAudioLoad(audio[nextNum], 3000)
  .then(function() {
    console.log('Audio file is loaded and ready to play.');
    playNext();
  });
  
}

function playNext() {
  console.log('  EisDEBUG: playNext(); nextNum is ' + nextNum);
  
  if (userAudio[userNum] !== undefined) {
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
    
    simulateProgress(musicData[currentNum].lengthToNext);

    if(nextNum !== -1) {
      audio[nextNum].load();
    }

  } else {
  
    if(nextNum === -1) {
      console.log('  EisDEBUG: song ended.');
      nextNum = 0;
      nextTitle = musicData[nextNum].title;
      nextSelectedNum = -1;
    } else {
      audio[nextNum].play();
      console.log('    EisDEBUG: playing track ' + nextNum);
      
      currentTitle = nextTitle;
      currentNum = nextNum;
      timeouts.push(setTimeout(playNext, musicData[currentNum].lengthToNext));

      simulateProgress(musicData[currentNum].lengthToNext);
      
      if(musicData[nextNum].next.length === 0) {
        console.log('  EisDEBUG: no next song.');
        nextNum = -1;
      } else {
        // choose next
        nextSelectedNum = weightedRandomIndex(musicData[currentNum].next);
        nextTitle = musicData[currentNum].next[nextSelectedNum].name;
        
        for(let i = 0; i < musicData.length; i++) {
          // console.log(`      EisDEBUG: musicData[${i}].title is ${musicData[i].title}`);
          if(musicData[i].title == nextTitle) {
            // console.log(`    EisDEBUG: found that musicData[${i}].title is ${musicData[i].title} and matches nextTitle`);
            nextNum = i;
            i = musicData.length;
          }
        }
        
        if(nextNum === currentNum) {
          console.log('    EisDEBUG: track repeats');
        } else {
          audio[nextNum].load();
        }
      }
    }
  }
        console.log(`    EisDEBUG: currentNum is ${currentNum}, currentTitle is ${currentTitle}, ` +
        `nextNum is ${nextNum}, nextTitle is ${nextTitle}, prevNum is ${prevNum}, and nextSelectedNum is ${nextSelectedNum}`);
        
        if (prevNum > -1){
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

        updateRightColumn(currentTitle, nextTitle, musicData[currentNum].artist, musicData[currentNum].next);
        updatePlayString(currentTitle);
        
}


// Functions to adjust things, not key functionality

function updateRightColumn(current, next, artist, nextList) {
  var currentNode = document.querySelector("#current .largeBold");
  var nextNode = document.querySelector("#nextNode");
  var artistLine = document.querySelector("#RightArtist");
  var nodeList = document.querySelector("#nodeList");
  var longNodeList = document.querySelector("#secondNodeList");

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
  
  nextList = nextList.filter(item => item.name !== next);

  currentNode.innerHTML = `${current}`;
  nextNode.innerHTML = `${next}`;
  artistLine.innerHTML = `${artist}`;
  nodeList.innerHTML = ``;
  nextList.forEach((item) => {
    let node = document.createElement('p');
    node.innerHTML = `${item.name} (${item.weight})`;
    nodeList.appendChild(node);
  });
}

function updatePlayString(current) {
  var playNode = document.querySelector("#Played");

  playedString += current + ", ";

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

  timeouts = [];
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

    if (currentTime >= endTime) {
      clearInterval(interval);
      progressBar.style.width = '100%';
    } else {
      progressBar.style.width = progress + '%';
    }
  }
};

function weightedRandomIndex(arr) {
  let totalWeight = arr.reduce((accum, item) => accum + item.weight, 0);
  let randomNum = Math.random() * totalWeight;

  for(let i = 0; i < arr.length; i++) {
      if (randomNum <= arr[i].weight) {
          return i;
      }
      randomNum -= arr[i].weight;
  }
}

function secondsToMS(num){
  let returnValue = num / 1000;
  return `${returnValue} s`
}

function verifySequence(web, string) {
  let titles = string.split(' ');
  
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