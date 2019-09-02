const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

// Create Redis Client
let client = redis.createClient();

client.on('connect', () => {
    console.log('Connected to Redis...');
})

// Set Port
const port = 3000;

// Init app
const app = express();

// View Engine
app.engine('handlebars' , exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// methodOverride
app.use(methodOverride('_method'));

// Default url / for searchusers view
app.get('/', (req, res, next) => {
    client.keys('*user*', (err, keys) => {
        if(!keys){
            res.render('redis_users', {
                users: []
            });
        } else {
            res.render('redis_users', {
                users: keys
            });
        }
    });    
});


// Default url / for searchusers view
app.get('/', (req, res, next) => {
    client.keys('*user*', (err, keys) => {
        if(!keys){
            res.render('redis_users', {
                users: []
            });
        } else {
            res.render('redis_users', {
                users: keys
            });
        }
    });    
});



app.get('/user/add', (req, res, next) => {
    res.render('adduser');
});

app.get('/user/search', (req, res, next) => {
    res.render('searchusers');
});

app.get('/user/update', (req, res, next) => {
    console.log('req.body: ',req.body);
    console.log('req.query: ',req.query);
    const id = req.query.id;
    client.hgetall(id, (err, obj) => {
        if (!obj) {
            res.render('searchusers', {
                error: 'Can not update user. User does not exist'
            });

        } else {
            obj.id = id;
            res.render('updateuser', {
                user: obj
            })
        }
    });
    
});

app.post('/user/search', (req, res, next) => {
    console.log(req.body);
    const id = req.body.id;

    client.hgetall(id, (err, obj) => {
        if (!obj) {
            res.render('searchusers', {
                error: 'User does not exist'
            });
        } else {
            obj.id = id;
            res.render('details', {
                user: obj
            })
        }
    });
})


app.post('/user/add', (req, res, next) => {
    const id = req.body.id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const phone = req.body.phone;

    client.hmset(id, [
        'first_name', first_name,
        'last_name', last_name,
        'email', email,
        'phone', phone
    ], (err, reply) => {
        if (err) {
            console.log(err);
        }
        console.log(reply);
        res.redirect('/');
    });

    
});

app.post('/user/update', (req, res, next) => {
    console.log('req.body: ',req.body);
    const id = req.body.id;
    console.log('id: ',id);
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const phone = req.body.phone;

    client.hmset(id, [
        'first_name', first_name,
        'last_name', last_name,
        'email', email,
        'phone', phone
    ], (err, reply) => {
        if (err) {
            console.log(err);
        }
        console.log(reply);
        res.redirect('/');
    });

    
});

app.delete('/user/delete/:id', (req, res, next) => {
    console.log(req);
    client.del(req.params.id);
    res.redirect('/');
})

app.listen(port, () => {
    console.log('Server started on port: '+port);
})

