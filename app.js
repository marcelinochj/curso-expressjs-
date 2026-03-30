require('dotenv').config();
const express = require('express');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const { validateUser } = require('./src/utils/validation');
const LoggerMiddleware = require('./src/middlewares/logger')
const errorHandler = require('./src/middlewares/errorHandler')
const authenticateToken = require('./src/middlewares/auth')

const bodyParser = require('body-parser');

const fs = require('fs');
const path = require('path');
const { error } = require('console');
const { nextTick } = require('process');
const console = require('console');
const { JsonWebTokenError } = require('jsonwebtoken');
const usersFilePath = path.join(__dirname, 'users.json');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(LoggerMiddleware);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
         <h1>Hola Mundo test V7</h1>
         <p>Esto es un prueba ${PORT}</p>
    `);
});

app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`Mostrar información del usuario ${userId}`)
});

app.get('/search/', (req, res) => {
    const terms = req.query.termino || 'No especificado';
    const category = req.query.category || 'Todas'
    res.send({Cat: category, CurrentTerms:terms})
});

app.post('/form', (req, res) => {
    const name = req.body.nombre || "Anonimo";
    const email = req.body.email || "No proporcionado";

    res.json({
        message: 'Datos Recibidos',
        nombre: name,
        email: email
    })
});

app.post('/api/data', (req, res) => {
    const data = req.body;

    if(!data || Object.keys(data).length === 0) {
        return res.status(400).json({error: 'No se recibieron datos'});
    };

    res.status(200).json({
        message: 'Datos recibidos',
        data
    });
});

app.get('/users', (req, res) => {
  fs.readFile(usersFilePath, 'utf8', (error, data) => {
    if (error) {
      return res.status(500).json({
        error: "Error con la conexión de datos"
      });
    }
    const users = JSON.parse(data);
    res.json(users);
  });
});

app.post('/users', (req, res) => {
    const newUser = req.body;
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if(err) {
            return res.status(500).json({error: 'Algo salio mal'});
        }
       
        const users = JSON.parse(data);

        const validation = validateUser(newUser, users);

        if (!validation.isValid){
            return res.status(400).json({error: validation.errors});
        }

        users.push(newUser);

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            return res.status(500).json({error: 'Algo salio mal'})
        })

        res.status(201).json(newUser);
    });
});

app.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const updateUser = req.body;
  
  // Leemos el archivo de usuarios
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error con conexión de datos" });
    }
    
    // Parseamos los datos JSON
    let users = JSON.parse(data);
    
    // Actualizamos el usuario que coincida con el ID
    users = users.map(user => {
      return user.id === userId ? { ...user, ...updateUser } : user;
    });
    
    // Guardamos los cambios en el archivo
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Error al actualizar el usuario" });
      }
      
      // Respondemos con el usuario actualizado
      res.json(updateUser);
    });
  });
});

app.delete('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  
  fs.readFile(usersFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error con conexión de datos" });
    }
    
    let users = JSON.parse(data);
    users = users.filter(user => user.id !== userId);
    
    fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Error al eliminar usuario" });
      }
      
      res.status(204).send();
    });
  });
});

app.get('/error', (req, res, next) => {
  next(new Error("Error intencional"));
});

app.get('/db/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    console.log(users);
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al comunicarse con la base de datos" });
  }
});

app.get('/protected-route', authenticateToken, (req, res) => {
  res.send('Esta ruta esta protegida.');
})

app.post('/register', async (req, res) => {
  const {name, email, password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data:{
      email,
      password: hashedPassword,
      name,
      role : 'USER'
    }
  });

  res.status(200).json({Message: 'User Registred Succefully'});
});

app.post('/login', async (req, res) => {
  const {email, password} = req.body;
  const user = await prisma.user.findUnique({where:{email}});

  if (!user) return res.status(400).json('Invalid email or password');
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return res.status(400).json('Invalid email or password');

  const token = jwt.sign({id: user.id, role: user.role},
    process.env.JWT_SECRET,
    {expiresIn: '1h'}
  );

  return res.status(201).json({token});


})


app.listen(PORT, () => {
    console.log(`servidor: http://localhost:${PORT}`);
});