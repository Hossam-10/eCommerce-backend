const express = require('express');
require('./db/mongoose');

const app = express();
app.use(express.json());


const customerRoutes = require('./routes/customers');
const adminRoutes = require('./routes/admins');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const wishlistRoutes = require('./routes/wishlists');
const cartRoutes = require('./routes/carts');

const port = process.env.PORT || 3000;
app.use(customerRoutes);
app.use(adminRoutes);
app.use(categoryRoutes);
app.use(productRoutes);
app.use(wishlistRoutes);
app.use(cartRoutes);

app.listen(port);