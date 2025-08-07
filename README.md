# DeliverIQ

DeliverIQ is a comprehensive logistics and delivery management platform.

## Features

- **Customer Portal**: Book transport, track orders, rate drivers.
- **Driver Portal**: Manage deliveries, update status.
- **Admin Dashboard**: Manage admins, view overall statistics, manage security settings.
- **Real-time Updates**: (Future feature) Track driver locations and order status in real-time.
- **MongoDB Integration**: Persistent storage for all user, admin, driver, and order data.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/DeliverIQ.git
cd DeliverIQ
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up Environment Variables

Create a `.env.local` file in the root of your project and add your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://<your_username>:<pass>@cluster0.hmzrnnp.mongodb.net/
```

Replace the placeholder with your actual MongoDB connection string.

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Default Accounts (for initial testing after MongoDB seeding)

Upon first load, the application will seed the database with the following demo accounts:

**Admin:**
- Email: `admin@deliveriq.com`
- Password: `admin123`
- Admin Security Key: `DELIVERIQ_ADMIN_2024`

**Customer:**
- Email: `john@deliveriq.com`
- Password: `password123`
- Email: `jane@deliveriq.com`
- Password: `password123`

**Driver:**
- Email: `amit@example.com`
- Password: `password123`
- vehicle: `van`

- Email: `raj@example.com`
- Password: `password123`
- vehicle: `truck`


### Project Structure

- `app/`: Next.js App Router pages and layouts.
- `actions/`: Server Actions for database interactions.
- `components/`: Reusable React components (UI, layout, auth).
- `lib/`: Utility functions, data models, and MongoDB connection.
- `public/`: Static assets.
- `styles/`: Global CSS.

## Deployment

This project can be easily deployed to Vercel. Ensure your `MONGODB_URI` environment variable is set in your Vercel project settings.
