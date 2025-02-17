const {PrismaClient}= require('@prisma/client');
const prisma = new PrismaClient();

const samplefn = async(req,res) =>{
    console.log("users attempted");
    const obj ={
        hello : "function"
    }
    return res.json(obj);
}

module.exports={samplefn}