<<<<<<< Updated upstream
function getClasses() {
	var x = document.getElementById("weightselectordiv");
	var GPAForms = document.getElementsByClassName("GPAForm");
	var openSkyward = document.getElementById("openSkyward");
	var GPAFormHolder = document.getElementById("GPAFormHolder")
	if (x.style.display === "none") {
		x.style.display = "block";
	} else {
		x.style.display = "none";
	}
	chrome.storage.local.get(['numberOfClasses', 'classNames'], function(data){
		console.log('Number Of Classes (from storage): ')
		console.log(data)
		if(!data.numberOfClasses || !data.classNames) {
			let biggestClassTitleWidth = 0;
			GPAFormHolder.style.display = "block";
			for (let i = 0; i < GPAForms.length; i++) {
				if(i < 7) {
					GPAForms[i].style.display = "block";
					let classTitleEl = GPAForms[i].getElementsByClassName('classTitle')[0]
					classTitleEl.innerHTML = "Class "+Math.floor(i+1)
					if(classTitleEl.offsetWidth > biggestClassTitleWidth) biggestClassTitleWidth = classTitleEl.offsetWidth
				}
			}
			console.log('biggestClassTitleWidth: '+biggestClassTitleWidth+"px")
			let classTitles = document.getElementsByClassName('classTitle')
			for (let o = 0; o < classTitles.length; o++) {
				classTitles[o].style.minWidth = `${biggestClassTitleWidth+20}px`	
			}
		}
		else {
			let biggestClassTitleWidth = 0;
			GPAFormHolder.style.display = "block";
			console.log(GPAForms)
			for (let i = 0; i < GPAForms.length; i++) {
				if(i < parseInt(data['numberOfClasses'])) {
					GPAForms[i].style.display = "block";
					let classTitleEl = GPAForms[i].getElementsByClassName('classTitle')[0]
					classTitleEl.innerHTML = data.classNames[i]
					if(classTitleEl.offsetWidth > biggestClassTitleWidth) biggestClassTitleWidth = classTitleEl.offsetWidth
				}
			}
			console.log('biggestClassTitleWidth: '+biggestClassTitleWidth+"px")
			let classTitles = document.getElementsByClassName('classTitle')
			for (let o = 0; o < classTitles.length; o++) {
				classTitles[o].style.minWidth = `${biggestClassTitleWidth+20}px`	
			}
		}
	})
}

function toggleSettingsDiv() {
	var x = document.getElementById("settingsdiv");
	if (x.style.display === "none") {
		x.style.display = "block";
	} else {
		x.style.display = "none";
	}
}

function toggleMainPage() {
	var z = document.getElementById("mainPage");
	if (z.style.display === "none") {
		z.style.display = "block";
	} else {
		z.style.display = "none";
	}
}

var y = document.getElementById("weightselectordiv");
y.style.display = "none";

var z = document.getElementById("settingsdiv");
z.style.display = "none";

window.onload=function(){
    document.getElementById('popupBtn').addEventListener('click', showhide);
	document.getElementById('closeWeight').addEventListener('click', showhide);
	document.getElementById('closeWeight').addEventListener('click', getGPAValues);
	document.getElementById('closeNoSave').addEventListener('click', showhide);
	document.getElementById('closeNoSave').addEventListener('click', returnWeights);
	document.getElementById('popupBtn2').addEventListener('click', showhide2);
	document.getElementById('closeSettings').addEventListener('click', showhide2);
	document.getElementById('closeSettings').addEventListener('click', getAlgorithm);
	document.getElementById('closeSettings').addEventListener('click', storeDivNumberGrades);
	document.getElementById('closeSettings').addEventListener('click', storeDarkMode);
	document.getElementById('closeSettingsNoSave').addEventListener('click', showhide2);
	document.getElementById('closeSettingsNoSave').addEventListener('click', returndivgrades);
	document.getElementById('closeSettingsNoSave').addEventListener('click', returnAlgorithm);
	document.getElementById('clearWeightSelections').addEventListener('click', clearWeightForms);
	
	function returnWeights(){
		clearRads();
		var i = 1;
		for(i=1; i<9; i++){(function(mykey) {
			console.log(i);
			//Now get value from Chrome Storage using this myKey.
			mykey = 'storedGPA' + i;
			var a = i;
			chrome.storage.local.get(mykey , function(items) {
				someValue = items[mykey];
				console.log(someValue);
				let seeIfUndefined = someValue;
				seeIfUndefined = +seeIfUndefined || 0;
				if(seeIfUndefined === 0){
					console.log('Weights currently unselected')
				}else{
					let getRadioId = someValue.toString() + '-' + a.toString();
					console.log(getRadioId);
					let getFormId = 'form' + someValue.toString();
					const selectItem = document.getElementById(getRadioId);
					const newItem = document.createElement('radio');
					newItem.innerHTML = '<input type="radio" id="' + getRadioId + '" name="GPA" value="' + someValue + '" checked="checked">';
					selectItem.parentNode.replaceChild(newItem, selectItem);
				}
			});
		}('storedGPA' + i.toString()))}
	}
	
	returnWeights();
	
	function returnAlgorithm(){
		chrome.storage.local.get(['storedAlgorithm'] , function(items) {
			console.log(items.storedAlgorithm);
			let algValue = items.storedAlgorithm;
			algValue = +algValue || 0;
			var algValueCorrected = algValue;
			if(algValue === 0){
				chrome.storage.local.set({storedAlgorithm: 1});
				console.log("changing stored algorithm from blank to default value of 1")
				algValueCorrected = 1;
			}
			//change radio of settings to saved value
			let getRadioId = "Alg" + algValueCorrected.toString();
			console.log(getRadioId);
			let getFormId = "algorithmsetting";
			const selectedItem = document.getElementById(getRadioId);
			console.log(selectedItem);
			const newItem1 = document.createElement('radio');
			newItem1.innerHTML = '<input type="radio" id="Alg' + algValue + '" name="algorithm" value="' + algValue + '" checked="checked">';
			selectedItem.parentNode.replaceChild(newItem1, selectedItem);
		})
	}
	returnAlgorithm();
	
	function returndivgrades(){
		chrome.storage.local.get(['storedGradesDivNum'] , function(items) {
			console.log(items.storedGradesDivNum);
			let numValue = items.storedGradesDivNum;
			numValue = +numValue || 0;
			var numValueCorrected = numValue;
			if(numValue === 0){
				chrome.storage.local.set({storedGradesDivNum: 1});
				console.log("changing stored grade div number from blank to default value of 1")
				numValueCorrected = 1;
			}
			//change radio of settings to saved value
			let getRadioId = "gradeDiv" + numValueCorrected.toString();
			console.log(getRadioId);
			let getFormId = "divnumbersetting";
			const selectedItem = document.getElementById(getRadioId);
			console.log(selectedItem);
			const newItem1 = document.createElement('radio');
			newItem1.innerHTML = '<input type="radio" id="gradeDiv' + numValue + '" name="gradeDivNumber" value="' + numValue + '" checked="checked">';
			selectedItem.parentNode.replaceChild(newItem1, selectedItem);
		})
	}
	returndivgrades();

	function returnDivDarkMode(){
		chrome.storage.local.get(['skywardDarkTheme'] , function(items) {
			let enabled = items.skywardDarkTheme;
			if(enabled === undefined || enabled === null || enabled === 0 || typeof enabled != "boolean"){
				chrome.storage.local.set({skywardDarkTheme: false});
				console.log("changing stored skyward Dark Theme blank to default value of false")
				enabled = false;
			}
			//change radio of settings to saved value
			let getRadioId = "divDarkMode" + enabled.toString();
			const selectedItem = document.getElementById(getRadioId);
			console.log(selectedItem);
			const newItem1 = document.createElement('radio');
			newItem1.innerHTML = '<input type="radio" id="divDarkMode' + enabled.toString() + '" name="darkModeRadio" value="' + (enabled ? "1" : "2") + '" checked="checked">';
			selectedItem.parentNode.replaceChild(newItem1, selectedItem);
		})
	}
	returnDivDarkMode();
	
}
function showhide(){
	getClasses();
	toggleMainPage();
}

function showhide2(){
	toggleMainPage();
	toggleSettingsDiv();
}


function getGPAValues(){
	//begin saving the GPA weights to variables
	var gpa1 = document.forms.GPAform1.GPA.value;
	console.log("GPA1 Form Value:"+gpa1);
	var gpa2 = document.forms.GPAform2.GPA.value;
	console.log("GPA2 Form Value:"+gpa2);
	var gpa3 = document.forms.GPAform3.GPA.value;
	console.log("GPA3 Form Value:"+gpa3);
	var gpa4 = document.forms.GPAform4.GPA.value;
	console.log("GPA4 Form Value:"+gpa4);
	var gpa5 = document.forms.GPAform5.GPA.value;
	console.log("GPA5 Form Value:"+gpa5);
	var gpa6 = document.forms.GPAform6.GPA.value;
	console.log("GPA6 Form Value:"+gpa6);
	var gpa7 = document.forms.GPAform7.GPA.value;
	console.log("GPA7 Form Value:"+gpa7);
	var gpa8 = document.forms.GPAform8.GPA.value;
	if(gpa8) console.log("GPA8 Form Value:"+gpa8);
	
	// begin storing variables in local storage
	chrome.storage.local.set({storedGPA1: gpa1});
	chrome.storage.local.set({storedGPA2: gpa2});
	chrome.storage.local.set({storedGPA3: gpa3});
	chrome.storage.local.set({storedGPA4: gpa4});
	chrome.storage.local.set({storedGPA5: gpa5});
	chrome.storage.local.set({storedGPA6: gpa6});
	chrome.storage.local.set({storedGPA7: gpa7});
	chrome.storage.local.set({storedGPA8: gpa8});
}

function getAlgorithm(){
	let algorithmValue = document.forms.algorithmForm.algorithm.value;
	console.log(algorithmValue);
	chrome.storage.local.set({storedAlgorithm: algorithmValue});
}

function clearRads() {
	var radList = document.getElementsByName("GPA");
	for (var i = 0; i < radList.length; i++) {
		if(radList[i].checked) document.getElementById(radList[i].id).checked = false;
	}
}

function clearWeightForms(){
	let currentform = "";
	clearRads();
=======
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

chrome.runtime.onInstalled.addListener(function() {
  chrome.browserAction.enable();
  chrome.alarms.create("notifier", {periodInMinutes:1});
  appendCourses();
});

var coursesAppended = false;

function appendCourses(){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      coursesAppended = true;
      text = this.responseText.replace("while(1);","");
      data = JSON.parse(text);
      courses = [];
      for(j=0;j<data.length;j++){
        i = data[j];
        c = {};
        c.s = {};
        c.s.content = "~#"+i.id;
        c.s.description = "<url>" + i.name + "</url>";
        c.url = "https://canvas.allenisd.org/courses/"+i.id;
        courses.push(c);
      }
      suggestions.push.apply(suggestions, courses);
    }
  };
  xhr.open("GET", "https://canvas.allenisd.org/api/v1/users/self/favorites/courses?include[]=term&exclude[]=en", true);
  xhr.send();
}

chrome.alarms.onAlarm.addListener(function(alarm){
  if(alarm.name == "notifier"){
    //  https://canvas.allenisd.org/api/v1/conversations?scope=inbox&filter_mode=and&include_private_conversation_enrollments=false
    chrome.storage.sync.get(null, function(storage){
      if(storage["supressBGComms"] != true){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (this.readyState == 4 && this.status == 200) {
            text = this.responseText.replace("while(1);","");
            data = JSON.parse(text);

            if(storage["canvasNotify"] == true || storage["canvasNotify"] != false){

              known = storage["latestMessage"];
              newest = data[0].id;
              if(known != newest){
                unread = data.filter(function(e){
                  return e.workflow_state == "unread";
                });
                if(unread.length == 1){
                  opt = {
                    type: 'basic',
                    title: unread[0].subject,
                    message: 'New message on Canvas',
                    iconUrl: chrome.extension.getURL('./images/app-canvas.png'),
                    eventTime: Date.now()
                  }
                  chrome.notifications.create("msg"+Date.now(), opt);
                }
                if(unread.length >= 2){
                  opt = {
                    type: 'list',
                    title: unread.length+" new messages",
                    iconUrl: chrome.extension.getURL('./images/app-canvas.png'),
                    message: '',
                    eventTime: Date.now(),
                    items: []
                  };
                  for(j=0;j<unread.length;j++){
                    i = unread[j];
                    title = i.subject;
                    l = {};
                    l.title = title;
                    l.message = "";
                    opt.items.push(l);
                  }
                  chrome.notifications.create("msg"+Date.now(), opt);
                }
              }
              f = {};
              f["latestMessage"] = newest;
              chrome.storage.sync.set(f, function(){});
            }

            if(!coursesAppended){
              appendCourses();
            }
          }
        };
        xhr.open("GET", "https://canvas.allenisd.org/api/v1/conversations?scope=inbox&filter_mode=and&include_private_conversation_enrollments=false", true);
        xhr.send();
      }
    });
  }
});

chrome.notifications.onClicked.addListener(function(id){
  if(id.startsWith("msg")){
    chrome.notifications.clear(id);
    chrome.tabs.create({url:"https://canvas.allenisd.org/conversations"});
  }
});

var suggestions = [
  {s: {content: "canvas", description: "Canvas"}, url: "https://canvas.allenisd.org/"},
  {s: {content: "skyward", description: "Skyward Gradebook"}, url: "https://skyward.allenisd.org/"},
  {s: {content: "portal", description: "Portal"}, url: "https://portal.allenisd.org/"},
  {s: {content: "google", description: "Google Drive"}, url: "https://google.allenisd.org/"},
  {s: {content: "montage", description: "Safari Montage <dim>(montage)</dim>"}, url: "https://montage.allenisd.org/"},
  {s: {content: "citrix", description: "Citrix Storefront"}, url: "https://citrix.allenisd.org/vpn/index.html"},
  {s: {content: "home", description: "AISD Front Page <dim>(home)</dim>"}, url: "https://www.allenisd.org/"},
  {s: {content: "hs", description: "Allen HS <dim>(hs)</dim>"}, url: "https://www.allenisd.org/allenhs"},
  {s: {content: "steam", description: "STEAM Center"}, url: "https://www.allenisd.org/Page/54990"},
  {s: {content: "lowery", description: "Lowery FC"}, url: "https://www.allenisd.org/loweryhs"},
  {s: {content: "curtis", description: "Curtis MS"}, url: "https://www.allenisd.org/curtisms"},
  {s: {content: "ereckson", description: "Ereckson MS"}, url: "https://www.allenisd.org/erecksonms"},
  {s: {content: "ford", description: "Ford MS"}, url: "https://www.allenisd.org/fordms"},
  {s: {content: "erma", description: "ERMA"}, url: "https://erma.allenisd.org/"},
  {s: {content: "test", description: "Test Skyward <dim>(test)</dim>"}, url: "https://testskyward.allenisd.org/"},
  {s: {content: "ticket", description: "Helpdesk <dim>(ticket)</dim>"}, url: "https://helpdesk.allenisd.org/"},
  {s: {content: "apg", description: "Academic Planning Guide <dim>(apg)</dim>"}, url: "https://canvas.allenisd.org/courses/858742"}
];

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
  text = text.toLowerCase();

  s = [];
  for(i=0;i<suggestions.length;i++){
    s.push(suggestions[i].s);
  }
  if(!coursesAppended){
    s.push({content: "~E", description: "<dim>Login to Canvas to see personalized options</dim>"});
  }

  current = s.filter(function(e){
    return (e.content.startsWith(text) || e.description.toLowerCase().includes(text));
  });

  if(current.length >= 1){
     chrome.omnibox.setDefaultSuggestion({description: current[0].description});
     current.shift();
  }
  suggest(current);
});

function open(loc){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tab = tabs[0];
    chrome.tabs.update(tab.id, {url: loc});
  });
}
function openQuery(q){
  open("https://www.google.com/search?q="+encodeURIComponent("aisd "+q));
>>>>>>> Stashed changes
}

chrome.omnibox.onInputEntered.addListener(function(text) {
  text = text.toLowerCase();

  current = suggestions.filter(function(e){
    return (e.s.content.startsWith(text) || e.s.description.toLowerCase().includes(text));
  });

  if(current.length >= 1){
    req = current[0];
    open(req.url);
  }
  else{
    openQuery(text);
  }
});

function courseMenu(i, t, page){
  r = /.*\/courses\/([0-9]*).*/g;
  c = r.exec(i.linkUrl)[1];
  chrome.tabs.update(null, {url: "https://canvas.allenisd.org/courses/"+c+page}, null);
}

chrome.contextMenus.create({
  id: "as-course",
  title: "Course Pages",
  contexts: ["link"],
  visible: true,
  targetUrlPatterns: ["*://canvas.allenisd.org/courses/*"]
});

chrome.contextMenus.create({
  title: "Home",
  contexts: ["link"],
  visible: true,
  parentId: "as-course",
  onclick: function(i, t){
    courseMenu(i, t, "/");
  }
});

chrome.contextMenus.create({
  title: "Modules",
  contexts: ["link"],
  visible: true,
  parentId: "as-course",
  onclick: function(i, t){
    courseMenu(i, t, "/modules");
  }
});

chrome.contextMenus.create({
  title: "Announcements",
  contexts: ["link"],
  visible: true,
  parentId: "as-course",
  onclick: function(i, t){
    courseMenu(i, t, "/announcements");
  }
});

chrome.contextMenus.create({
  title: "People",
  contexts: ["link"],
  visible: true,
  parentId: "as-course",
  onclick: function(i, t){
    courseMenu(i, t, "/users");
  }
});
