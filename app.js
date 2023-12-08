const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const restaurants = require('./public/jsons/restaurant.json').results
const cssIndex = '/stylesheets/index.css' // index所使用的css
const cssShow = '/stylesheets/show.css' // show所使用的css

// express初始化設定: template,static file, view path,post數據解析
app.use(express.urlencoded({ extended: true}))
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

// 接收請求並處理: /
// 將資料放入index.hbs並返回給客戶端
app.get('/', (req, res) => {
  res.render('index', { restaurants, cssPath: cssIndex })
})

// 接收請求並處理: /restaurants
// 如果在search bar有輸入關鍵字，將餐廳列表設定為符合條件之餐廳，否則為所有餐廳列表
// 將資料放入index.hbs並返回給客戶端
app.get('/restaurants', (req, res) => {
  const keyword = req.query.keyword?.trim()
  const matchedRestaurants = keyword
    ? restaurants.filter((restaurant) =>
        Object.values(restaurant).some((property) => {
          if (typeof property === 'string') {
            return property.toLowerCase().includes(keyword.toLowerCase())
          }
          return false
        })
      )
    : restaurants
  res.render('index', {
    restaurants: matchedRestaurants,
    cssPath: cssIndex,
    keyword,
  })
})

// 接收請求並處理: /restaurant/:id
// 依照請求路徑上的id顯示對應的餐廳資訊
// 將資料放入show.hbs並返回給客戶端
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.find((restaurant) => restaurant.id.toString() === id)
  res.render('show', { restaurant, cssPath: cssShow })
})

// 伺服器啟動並監聽port:3000
app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})
