document.addEventListener(
  "DOMContentLoaded",

  function() {
    function animateValue(id, start, end, duration) {
      var range = end - start;
      var current = start;
      var increment = end > start ? 1 : -1;
      var stepTime = Math.abs(Math.floor(duration / range));
      var obj = document.getElementById(id);
      var timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
          clearInterval(timer);
        } else if (end == 0) {
          obj.innerHTML = 0;
          clearInterval(timer);
        }
      }, stepTime);
    }
    document.querySelector("button").addEventListener("click", onclick, false);
    function onclick() {
      document.getElementById("loading_frame").style.display = "block";
      document.getElementById("morph_text").style.display = "flex";
      document.getElementById("div-start").style.display = "none";
      document.getElementById("highlight").style.display = "none";
      chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, "getOccurrences");
      });
    }
    function setCount(occurrences, keyword_occurrences, total_number_words) {
      setTimeout(function() {
        document.getElementById("loading_frame").style.display = "none";
        document.getElementById("div-result").style.display = "flex";
        document.getElementById("headline").classList.add("mark-once");
        if (occurrences > 1) {
          document.getElementById("wow-gif").style.display = "flex";
          document.getElementById("total_amount").innerHTML =
            " out of " + String(total_number_words) + " words found:";
          document.getElementById("result-topwords").innerHTML = String(
            keyword_occurrences
          );
        } else {
          document.getElementById("nice-gif").style.display = "flex";
          document.getElementById("total_amount").innerHTML =
            " out of " +
            String(total_number_words) +
            " words found. <br /> Not bad! ✊";
          document.getElementById("result-topwords").innerHTML = String(
            keyword_occurrences
          );
        }

        // document.getElementById("highlight").innerHTML = "Again";
        document.getElementById("morph_text").style.display = "none";
        // document.getElementById("result-amount").innerHTML = String(
        //   occurrences
        // );
        animateValue("result-amount", 0, occurrences, 5000);
      }, 4000);
    }

    chrome.runtime.onMessage.addListener(function(request) {
      if ("showOccurrences" == request.message) {
        var occurrences = request.occurrences;
        var keyword_occurrences = request.keyword_occurrences;
        var total_number_words = request.total_number_words;
        var average_buzzwords = (100 * occurrences) / total_number_words;
        if (occurrences == 0) {
        }
        setCount(occurrences, keyword_occurrences, total_number_words);
      }
    });
  },
  false
);
