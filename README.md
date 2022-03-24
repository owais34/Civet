
# Civet

A simple non relational database system built to avoid the hassle of setting up mongoose for simple Node projects




## Documentation

Civet uses simple javascript and power of json to persist data.
It is not meant for heavy projects but simple backends which may need setting up a quick usable database.


### Step 1

Include **Civet.js** and **fileUtil.js** in the same directory

### Step 2

```
//app.js 

import civet =require('./Civet')

//create a class model of the data to be stored

class Dog{
    constructor(name)
    {
        this.name=name
    }
}

// register the model with civet 
civet.use(Dog)

```

### CRUD operations

Civet class exposes several methods for CRUD operations which return a promise.

#### Create a record

```
//creating a record

civet.add("Dog",new Dog("Luffy"))
.then(result=>console.log(result))
.catch(error=>console.log(error)) 

```

#### Read records

```
//reading all entries

civet.get("Dog")
.then(result=>console.log(result))
.catch(error=>console.log(error)) 
```

#### Update record

Update method takes an updated object and a callback function to identify the record to be updated.

The callback must return true or false 
```
civet.update("Dog",new Dog("Snoopy"),(dog)=>{
    return dog["name"]==="Luffy"
})
.then(result=>console.log(result))
.catch(error=>console.log(error))  
```


#### Delete record

Delete method takes a callback function to identify the record to be deleted.

The callback must return true or false 
```
civet.delete("Dog",(dog)=>{
    return dog["name"]==="Snoopy"
})
.then(result=>console.log(result))
.catch(error=>console.log(error))   
```

### Improvements in future

1) Faster queries using unique keys
2) Pagination