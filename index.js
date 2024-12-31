import express from "express";
import cors from "cors";
import Stripe from "stripe"
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello Boss MAN!");
});

app.post("/api/v1/checkout", async (req, res) => {
    const { products } = req.body;
    const lineItems = products.map((item) => ({
        price_data: {
            currency: "usd",
            product_data: {
                name: item.name,
            },
            unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
    }));
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:5173/success", // Replace with your frontend success page
        cancel_url: "http://localhost:5173/cancel",  // Replace with your frontend cancel page
    });

    res.json({ message: "session completed", id: session.id });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

