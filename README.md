# DeliverIQ Project

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/sripad1003s-projects/v0-deliver-iq)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/GOXnIHkKZbk)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Project Details: DeliverIQ

DeliverIQ is a comprehensive transport management system designed to streamline the process of booking, managing, and tracking transportation services. It provides distinct interfaces for customers, drivers, and administrators, ensuring a smooth and efficient experience for all stakeholders.

### Key Features:

*   **Customer Portal:**
    *   **Book Transport:** Customers can easily request transportation services.
    *   **Track Orders:** Real-time tracking of their booked orders.
    *   **Rate Drivers:** Provide feedback and ratings for completed trips.
    *   **Dashboard:** Overview of their past and current orders.
*   **Driver Portal:**
    *   **Dashboard:** View assigned orders, manage availability, and update order status.
    *   **Order Management:** Accept, decline, and complete transport requests.
*   **Admin Portal:**
    *   **Dashboard:** Centralized view of all system activities, including orders, customers, and drivers.
    *   **Manage Admins:** Add, remove, or modify admin accounts.
    *   **Setup:** Configure system-wide settings, including security keys.
    *   **Order Management:** Oversee and manage all transport orders.

### Our Service:

DeliverIQ aims to provide a reliable, efficient, and user-friendly platform for transportation needs. By connecting customers with available drivers and empowering administrators with robust management tools, we ensure seamless operations and high customer satisfaction. Our focus is on simplifying logistics, enhancing transparency, and delivering a superior transport experience.

## How It Works

1.  Create and modify your project using [v0.dev](https://v0.dev)
2.  Deploy your chats from the v0 interface
3.  Changes are automatically pushed to this repository
4.  Vercel deploys the latest version from this repository

## Running the Project Locally

Follow these steps to set up and run the DeliverIQ project on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:** Version 18.x or higher. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm** (Node Package Manager) or **Yarn**: npm comes with Node.js. If you prefer Yarn, install it globally: `npm install -g yarn`.
*   **Git:** For cloning the repository. Download from [git-scm.com](https://git-scm.com/).

### Installation Steps

1.  **Clone the Repository:**
    Open your terminal or command prompt and clone the project repository:
    \`\`\`bash
    git clone https://github.com/sripad1003s-projects/v0-deliver-iq.git
    \`\`\`

2.  **Navigate to the Project Directory:**
    Change into the newly cloned project directory:
    \`\`\`bash
    cd v0-deliver-iq
    \`\`\`

3.  **Install Dependencies:**
    Install the required Node.js packages.
    Using npm:
    \`\`\`bash
    npm install
    \`\`\`
    Or using Yarn:
    \`\`\`bash
    yarn install
    \`\`\`

4.  **Environment Variables (Optional for this project):**
    This project uses in-memory data for simplicity and does not require a `.env` file for basic functionality. However, if you were to integrate with external services (like a database or external APIs), you would typically create a `.env.local` file in the root of your project and add your environment variables there.

    For admin login, the default security key is hardcoded for demonstration purposes.

5.  **Run the Development Server:**
    Start the Next.js development server:
    Using npm:
    \`\`\`bash
    npm run dev
    \`\`\`
    Or using Yarn:
    \`\`\`bash
    yarn dev
    \`\`\`

6.  **Access the Application:**
    Once the server starts, open your web browser and navigate to:
    \`\`\`
    http://localhost:3000
    \`\`\`

### Admin Login Details

To access the admin dashboard, use the following security key when prompted:

*   **Admin Security Key:** `DELIVERIQ_ADMIN_2024`

Enjoy exploring the DeliverIQ application!
\`\`\`

```plaintext file=".gitignore"
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
