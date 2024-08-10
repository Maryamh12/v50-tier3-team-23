const PORT = process.env.PORT ?? 8000;
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { v4: uuidv4 } = require("uuid");

const cors = require("cors");
const Stripe = require("stripe");
const app = express();
require("dotenv").config();

app.use('*',cors());
app.use(express.json());

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const pool = require("./db");

app.get("/", async (req, res) => {
  res.send("Hello World");
});

app.get("/getAllUsers", async (req, res) => {
  try {
    const response = await pool.query("SELECT * FROM users");
    const users = response.rows.map((user) => {
      return user.user_email;
    });
    res.json(users);
    return users;
  } catch (error) {
    console.log(error);
  }
});

app.post("/signup", async (req, res) => {
  const { user_email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    if (!user_email || !password) {
      return res.json({ error: "No data provided", status: 401 });
    }

    const data = await pool.query(
      `SELECT * FROM users WHERE user_email = user_email;`
    );

    const email = data.rows.map((user) => {
      return user.user_email;
    });

    if (email.includes(user_email)) {
      return res.json({ error: "User already exists!", status: 401 });
    }

    const id = uuidv4();
    await pool.query(
      `INSERT INTO users(id, user_email, password) VALUES($1, $2, $3)`,
      [id, user_email, hashedPassword]
    );
    const token = jwt.sign({ user_email }, "secret", { expiresIn: "1hr" });
    res.json({
      message: "SUCCESS CREATING USER",
      status: 200,
      token,
      user_email,
    });
  } catch (error) {
    console.log("ERROR CREATING USER: ", error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { user_email, password } = req.body;
    const data = await pool.query(
      `SELECT password FROM users WHERE user_email = '${user_email}';`
    );
    const hashedPassword = data.rows[0].password;
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) {
      return res.json({ error: "Incorrect password or email", status: 401 });
    }
    const token = jwt.sign({ user_email }, "secret", { expiresIn: "1hr" });
    return res.json({
      message: "Logged In",
      status: 200,
      token,
      user_email,
    });
  } catch (error) {
    console.log("ERROR CREATING USER: ", error);
    return { status: 401, message: error };
  }
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Burger",
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url:
        "http://localhost:5173/return?session_id={CHECKOUT_SESSION_ID}",
    });

    res.send({ clientSecret: session.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/session-status", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email,
  });
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
