const Image = require('../../models/image')
const User = require('../../models/user')
const ImageRating = require('../../models/imageRating')
const axios = require('axios')
const querystring = require('query-string');

let getAllTags = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit)
        const skip = parseInt(req.query.skip)

        const tags = await Image.find({private: false}).select('tags -_id').lean()

        let arr = tags.map(tag => tag['tags'])
        arr = [].concat(...arr)
        let myMap = arr.reduce(function(countMap, word) {countMap[word] = ++countMap[word] || 1; return countMap }, {});
        let  response = []

        Object.keys(myMap).forEach(key => {
            let obj = {
                tag: key,
                nrOfPosts: myMap[key],
            }
            response.push(obj)
        })

       response = response.sort((a,b) => (a.nrOfPosts < b.nrOfPosts)? 1 : -1 ).slice(0, limit)

        for (resp of response) {
            let imageUrl =  await axios.get('https://pixabay.com/api?' + querystring.stringify({ key: '12801090-f0058b673854f855fe7fa6cf1', q:resp.tag}))
            if (imageUrl.data.totalHits > 0) {
                imageUrl = imageUrl.data.hits[0].previewURL
                resp.imageUrl = imageUrl
            } else {
                resp.imageUrl = null
            }
        }

        res.status(200).send(response)
    } catch (e) {
        res.status(400).send()
    }
}

let getTagByName = async(req, res) => {
    try {
        let resp = {
            tag: req.params.tagName
        }
        resp.nrOfPosts = await Image.find({tags: req.params.tagName}).countDocuments()
        let imageUrl =  await axios.get('https://pixabay.com/api?' + querystring.stringify({ key: '12801090-f0058b673854f855fe7fa6cf1', q:req.params.tagName}))

        if (imageUrl.data.totalHits > 0) {
            imageUrl = imageUrl.data.hits[0].webformatURL.replace('_640', '_960')
            resp.imageUrl = imageUrl
        } else {
            resp.imageUrl = null
        }
        res.status(200).send(resp)
    } catch (e) {
        res.status(400).send()
    }
}

module.exports = {
    getAllTags: getAllTags,
    getTagByName: getTagByName
}