const express = require('express');
const pool = require('./db');

const PORT = 8080;
const app = express();

app.use(express.json());

app.get('/todos', async (req, res) => {
    const todos = await pool.query("SELECT * FROM todo");
    res.json(todos.rows);
});

app.get('/todos/:id', async (req, res) => {
    const todo = await pool.query(`SELECT * FROM todo WHERE todo_id=${req.params.id}`);
    res.json(todo.rows[0]);
});

app.post('/todos', async (req, res) => {
    try {
        const { description } = req.body;
        const newTodo = await pool.query(`INSERT INTO todo (description) VALUES ($1) RETURNING *`, [description]);
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
});