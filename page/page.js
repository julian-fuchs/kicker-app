module.exports = init

function init (app) {
  app.get('/example', function (req, res) {
    require('./example').page(req, res)
  })
  app.get('/choose_login_method', function (req, res) {
    require('./choose_login_method').page(req, res)
  })

  // ^^^ Insert new pages here ^^^
}
