class jsonData{
   text;
   font;
   fontname;
   isBold;
   isItalic;
   ParaNo;
   Element;

   constructor(txt,fnt,fntNm,bld,itl,pn,ele){
    this.text = txt;
    this.font = fnt;
    this.fontname = fntNm;
    this.isBold = bld;
    this.isItalic = itl;
    this.ParaNo = pn;
    this.Element = ele;
   }
}module.exports = {jsonData}