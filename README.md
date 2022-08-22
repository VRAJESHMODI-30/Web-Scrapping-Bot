# Web-Scrapping-Bot<br/>
<br/>
How to run the Bot: <br/>
step 1: Install node_modules file using "npm install" command in terminal of your project file <br/>
step 2: Open index.js file and put Url of website and class/id of content which you want to scrapp from that website in "getData" function <br/>
step 3: Open terminal and run "node .\index.js" command <br/>
<br/>
Result:<br/>
It will give line by line content with their respective styling properties and XML path as JSON data<br/>
Example:<br/>
{<br/>
    text: 'Abstract',<br/>
    fontSize: '20px',<br/>
    fontFamily: 'Merriweather, Georgia, Cambria, "Times New Roman", Times, serif',<br/>
    isBold: '700',<br/>
    isItalic: 'normal',<br/>
    paraNumber: 1,<br/>
    Element: '#abstract H2:nth-child(1)'<br/>
}<br/>
<br/>
Note:<br/>
--> Issue in v1.0<br/>
    Can't scrap for Big Data...Having memory leakage problem<br/>
<br/>
Currently working on memory leakage problem<br/>


## DEMO clip:- </br>

https://user-images.githubusercontent.com/91773413/185977497-44b27292-2c0e-4912-b566-811a6090fdf8.mp4
