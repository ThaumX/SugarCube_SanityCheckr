/*eslint no-console: [0] */
/******************************************************/
/*  ███████╗ █████╗ ███╗   ██╗██╗████████╗██╗   ██╗   */
/*  ██╔════╝██╔══██╗████╗  ██║██║╚══██╔══╝╚██╗ ██╔╝   */
/*  ███████╗███████║██╔██╗ ██║██║   ██║    ╚████╔╝    */
/*  ╚════██║██╔══██║██║╚██╗██║██║   ██║     ╚██╔╝     */
/*  ███████║██║  ██║██║ ╚████║██║   ██║      ██║      */
/*  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝      ╚═╝      */
/*                                                    */
/*   ██████╗██╗  ██╗███████╗ ██████╗██╗  ██╗██████╗   */
/*  ██╔════╝██║  ██║██╔════╝██╔════╝██║ ██╔╝██╔══██╗  */
/*  ██║     ███████║█████╗  ██║     █████╔╝ ██████╔╝  */
/*  ██║     ██╔══██║██╔══╝  ██║     ██╔═██╗ ██╔══██╗  */
/*  ╚██████╗██║  ██║███████╗╚██████╗██║  ██╗██║  ██║  */
/*   ╚═════╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝  */
/*------------------------------------------------------
A rough-and-tumble debugging tool for tw files.
Seriously, this is pretty ugly -- it just needs to get
the job done!
Requirements:
.  node.js (obviously)
.  node-dir (for directory easiness)
.  .  [INSTALL: npm install node-dir -g]
/******************************************************/
//Open the filesystem and load node-dir, choose path.
var _fs   = require("fs"),
  _path   = require("path"),
  dir     = require("node-dir"),
  dirname = "src/";

/******************************************************
Create an object with all of our RegEx identifications
in one place. Should make it easier to adjust and expand.
The script iterates through object properties and applies
a check to the text data using them. baseHtml for example
contains properties that are arrays. The arrays contain
the opening tag, and then closing tag RegEx.
******************************************************/
var reg = {
  baseHtml : {
    div : [/[^<]<div/g,/<\/div>/g],
    span : [/[^<]<span/g,/<\/span>/g],
    p : [/[^<]<p/g,/<\/p>/g],
    table : [/[^<]<table/g,/<\/table>/g],
    tr : [/[^<]<tr/g,/<\/tr>/g],
    th : [/[^<]<th/g,/<\/th>/g],
    td : [/[^<]<td/g,/<\/td>/g],
    ul : [/[^<]<ul/g,/<\/ul>/g],
    li : [/[^<]<li/g,/<\/li>/g],
    dd : [/[^<]<dd/g,/<\/dd>/g],
    dl : [/[^<]<dl/g,/<\/dl>/g],
    dt : [/[^<]<dt/g,/<\/dt>/g],
    form : [/[^<]<form/g,/<\/form>/g],
    ol : [/[^<]<ol/g,/<\/ol>/g],
    center : [/[^<]<center/g,/<\/center>/g],
    dir : [/[^<]<dir/g,/<\/dir>/g],
    b : [/<b>/g,/<\/b>/g],
    i : [/<i>/g,/<\/i>/g],
    base : [/[^<]<base/g,/<\/base>/g],
    basefont : [/[^<]<basefont/g,/<\/basefont>/g],
    caption : [/[^<]<caption/g,/<\/caption>/g],
    col : [/[^<]<col/g,/<\/col>/g],
    colgroup : [/[^<]<colgroup/g,/<\/colgroup>/g],
    del : [/[^<]<del/g,/<\/del>/g],
    em : [/[^<]<em/g,/<\/em>/g],
    font : [/[^<]<font/g,/<\/font>/g],
    label : [/[^<]<label/g,/<\/label>/g],
    legend : [/[^<]<legend/g,/<\/legend>/g],
    map : [/[^<]<map/g,/<\/map>/g],
    q : [/<q>/g,/<\/q>/g],
    s : [/<s>/g,/<\/s>/g],
    small : [/[^<]<small/g,/<\/small>/g],
    strike : [/<strike>/g,/<\/strike>/g],
    strong : [/<strong>/g,/<\/strong>/g],
    sub : [/<sub>/g,/<\/sub>/g],
    sup : [/<sup>/g,/<\/sup>/g],
    tt : [/[^<]<tt/g,/<\/tt>/g],
    u : [/<u>/g,/<\/u>/g],
    tfoot : [/[^<]<tfoot/g,/<\/tfoot>/g],
    thead : [/[^<]<thead/g,/<\/thead>/g],
  },
  baseMacro : {
    silently : [/<<silently>>/g,/<<\/silently>>/g],
    nobr : [/<<nobr>>/g,/<<\/nobr>>/g],
    if : [/<<if\s/g,/<<\/if>>/g],
    replace : [/<<replace\s/g,/<<\/replace>>/g],
    button : [/<<button\s/g,/<<\/button>>/g],
    link : [/<<link\s/g,/<<\/link>>/g],
    for: [/<<for\s/g,/<<\/for>>/g],
    switch: [/<<switch\s/g,/<<\/switch>>/g],
    repeat: [/<<repeat\s/g,/<<\/repeat>>/g],
    timed: [/<<timed\s/g,/<<\/timed>>/g],
    widget: [/<<widget\s/g,/<<\/widget>>/g],
    append: [/<<append\s/g,/<<\/append>>/g],
    prepend: [/<<prepend\s/g,/<<\/prepend>>/g],
    script: [/<<script>>/g,/<<\/script>>/g],
    capture: [/<<capture\s/g,/<<\/capture>>/g],
    dialog: [/<<dialog\s/g,/<<\/dialog>>/g],
    message: [/<<message\s/g,/<<\/message>>/g],
    alert: [/<<alert\s/g,/<<\/alert>>/g],
    hoverreplace: [/<<hoverreplace\s/g,/<<endhoverreplace>>/g],
    insertion: [/<<insertion\s/g,/<<endinsertion>>/g],
  },
  baseMarkDown : {
    spanMarkDown : [/@@[.a-zA-Z0-9_\-:;]+;/g,/(@@[.a-zA-Z0-9_\-:;]+;)[^@]+(@@)/g],
  },
  passageName : /[a-zA-Z0-9_-]+/,
};

//dd|dl|dt|form|ol|p|ul|center|dir|hr|b|base|basefont|br|caption|col|colgroup|del|em|font|input|label|legend|li|map|q|s|select|small|strike|strong|sub|sup|textarea|tfoot|thead|tt|u|

dir.readFiles(dirname, {match: /.tw$/,exclude: /^-/},
  function(err, content, next) {
    if (err) throw err;
    splitPassages(content);
    next();
  });

function splitPassages(content){
  let passages = [],
    str = content,
    fnd = -1,
    lmt = 25,
    j = 0;
  do{
    j ++;
    fnd = str.slice(20).search(/::[\s]{1,2}[a-zA-Z0-9_-]+[\s]{1,2}\[[a-zA-Z0-9.\s_-]*\]/);
    if(fnd != -1){
      fnd += 20;
      passages.push(str.slice(0,fnd));
      str = str.slice(fnd);
    }else{
      passages.push(str);
    }
  }while(fnd != -1 && j < lmt);
  //console.log(`Found ${passages.length} passages.`);
  for(let i = 0, l = passages.length; i < l; i++){
    parseFile(passages[i]);
  }
}

function parseFile(text){
  const name = getName(text.slice(0,30));
  var err = [],errCunt = "Error Count: ";
  err.push("Specific Errors:");
  if(!reg.passageName.test(name)){
    err.push(`Passage name ${name} is invalid.`);
  }
  text = murderComments(text);
  //console.log(`I found this thing: ${name}`);
  //start basic open & close checks
  let re = openCloseCheck(text,err,"baseHtml");
  re += openCloseCheck(text,err,"baseMacro");
  re += openCloseCheck(text,err,"baseMarkDown");
  errCunt += `Open/Close=${re}`;
  if(err.length > 1){
    err = err.join("\n");
    tempPrint(name,err,errCunt);
  }
}

function getName (sliced){
  let n = sliced.search(/[^:\s/]./);
  sliced = sliced.slice(n);
  n = sliced.search(/\s/);
  return sliced.slice(0,n);
}

function countMatch(str,sub){
  return (str.match(sub)||[]).length;
}

function openCloseCheck(text,err,check){
  const keys = Object.keys(reg[check]),
    l = keys.length;
  let opn, cls, c = 0;
  for(let i = 0; i < l; i++){
    opn = countMatch(text,reg[check][keys[i]][0]);
    cls = countMatch(text,reg[check][keys[i]][1]);
    if(opn > cls){
      err.push(`Missing a closing tag/s for element ${keys[i]}. Open: ${opn}, Close: ${cls}.`);
      c++;
    }else if(opn < cls){
      err.push(`Too many closing tags for element ${keys[i]}. Open: ${opn}, Close: ${cls}.`);
      c++;
    }
  }
  return c;
}

function tempPrint(name,err,errCunt){
  let l1 = Math.floor((26 - name.length) / 2);
  let l2 = Math.ceil((26 - name.length) / 2);
  let beg = "", end = "]";
  for(let i = 0; i < l1; i++){
    beg += "=";
  }
  beg += "[";
  for(let i = 0; i < l2; i++){
    end += "=";
  }
  console.log(`========${beg} PASSAGE REPORT: ${name} ${end}========\n${errCunt}\n${err}`);
}

function murderComments(text){
  let fnd = -1, snd = -1, j = 0, jmax = 40;
  do{
    fnd = text.indexOf("/*");
    if(fnd > -1){
      snd = text.indexOf("*/",(fnd+2));
      if(snd == -1){ //for unclosed comments at end of file
        text = text.slice(0,fnd);
      }else{
        snd += 2; //to remove closing portion
        text = (text.slice(0,fnd) + text.slice(snd));
      }
    }
  }while(fnd != -1 && j < jmax);
  return text;
}