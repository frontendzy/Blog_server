module.exports = app => {
  const express = require('express')
  const router = express.Router()
  const Article = require('../../models/Article')
  const BlogIcon = require('../../models/Blog')
  const Personal = require('../../models/Personal')
  router.get('/article', async(req, res) => {
    const model = await Article.find().populate('belong')
    res.send(model)
  })
  router.get('/article/:id', async(req, res) => {
    const model = await Article.findById(req.params.id).populate('belong')
    res.send(model)
  })

  router.get('/blogicon', async(req, res) => {
    const model = await BlogIcon.find()
    res.send(model)
  })

  router.get('/personal', async(req, res) => {
    const model = await Personal.find().limit(1)
    res.send(model)
  })

  app.use('/web/api', router)

}