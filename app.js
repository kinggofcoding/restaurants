const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
// const restaurants = require('./public/jsons/restaurant.json').results
const cssIndex = '/stylesheets/index.css' // index所使用的css
const cssShow = '/stylesheets/show.css' // show所使用的css
const methodOverride = require('method-override')
const db = require('./models')
const Restaurant = db.Restaurant

// express初始化設定: template,static file, view path,post數據解析
app.use(express.urlencoded({ extended: true}))
app.use(methodOverride('_method'))
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

// 讀取所有餐廳
app.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({ raw: true })
    res.render('index', { cssPath: cssIndex, restaurants })
  } catch (error) {
    res.status(422).json(error)
  }
})


// 新增餐廳頁面
app.get('/restaurants/new', (req, res) => {
  try {
    res.render('new')
  } catch (error) {
    res.status(422).json(error)
  }
})


// 讀取單一餐廳
app.get('/restaurants/:id', async (req, res) => {
  try {
    const id = req.params.id
    const restaurant = await Restaurant.findByPk(id, { raw: true })
    res.render('show', { cssPath: cssShow, restaurant })  
  } catch (error) {
    res.status(422).json(error)
  }
})

// 新增餐廳
app.post('/restaurants', async (req, res) => {
  try {
    const { name, name_en, category, image, location, google_map, phone, rating, description } = req.body
    const restaurant = await Restaurant.create({ name, name_en, category, image, location, google_map, phone, rating: parseFloat(rating), description })
    if (restaurant) {
      res.redirect('/restaurants')
    }
  } catch (error) {
    res.status(422).json(error)
  }
})

// 編輯餐廳頁面

// 更新餐廳

// 刪除餐廳



// 接收請求並處理: /restaurants
// 如果在search bar有輸入關鍵字，將餐廳列表設定為符合條件之餐廳，否則為所有餐廳列表
// 將資料放入index.hbs並返回給客戶端
// app.get('/restaurants', (req, res) => {
//   const keyword = req.query.keyword?.trim()
//   const matchedRestaurants = keyword
//     ? restaurants.filter((restaurant) =>
//         Object.values(restaurant).some((property) => {
//           if (typeof property === 'string') {
//             return property.toLowerCase().includes(keyword.toLowerCase())
//           }
//           return false
//         })
//       )
//     : restaurants
//   res.render('index', {
//     restaurants: matchedRestaurants,
//     cssPath: cssIndex,
//     keyword,
//   })
// })


// 伺服器啟動並監聽port:3000
app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})
