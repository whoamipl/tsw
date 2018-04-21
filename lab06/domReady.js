// jshint esversion: 6
let state = document.readyState;

document.onreadystatechange = () => {
    if (document.readyState === "interactive") {
        console.log("Document is ready");
        initHarmony();
    }
} 

