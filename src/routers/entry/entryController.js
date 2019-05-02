const Entry = require('../../models/entry')

let create =  async (req, res) => {
    const entry = new Entry({
        ...req.body,
        owner: req.user._id
    })

    try {
        const savedEntry = await entry.save()
  
        res.status(201).send(await savedEntry.populate('owner').execPopulate())
    } catch (e) {
        res.status(400).send(e)
    }
}

let getAll = async (req, res) => {
    try {
        res.send(await Entry.find(req.query).populate('owner').exec())
    } catch (e) {
        res.status(500).send()
    }
}

let getById = async (req, res) => {
    try {
        const entry = await Entry.findOne({_id:req.params.id})
        if (!entry) {
            return res.status(404).send()
        }
        res.send(entry)
    } catch (e) {
        res.status(404).send(`
        ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
        ░░░░░░░░░░░░████░░░░░░░░░░░░░░░░░░░░░░
        ░░░░░░░░░█████████░░░░░░░░░░░░░░░░░░░░
        ░░░░░░░░███░░░░░░█░░░░░░░░░░░░░░░░░░░░
        ░░░░░░███░░░░░░░░██░░░░░░░░░░░░░░░░░░░
        ░░░░░██░░░░░░░░░░░██░░░░░░░░░░░░░░░░░░
        ░░░░██░░░░░░░░░░░░░█░░░░░░░░░░░░░░░░░░
        ░░░░█░░░░░░░░░░█░░░█░░░░░░░░░░░░░░░░░░
        ░░░███░█░░░░░██░█░░█░░░░░░░░░░░░░░░░░░
        ░░░███░██░░█░███░░░█░░░░░░░░░░░░░░░░░░
        ░░░██░██░░░█░███░░░█░░░░░░░░░░░░░░░░░░
        ░░█░░░██░░░░░░░░░░█░░░░░░░░░░░░░░░░░░░
        ░█░░░█░█░░░█░░██░░█░░░░░░░░░░░░░░░░░░░
        ░█░░░░███░░░░██░░░░█░░░░░░░░░░░░░░░░░░
        ░██░░░░░░░░██░██░░░█░░░░░░░░░░░░░░░░░░
        ░██████████████░░░░█░░░░░░░░░░░░░░░░░░
        ░█░░░░░░░░░░░░░░░░░█░░░░░░░░░░░░░██░░░
        ░█░░░░░░░░░░░░░░░░░█░░░░░░░░░░░░██░█░░
        ███░░░░░░░░░░░░░░░░█░░░░░░░░░░░░█░░██░
        ██░░░░░░░░░░░░░░░░░█░░░░░░░░░░░░█░░░█░
        ██░░░░░░░░░░░░░█░░██░░░░░░░░░░░██░░░█░
        ██░░░░░░░░░░░█░█░░░█░░░░░░░░░░░██░░░█░
        ██░░░░░░░░░░░█░█░░░█░░░░░░░░░░██░░░██░
        ██░░░░░░░░░░░█░█░░░█░░░░░░░░░░█░░░██░░
        ██░░░░░░░░░░░█░█░░░████████████░░░█░░░
        ██░░░░░░░░░░░█░█░░░███░░░░░░█░░░░██░░░
        ░█░░░░░░░░░░░█░█░░░█░░░██░░░░█░░░███░░
        ░█░░░░░░░░░░░█░█░░░█░░░░░█████░░░░░██░
        ░██░░░░░░░░░░█░█░░░░░░███░░░███░░░░░█░
        ░██░░░░░░░░░░█░█░░░░░░░░░░░░░███░░███░
        ░█░░░░░░░░░░░█░███░░░░░░░░░░░░░██░░░█░
        ░██░░░░░░░░██░░░░█░░░░░░██░░░░░░█░░░██
        ░░█░░░░░░░░█░░░░██░░░░░░░░░░░░░░██░░░█
        ░░██░░░░░░░███████░░░░░░░░░░░░░░█████░
        ░░░██░░░░░░░░███░░░░░░░██░░░░░░░█░░░░░
        ░░░██░░░░░░░░░░░░░░░░░█░░░░░░░░░█░░░░░
        ░░░░██░░░░░░░░░░░░░░░░░░█░░░░░░██░░░░░
        ░░░░░██░░░░░░░░░░░░░░░░░░░░░░░██░░░░░░
        ░░░░░░██░░░░░░░░░░░░░░░░░░░░███░░░░░░░
        ░░░░░░░░██░░█░░░░░░░░░░░░░░██░░░░░░░░░
        ░░░░░░░░░█████░░█░░░░░███████░░░░░░░░░
        ░░░░░░░░███░░████████░█░░░░░░░░░░░░░░░
        ░░░░░░░░███░░░░░░░░█░██░░░░░░░░░░░░░░░
        ░░░███░████░░░░░██░█░░█░░░░░░░░░░░░░░░
        ░░░█░███░█░░░░░░████░█░░░░░░░░░░░░░░░░
        ░░░░█░░░░█░░░░░░█░░░░█░░░░░░░░░░░░░░░░
        ░░░░██░░██░░░░░░██░░░█░░░░░░░░░░░░░░░░
        ░░░░█████░░░░░░░░██░░█░░░░░░░░░░░░░░░░
        ░░░░░░░█░░░░░░░░░░███░░░░░░░░░░░░░░░░░`)
    }
}



let deleteEntry = async (req, res) => {
    try {
        const entry = await Entry.deleteMany({_id: {$in:req.query.ids}})

        if (!entry) {
            res.status(404).send()
        }

        res.send(entry)
    } catch (e) {
        res.status(404).send()
    }
}


// router.patch('/tasks/:id', auth, async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['description', 'completed']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {
//         const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

//         if (!task) {
//             return res.status(404).send()
//         }

//         updates.forEach((update) => task[update] = req.body[update])
//         await task.save()
//         res.send(task)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })



module.exports = {
    create:create,
    getAll:getAll,
    getById:getById,
    deleteEntry:deleteEntry
}