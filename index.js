import express from 'express';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
app.use(cors())
const PORT = process.env.PORT || 3006;

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const  db = await sqlite.open({
    filename:  './data_plan.db',
    driver:  sqlite3.Database
});

await db.migrate();

await db.migrate({ migrationsPath: './migrations' });



app.post('/api/phonebill/', async (req, res) => {
    const { price_plan, actions } = req.body;
    console.log('Request Body:', req.body);

    // Find the price plan in the database
    const plan = await db.get('SELECT * FROM price_plan WHERE plan_name = ?', [price_plan]);
    console.log('Fetched Plan:', plan);
console.log('Requested Plan:', price_plan);

    if (!plan) {
        return res.status(404).json({ error: 'Price plan not found' });
    }

    // Split the actions string into an array
    const actionsArray = actions.split(', ');

    // Calculate the total cost
    let total = 0;
    actionsArray.forEach(action => {
        if (action === 'call') {
            total += plan.call_price;
        } else if (action === 'sms') {
            total += plan.sms_price;
        }
    });

    // Respond with the total
    res.json({ total: total.toFixed(2) });
});


app.post('/api/price_plan/update', async (req, res) => {
    const { name, sms_cost, call_cost } = req.body;
    console.log(res.body);
    
    await db.run('UPDATE price_plan SET sms_price = ?, call_price = ? WHERE plan_name = ?', [sms_cost, call_cost, name ]);
    res.json({ message: 'Price plan updated successfully' });
});


app.post('/api/price_plan/create', async (req, res) => {
    const { name, sms_cost, call_cost } = req.body;
    await db.run('INSERT INTO price_plan (plan_name, sms_price, call_price) VALUES (?, ?, ?)', [name, sms_cost, call_cost]);
    res.json({ message: 'Price plan created successfully' });
});



app.get('/api/price_plans', async (req, res) => {
    const pricePlans = await db.all('SELECT * FROM price_plan');
    res.json(pricePlans);
});

app.post('/api/price_plan/delete', async (req, res) => {
    const { id } = req.body;
    await db.run('DELETE FROM price_plan WHERE id = ?', [id]);
    res.json({ message: 'Price plan deleted successfully' });
});


app.listen(PORT, () => `Server started ${PORT}`)
console.log(`Example app listening on port ${PORT}!`);



