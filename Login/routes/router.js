const express =require('express')
const router = express.Router()
const UserData = require('../models/userdata')
const ProductData = require('../models/productdata')
const session =require('express-session')



router.post('/create',async(req,res)=>{
    const user = new UserData({
        uid : req.body.id,
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

// router.get('/login',async(req,res)=>{
//     try{
//         const p = await UserData.find({id:req.query.uid})

//         if(p.length > 0){
//             req.session.flag=true
//             req.session.uid = p;
//             res.send('Login Successfull')
//         }
//         else{
//             req.session.flag=false
//             res.send('Account not Found')
//         }

//     }catch(err){
//         res.send(err)
//     }
// })

// // router.get('/login',async(req,res)=>{
// //         try{
// //             const id =  req.query.uid
// //             console.log(req.session.uid)

// //             const p = await UserData.find({'id':id})
// //            console.log(p)

// //            res.send(p)
// //             // const len = p.length

// //             // for(var i=0;i<len;i++){
// //             //     if(p[i].id == id){
// //             //         res.send('LOGIN SUCCESSFULL\n'+'Name:'+p[i].name+'\nUserid:'+p[i].id+'\nRole:'+p[i].role)
// //             //         break
// //             //     }
// //             // }
            
// //             // if(i==len)
// //             // res.send('USER NOT FOUND')
// //         }catch(err){
// //             res.send('Error :',err)
// //         }
// // })

// router.get('/prod',async(req,res)=>{
//     try{
//         const k = req.session.uid[0]
//         res.send(k)

//         // if(req.session.flag){
//         //     const p = await ProductData.find({'userid':req.session.uid})
//         //     res.send(p)
//         // }else{
//         //     res.send('Please Login In First')
//         // }
//     }catch(err){
//         res.send('Error :',err)
//     }
// })



// router.post('/product',async(req,res)=>{
//     try{
//         const p = new ProductData({
//             pid : req.body.id,
//             name : req.body.name,
//             userid : req.body.userid
//         })

//         const d = await p.save()
//         res.send(d)

//     }catch(err){
//         res.send(err)
//     }
// })



// router.delete('/user',async(req,res)=>{
//     const p = await UserData.drop
//     const z = await ProductData.drop
//     Emp.dropCollection
//     res.send(z)
// })


router.get('/',async(req,res)=>{
    try{
        const u = await UserData.find()
        res.send(u)
        
    }catch(err){
        res.send('Error : ',err)
    }
})
module.exports = router