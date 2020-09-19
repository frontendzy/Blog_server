module.exports = app => {
  const express = require('express')
  const jsonwebtoken = require('jsonwebtoken')
  const assert = require('http-assert')
  const AdminUser = require('../../models/AdminUser')
  const router = express.Router({
    mergeParams: true
  })

  const genericModel = async(req, res, next) => {
    // 转换模型名称大小写问题
    const modelName = require('inflection').classify(req.params.resource)
    // 获取数据模型
    req.Model = require(`../../models/${modelName}`)
    next()
  }

  // 登陆校验中间件
  const authMiddleware = async (req, res, next) => {
    const token = String(req.headers.authorization || '').split(' ').pop()
    assert(token, 401, '请先登陆')
    const {id} = jsonwebtoken.verify(token, app.get('secret'))
    assert(id, 401, '请先登陆')
    req.user = await AdminUser.findById(id)
    assert(req.user, 401, '请先登陆')
    await next()
  }

  router.post('/', async(req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model)
  })

  router.put('/:id', async(req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })

  router.delete('/:id', async(req, res) => {
    await req.Model.findByIdAndDelete(req.params.id, req.body)
    res.send({
      success: true
    })
  })

  router.get('/', async(req, res) => {
    const queryOptions = {}
    if(req.Model.modelName === 'Classification'){
      queryOptions.populate = 'belong'
    }
    // const model = await req.Model.find().setOptions(queryOptions)
    const model = await req.Model.find().populate('belong')
    res.send(model)
  })

  router.get('/:id', async(req, res) => {
    const model = await req.Model.findById(req.params.id)
    res.send(model)
  })

  app.use('/admin/api/rest/:resource', authMiddleware, genericModel, router)

  const multer = require('multer')
  const upload = multer({ dest: __dirname + '/../../uploads' })
  app.post('/admin/api/upload', authMiddleware, upload.single('file'), async(req, res) => {
    const file = req.file
    file.url = `http://localhost:2700/uploads/${file.filename}`
    res.send(file)
  })

  app.post('/admin/api/login', async(req, res) => {
    const {username, password} = req.body
    const user = await AdminUser.findOne({
      username: username
    }).select('+password')
    assert(user, 422, {message: '用户不存在'})
    const isvalid = require('bcrypt').compareSync(password, user.password)
    assert(isvalid, 422, {message: '密码错误'})
    const token= jsonwebtoken .sign({id: user._id}, app.get('secret'))
    res.send({token})

  })
  // 错误处理函数
  app.use(async (err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
}