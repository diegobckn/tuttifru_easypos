export default function Log(title,jsonOriginal) {
  // console.log("Log")
  // console.log("Log title", title)
  // console.log("Log jsonOriginal", jsonOriginal)
  if(!jsonOriginal){
    console.log("no hay datos para loguear, salgo")
    return
  }
    var json = JSON.stringify(jsonOriginal)
    // json = json.replaceAll("\\","")
    // json = json.replaceAll("{","{\n")
    // json = json.replaceAll("}","}\n")
    // json = json.replaceAll(",",",\n")
  
    var json2 = "";
    var tabLevel = 0
    var aperturaComilla = false
    for (let i = 0; i < json.length; i++) {
      var char = json[i];
      if(char === "\""){
        aperturaComilla = !aperturaComilla
      }else
      if(char === "{"){
        tabLevel++
        char = char + "\n"
        if(tabLevel>0)  char += "    ".repeat(tabLevel)
      }else
      if(char === "["){
        tabLevel++
        char = char + "\n"
        if(tabLevel>0)  char += "    ".repeat(tabLevel)
      }else
      if(char === "}"){
        var char2 = "\n"
        tabLevel--
        if(tabLevel>0)  char2 += "    ".repeat(tabLevel)
          char = char2 + char //+ "\n"
      }else
      if(char === "]"){
        var char2 = "\n"
        tabLevel--
        if(tabLevel>0)  char2 += "    ".repeat(tabLevel)
          char = char2 + char //+ "\n"
      }else
      // if(tabLevel>0)  json2 += "    ".repeat(tabLevel)
      if(char === "," && !aperturaComilla) {
        char += "\n"
        if(tabLevel>0)  char += "    ".repeat(tabLevel)
      }
  
      json2 += char
    }
    console.log( title + ":" );
    console.log( "\u001b[1;46m", json2 );
    console.log( "\u001b[0m " );
  
  
  }