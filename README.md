# Swift Delicacies

A full-stack meal-sharing application built with **Next.js**, **Supabase**, and **Cloudinary**. Users can browse meals, view meal details, and share their own recipes with images.

## Tech Stack

* **Next.js** — React framework and application routing
* **React** — User interface
* **Supabase** — Database and authentication
* **Cloudinary** — Meal image storage and delivery
* **JavaScript** — Application logic
* **CSS** — Styling

## Features

* Browse available meals
* View individual meal details
* Share new meals and recipes
* Upload and display meal images with Cloudinary
* Store meal data in Supabase
* User authentication
* Responsive interface
* Server-side data handling with Next.js

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Lordren1/swift-delicacies.git
cd swift-delicacies
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root of the project:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Replace the placeholder values with your actual Cloudinary and Supabase credentials.

**Important:** Never commit `.env.local` or expose your Supabase service role key publicly.

### 4. Set up Supabase

The application uses Supabase as its database, so no local database installation is required.

If you are setting up the project with a new Supabase project:

1. Create a project in Supabase.
2. Open the **SQL Editor**.
3. Run the schema located at:

```text
supabase/schema.sql
```

This will create the required database tables.

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The application will automatically reload when you make changes.

## Project Structure

```text
swift-delicacies/
├── app/
├── components/
├── lib/
├── public/
├── supabase/
│   └── schema.sql
├── .env.local
├── package.json
└── README.md
```

## Deployment

The application can be deployed to **Vercel**.

Before deploying, add the same environment variables from `.env.local` to your Vercel project's **Environment Variables** settings.

Then deploy the project from your GitHub repository.

## Environment Variables

| Variable                    | Purpose                               |
| --------------------------- | ------------------------------------- |
| `CLOUDINARY_CLOUD_NAME`     | Cloudinary cloud name                 |
| `CLOUDINARY_API_KEY`        | Cloudinary API key                    |
| `CLOUDINARY_API_SECRET`     | Cloudinary API secret                 |
| `SUPABASE_URL`              | Supabase project URL                  |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase server-side service role key |

## License

This project is for learning and development purposes.
