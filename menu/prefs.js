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

var clicks = 0;

chrome.storage.sync.get(null, function(result){
  function defCheckbox(name, def){
      if(result[name] == true){
        document.getElementById(name).checked = "checked";
      }
      else if(result[name] == false){}
      else{
        if(def == true){
          document.getElementById(name).checked = "checked";
        }
      }
  }
  function checkSet(name){
    value = document.getElementById(name).checked;
    f = {};
    f[name] = value;
    chrome.storage.sync.set(f, function(){});
  }
  // Canvas
  defCheckbox("canvasListModules", true);
  defCheckbox("canvasPeople", true);
  defCheckbox("canvasDarkTheme", false);
  defCheckbox("canvasNotify", true);
  defCheckbox("canvasNoThumb", false);
  // Skyward
  defCheckbox("skywardGrades", true);
  defCheckbox("skywardDarkTheme", false);
  defCheckbox("skywardTab", true);
  defCheckbox("skywardGpa", true);
  defCheckbox("skywardBanner", true);

  if(result["storedGradesDivNum"] == 1 || result["storedGradesDivNum"] == 1){
    document.getElementById("skywardGradesDivNum").value = result["storedGradesDivNum"];
  } else{
    document.getElementById("skywardGradesDivNum").value = 1;
    f = {};
    f["storedGradesDivNum"] = 1
    chrome.storage.sync.set(f, function(){});
  }

  function saveSkywardGradeDivs() {
    f = {};
    f["storedGradesDivNum"] = document.getElementById("skywardGradesDivNum").value || 1
    chrome.storage.sync.set(f, function(){});
  }

  // Skyward GPAs
  var selectedGPAWeight = {
    1: 4.0,
    2: 4.0,
    3: 4.0,
    4: 4.0,
    5: 4.0,
    6: 4.0,
    7: 4.0,
    8: 4.0
  };

  function saveWeights() {
    f = {};
    Object.keys(selectedGPAWeight).forEach(key => {
      f["storedGPA"+key] = selectedGPAWeight[key];
    })
    chrome.storage.sync.set(f, function(){});
  }

  function handleWeightSelection(event) {
    if(event.target && event.target.id && event.target.id.startsWith("weight-")) {
      var classNumber = event.target.id.split("-")[2];
      var selectedWeight = event.target.value;
      if(selectedGPAWeight[classNumber] == selectedWeight) {
        event.target.checked = false;
        selectedGPAWeight[classNumber] = null;
      } else {
        var weightRadios = Array.from(document.getElementsByTagName('input')).filter(a=>a.type=="radio" && a.id.startsWith("weight-") && a.id.split("-")[2] == classNumber)
        selectedGPAWeight[classNumber] = selectedWeight;
        for (var i = 0; i < weightRadios.length; i++) {
          if(weightRadios[i] != event.target) {
            weightRadios[i].checked = false;
          }
        }
      }
    }
  }

  document.addEventListener("click", function(event) {
    if(event.target && event.target.id == "clearWeightsButton") {
      var weightRadios = Array.from(document.getElementsByTagName('input')).filter(a=>a.type=="radio" && a.id.startsWith("weight-"))
      Object.keys(selectedGPAWeight).forEach(key => {
        selectedGPAWeight[key] = null;
      })
      for (var i = 0; i < weightRadios.length; i++) {
        weightRadios[i].checked = false;
      }
    }
  })

  document.getElementById("skywardGPAWeights").addEventListener("click", function(event){ // Show Select GPA Weights option.
    var gpaWeightDropdown = document.getElementById("gpaWeightDropdown")
    
    if(event.target.checked == false) {
      gpaWeightDropdown.style.display = "none";
    } else {
      gpaWeightDropdown.style.display = "block";

      gpaWeightDropdown.innerHTML = "";
      var biggestClassTitleWidth = 0;
      var classNames = result["classNames"] || ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7"]

      var nullValues = 0;
      for (var o = 0; o < classNames.length; o++) {
        if(result["storedGPA"+(o+1)] == null) nullValues++
      }

      for (var i = 0; i < classNames.length; i++) {
        var titleName = classNames[i]
        var divContainer = document.createElement('div');
        divContainer.style.marginLeft="25px";
  
        var title = document.createElement('span')
        title.innerHTML = titleName;
        title.classList.add("classTitle")
        divContainer.append(title)

        for (var l = 4.0; l < 5.5; l += 0.5) {
          var input = document.createElement('input')
          input.type = "radio"
          input.id = `weight-${l+"-"+(i+1)}`
          input.value = l;
          if(result["storedGPA"+(i+1)] == l) {
            selectedGPAWeight[(i+1)] = l;
            input.checked = true
          } else if(result["storedGPA"+(i+1)] == null && nullValues >= classNames.length) {
            if(titleName.includes("Advanced") || titleName.includes("Pre-AP")
            || titleName.includes("PAPIB")
            || titleName.includes("Networking")
            || titleName.includes("Computer Maintenance")
            || titleName.includes("Computer Science")
            || titleName.includes("DC")
            ) {
              if(l == 4.5) {
                input.checked = true;
                selectedGPAWeight[(i+1)] = l;
              }
            } else if(titleName.includes("AP") || titleName.includes("IB")) {
              if(l == 5) {
                input.checked = true;
                selectedGPAWeight[(i+1)] = l;
              }
            } else {
              if(l == 4) {
                input.checked = true;
                selectedGPAWeight[(i+1)] = l;
              }
            }
          }
          input.onclick = function(e) {
            handleWeightSelection(e)
          }
  
          var label = document.createElement('label')
          label.htmlFor = `weight-${l+"-"+(i+1)}`
          label.innerHTML = l

          divContainer.append(input)
          divContainer.append(label)
        }

        gpaWeightDropdown.append(divContainer)
        if(title.offsetWidth > biggestClassTitleWidth) biggestClassTitleWidth = title.offsetWidth
      }

      saveWeights()

      let classTitles = document.getElementsByClassName('classTitle')
      for (let o = 0; o < classTitles.length; o++) {
        classTitles[o].style.width = `${biggestClassTitleWidth+20}px`	
      }

      var clearButton = document.createElement('button')
      clearButton.type = "button";
      clearButton.formAction = "button";
      clearButton.innerHTML = "Clear Weights"
      clearButton.classList.add("btn");
      clearButton.classList.add("btnPrimary")
      clearButton.style.padding = "5px";

      clearButton.style.marginLeft="25px";
      clearButton.id = "clearWeightsButton"
      gpaWeightDropdown.append(clearButton)

    }
  });

  document.getElementById("opt").addEventListener("submit", function(event){ // Save options.
    event.preventDefault();
    btn = document.getElementById("btnSave");
    if(btn.disabled !== true) {
      checkSet("canvasListModules");
      checkSet("canvasPeople");
      checkSet("canvasDarkTheme");
      checkSet("canvasNoThumb");
  
      checkSet("skywardGrades");
      checkSet("skywardDarkTheme");
      checkSet("skywardTab");
      checkSet("skywardGpa");
      checkSet("canvasNotify");
      checkSet("skywardBanner");

      saveWeights()
      saveSkywardGradeDivs()

      btn.innerHTML = "Saved";
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = "Save Changes";
        btn.disabled = false;
      }, 750);
    }
  });

  dev = document.querySelector("a#enableDevButton");
  dev.style.cursor = "default";
  dev.style.color = "#000000";
  dev.style.textDecoration = "none";
  dev.href = "#";
  dev.addEventListener("click", function(){
    clicks = clicks + 1;
    if(clicks == 7){
      if(result["dev"] != true){
        f = {};
        f["dev"] = true;
        chrome.storage.sync.set(f, function(){});
        alert("You are now a developer!");
      }
      else{
        alert("You are already a developer!");
      }
    }
  });

  if(result["mal"] == true){
    var mI = document.querySelectorAll('input');
    for(var j=0;j<mI.length;j++){
      i = mI[j];
      i.disabled = true;
    }
    mB = document.getElementById("btnSave");
    mB.innerHTML = "Saved";
    mB.disabled = true;
  }
});
