const path=require('path');
const fs=require('fs')


const readFile=(filename)=>{
    
    try {
        const content=fs.readFileSync(filename)
        const jsonContent=JSON.parse(content)
        return jsonContent
    } catch (error) {
        throw error
    }

    return null; 
}


const writeFile=(filename,content)=>{
    try {
        fs.writeFileSync(filename,JSON.stringify(content))
        return true
    } catch (error) {
        throw error
    }
    return false;
}

module.exports={
    readFile,
    writeFile
}
