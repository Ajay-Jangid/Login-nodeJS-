const express =require('express')
const router = express.Router()
const UserData = require('../models/userdata')
const ProductData = require('../models/productdata')
const session =require('express-session')

/************* For Creating User ****************/
router.post('/create',async(req,res)=>{
    const user = new UserData({
        uid : req.body.uid,
        name : req.body.name,
        role : req.body.role
    })
    // console.log(req.body.role)
    // console.log(user)
    try{
        const s = await user.save();
        res.send(s)

    }catch(err){
        res.send('Error = '+err)
    }
})

/******************For Product Data Insertion****************/
router.post('/product',async(req,res)=>{
    try{

        if(req.session.flag && req.session.admin){
        const p = new ProductData({
            pid : req.body.pid,
            name : req.body.name,
            userid : req.body.userid
        })

        const k = await UserData.find({'uid':req.body.userid})
        if(k.length>0){
            const d = await p.save()
            
            req.session.flag = false
            req.session.uid = null
            res.send(d)
        }else{
            res.send('User Account not found with UserID:',req.body.userid)
        }
    }else if(req.session.flag && req.session.admin==false){
        const p = new ProductData({
            pid : req.body.pid,
            name : req.body.name,
            userid : req.body.userid
        })
        const k = await UserData.find({'uid':req.body.userid})

        if(k.length>0 && k[0].role=='User'){
            if(req.body.userid == req.session.uid){
                const d = await p.save()
        
                req.session.flag = false
                req.session.uid = null
                res.send(d)
            }else{
                res.send('Cannot Insert Product Data Under Different User')
            }
           
        }else if (k[0].role=='Admin'){
            res.send('Cannot Insert Product Under Admin as your role is User')
        }
        else{
            res.send('User Account not found with UserID:',req.body.userid)
        }
    }
    else{
        res.send('Login First')
    }
    }catch(err){
        res.send(err)
    }
})


/******************For Product Data Display **************/
router.get('/prod',async(req,res)=>{
    try{
        if(req.session.flag && req.session.admin){
            const p = await ProductData.find()
            req.session.flag = false
            req.session.uid = null
            res.send(p)
        }else if(req.session.flag && req.session.admin==false){
            const p = await ProductData.find({'userid':req.session.uid})
            req.session.flag = false
            req.session.uid = null
            res.send(p)
        }else{
            res.send('Please Login In First')
        }
    }catch(err){
        res.send('Error : ',err)
    }
})

/**********************For Login ****************************/

router.get('/login',async(req,res)=>{
    try{
        const p = await UserData.find({'uid':req.query.uid})
        if(p.length > 0){
            req.session.flag=true
            req.session.uid = p[0].uid;
            req.session.admin = p[0].role == 'Admin' ? true : false 
            res.send('Login Successfull')
        }
        else{
            req.session.flag=false
            res.send('Account not Found, Please Create an Account First')
        }

    }catch(err){
        res.send(err)
    }
})

/*************For users data ************/

router.get('/users',async(req,res)=>{
    try{
        if(req.session.flag && req.session.admin){
            const p = await UserData.find({'role':'User'})
            req.session.flag = false
            req.session.uid = null
            res.send(p)
        }else if(req.session.flag && req.session.admin==false){
            const p = await UserData.find({'uid':req.session.uid})
            req.session.flag = false
            req.session.uid = null
            res.send(p)
        }else{
            res.send('Please Login In First')
        }
    }catch(err){
        res.send('Error : ',err)
    }
})

/*************For admin users only *************************/
router.get('/admin',async(req,res)=>{
    try{
        if(req.session.flag && req.session.admin){
            const p = await UserData.find({'role':'Admin'})
            req.session.flag = false
            req.session.uid = null
            res.send(p)
        }else if(req.session.flag && req.session.admin==false){
            req.session.flag = false
            req.session.uid = null
            res.send('You are not a admin user.')
        }else{
            res.send('Please Login In First')
        }
    }catch(err){
        res.send('Error : ',err)
    }
})

/*********Deleting UsersData Based on role **************/
router.delete('/users',async(req,res)=>{
    try{
        if(req.session.flag && req.session.admin){
            const p = await UserData.find({'uid':req.query.uid})
            const z = await UserData.findByIdAndDelete(p[0]._id)
            const k = await ProductData.find({'userid':req.query.uid})
            
            for(var i=0;i<k.length;i++){
                await ProductData.findByIdAndDelete(k[i]._id)
            }
            
            req.session.flag = false
            req.session.uid = null
            res.send('User Deleted Successfully')
        }else if(req.session.flag && req.session.admin==false){
            const p = await UserData.find({'uid':req.query.uid})
            const k = await ProductData.find({'userid':req.query.uid})
            if(p[0].role == 'Admin'){
                req.session.flag = false
                req.session.uid = null    
                res.send('You cannot delete Admin users Data as your role is user') 
            }else{
                const z = await UserData.findByIdAndDelete(p[0]._id)     

                for(var i=0;i<k.length;i++){
                    await ProductData.findByIdAndDelete(k[i]._id)
                }
                req.session.flag = false
                req.session.uid = null
                res.send('User Deleted Successfully')            }
        }else{
            res.send('Please Login In First')
        }
    }catch(err){
        res.send('Error : ',err)
    }
})

/***********************Deleting Product DATA ******************/
router.delete('/products',async(req,res)=>{
try{
        if(req.session.flag && req.session.admin){
            const p = await ProductData.find({'pid':req.query.pid})
            const z = await ProductData.findByIdAndDelete(p[0]._id)
            req.session.flag = false
            req.session.uid = null
            res.send('Products Deleted Successfully')
        }else if(req.session.flag && req.session.admin==false){

            const p = await ProductData.find({'pid':req.query.pid})
            const k = await UserData.find({'uid':p[0].userid})

            if(k[0].role=='Admin'){
                req.session.flag = false
                req.session.uid = null
                res.send('You cannot delete the product which is added by admin..')  
            }else{
                const z = await ProductData.findByIdAndDelete(p[0]._id)       
    
                req.session.flag = false
                req.session.uid = null
                res.send('Products Deleted Successfully')          
                }
        }
        else{
            res.send('Please Login In First')
        }
    }catch(err){
        res.send('Error : ',err)
    }  

})

/*****************Update Products Data********************/
router.put('/updatep',async(req,res)=>{
    try{
        if(req.session.flag && req.session.admin){
            const p = await ProductData.find({'pid':req.query.pid})
            const l = await ProductData.findByIdAndUpdate({'_id':p[0]._id}).then(val=>{
                val.name=req.query.name
                val.save()
            })
            req.session.flag = false
            req.session.uid = null
            res.send('Product Data Successfully Updated!!....')    
        }else if(req.session.flag && req.session.admin==false){
            const p = await ProductData.find({'pid':req.query.pid})
            if(req.session.uid==p[0].userid){
                const l = await ProductData.findByIdAndUpdate({'_id':p[0]._id}).then(val=>{
                    val.name=req.query.name
                    val.save()
                })
                req.session.flag = false
                req.session.uid = null
                res.send('Product Data Successfully Updated!!....') 
            }else{
                req.session.flag = false
                req.session.uid = null
                res.send('Cannot Update Another Users Data Or Admin Data')
            }
        }
        else{
            res.send('Login First')
        }
    }catch(err){
        res.send('Error :',err)
    }
})


router.put('/updateu',async(req,res)=>{
    try{
        if(req.session.flag && req.session.admin){
            const p = await UserData.find({'uid':req.query.uid})
            const l = await UserData.findByIdAndUpdate({'_id':p[0]._id}).then(val=>{
                val.name=req.query.name
                val.save()
            })
            req.session.flag = false
            req.session.uid = null
            res.send('Users Data Successfully Updated!!....')    
        }else if(req.session.flag && req.session.admin==false){
            const p = await UserData.find({'uid':req.query.uid})
            if(p[0].role=='User' && p[0].uid==req.session.uid){
                const l = await UserData.findByIdAndUpdate({'_id':p[0]._id}).then(val=>{
                    val.name=req.query.name
                    val.save()
                })
                req.session.flag = false
                req.session.uid = null
                res.send('Users Data Successfully Updated!!....') 
            }else{
                req.session.flag = false
                req.session.uid = null
                res.send('Cannot Update Another Users Data Or Admin Data')
            }
        }
        else{
            res.send('Login First')
        }
    }catch(err){
        res.send('Error :',err)
    }
})

module.exports = router