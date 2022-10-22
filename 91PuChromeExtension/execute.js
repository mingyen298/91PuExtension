var table = { "C": 0, "C#": 1, "Db": 1, "D": 2, "D#": 3, "Eb": 3, "E": 4, "F": 5, "F#": 6, "Gb": 6, "G": 7, "G#": 8, "Ab": 8, "A": 9, "A#": 10, "Bb": 10, "B": 11 };
var sequences = {
  "#": "C C# D D# E F F# G G# A A# B".split(" "),
  "b": "C Db D Eb E F Gb G Ab A Bb B".split(" ")
};
var set_box_context = {
  originNode: null,
  prevNode: null,
  curNode: null,
}
const chordRegex = /(.+)[/](.+)/;
// function ặ() { } //override setbox alert
function Adblock() {
  const adGeekRegex = /(adGeek).*/;
  const adRegex = /(div-gpt-ad).*/;
  const cfRegex = /(CFOutDiv)/;
  document.querySelectorAll("#coverDiv").forEach(element => {
    element.remove("")
  });
  document.querySelectorAll("#viptoneWindow").forEach(element => {
    element.remove("")
  });
  document.querySelectorAll(".alertwin").forEach(element => {
    element.remove("")
  });
  document.querySelectorAll("div[id]").forEach(element => {
    element.id.match(adGeekRegex) && element.remove("")
  });
  document.querySelectorAll("div[id]").forEach(element => {
    element.id.match(adRegex) && element.remove("")
  });
  document.querySelectorAll("div[id]").forEach(element => {
    element.id.match(cfRegex) && element.remove("")
  });

  document.querySelectorAll("ins").forEach(element => {
    element.remove("")
  });
  document.querySelectorAll("iframe").forEach(element => {
    element.remove("")
  });


  document.querySelectorAll(".set").forEach(element => {
    var s = document.createElement("div")
    s.setAttribute("class", "set");
    s.innerHTML = element.innerHTML;

    element.parentElement.appendChild(s);
    element.remove("");
  });
}






var calculDistance = (cur, targ) => {
  cur = table[cur];
  targ = table[targ];
  return targ - cur;
};

var mappingChord = (curChord, dist, originDist) => {
  var arr = curChord.match('([A-Z]([#|b]?))(.*)');
  arr.splice(0, 1);
  var rawPos = 0;
  var seq;
  if (originDist < 0) {
    rawPos = table[arr[0]];
    seq = sequences['b'];
  } else {
    rawPos = table[arr[0]];
    seq = sequences['#'];
  }
  rawPos = rawPos + dist + 12;

  rawPos %= 12;
  arr[0] = seq[rawPos];
  var temp = arr[0].split('');
  (temp.length === 2) && (arr[0] = temp[0] + '<sup>' + temp[1] + '</sup>');

  // console.log(rawPos)
  if (arr.length === 3) {
    arr[0] += arr[2];
  } else if (arr.length === 2) {
    arr[0] += arr[1];
  }
  return arr[0];

};

var proccessChord = (element, dist, originDist) => {
  var arr = element.innerText.match(chordRegex)
  if (arr) {
    arr.splice(0, 1);
    var res1 = mappingChord(arr[0], dist, originDist);

    var res2 = mappingChord(arr[1], dist, originDist);
    return res1 + '/' + res2;
  } else {
    var res = mappingChord(element.innerText, dist, originDist);
    return res;
  }
}

var updateChordUI = (element, dist, originDist) => {

  var res = proccessChord(element, dist, originDist);
  element.innerHTML = res;
}

var cacheTfs = null;
var keyTransposition = (newElem) => {

  var dist = calculDistance(set_box_context.curNode.innerText, newElem.innerText);
  var originDist = calculDistance(set_box_context.originNode.innerText, newElem.innerText);
  console.log("origin Dist :" + originDist);
  console.log(dist);
  if (cacheTfs === null) {
    cacheTfs = document.querySelectorAll(".tf");
  }
  cacheTfs.forEach(element => {
    updateChordUI(element, dist, originDist);

  });


};

function updateBtnUI(newElem) {
  set_box_context.curNode.classList.remove("select")
  newElem.classList.add("select");

}
function onClickKey(e) {

  updateBtnUI(e.target);

  keyTransposition(e.target);
  set_box_context.prevNode = set_box_context.curNode;
  set_box_context.curNode = e.target;

}
function CostomKeyTranspositionInit() {
  //regist keys click observer function 
  document.querySelectorAll("div.ks").forEach(element => {
    for (var e of element.children) {
      e.getAttribute('class') && (set_box_context.originNode = e);
      e.addEventListener("click", onClickKey);
    }
    set_box_context.prevNode = set_box_context.originNode;
    set_box_context.curNode = set_box_context.originNode;
    console.log(set_box_context.originNode);
  });

}

// var started = false;

const onMessage = (message) => {

  switch (message.action) {

    case 'run':
      // if (!started){
        Adblock();
        CostomKeyTranspositionInit();
      // }

      break;
  }
}

chrome.runtime.onMessage.addListener(onMessage);