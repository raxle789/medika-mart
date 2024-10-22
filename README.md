# MedikaMart - Online Store

MedikaMart is an online store that provides a variety of the best health tools and products. MedikaMart only provides quality products at affordable prices. Currently, MedikaMart is trusted by millions of customers.

## Demo

1. First install the package:
   npm install

2. Initialize the environment variables, such as:

- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
- MIDTRANS_SERVER_KEY
- EMAIL_USER
- EMAIL_PASS

3. Run the development server:
   npm run dev

4. If you want to running the production mode, first:
   npm run build

5. Run the production server:
   npm run start

## Project Structure

Following is the project structure and explanation:

- `/online-store`
  - `/public` # Static files for client
  - `/src` # Source code
    - `/app` # Website route and api route
    - `/components` # Reusable ui component
    - `/hooks` # Logic handler ui for shadcn ui
    - `/lib` # Important functions from packages
    - `/redux` # Configuration and state action for redux
    - `/utils` # Data object for ui
  - `.env` # Environment variables
  - `other files configuration`
