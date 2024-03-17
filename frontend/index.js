window.onload = () => {

  //document.body.dataset.theme = "system";
  
  //eruda.init();
  
  window.cm = {};

  window.dom = {

    body: document.body,
    
    boot: document.getElementById('boot'),
    
    "style": document.getElementById("css"),

    "code":  document.getElementById("code"),

    "html": document.getElementById('html-editor'),

    "css": document.getElementById('css-editor'),

    "js": document.getElementById('js-editor'),

    "resize": {

      "code": document.getElementById("resizer"),

      "html": document.getElementById('html-resizer'),

      "css": document.getElementById('css-resizer'),

      "js": document.getElementById('js-resizer')

    },

    "iframe": {

      "code": {

        "elem": document.getElementById("preview-code")

      }

    }

  };

  

  pvw();

  

  cm.html = CodeMirror(dom.html, {

    lineNumbers: true,

    lineWrapping: true,

    htmlMode: true,

    mode: 'xml',  

    styleActiveLine: true,

    theme: 'abcdef',

    matchBrackets: true

  });

  cm.html.on("change",(change) => { 

    upd();

  });

  

  cm.css = CodeMirror(dom.css, {

    lineNumbers: true,

    lineWrapping: true,

    mode: 'css',  

    styleActiveLine: true,

    theme: 'abcdef',

    matchBrackets: true

  });

  cm.css.on("change",(change) => { 

    upd();

  });

  

  cm.js = CodeMirror(dom.js, {

    lineNumbers: true,

    lineWrapping: true,

    mode: 'javascript',  

    styleActiveLine: true,

    theme: 'abcdef',

    matchBrackets: true

  });

  cm.js.on("change",(change) => {

    upd();

  });

  

  /*RESIZER*/

  let m_pos;

  function resize(e) {

    const dx = (m_pos - e.x) * -1;

    m_pos = e.x;

    dom.code.style.width = (parseInt(getComputedStyle(dom.code, '').width) + dx) + "px";

    //console.log({m_pos,x:e.x},dx);

  }

  dom.resize.code.addEventListener("mousedown", function(e){ 

    //console.log(e.offsetX);

    if (e.offsetX < dom.resize.code.clientWidth) {

      m_pos = e.x;

      body.classList.add('dragging');

      document.addEventListener("mousemove", resize, false);

    }

  }, false);

  document.addEventListener("mouseup", function(){

    body.classList.remove('dragging');

    document.removeEventListener("mousemove", resize, false);

  }, false); 

  /*RESIZER*/
  
  init();

};

function init() {

  window.rout.ing = (href, GOT, n, m = GOT[n], root = GOT[0]) => {
    return m.includes("#") ||
      (n > -1);
  };
  
  firebase.initializeApp(auth.config);

  dom.body.onclick = (event) => on.touch.tap(event, "tap");

  (dom.boot.dataset.path ? dom.boot.dataset.path : window.location.pathname).router().then(e => {
    firebase.auth().onAuthStateChanged(user => {
      auth.change(user).then(user => {
        //console.log({user});
        if(user) {
          
        } else {
          localStorage.removeItem('githubAccessToken');
        }
        dom.body.dataset.load = "ed";
      })
    });
  });
  
}


                     function getBlobURL(code, type) {
  const blob = new Blob([code], { type });

  return URL.createObjectURL(blob);
}

function getPageURL(html, css, js) {
  const cssURL = getBlobURL(css, "text/css");

  const jsURL = getBlobURL(js, "text/javascript");

  const source = `

    <html>

      <head>

        ${css && `<link rel="stylesheet" type="text/css" href="${cssURL}" />`}

        ${js && `<script src="${jsURL}">${atob("PC9zY3JpcHQ+")}`}

      </head>

      <body>

        ${html || ""}

      </body>

    </html>

  `;

  return getBlobURL(source, "text/html");
}

function pvw() {
  dom.iframe.code.doc = document.getElementById("iframe").contentDocument;

  dom.iframe.code.head = document
    .getElementById("iframe")
    .contentDocument.querySelector("head");

  dom.iframe.code.head.innerHTML = '<style id="style"></style>';

  dom.iframe.code.style = dom.iframe.code.head.querySelector("style");

  //dom.iframe.code.body = document
    //.getElementById("preview-code")
    //.contentDocument.querySelector("body");
}

function upd() {
  pvw();

  var html = cm.html.getValue();

  var css = cm.css.getValue();

  var js = cm.js.getValue();

  var page = getPageURL(html, css, js);

  dom.iframe.code.style.textContent = css;

  dom.iframe.code.elem.src = page;
}
