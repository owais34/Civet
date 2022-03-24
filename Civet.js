const path=require('path')
const fs=require('fs')
const {readFile,writeFile}=require('./fileUtil');

class Civet{
    
    constructor(){
        this.objectMap=new Map();// initilize model name and class constructor mapping
        this.dataMap=new Map() //initialize model name and data mapping


        // Check whether directory exists in folder structure
        if(!fs.existsSync('CivetData'))
        {
            fs.mkdirSync('CivetData') //if not then create directory
        }
    }


    /* method to register the model with the Civet class and create file dependencies */
    use(Class){
        try {
            let className=Class["name"];/* the object passed should have name field to identify it
                present in class definitions by default 
                */

            if(!className) /* if className not defined then invalid object passed */
            throw new Error("Class is not defined")

            /* initialize the mappings from model name to model contructor*/
            this.objectMap.set(className,Class)
            /* initialize the model name with empty data */
            this.dataMap.set(className,[])


            if(!fs.existsSync(path.join('CivetData',className+".json")))
            {
                /* If json file for model not present create it */
                Civet.writeData(className,[])
            }
            else
            {
                /* Else read data from json file and set it to datamap */
                let dataRead = Civet.readData(className)
                this.dataMap.set(className,dataRead)
            }

        } catch (error) {
            console.log(error)
        }
        
    }

    /* Expects the model name or class name */
    get(className){

        return new Promise((resolve,reject)=>{

            try {
            this.checkIfClassNameValid(className)

            resolve(this.dataMap.get(className))

            } catch (error) {
                reject(error)
            }   
        })
    }
    /* Expects model name and record object */
    add(className,record){
        return new Promise((resolve,reject)=>{
            
            try {
                
                this.checkIfClassNameValid(className)
                
                this.dataMap.get(className).push(record)
                
                Civet.writeData(className,this.dataMap.get(className))
                resolve("Added Successfully")
            } catch (error) {
                reject(error)
            }
        })
    }
    /* specialized get function accepts className and callback (must return true or false ) */
    getWhere(className,callBack){

        return new Promise((resolve,reject)=>{
            try {
                this.checkIfClassNameValid(className)
                const data=this.dataMap.get(className).filter(callBack)
                resolve(data)
            } catch (error) {
                reject(error)
            }
        })
    }
    /* Update operation  */
    update(className,updatedObject,callBack){

        return new Promise((resolve,reject)=>{
            try {
                this.checkIfClassNameValid(className)
                const updatedData=this.dataMap.get(className)
                .map((record)=>{
                    if(callBack(record)){  /* This callback returns true or false */
                        return updatedObject
                    }
                    else
                        return record
                })
                this.dataMap.set(className,updatedData)
                
                Civet.writeData(className,this.dataMap.get(className))
                resolve("Updated Successfully")
            } catch (error) {
                reject(error)
            }
        })
    }

    delete(className,callBack){
        return new Promise((resolve,reject)=>{
            try {
                this.checkIfClassNameValid(className)

                let updatedData=this.dataMap.get(className).filter((record)=>{
                    return !callBack(record)
                })
                this.dataMap.set(className,updatedData)
                Civet.writeData(className,this.dataMap.get(className))
                resolve("Deleted Successfully")
            } catch (error) {
                reject(error)
            }
        })
    }

    checkIfClassNameValid(className){
                if(typeof className !== 'string')
                throw new Error("String expected found "+typeof className)

                if(!this.dataMap.has(className))
                throw new Error("Model not initialized")
    }

    static readData(className){
        
            let fileName=className+".json"
            return readFile(path.join('CivetData',fileName))

    }
    
    static writeData(className,content){

        let fileName=className+".json"
        writeFile(path.join('CivetData',fileName),content)
    }
}


const civetInstance=new Civet()


module.exports=civetInstance