/* ----------------------------------
  Webフォントの遅延読み込み
---------------------------------- */
(function () {
  var webfont = document.getElementById("webfont");
  webfont.rel = "stylesheet";
})();

/* ----------------------------------
  スムーズスクロール
---------------------------------- */
var scroll = new SmoothScroll('a[href*="#"]', {
  speed: 500,
  speedAsDuration: true
});

/* ----------------------------------
  Heroの文字アニメーション
---------------------------------- */
var words = document.querySelectorAll(".word");
words.forEach(function (word) {
  var letters = word.textContent.split("");
  word.textContent = "";
  letters.forEach(function (letter) {
    var span = document.createElement("span");
    span.textContent = letter;
    span.className = "letter";
    word.append(span);
  });
});
var currentWordIndex = 0;
var maxWordIndex = words.length - 1;
words[currentWordIndex].style.opacity = "1";
var rotateText = function () {
  var currentWord = words[currentWordIndex];
  var nextWord =
    currentWordIndex === maxWordIndex ? words[0] : words[currentWordIndex + 1];
  // rotate out letters of current word
  Array.from(currentWord.children).forEach(function (letter, i) {
    setTimeout(function () {
      letter.className = "letter out";
    }, i * 80);
  });
  // reveal and rotate in letters of next word
  nextWord.style.opacity = "1";
  Array.from(nextWord.children).forEach(function (letter, i) {
    letter.className = "letter behind";
    setTimeout(function () {
      letter.className = "letter in";
    }, 340 + i * 80);
  });
  currentWordIndex =
    currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
};
rotateText();
setInterval(rotateText, 4000);

/* ----------------------------------
  FormspreeのAjax送信
---------------------------------- */
window.addEventListener("DOMContentLoaded", function () {
  // get the form elements defined in your form HTML above
  var form = document.getElementById("my-form");
  var button = document.getElementById("my-form-button");
  var status = document.getElementById("my-form-status");

  // Success and Error functions for after the form is submitted
  function success() {
    form.reset();
    button.style = "display: none ";
    status.innerHTML =
      "<p class='alert'>お問い合わせありがとうございます！</p>";
  }

  function error() {
    status.innerHTML =
      "<p class='alert'>Oops! There was a problem.</p>";
  }

  // handle the form submission event
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var data = new FormData(form);
    ajax(form.method, form.action, data, success, error);
  });
});

// helper function for sending an AJAX request
function ajax(method, url, data, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url);
  xhr.setRequestHeader("Accept", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;
    if (xhr.status === 200) {
      success(xhr.response, xhr.responseType);
    } else {
      error(xhr.status, xhr.response, xhr.responseType);
    }
  };
  xhr.send(data);
}
