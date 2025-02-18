const stickyTemplate = document.querySelector("[data-sticky-template]");
const stickyContainer = document.querySelector("[data-sticky-container]");
let wrapper = document.querySelector("#wrapper");
const mainRect = document.querySelector(".main").getBoundingClientRect();


let data = [{checkbox: "true",
    title:"MEOW",
    bgcolor: "#FFFFFF",
    textcolor: "black",
    content: "I need to finish my to do APP!" ,
} , {checkbox: "false",
    title:"BARK",
    bgcolor: "#985757",
    content: "I HATE CSS" ,
    textcolor: "black",
} ,
{checkbox: "false",
    title:"beep",
    bgcolor: "#985097",
    content: "I HATE CSS" ,
    textcolor: "white",
}];



let maxZInDex = 0;
function makeDraggable(wrapper) {
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

      
    }

    function onMouseUp() {
        isDragging = false;
    }
}

 function runData() { data.forEach(populate) };

function populate(info) {
const task = stickyTemplate.content.cloneNode(true).children[0];
const checkbox = task.querySelector("[data-checkbox]");
const title = task.querySelector("[data-title]"); 
const text = task.querySelector("[data-text]");

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

const taskRect = task.getBoundingClientRect();

const randomX = Math.floor(Math.random() *  (mainRect.width - taskRect.width )  );
const randomY = Math.floor(Math.random() * (mainRect.height - taskRect.height )  );

task.style.left = `${randomX}px`;
task.style.top = `${randomY}px`; 

makeDraggable(task); 

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

function completedBox(event) {
    let wrapper = event.target.closest("#wrapper");
    let checkbox = wrapper.querySelector(".checkbox").checked;
if (checkbox === true ) {
    wrapper.classList.add("opacity-50")
    
} else if (checkbox === false) {
    wrapper.classList.remove("opacity-50")
}
console.log(checkbox)
}


function saveNewData() {
let title = document.getElementById("title").value;
let content = document.getElementById("task").value;
let bgcolor = document.getElementById("color").value;
let textColor = document.getElementById("text-color").value;
let checkbox = "false";

    class NewData { 
        constructor(checkbox, title, content, bgcolor, textColor) {
           this.checkbox = checkbox;
           this.title = title;
           this.content = content;
           this.bgcolor = bgcolor
           this.textcolor = textColor

        }
    }

let tempData = new NewData(checkbox, title, content, bgcolor, textColor)
 console.log(tempData)
 data.push(tempData)

 populate(tempData)

function reset() {

    document.getElementById("title").value = "";
    document.getElementById("task").value = "";
    document.getElementById("color").value = "#000000";
    document.getElementById("text-color").value = "black"; }
reset()
}

window.addEventListener("load", () => {runData()});