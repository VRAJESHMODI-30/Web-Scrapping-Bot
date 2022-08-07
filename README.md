# Web-Scrapping-Bot

How to run the Bot:
step 1: Install node_modules file using "npm install" command in terminal of your project file
step 2: Open index.js file and put Url of website and class/id of content which you want to scrapp from that website in "getData" function
step 3: Open terminal and run "node .\index.js" command

Result:
It will give line by line content with their respective styling properties and XML path as JSON data
Example:
{
    text: 'Abstract',
    fontSize: '20px',
    fontFamily: 'Merriweather, Georgia, Cambria, "Times New Roman", Times, serif',
    isBold: '700',
    isItalic: 'normal',
    paraNumber: 1,
    Element: '#abstract H2:nth-child(1)'
}

Note:
--> Issue in v1.0
    Can't scrap for Big Data...Having memory leakage problem

Currently working on memory leakage problem
