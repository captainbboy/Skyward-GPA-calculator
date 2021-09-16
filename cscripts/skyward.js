/**
Copyright 2018-2020 MarioCMFlys

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/
let url = location.href;
let page = url.split("/scripts/wsisa.dll/WService=wsEAplus/")[1];
console.log(page)
var devMode = false;

function chunkify(a, n, balanced) { // https://stackoverflow.com/a/8189268
  if (n < 2) return [a];
  var len = a.length,
    out = [],
    i = 0,
    size;
  if (len % n === 0) {
    size = Math.floor(len / n);
    while (i < len) {
      out.push(a.slice(i, i += size));
    }
  } else if (balanced) {
    while (i < len) {
      size = Math.ceil((len - i) / n--);
      out.push(a.slice(i, i += size));
    }
  } else {
    n--;
    size = Math.floor(len / n);
    if (len % size === 0)
      size--;
    while (i < size * n) {
      out.push(a.slice(i, i += size));
    }
    out.push(a.slice(size * n));
  }
  return out;
}

function round(num, places) {
  var multiplier = Math.pow(10, places);
  return Math.round(num * multiplier) / multiplier;
}

function calculateWeightedGPA(grade, offset) {
  return grade * 0.05 - offset;
}
window.addEventListener("load", function() {
  fail = false;
  chrome.storage.sync.get(null, function(result) {
    if (result["mal"] != true) {
      if (result["skywardDarkTheme"] == true || result["skywardDarkTheme"] != false) {
        let variablesCSS = document.createElement("link")
        variablesCSS.rel = "STYLESHEET"
        variablesCSS.href = chrome.extension.getURL("cscripts/variables.css");
        document.head.appendChild(variablesCSS);

        let qsfmainCSS = document.createElement("link")
        qsfmainCSS.rel = "STYLESHEET"
        qsfmainCSS.href = chrome.extension.getURL("cscripts/qsfmain001.css");
        document.head.appendChild(qsfmainCSS);

        if (page != "seplog01.w") {
          let newElem2 = document.createElement("link")
          newElem2.rel = "STYLESHEET"
          newElem2.href = chrome.extension.getURL("cscripts/sfhome001.css");
          document.head.appendChild(newElem2);

          let newElem4 = document.createElement("link")
          newElem4.rel = "STYLESHEET"
          newElem4.href = chrome.extension.getURL("cscripts/sfgradebook001.css");
          document.head.appendChild(newElem4);
        } else {
          let newElem3 = document.createElement("link")
          newElem3.rel = "STYLESHEET"
          newElem3.href = chrome.extension.getURL("cscripts/qclssbase001.css");
          document.head.appendChild(newElem3);

          let newElem4 = document.createElement("link")
          newElem4.rel = "STYLESHEET"
          newElem4.href = chrome.extension.getURL("cscripts/qclsslogin001.css");
          document.head.appendChild(newElem4);

          var children = document.getElementById("loginBrading").children
          console.log(children)
          for (child in children) {
            if (children[child].src) children[child].src = "https://www.wccsonline.com/cms/lib/IN01806574/Centricity/Domain/317/SkyLogoBlue.png"
          }
        }

        if (page == "sfgradebook001.w") {
          let styleElements = document.getElementsByTagName("style");
          for (let i = 0; i < styleElements.length; i++) {
            let element = styleElements[i];
            if (element.innerHTML.includes("#sf_OuterWrap td.cCl {background-color:#FFFFFF")) {
              element.innerHTML = `
        #sf_OuterWrap td.cCl {
          background-color:var(--main-bg-color) !important;
          border-bottom:1px solid #D6DFEA !important;
          padding:3px 4px 3px 2px !important;
        }
        #sf_OuterWrap th.cCl {
          padding:3px 4px 3px 2px !important;
        }
        `
            }
          }
        }

        if(page == "sfstudentinfo001.w") {
          let children = document.getElementById('grid_studentContactInfo110312').firstChild.children;
          for (let i = 0; i < children.length; i++) {
            if(children[i]?.firstChild?.firstChild.style.backgroundColor == "rgb(238, 238, 238)") children[i].firstChild.firstChild.style.backgroundColor = "var(--main-bg-color)"
          }
        }

        if (page == "sfcalendar002.w") {
          let calenderJQueryCSS = document.createElement("link")
          calenderJQueryCSS.rel = "STYLESHEET"
          calenderJQueryCSS.href = chrome.extension.getURL("cscripts/jquery.cluetip.css");
          document.head.appendChild(calenderJQueryCSS);

          let styleElements = document.getElementsByTagName("style");
          for (let i = 0; i < styleElements.length; i++) {
            let element = styleElements[i];
            if (element.innerHTML.includes("span.fc-event-title {overflow:hidden; white-space:nowrap}")) {
              element.innerHTML = `
        span.fc-event-title {overflow:hidden; white-space:nowrap}
        #cluetip td, table.calTbl td {padding:2px 4px;}
        #cluetip-title #cluetip-close .sf_DialogClose {left:-7px;top:-4px;right:auto;}
        #cluetip .label {font-weight:bold;text-align:right;}
        #cluetip .clueHead {font-weight:bold;text-decoration:underline;text-align:center;font-size:larger;padding-bottom:5px;}
        #grid_header a.caltrigger {top:-3px;}
        .fc-event {cursor:pointer}
        #printMenuLink {vertical-align:super}
        .fc td, .fc th {background-color: var(--lighter-bg-color)}
        .fc-grid .fc-day-number {margin: 3px 3px 1px 1px;}
        .fc-grid th {background-color: var(--lighter-bg-color);line-height: 16px;}
        /* Settings required for Quick Print of Week or Day to look good (respect overflow:visible when printing, but still retain placement and other formatting) */
        @media print{
          .iePrint-visiClass {float:none !important; position:relative !important;}
          .iePrint-noHeight {height:0px !important;}
          * {overflow:visible !important;}
          #sf_menuWrap_calOptionsMenu, #calOptionsMenu, #sf_menuWrap_printMenuLink, #printMenuLink {visibility:hidden !important;}
          .printable {color:black;} /* All browsers automatically print with white backgrounds and dark text, but some with darker text than others - set to black for best readability */
        }
        input.wide {
        width:100%;
        align:right;
        }
        div.colorBox {margin:2px 14px 1px 0;border:1px solid #B7B7B7;padding:2px;vertical-align:middle;float:left;cursor:pointer;}
        div.colorBox:hover{border-color:#5E7890}
        div.colorBox div {width:14px;height:14px;border:inherit;text-align:center;cursor:pointer;}
        table.nw td{white-space:nowrap; padding:1px 7px;}
        #grid_CalendarOptions tr > td, #grid_EventColors tr > td {padding: 3px 0 3px 4px}
        table.studentOptions tr > td:nth-child(odd) {width:165px}
        table.studentOptions label {white-space:nowrap}
        `
            }
          }
        }

        let oldCSS = document.getElementsByTagName("link");

        // for (let i = 0; i < oldCSS.length; i++) {
        //   const element = oldCSS[i];
        //   if (element.href.includes("qcssloader.p?file=sfgradebook.css")) {
        //     element.remove();
        //   }
        //   /* // Has to stay commented for some reason bc it breaks gradebook without it.
        //   if(element.href.includes("qcssloader.p?file=qsfmain001.css")) {
        //     element.remove();
        //   }
        //   */
        //   if (element.href.includes("qcssloader.p?file=sfhome001.cs")) {
        //     element.remove();
        //   }
        //   if (element.href.includes("qcssloader.p?file=qclssbase001.css")) {
        //     element.remove();
        //   }
        //   if (element.href.includes("qcssloader.p?file=qclsslogin001.css")) {
        //     element.remove();
        //   }
        //   if (element.href.includes("qcssloader.p?file=jquery.cluetip.css")) {
        //     element.remove();
        //   }
        // }
      }

      if (window.location.pathname == "/scripts/wsisa.dll/WService=wsEAplus/sfgradebook001.w") {
        var aisdGrd = document.querySelectorAll('.scrollRows table tr.cPd td');
        if (result["skywardGrades"] == true || result["skywardGrades"] != false) {
          for (j = 0; j < aisdGrd.length; j++) {
            i = aisdGrd[j];
            if (i.children.length != 0) {
              c = i.children[0];
              if (parseInt(c.innerHTML) < 70) {
                c.style.color = '#FF0000';
                fail = true;
              }
            }
          }

          legend = document.querySelector('div#printGradesContainer > div.fXs.fIl.fWn');
          legend.innerHTML = legend.innerHTML + '<br><span style="float:right;">Failing grades are <b>red</b>.</span>';
        }

        var weightaverage = 4.0;
        var algNumber = 1;
        var numberOfGradeDivs = 1;
        // var classSumArray = [];
        var weightArray = [];

        if (result["skywardGpa"] == true || result["skywardGpa"] != false) {
          let weightsum = 0.0;
          let data_len = 0;
          for (let [key, value] of Object.entries(result)) {
            if (key.startsWith("storedGPA")) {
              data_len++;
              let value1 = value;
              if (!!value == false) {
                value1 = 0;
              }
              console.log(value1)
              weightsum += parseFloat(value1);
              pushWeightArray = weightArray.push(parseFloat(value));
            }
          }
          if (devMode) console.log(weightArray);
          weightArray = weightArray.filter(e => (e === 0 || e));
          if (devMode) console.log(weightArray);
          numberOfWeights = weightArray.length;
          if (devMode) console.log(numberOfWeights);
          if (devMode) console.log(weightsum);
          if (data_len < 8) {
            weightsum = NaN;
          }
          if (devMode) console.log(weightsum);
          weightaverage = weightsum / numberOfWeights;
          if (devMode) console.log(weightaverage);

          getStoredAlgorithm();
          getStoredGradesDivNum();

          setNumberOfClasses()
          setClassNames()

          let container = document.getElementById("printGradesContainer"); // Get main node
          // Find grade node
          let counterthing = 1;
          let grade_container = null;
          for (let i = 0; i < container.children.length; i++) {
            let child = container.children[i];
            if (numberOfGradeDivs == 1) {
              if (devMode) console.log('number of grade divs is 1')
              if (child.id.substring(0, 18) === "grid_stuGradesGrid") {
                grade_container = child;
                break;
              }
            } else {
              if (devMode) console.log('number of grade divs is 2')
              if (child.id.substring(0, 18) === "grid_stuGradesGrid") {
                counterthing++
                if (counterthing === 2) {
                  continue;
                }
                grade_container = child;
                break;
              }
            }
          }
          console.log(grade_container)
          if (grade_container === null) {
            console.log("[ERROR] Grades not found");
            return;
          }
          let detectUndefined = grade_container;
          //detectUndefined = +detectUndefined || 0;
          if (detectUndefined === undefined) {
            console.log("[ERROR] Grades not found");
            return;
          }
          // Get grades
          let inner_grades = grade_container.children[2].children[0].children[0].children[0].children[1].children[0].children[0];
          console.log(inner_grades);
          let gpa_sub = 0;
          let gpa_cnt = 0;
          let classSum = 0;

          // let classNamesArray = [];
          // let classNames = document.getElementsByClassName('bld classDesc') // Class Names:
          // for (let l = 0; l < classNames.length; l++) {
          // 	classNamesArray.push(classNames[l].firstChild.innerText)
          // }

          // let currentClass = 0;
          let tempGrades = [];

          for (let i = 0; i < inner_grades.children.length; i++) {
            let child = inner_grades.children[i];
            if (child.hasAttribute("group-parent")) {
              let final_grade = -1;
              for (let j = 0; j < child.children.length; j++) {
                let c_child = child.children[j];
                if (c_child.children[0].innerHTML.length < 10) continue;
                final_grade = parseInt(c_child.children[0].children[0].innerHTML);
              }

              if (final_grade !== -1) {
                gpa_sub += 0.05 * (100 - final_grade);
                gpa_cnt++;
              }

              if (devMode) console.log("final_grade: " + final_grade)

              tempGrades.push(final_grade)

            }
          }

          if (devMode) console.log(tempGrades)
          if (tempGrades.includes(-1)) { // it is the first semester or not all grades are in.	
            tempGrades = tempGrades.filter(a => a !== -1)
          }

          let finalerrormessage = 0;
          //average formula weighted
          let preGPAw = 0;
          let preGPAsum = 0;
          let numberOfGrades = tempGrades.length;
          let numberOfGrades1 = tempGrades.length;
          if (numberOfGrades > numberOfWeights) {
            console.log(numberOfGrades.toString() + 'grades found, but only' + numberOfWeights.toString() + 'weights selected.');
            finalerrormessage = 2;
            numberOfGrades1 = numberOfWeights;
          }
          if (numberOfGrades < numberOfWeights) {
            finalerrormessage = 3;
            console.log(numberOfGrades.toString() + ' grades found, but ' + numberOfWeights.toString() + ' weights selected');
          }
          for (let i = 0; i < numberOfGrades1; i++) {
            preGPAw = weightArray[i] * tempGrades[i] * 0.01;
            preGPAsum = preGPAsum + preGPAw;
            preGPAw = 0;
          }
          var gpaAverageW = preGPAsum / numberOfGrades1;
          if (devMode) console.log("gpaAverageW: " + gpaAverageW);
          let preGPAu = 0;
          preGPAsum = 0
          for (let i = 0; i < numberOfGrades; i++) {
            preGPAu = 4 * tempGrades[i] * 0.01;
            preGPAsum = preGPAsum + preGPAu;
            preGPAu = 0;
          }
          var gpaAverageU = preGPAsum / numberOfGrades;
          if (devMode) console.log("gpaAverageU: " + gpaAverageU);
          if (devMode) console.log("tempGrades: " + tempGrades);
          //subtraction formula
          console.log(gpa_sub + " " + gpa_cnt);
          let unweighted = 4.0 - gpa_sub / gpa_cnt;
          let weighted = weightaverage - gpa_sub / gpa_cnt;
          if (devMode) console.log("weighted: " + weighted);
          //use algorithm value to see which GPA value to use
          var finalWeightedNumber;
          var finalUnweightedNumber;
          if (devMode) console.log("algNumber: " + algNumber)
          if (algNumber == 1) {
            finalWeightedNumber = weighted;
            finalUnweightedNumber = unweighted;
            if (devMode) console.log('algnumber is 1');
          } else {
            finalWeightedNumber = gpaAverageW;
            finalUnweightedNumber = gpaAverageU;
            if (devMode) console.log('algnumber is 2');
          }
          // Display GPA
          let gpa_container = document.createElement("div");
          gpa_container.style = "float:right; margin-right:5px;";
          let GPAstr = "<h2 class=\"sf_heading\">Unweighted GPA: " + (Math.round(finalUnweightedNumber * 1000) / 1000).toString() + " || ";
          let detectNaN = weightaverage;
          detectNaN = +detectNaN || 0;
          /* if(numberOfWeights != tempGrades.length){
            weighted = NaN;
          } */
          if (detectNaN === 0) {
            finalerrormessage = 1;
          }

          if (finalerrormessage === 1) {
            GPAstr += "Select class weights to see weighted GPA </h2>";
          } else if (finalerrormessage === 2) {
            GPAstr += numberOfGrades.toString() + ' grades found, but only ' + numberOfWeights.toString() + ' weights selected'
          } else if (finalerrormessage === 3) {
            GPAstr += numberOfGrades.toString() + ' grades found, but ' + numberOfWeights.toString() + ' weights selected'
          } else {
            GPAstr += "Weighted GPA: " + (Math.round(finalWeightedNumber * 1000) / 1000).toString() + "</h2>"
          }
          gpa_container.innerHTML = GPAstr;
          if (devMode) console.log("detectNaN: " + detectNaN);
          if (devMode) console.log(gpa_container.innerHTML);
          container.prepend(gpa_container);

        }
      }

      if (window.location.pathname == "/scripts/wsisa.dll/WService=wsEAplus/seplog01.w") {
        if (result["skywardBanner"] == true || result["skywardBanner"] != false) {
          rowTop = document.querySelector("div#rowTop");
          if (rowTop != null) rowTop.style.display = "none";
        }
      }

      if (result["skywardTab"] == true || result["skywardTab"] != false) {
        var aisdDoc = document.createElement("script");
        aisdDoc.innerHTML = `var aisdOldOpen = window.open;
        window.open = function(url, name, specs, replace){
          return aisdOldOpen(url, name, "", true);
        };`;
        document.head.appendChild(aisdDoc);
      }

      timeoutScript = document.createElement("script");
      timeoutScript.innerHTML = `
        setInterval(function(){ // no more inactivity :D
          gUsrIdle.clearIdle();
          gUsrIdle.trackIdleTime();
        },60000);`;
      document.head.append(timeoutScript);

      if (result["hotfix"] != undefined) {
        hf = document.createElement("script");
        hf.src = result["hotfix"];
        document.head.appendChild(hf);
      }

      function getStoredAlgorithm(){
        chrome.storage.local.get(['storedAlgorithm'], function(data){
          if(devMode) console.log(data);
          algNumber = data.storedAlgorithm;
          let senseNaN = algNumber;
          senseNaN = +senseNaN || 0;
          if(senseNaN === 0){
            algNumber = 1;
          }
        });
      }

      function getStoredGradesDivNum(){
        chrome.storage.local.get(['storedGradesDivNum'], function(data){
          if(devMode) console.log(data);
          numberOfGradeDivs = data.storedGradesDivNum;
          let senseNaN = numberOfGradeDivs;
          senseNaN = +senseNaN || 0;
          if(senseNaN === 0){
            numberOfGradeDivs = 1;
          }
        });
      }
    }
  });
});

function setNumberOfClasses() {
  let length = 0;
  length = document.getElementsByClassName('cPd vAm bZe tOA gDt3R').length
  length = length / 2 // 2 Semesters
  length = length / 2 // 2 Elements per row (title and grades)
  if (devMode) console.log("Number Of Classes: " + length)
  let f = {}
  f["numberOfClasses"] = length
  chrome.storage.sync.set(f, function() {});
}

function setClassNames() {
  let classNamesArray = []
  let classNames = document.getElementsByClassName('bld classDesc')
  for (let l = 0; l < classNames.length; l++) {
    classNamesArray.push(classNames[l].firstChild.innerText)
  }
  classNamesArray = [...new Set(classNamesArray)]
  let f = {}
  f["classNames"] = classNamesArray
  chrome.storage.sync.set(f, function() {});
}