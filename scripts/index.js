const stickyTemplate = document.querySelector("[data-sticky-template]");
const stickyContainer = document.querySelector("[data-sticky-container]");
const templateGroup = document.querySelector("[data-group-template]");
const groupsContainer = document.querySelector("[data-groups-container]");
let wrapper = document.querySelector("#wrapper");
const mainRect = document.querySelector(".main").getBoundingClientRect();
const menu = document.getElementById("addtask");
const groupMenu = document.getElementById("addGroup");
let groupOptions = document.getElementById("group-option")
const deleteGroupsMenu = document.getElementById("deleteGroups")
const deleteTasksMenu = document.getElementById("deleteTasks")
let editingSticky = null;


let groups = [
]


let data = [];


function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(data));
    localStorage.setItem("groups", JSON.stringify(groups));
    
}

function getTasks() {
    data = JSON.parse(localStorage.getItem("tasks"));
    groups = JSON.parse(localStorage.getItem("groups"));
    console.log(groups)

}


//Population and Movement


let maxZInDex = 0;
function makeDraggable(wrapper, positionData) {
    let isDragging = false;
    let offsetX = 0, offsetY = 0;
    
          
    const header = wrapper.querySelector("#header");

    header.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - wrapper.getBoundingClientRect().left;
        offsetY = e.clientY - wrapper.getBoundingClientRect().top;
        wrapper.style.position = "absolute";
        maxZInDex++;
        wrapper.style.zIndex = maxZInDex;

        
            

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseMove(e) {
        if (!isDragging) return;

        const wrapperRect = wrapper.getBoundingClientRect();

        let newX = e.clientX - offsetX - mainRect.left;
        let newY = e.clientY - offsetY - mainRect.top ;
    
        let maxX = Math.max(0, mainRect.width - wrapperRect.width);
         let maxY = Math.max(0, mainRect.height - wrapperRect.height);
    
         newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
       
        wrapper.style.left = `${newX}px`;
        wrapper.style.top = `${newY}px`;

        positionData.posX = newX;
        positionData.posX = newX;
      
    }

    function onMouseUp() {
        isDragging = false;
    }
}

function groupPopulating(info) {
    const group = templateGroup.content.cloneNode(true).children[0];
    const button = group.querySelector(".button")

    button.id = `${info.groupName}`
    button.textContent = info.groupName

    groupsContainer.append(group)
    return{groupName: info.groupName}

}

 function runData() { 
    getTasks()
    data.forEach(populate)
    groups.forEach(groupPopulating)
    boxOpacity() 
 };

function populate(info) {
const task = stickyTemplate.content.cloneNode(true).children[0];
const checkbox = task.querySelector("[data-checkbox]");
const title = task.querySelector("[data-title]"); 
const text = task.querySelector("[data-text]");
const settings = task.querySelector("#settings");

task.style.backgroundColor = `${info.bgcolor}`;
task.classList.add(`text-${info.textcolor}`)
function checkBoxBG(color) {
    if (color === "white") {
        let bg = task.querySelector(".checkbox")
        bg.classList.remove("checked:bg-black")
        bg.classList.remove("bg-gray-700")
        bg.classList.add("bg-gray-400")
        bg.classList.add("checked:bg-white")
    } else {
    }
}
 checkBoxBG(info.textcolor)

checkbox.checked= (info.checkbox === "true");
title.textContent = info.title;
text.textContent = info.content;

stickyContainer.append(task);




makeDraggable(task, info); 

if (info.posX !== undefined && info.posY !== undefined) {
    task.style.left = `${info.posX}px`;
    task.style.top = `${info.posY}px`;

    console.log(info.posY, info.posX)
} else {
    const taskRect = task.getBoundingClientRect();
    info.posX = Math.floor(Math.random() * (mainRect.width - taskRect.width));
    info.posY = Math.floor(Math.random() * (mainRect.height - taskRect.height));
    task.style.left = `${info.posX}px`;
    task.style.top = `${info.posY}px`;

    console.log(info.posY, info.posX)
}

settings.addEventListener('click', () => {
    editSticky(task, info);
    
});

return{checkbox: info.checkbox, title: info.title, element:task}

}

function toggleMinimize(event) {
    let wrapper = event.target.closest("#wrapper");
    let content = wrapper.querySelector(".content");
    let header = wrapper.querySelector("#header");
    if (content) {
        content.classList.toggle("hidden");
        
    }
    if (header) {
        header.classList.toggle("border-b")
    }
}

function boxOpacity() {
    let wrapper = document.querySelectorAll(".wrapper");
    wrapper.forEach(wrappy => {
        
        let checkbox = wrappy.querySelector(".checkbox").checked
        console.log(checkbox)
        if (checkbox === true ) {
            wrappy.classList.add("opacity-50")
            
        } else if (checkbox === false) {
            wrappy.classList.remove("opacity-50")
        }
    }) }

function completedBox(event) {
    let wrapper = event.target.closest("#wrapper");
    let checkbox = wrapper.querySelector(".checkbox").checked;
    let title = wrapper.querySelector("[data-title]").innerHTML;

    
        if (checkbox === true ) {
            wrapper.classList.add("opacity-50")
            
        } else if (checkbox === false) {
            wrapper.classList.remove("opacity-50")
        }
    
let task = data.find(task => task.title === title);

task.checkbox = checkbox.toString();

saveTasks()
}

function removeAll() { 
    while (stickyContainer.firstChild) {
        stickyContainer.removeChild(stickyContainer.firstChild);
}
saveTasks()
}

let lastClickedGroup = "All"; 

function repopulate(event) { 
    lastClickedGroup = event.target.id; 
    reloadTasks();
    boxOpacity();
}

function reloadTasks() {
    removeAll(); 

    if (lastClickedGroup !== "All") {
        data.forEach(task => {
            if (lastClickedGroup === task.group) {
                populate(task);
            }
        });
    } else {
        data.forEach(populate);
    }
}


function repopulateGroups() {
    while (groupsContainer.firstChild) {
        groupsContainer.removeChild(groupsContainer.firstChild);
}

groups.forEach(groupPopulating)

}

//Save and Edit Area

function editSticky(task, info) {
    editingSticky = {task, info};

    document.getElementById("title").value = info.title;
    document.getElementById("task").value = info.content;
    document.getElementById("color").value = info.bgcolor;
    document.getElementById("text-color").value = info.textcolor;

    hideMenu();
    
  }





function saveNewData() {


let title = document.getElementById("title").value;
let content = document.getElementById("task").value;
let bgcolor = document.getElementById("color").value;
let textColor = document.getElementById("text-color").value;
let group = document.getElementById("group-option").value;
let checkbox = "false";




if (editingSticky) {
   
    let { task, info } = editingSticky;


    info.title = title;
    info.content = content;
    info.bgcolor = bgcolor;
    info.textcolor = textColor;
    info.group = group;


    task.querySelector("[data-title]").textContent = title;
    task.querySelector("[data-text]").textContent = content;
    task.style.backgroundColor = bgcolor;
    task.classList.remove("text-white", "text-black"); 
    task.classList.add(`text-${textColor}`);

    editingSticky = null; 
    saveTasks();

} else { 

    class NewData { 
        constructor(checkbox, title, content, bgcolor, textColor, group) {
           this.checkbox = checkbox;
           this.title = title;
           this.content = content;
           this.bgcolor = bgcolor;
           this.textcolor = textColor;
           this.group = group;
        }
    }
    let tempData = new NewData(checkbox, title, content, bgcolor, textColor,group)
 data.push(tempData)
 
let next = data.length - 1 ;
populate(data[next]) ;

saveTasks()
}



hideMenu('close')

}

function grouping() {
    let groupName =  document.getElementById("groupName").value;
  

    class NewGroup  {
        constructor(groupName) {
            this.groupName = groupName
        }
    }
    let tempGroup = new NewGroup(groupName);
    groups.push(tempGroup);
    let nextGroup = groups.length - 1; 
    console.log(nextGroup)
    groupPopulating(groups[nextGroup]);
    hideGroupsMenu('close')

    reset("groups");

    saveTasks()
    
  }

function reset(reset) {
    
    if (reset === "task") {
    document.getElementById("title").value = "";
    document.getElementById("task").value = "";
    document.getElementById("color").value = "#000000";
    document.getElementById("text-color").value = "white"; 
    document.getElementById("deleteTaskInput").value = ""; 
    editingSticky = null; } else if (reset === "groups") {
        document.getElementById("groupName").value = "";
        document.getElementById("deleteGroupInput").value = "";
    }
 
}

function hideMenu(value) {


    while (groupOptions.firstChild) {
         groupOptions.removeChild(groupOptions.firstChild)
    }

    groups.forEach((options) => {
        let option = document.createElement("option")
        option.textContent = options.groupName;
        groupOptions.appendChild(option) 
    })

    if(menu.classList.contains("invisible")) {
        menu.classList.toggle("invisible") 
    } else if (value === "close") {
        menu.classList.add("invisible")
        reset('task')
    }
}

function hideGroupsMenu(value) {

    if(groupMenu.classList.contains("invisible")) {
        groupMenu.classList.toggle("invisible") 
    } else if (value === "close") {
        groupMenu.classList.add("invisible")
        reset('groups')
    }
}


function hideGroupsDeleteMenu(value) {

    if(deleteGroupsMenu.classList.contains("invisible")) {
        deleteGroupsMenu.classList.toggle("invisible") 
    } else if (value === "close") {
        deleteGroupsMenu.classList.add("invisible")
        reset('groups')
    }
}

function hideTasksDeleteMenu(value) {

    if(deleteTasksMenu.classList.contains("invisible")) {
        deleteTasksMenu.classList.toggle("invisible") 
    } else if (value === "close") {
        deleteTasksMenu.classList.add("invisible")
        reset('task')
    }
}

//Delete groups and tasks 

function deleteGroups() {
let input = document.getElementById("deleteGroupInput").value
 
groups.forEach(group => {
    if (input === group.groupName) {
      groups = groups.filter(group => group.groupName !== input )
     repopulateGroups()
     saveTasks()
    } 
});

hideGroupsDeleteMenu('close')


}


function deleteTasks() {
    let input = document.getElementById("deleteTaskInput").value
    if (input === "DELETE"){
    data = data.filter(task => task.checkbox !== "true");
    reloadTasks()
    saveTasks()
    ;} else {
        window.alert("LOUD INCORRECT BUZEER")
    }

    hideTasksDeleteMenu('close');
}

 window.setInterval(function() {

// getTasks()

 }, 1000)


window.addEventListener("load", () => {runData()});