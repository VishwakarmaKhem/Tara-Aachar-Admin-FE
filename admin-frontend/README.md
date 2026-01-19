# Aachar Admin Panel

A modern, responsive admin panel for managing aachar (pickle) product pages. Built with React, TypeScript, and Vite.

## Features

- **Product Management**: Create, edit, and delete aachar products
- **Rich Product Details**: Name, description, price, category, ingredients, spice level, weight, and images
- **Inventory Tracking**: Mark products as in-stock or out-of-stock
- **Featured Products**: Highlight special products
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Form Validation**: Comprehensive validation for all product fields
- **Modern UI**: Clean, intuitive interface with smooth animations

## Product Fields

- **Name**: Product name (e.g., "Traditional Mango Pickle")
- **Category**: Product category (e.g., "Fruit Pickle", "Vegetable Pickle")
- **Description**: Detailed product description
- **Price**: Product price in INR
- **Weight**: Product weight (e.g., "500g", "1kg")
- **Spice Level**: Mild, Medium, Hot, or Extra Hot
- **Ingredients**: Comma-separated list of ingredients
- **Image URL**: Product image URL
- **In Stock**: Inventory status
- **Featured**: Whether the product should be highlighted

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage

### Creating Products
1. Click "Create Product" in the navigation
2. Fill in all required fields (marked with *)
3. Set spice level and inventory status
4. Click "Create Product" to save

### Managing Products
- **Edit**: Click the "Edit" button on any product card
- **Delete**: Click the "Delete" button (with confirmation)
- **View**: All products are displayed in an organized grid layout

### Product Categories
Common aachar categories include:
- Fruit Pickle (Mango, Lime, etc.)
- Vegetable Pickle (Mixed vegetables, Garlic, etc.)
- Citrus Pickle (Lime, Lemon, etc.)

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern features
- **ESLint** - Code linting

## Project Structure

```
src/
├── components/          # React components
│   ├── AdminPanel.tsx   # Main admin panel
│   ├── ProductList.tsx  # Product listing
│   ├── ProductCard.tsx  # Individual product cards
│   ├── ProductForm.tsx  # Create/edit form
│   └── Header.tsx       # App header
├── types/              # TypeScript type definitions
│   └── Product.ts      # Product interfaces
├── data/               # Sample data
│   └── sampleProducts.ts
└── App.tsx             # Root component
```

## Contributing

1. Follow the existing code style
2. Add proper TypeScript types
3. Include CSS for new components
4. Test thoroughly before submitting

## License

This project is for educational and demonstration purposes.