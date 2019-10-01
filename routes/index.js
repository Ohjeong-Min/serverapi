const dot = require('dotenv');
const express = require('express')
const mysql = require('mysql')

const router = express.Router()
dot.config();

var db = mysql.createConnection({
    host:process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database : process.env.DB_NAME
})

router.get('/topic/add' , (req , res)=>{
    var sql = 'SELECT * FROM topic'
    db.query(sql ,(err , result)=>{
        if(err) {
            console.log(err);
            res.status(500).send('서버가 응답이 없습니다.')
        }
        
        console.log(result[0].description)
        // res.status(200).send(result);
        // return result
        res.render('add',{data:result})
        
    })
    // 
})

router.post('/topic/add',(req, res)=>{
    console.log(req.body)
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var sql = 'INSERT INTO topic (title , description,author )  VALUES (? , ?, ? )'
    params = [title,description ,author ];

    db.query(sql, params ,(err, result)=>{
        if(err){
            cosole.log(err);
            res.status(500).send('Internal Server error')
        }

        else{
            console.log("성공적으로 저장되었습니다.");
            console.log(result);
            res.redirect(`/topic/${result.insertId}`)

        }
    })
})

router.get('/topic/:id/edit' , (req, res)=>{
    var sql = "SELECT * FROM topic";
    db.query(sql, (err, results)=>{
        var ids = req.params.id
    if(ids){
        var sql = `SELECT * FROM topic where id= ${ids}`;
        db.query(sql, (err, result)=>{
            
            if(err){
                console.log(err)
                res.status(500).send('Internal Server error')
            }
            
            else {
                console.log(result);
                res.render('edit' , {datas:results , data:result[0]})
            }
        })
    }
    else{
        console.log(err)
        res.send("there is no id")
    }        
    })
 })

router.get('/topic/:id',(req, res)=>{
    var sql = 'SELECT * FROM topic';
    db.query(sql , (err , results)=>{
        var ids = req.params.id;
        if(ids){
            var sql = `SELECT * FROM topic WHERE id=${ids}`
            db.query(sql, (err , result)=>{
                if(err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                }
                else{
                    console.log(result)
                    res.render('view',{datas:results , data:result[0]})
                }
            })    
        }
        else{
            res.render('view', {datas:results , data:
                {id:1, title:"1",description:"1", author:"1"}})
        }
    })
    
})



router.post('/topic/:id/edit' , (req , res)=> {

    var sql = 'UPDATE topic SET title=? , description=? , author=? WHERE id=?' ;
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    var ids = req.params.id
    var editData = [title, description, author, ids]

    db.query(sql, editData, (err , result)=>{
        if(err){
            console.log(err);
            res.status(500).send('Internel Server Error')
        }
        else{
            res.redirect('/topic/add')     //`/topic/${ids}/edit`) // '/topic/' +ids+ '/edit' 이런식으로 바꿔도됨
        }
    })
})



router.get('/topic/:id/delete', (req,res)=>{
    var sql = 'SELECT id , title FROM topic';
    db.query(sql,(err, results)=>{
        var ids = req.params.id;
        if(err){
            console.log(err);
            res.status(500).send('interval service error')
        }
        else{
            var sql = 'SELECT * FROM topic WHERE id = ?'
            db.query(sql,[ids] , (err, result)=>{
                if(err){
                    console.log(err);
                    res.status(500).send('interval service error')
                }
                else{
                    res.render('delete' , {})
                }
            })
        }
    })
})

router.post('/topic/:id/delete', (req, res)=>{
    var ids = req.params.id;
    var sql = 'DELETE FROM topic WHERE id=?'
    var deleteId = [ids] 

    db.query(sql,deleteId, (err , result)=>{
        if(err) {
            console.log(err);
            res.status(500).send('Internel Server Error')
        }
        else{
            res.redirect('/topic/add')
        }
    })
})



module.exports = router;