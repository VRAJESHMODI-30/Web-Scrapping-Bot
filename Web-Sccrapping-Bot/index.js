const puppeteer = require('puppeteer');
const xlsx = require('xlsx');
const {jsonData} = require('./model');
// require('events').EventEmitter.defaultMaxListeners = 0

//For getting valid url from string
function getURL(str) {
    var urlRegex = /(https?:\/\/[^ ]*)/;
    var url="";
    if(str.match(urlRegex) != null){
        url = str.match(urlRegex)[1];
    }
    return url;
}

//Fetching data from .xlsx file and adding to set ds
function getDistUrls(path,sheet='Xeljanz Evidence Library'){
    var wb = xlsx.readFile(path,{cellDates:true});
    var ws = wb.Sheets[sheet];
    var data = xlsx.utils.sheet_to_json(ws);
    var links_origins = new Set();
    data.map(function(record){
        var link = getURL(record.Link);
        if(link != "" && link[0]=='h'){
            var url = new URL(link);
            var origin = url.origin;
            links_origins.add(origin);
        }
    })
    // console.log(links_origins.size);
    return links_origins;
}

//Scraping class/id styles from websites
async function getStyles(url,class_id, ele="",i=0){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    let str ="";
    if(i==0){
        str = str+class_id;
    }
    else{
        str = str+class_id+" "+ele+":nth-child("+i+")"
    }
    const textStyles = await page.$eval(str,el=>{
        const styleObjects = getComputedStyle(el);
        const styles = {};
        for(const prop in styleObjects){
            if(styleObjects.hasOwnProperty(prop)){
                styles[prop] = styleObjects[prop];
            }
        }
        return styles;
    })  
    // console.log(textStyles);
    await browser.close();
    return textStyles;
}

//Scrap text-content from given website class
async function getText(url,class_id, ele="",i=0){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    let str="";
    if(i==0){
        str = str+class_id;    
    }
    else{
        str = str+class_id+" "+ele+":nth-child("+i+")"
    }
    const text = await page.evaluate((str)=>{
        let txt = document.querySelector(str).innerText;
        return txt;
    },str)
    // console.log(text);
    await browser.close();
    return text;
}

async function getChildNodes(url,class_id){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await page.exposeFunction("myFunc", getChildNodes);

    const children_Ele_list = await page.evaluate(async (url,class_id)=>{
        const ele = document.querySelector(class_id);
        if(ele.children.length===0 && ele.childElementCount===0){
            let arr= [];
            const str = class_id+" --> 0";
            arr.push(str);
            return arr;
        }

        else{
            let arr = [];
            let i = 1; 
            for(elements of ele.children){
                let str = class_id+" "+elements.tagName+":nth-child("+i+")";
                i++;
                
                    const ans  = await myFunc(url,str);
                    arr = arr.concat(ans);
            }
            // if(arr.indexOf(class_id) === -1){
                arr.push(class_id);
            // }
            return arr;
        }


    },url,class_id);

    await browser.close();
    return children_Ele_list;
}

async function getImmediateText(url,class_id){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    // let str="";
    const text = await page.evaluate((class_id)=>{

        const nodeList = document.querySelector(class_id).childNodes;
        let txt ="";
        for(let i=0;i<nodeList.length;i++){
         if(nodeList[i].nodeName=="#text"){
            txt+=nodeList[i].nodeValue;
         } 
        }
        return txt; 
    },class_id)
    await browser.close();
    return text;
}

//Genrates the main data
async function getData(url,class_id){
    const browser  = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    const child_list = await getChildNodes(url,class_id);
    const result = [];
    const n = child_list.length;
    for(let i=0;i<n;i++){
        if(child_list[i].endsWith("0")){
            let n = child_list[i].length;
            let new_class_id = child_list[i].slice(0,n-6); 
            let text = await getText(url,new_class_id);
            let eleStyle = await getStyles(url,new_class_id);
            let data = {text : text,
                        fontSize : eleStyle.fontSize,
                        fontFamily : eleStyle.fontFamily,
                        isBold : eleStyle.fontWeight,
                        isItalic : eleStyle.fontStyle,
                        paraNumber : i+1,
                        Element : new_class_id
                    };
            result.push(data);
        }
        else{
            let text = await getImmediateText(url,child_list[i]);
            let eleStyle = await getStyles(url,child_list[i]);
            let data = {text : text,
                fontSize : eleStyle.fontSize,
                fontFamily : eleStyle.fontFamily,
                isBold : eleStyle.fontWeight,
                isItalic : eleStyle.fontStyle,
                paraNumber : i+1,
                Element : child_list[i]
            };
            result.push(data);
        }
    }
    console.log(result);
    browser.close();
}

//Main
// const distUrls = getDistUrls("data.xlsx");
// console.log(distUrls);
// getStyles('https://doi.org/10.1007/s40744-020-00194-8','#Abs1-section','h2',1).then(a => console.log(a));
// scrapText("https://doi.org/10.1007/s40744-020-00194-8");
// getChildNodes("https://pubmed.ncbi.nlm.nih.gov/21245074/","#abstract").then(a=>console.log(a));
// getData("https://doi.org/10.1007/s40744-020-00194-8",'.c-article-main-column');
// getImmediateText("https://pubmed.ncbi.nlm.nih.gov/21245074/","#abstract DIV:nth-child(2) P:nth-child(2)").then(a=>console.log(a));
getData("https://pubmed.ncbi.nlm.nih.gov/21245074/",'#abstract');
    
