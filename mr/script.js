var currentTitle, currentNum, nextTitle, nextNum, nextSelectedNum, prevNum;
var audio = [];
var start = [];
var nodes;
var edges;


import {musicData} from "./assets/music-data.js"

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

function startup() {
  console.log('EisDEBUG: startup() started.');

  loadTable();
  prepareAudio();

  currentNum = -1;
  nextNum = start[Math.floor(Math.random() * start.length)];
  nextTitle = musicData[nextNum].title;
  nextSelectedNum = -1;
  // document.getElementsByClassName('table-row-container')[nextNum].children[0].children[0].classList.add('next-cell');
  
  document.getElementById('controls-container').innerHTML =
          `<button id="begin-btn">Begin</button>`;
  document.querySelector('#begin-btn').addEventListener('click', playNext);

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
              color = "#47d16c";
              break;
          default:
              color = "#DDDDDD";
              break;
      }
    
      // Generate node array
      let node = {
          id: index,
          label: music.title,
          color: color
      };
      nodeArray.push(node);
    
      // Generate edge array
      music.next.forEach((nextNode) => {
          // Get the index of the nextNode from the musicData array
          let toIndex = musicData.findIndex(item => item.title === nextNode);
          if (toIndex != -1) {
              let edge = {
                  from: index,
                  to: toIndex,
                  arrows: {to: {enabled: true, type: "arrow"}},
                  color: "#000000"
              };
              edgeArray.push(edge);
          }
      });
  });

  // console.log("Node Array:", nodeArray);
  // console.log("Edge Array:", edgeArray);

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
    }
  };
  var network = new vis.Network(container, data, options);
  
  console.log('  EisDEBUG: loadTable() completed.');
}

function prepareAudio() {
  console.log('  EisDEBUG: prepareAudio() started; musicData.length is ' + musicData.length);
  for(let i = 0; i < musicData.length; i++) {
    audio.push(new Audio('assets/audio-clips/' + musicData[i].file));
    audio[i].addEventListener('play', function() {
      setTimeout(playNext, (musicData[i].lengthToNext) - 10); //Arbitrary number to reduce silence
    });
    if (musicData[i].start) {
      start.push(i);
    }
  }
  console.log('  EisDEBUG: prepareAudio() completed; audio.length is ' + audio.length);
  console.log('  EisDEBUG: prepareAudio() completed; start.length is ' + start.length);
}

function playNext() {
  console.log('  EisDEBUG: playNext(); nextNum is ' + nextNum);

  
  
  if(nextNum === -1) {
    console.log('  EisDEBUG: song ended.');
    nextNum = 0;
    nextTitle = musicData[nextNum].title;
    nextSelectedNum = -1;
    // document.getElementsByClassName('table-row-container')[currentNum].children[0].children[0].classList.remove('current-cell');
    // document.getElementsByClassName('table-row-container')[nextNum].children[0].children[0].classList.add('next-cell');
  } else {
    audio[nextNum].play();
    console.log('    EisDEBUG: playing track ' + nextNum);
    
    // decolor
    // document.getElementsByClassName('table-row-container')[nextNum].children[0].children[0].classList.remove('next-cell');
    if(nextSelectedNum !== -1) {
      // document.getElementsByClassName('table-row-container')[currentNum].children[1].children[nextSelectedNum].classList.remove('next-cell');
    }
    if(currentNum !== -1) {
      // document.getElementsByClassName('table-row-container')[currentNum].children[0].children[0].classList.remove('current-cell');
    }
    
    currentTitle = nextTitle;
    currentNum = nextNum;
    // document.getElementsByClassName('table-row-container')[currentNum].children[0].children[0].classList.add('current-cell');
    
    if(musicData[nextNum].next.length === 0) {
      console.log('  EisDEBUG: no next song.');
      // document.getElementsByClassName('table-row-container')[currentNum].children[1].children[0].classList.add('end-cell');
      nextNum = -1;
    } else {
      // choose next
      nextSelectedNum = Math.floor(Math.random() * musicData[currentNum].next.length);
      nextTitle = musicData[currentNum].next[nextSelectedNum];
      
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
      
      nodes.update({id: currentNum, color: '#5e71c4'}); 
      nodes.update({id: nextNum, color: '#e0d679'});
      
    }
  }
}