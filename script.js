var windows = {
    test: {
        id: "testWindow",
        title: "Test Window",
        state: "0", //(0 = Default, 1 = Maximized, 2 = Minimized)
        active: false,
        width: "300px",
        height: "60px",
        posX: "0px",
        posY: "0px",
    },
    aboutMe: {
        id: "aboutMe",
        title: "About Me",
        state: "0", //(0 = Default, 1 = Maximized, 2 = Minimized)
        active: false,
        width: "500px",
        height: "410px",
        posX: "70px",
        posY: "26px",
    },
    experience: {
        id: "experience",
        title: "Experience",
        state: "0", //(0 = Default, 1 = Maximized, 2 = Minimized)
        active: false,
        width: "500px",
        height: "390px",
        posX: "70px",
        posY: "26px",
    },
    portfolio: {
        id: "portfolio",
        title: "Portfolio",
        state: "0", //(0 = Default, 1 = Maximized, 2 = Minimized)
        active: false,
        width: "500px",
        height: "390px",
        posX: "70px",
        posY: "26px",
    },
    certifications: {
        id: "certifications",
        title: "Certifications",
        state: "0", //(0 = Default, 1 = Maximized, 2 = Minimized)
        active: false,
        width: "500px",
        height: "390px",
        posX: "70px",
        posY: "26px",
    },
    startMenu: {
        id: "startMenu",
        title: "Start Menu",
        state: "0", //(0 = Default, 1 = Maximized, 2 = Minimized)
        active: false,
        width: "500px",
        height: "370px",
        posX: "70px",
        posY: "26px",
    }
}

var top_z = 10;

var activated = false;

function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
}

function dragElement(object) {
    let elmnt = document.getElementById(object.id)
    let currentPosX = 0, currentPosY = 0, previousPosX = 0, previousPosY = 0;
    let screenRect = document.getElementById("screen-content").getBoundingClientRect();
    let elemRect = elmnt.getBoundingClientRect();
  
    elmnt.querySelector('.title-bar').onmousedown = dragMouseDown;
  
    function dragMouseDown(e) {
        e.preventDefault();
        
        // Check to make sure window isn't maximized
        if (object.state != 1)
        {
            // get the mouse cursor position at startup:
            previousPosX = e.clientX;
            previousPosY = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmouseleave = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }
    }
  
    function elementDrag(e) {
        e.preventDefault();
        // calculate the new cursor position:
        currentPosX = previousPosX - e.clientX;
        currentPosY = previousPosY - e.clientY;
        previousPosX = e.clientX;
        previousPosY = e.clientY;

        elmnt.style.top =  clamp((elmnt.offsetTop - currentPosY), 0, (screenRect["height"] - elemRect["height"])) + "px";
        object.posY =  elmnt.style.top;
        elmnt.style.left =  clamp((elmnt.offsetLeft - currentPosX), 0, (screenRect["width"] - elemRect["width"])) + "px";
        object.posX = elmnt.style.left;
    }
  
    function closeDragElement() {
        // stop moving when mouse button is released or leaves page:
        document.onmouseup = null;
        document.onmouseleave = null;
        document.onmousemove = null;
    }
}

function showWindow(object) {
    if (activated == true)
    {
        let elmnt = document.getElementById(object.id)

        if (document.getElementById(object.id + "btn") == null)
        {
            taskbarButton(object);
        }

        // Activate window
        activeWindow(object);

        // Bring to front on click
        elmnt.onmousedown = function() { activeWindow(object); }

        dragElement(object);
    }
}

function closeWindow(object) {
    let elmnt = document.getElementById(object.id)
    
    elmnt.style.display = "none";

    document.getElementById(object.id + "btn").remove();
    buttonResize();

    nextActive(object);
}

function maximizeWindow(object) {
    let elmnt = document.getElementById(object.id)
        
    if (object.state != "1")
        {
            object.state = "1";
            
            elmnt.style.left = "0px"
            elmnt.style.top = "0px"
            elmnt.style.maxWidth = "635px";
            elmnt.style.width = "635px";
            elmnt.style.maxHeight = "447px";
            elmnt.style.height = "447px";

            elmnt.querySelector('[aria-label="Maximize"]').ariaLabel = "Restore";
            elmnt.style.resize = "none";
        }
        else
        {
            object.state = "0";

            elmnt.style.left = object.posX;
            elmnt.style.top = object.posY;
            elmnt.style.width = object.width;
            elmnt.style.height = object.height;

            elmnt.querySelector('[aria-label="Restore"]').ariaLabel = "Maximize";
            elmnt.style.resize = "both";
        }

    dragElement(object);
}

function minimizeWindow(object) {
    let elmnt = document.getElementById(object.id)
    elmnt.style.display = "none";

    let button = document.getElementById(object.id + "btn")
    button.style.fontWeight = "normal";
    button.className = "";
    button.style.background = "";

    nextActive(object);
}

function taskbarButton(object) {
    let elmnt = document.getElementById(object.id)

    let button = document.createElement('button');
    let taskbarPrograms = document.getElementById("taskbar-programs");

    // Set button text to title of window
    button.innerHTML = elmnt.querySelector(".title-bar-text").innerHTML;
    // Set button ID
    button.id = (object.id + "btn");
    // Set button to show window and bring it to front on click
    button.onclick = function() { activeWindow(object); }

    button.style.width = "160px";
    button.style.height = "22px";
    button.style.margin = "2px";
    button.style.textAlign = "left";
    button.style.paddingLeft = "8px" // To be changed, dont have icons set up yet
    
    // Add button to taskbar
    taskbarPrograms.appendChild(button);

    buttonResize();
}

function buttonResize() {
    let buttons = document.getElementById("taskbar-programs").querySelectorAll('button');

    switch (buttons.length) {
        case 4:
            buttons.forEach(element => { element.style.width = "121px"});
            break;
        case 5:
            buttons.forEach(element => { element.style.width = "96px"});
            break;
        default:
            buttons.forEach(element => { element.style.width = "160px"});
            break;
    }
}

function activeWindow(object) {
    let elmnt = document.getElementById(object.id);

    object.active = true;
    
    // Bring window to front
    elmnt.style.zIndex = ++top_z;

    // Set window as visible
    elmnt.style.display = "block";
    
    // Loop through all windows
    for (s of document.querySelectorAll('.window'))
    {
        // For windows that are not selected, set to inactive
        if (s.id != object.id)
        {
            setInactive(s);
        }
        // For selected window, set to active
        else
        {
            setActive(s);
        }
    }

    // Watch for if user clicks element other than window
    window.addEventListener('mousedown', function(e){  
        // If clicking window, set clicked window to active
        if (elmnt.contains(e.target)) {
            setActive(elmnt);
        }
        // If clicking anything else aside from related taskbar button, set to inactive
        else if (e.target != document.getElementById(elmnt.id + "btn"))
        {
            setInactive(elmnt);
        }
    });
}

function nextActive(object)
{
    object.active = false;

    // Get all windows and convert to array
    let windows = Array.prototype.slice.call(document.querySelectorAll(".window[style"), 0);

    // Sort list of windows by descending zIndex (used to figured out last selected)
    windows.sort(function(a, b) { 
        return b.style.zIndex - a.style.zIndex;
    })

    // Loop through sorted list, and set first that is open and not closed window to active
    for (s of windows)
    {
        if (s.id != object.id && s.style.display != "none")
        {
            activeWindow(s);
            break;
        }
    }

    //Activate last window when window closes
    //Object.keys(windows).forEach(e => {
    //    if (windows[e].active == true)
    //    {
    //        activeWindow(windows[e]);
    //    }
    //});
}

function setActive(object)
{
    let elmnt = document.getElementById(object.id);
    let button =  document.getElementById(elmnt.id + "btn");

    elmnt.querySelector('.title-bar').className = "title-bar";
    if (button != null) {
        button.style.fontWeight = "bold"
        button.className = "active";
        button.style.backgroundImage = "url('./icon/taskbar-btn-bg.svg')";
    }
    object.active = true;
}

function setInactive(object)
{
    let elmnt = document.getElementById(object.id);
    let button =  document.getElementById(elmnt.id + "btn");
    
    elmnt.querySelector('.title-bar').className = "title-bar inactive";
    if (button != null) {
        button.style.fontWeight = "normal";
        button.className = "";
        button.style.backgroundImage = "";
    }
    //object.active = false;
}

function updateClock()
{
    var date = new Date();
    document.getElementById("taskbar-clock").innerHTML = date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

}

function startMenu()
{
    if (activated)
    {
        let elmnt = document.getElementById("startMenu");
        let startbtn = document.getElementById("startButton");
        
        // Display window
        elmnt.style.display = "block";
        
        // Bring window to front
        elmnt.style.zIndex = ++top_z;
        
        // Show Start Button as clicked
        startbtn.className = "start active";
        
        for (s of document.querySelectorAll('.window'))
        {
            let button =  document.getElementById(s.id + "btn");
            s.querySelector('.title-bar').className = "title-bar inactive";
            if (button != null) {
                button.style.fontWeight = "normal";
                button.className = "";
                button.style.backgroundImage = "";
            }
        }
        // Hide Start Menu if user clicks element other than it
        window.addEventListener('mousedown', function(e){   
            if (elmnt.contains(e.target)) {
                // Clicked in box
            }
            // Exclude start button from outside click, as it will cause event to trigger
            else if (e.target != document.getElementById("startButton")) { 
                // Clicked outside the box
            
                // Hide start menu
                elmnt.style.display = "none";
                elmnt.active = false;
            
                // Unclick Start Button
                startbtn.className = "start";
            }
        });
    }   
}

function tablist() {
    let elmnt = document.getElementById("portfolioTabs");

    let tabs = elmnt.querySelectorAll("li");

    elmnt.addEventListener('click', function(e){
        //e.target.querySelector("li").ariaSelected = true;
        for (tab of tabs)
        {
            if (tab != e.target)
            {
                tab.ariaSelected = false;
            }
            else
            {
                tab.ariaSelected = true;
            }
            
        }
    });
}

//function tabSelect(id)
//{
//    let elmnt = document.getElementById("portfolioTabs");
//    let tabs = elmnt.querySelectorAll("li");
//
//    for (s of tabs)
//    {
//        if (s.id != id)
//        {
//            s.ariaSelected = false;
//        }
//        else
//        {
//            s.ariaSelected = true;
//        }
//    }
//}

function pageSelect(id)
{
    let pages = document.getElementById("pages");
    for (s of pages.querySelectorAll("div.window-content"))
    {
        if (s.id != id)
        {
            s.style.display = "none";
        }
        else
        {
            s.style.display = "block";
        }
    }
}

function main()
{
    updateClock();
    setInterval(updateClock, 10000);

    //var canvas = document.getElementById('canvas');
    //var context = canvas.getContext('2d');
    //context.webkitImageSmoothingEnabled = false;
    //context.mozImageSmoothingEnabled = false;
    //context.imageSmoothingEnabled = false;

    //Set content of status bars across all windows
    var statusbar = '<p class="status-bar-field">Press F1 for help</p><p class="status-bar-field">Last Updated: 4/18/24</p><p class="status-bar-field">Created by Jaden Hankin</p>';
    for (content of document.getElementsByClassName("status-bar fill"))
    {
        content.innerHTML = statusbar;
    }

    setTimeout(function(){});

    //Play startup sound
    let startup = new Audio('sound/The Microsoft Sound.mp3');
    startup.play()
    
    //Wait for startup sound to finish, then display about page with ding sound
    setTimeout(function(){
        activated = true;
        showWindow(windows.aboutMe);
        new Audio('sound/DING.mp3').play();

        const audio = new Audio('sound/START.mp3');
        const buttons = document.querySelectorAll(".desktopicon");

        // Set all desktop icon buttons to play click sounds
        buttons.forEach(button => {
            button.addEventListener("click", () => {
            audio.play();
            });
        });

        const windowsList = document.querySelectorAll(".window")
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                let window = entry.target;

                //Hide scrollbar while resizing, will reset itself to display when moved
                let scrollbar = window.querySelector(".ss-scroll");
                if (scrollbar) scrollbar.style.display = "none";

                // Set max dimensions based on screensize - current position
                let maxwidth = (635 - parseInt(window.style.left));
                let maxheight = (447 - parseInt(window.style.top));
                
                window.style.maxWidth = maxwidth + "px";
                window.style.maxHeight = maxheight + "px";
            }
          });

        // Set windows to be resizable with minimum size
        windowsList.forEach(window => {
            window.style.minWidth = window.style.width;
            window.style.minHeight = window.style.height;
            //window.style.maxWidth = "100%"; 
            //window.style.maxHeight = "100%"; 
            window.style.overflow = "auto";
            window.style.resize = "both";
            resizeObserver.observe(window);
        });

    }, startup.paused ? 1500 : 8000)
    //Check for if audio is playing or not.
    //Will not always play depending on autoplay, so this will change the delay based on if playing or not
}
