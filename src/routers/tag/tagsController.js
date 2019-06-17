const Image = require('../../models/image')
const User = require('../../models/user')
const ImageRating = require('../../models/imageRating')
const axios = require('axios')
const querystring = require('query-string');

let getAllTags = async (req, res) => {
    let tagArray;
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
            imageUrl = imageUrl.data.hits[0].largeImageURL
            resp.imageUrl = imageUrl
        }

        res.status(200).send(response)
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getAllTags: getAllTags
}