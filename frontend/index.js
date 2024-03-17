window.onload = () => {

  //document.body.dataset.theme = "system";
  
  //eruda.init();
  
  window.cm = {};

  window.dom = {

    body: document.body,
    
    boot: document.getElementById('boot'),
    
    "style": document.getElementById("css"),

    "code":  document.getElementById("editor"),

    "htm": document.getElementById('editor'),

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

  cm.htm = CodeMirror(document.getElementById("editor"), {

    lineNumbers: true,

    lineWrapping: true,

    htmlMode: true,

    mode: 'xml',  

    styleActiveLine: true,

    theme: 'abcdef',

    matchBrackets: true

  });

  cm.htm.on("change",(change) => { 

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

      document.body.classList.add('dragging');

      document.addEventListener("mousemove", resize, false);

    }

  }, false);

  document.addEventListener("mouseup", function(){

    document.body.classList.remove('dragging');

    document.removeEventListener("mousemove", resize, false);

  }, false); 

  /*RESIZER*/
  
  init();

};

function init() {
  console.log('Initialized...');
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
  dom.iframe.code.doc = document.getElementById("iframe").contentWindow.document;

  dom.iframe.code.head = document.getElementById("iframe").contentWindow.document.querySelector("head");

  dom.iframe.code.head.innerHTML = '<style id="style"></style>';

  dom.iframe.code.style = dom.iframe.code.head.querySelector("style");

  //dom.iframe.code.body = document
    //.getElementById("preview-code")
    //.contentDocument.querySelector("body");
}

function upd() {
  pvw();

  var htm = cm.htm.getValue();

  var page = getPageURL(htm, '', '');

  console.log({html, page})

  dom.iframe.code.style.textContent = css;

  dom.iframe.code.elem.src = page;
}
