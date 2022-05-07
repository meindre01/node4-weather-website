const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const port = process.env.PORT || 3000

const app = express()

const publicPathDirectory =  path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')

app.set('view engine','hbs')
app.set('views',viewsPath)

app.use(express.static(publicPathDirectory))

hbs.registerPartials(partialsPath)


app.get('',(req,res)=>{
    res.render('index',{
        title : 'Weather',
        name : 'Indra Permana'
    })
})

app.get('/about',(req,res)=>{
    res.render('about',{
        title : 'About Me',
        name : 'Indra Permana'
    })
})

app.get('/help',(req,res)=>{
    res.render('help',{
        title : 'Help',
        name : 'Indra Permana'
    })
})

app.get('/weather',(req,res)=>{
    if(!req.query.address){
       return res.send({
            message : 'You must provide the address'
        })
    }    

        geocode(req.query.address,(error,{ latitude, longitude, location = {} })=>{
            if(error){
                return res.send({
                    error : error
                })
            }
            forecast(longitude, latitude, (error, dataForecast)=>{
                if(error){
                   return res.send({
                        error : error
                    })
                }
                
                res.send({
                    address : req.query.address,
                    forecast : dataForecast,
                    location : location
                })
            })
        })
    
})

app.get('*',(req,res)=>{
    res.render('404',{
        title : '404 page',
        name : 'Indra Permana'
    })
})

app.listen(port,()=>{
    console.log('Server is on ' + port )
})




