'use strict'

const dotenv = require('dotenv').config()
const fs = require('fs')
const mongoose = require('mongoose')
const express = require('express')
const sharp = require('sharp')
const ExifImage = require('exif').ExifImage
const bodyParser = require('body-parser')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/storage')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })
const postCounter = require('./PostCounter')
const app = express()

app.listen(3000)

// Routes ///////////////////////////////////////////////////////////

app.get('/api/posts', (req, res) => {
    res.send(`get works`)
})

app.post('/api/posts', upload.single('image'), (req, res, next) => {
    const id = postCounter.getID
    next()
})

app.use('/api/posts', (req, res) => {
    const body = req.body
    const file = req.file
    console.log(req.file)

    console.log(getCoordinates(`public/storage/${req.file.filename}`));
    
    sharp(file.path)
        .resize(350, 350)
        .toFile(file.destination + 'thumbnail/' + file.filename, err => {
            if (err === !null) {
                console.log(err)
            }
        })

    const uploadSchema = {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        imagePath: req.file.path,
        thumbnailPath: req.file.destination + 'thumbnail/' + file.filename,
        coordinates: getCoordinates(`public/storage/${req.file.filename}`)
    }

    res.send(req.body)

    /*const Demo = mongoose.model('Demo', formSchema)
    Demo.create(uploadSchema).then(() => {
        console.log(uploadSchema.toString())
        res.refresh(true)
    })*/
})

// Helper functions /////////////////////////////////////////////////

const getCoordinates = image => {
    try {
        new ExifImage({ image: image }, (error, exifData) => {
            if (error) {
                console.log('Error: ' + error.message)
            } else {
                const coordinates = [
                    { lat: exifData.gps.GPSLatitude },
                    { lon: exifData.gps.GPSLongitude }
                ]
                console.log(coordinates)
                return coordinates
            }
        })
    } catch (error) {
        console.log('Error: ' + error.message)
    }
}
