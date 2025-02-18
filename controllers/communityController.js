const {PrismaClient}= require('@prisma/client');
const e = require('express');
const { get } = require('http');
const prisma = new PrismaClient();

const addCommunity = async (req,res) =>{
    try{
        const body=req.body;
        const community = await prisma.community.create({
            data : {
                ...body,
                owner: { connect: { id: req.user.userId } },
                members: {
                    create: {
                        userId: req.user.userId, 
                    },
                }
            }
        });
        if(!community)
            return res.status(400).json({error : "could not make community"});
        return res.status(201).json(community)

    }
    catch(err){
        return res.status(400).json({error : err.message})
    }
}

const getCommunity = async (req,res) =>{
    try{
        const body=req.body;
        const communities = await prisma.community.findMany({
            where : {
                OR : [
                    body.id ? {id : body.id} : {},
                    body.name ? {name : {contains : body.name, mode : 'insensitive'}} : {}
                ]
            },
            select : {
                name : true,
                members :true,
                owner : {
                    select :{
                        id : true,
                        username : true
                    }
                },
                posts : true
            }
        })
        if(communities.length==0)
            return res.status(404).json({error : "no community found"});
        return res.status(200).json(communities);
    }
    catch(err){
        return res.status(400).json({error : err.message});
    }
}

module.exports={addCommunity,getCommunity}