module.exports = ((err, req, res, next) => {
    res.set('Content-Type', 'text/html');
    console.log(err);
    res.send(Buffer.from('<h1 style="text-align:center">Oops! Something went wrong.</h1>'));
});