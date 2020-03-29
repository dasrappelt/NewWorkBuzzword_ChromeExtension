function keywordsHighlighter(remove) {
  var occurrences = 0;
  var keyword_occurrences = [];

  // Based on "highlight: JavaScript text higlighting jQuery plugin" by Johann Burkard.
  // http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
  // MIT license.
  function highlight(node, pos, keyword) {
    keyword_occurrences.push(keyword);
    var span = document.createElement("span");
    span.className = "highlighted";
    span.style.color = "#292524";
    span.style.fontWeight = "900";
    span.style.backgroundColor = "#fee603";

    var highlighted = node.splitText(pos);
    /*var afterHighlighted = */ highlighted.splitText(keyword.length);
    var highlightedClone = highlighted.cloneNode(true);

    span.appendChild(highlightedClone);
    highlighted.parentNode.replaceChild(span, highlighted);

    occurrences++;
  }

  function addHighlights(node, keywords) {
    var skip = 0;

    var i;
    if (3 == node.nodeType) {
      for (i = 0; i < keywords.length; i++) {
        var keyword = keywords[i].toLowerCase();
        var pos = node.data.toLowerCase().indexOf(keyword);
        if (0 <= pos) {
          highlight(node, pos, keyword);
          skip = 1;
        }
      }
    } else if (
      1 == node.nodeType &&
      !/(script|style|textarea)/i.test(node.tagName) &&
      node.childNodes
    ) {
      for (i = 0; i < node.childNodes.length; i++) {
        i += addHighlights(node.childNodes[i], keywords);
      }
    }

    return skip;
  }

  function removeHighlights(node) {
    var span;
    while ((span = node.querySelector("span.highlighted"))) {
      span.outerHTML = span.innerHTML;
    }

    occurrences = 0;
  }

  if (remove) {
    removeHighlights(document.body);
  }
  var buzzwords =
    "New Work, NewWork, Scrum, Design Thinking, Purpose, Agilität, Agil, Obstkorb, gesellschaftlicher Mehrwert, Jobsharing, New Leadership, menschenzentriert, digital, menschzentriert, lego, serious play, tischtennis, table tennis, tischkicker, yolo, kultur, culture, cultural, work-life-balance, ai, identität, wert, vuca, change, enable, enablement, potential, design, mindset, big data, freiheit, freeedom, performance, arbeit 4.0, digitalisierung, management 3.0, lernende organisation, netzwerkorganisation, schwarm, bällebad, lean, bottom up";
  var keywords = buzzwords.split(",");
  addHighlights(document.body, keywords);
  var total_number_words = document.body.innerText
    .split(/\s/)
    .filter(function(txt) {
      return /\S/.test(txt);
    }).length;

  var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
  xmlhttp.open("POST", "https://api.leavinghierarchies.org/insert.php", true);
  xmlhttp.setRequestHeader("Content-Type", "application/json");
  xmlhttp.send(
    JSON.stringify({
      domain: location.href,
      words: occurrences,
      keywords: keyword_occurrences.toString(),
      total_words: total_number_words
    })
  );

  chrome.runtime.sendMessage({
    message: "showOccurrences",
    occurrences: occurrences,
    keyword_occurrences: keyword_occurrences,
    total_number_words: total_number_words
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  keywordsHighlighter(false);

  console.log(
    document.body.innerText.split(/\s/).filter(function(txt) {
      return /\S/.test(txt);
    })
  );
});
