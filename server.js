import express from 'express';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ 
        status: "active", 
        message: "Creator Marketplace API is screaming 🚀",
        runtime: "Node.js ES Modules"
    });
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
    console.log(`\n✅ Server running at http://localhost:${PORT}`);
});