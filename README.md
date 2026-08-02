# Fashion Lab

A premium, state-of-the-art E-Commerce Product Page built for a university Software Engineering project. Fashion Lab is an exclusive women's fashion, beauty, and lifestyle drop store featuring limited stock items across various luxury categories.

## Developer

**Sadia Butt**
Software Engineering Student

## Features

- **Live Countdown Timer**: "Next Drop Ends In" countdown ticking every second. Automatic "Drop Ended" state when time expires.
- **Dynamic Live Stock System**: Items have individual stock limits ("Only X Left" or "Sold Out"). Adding items to cart immediately reserves stock and dynamically updates the UI.
- **Advanced Shopping Cart**: Slide-out offcanvas cart drawer utilizing LocalStorage for persistence across page reloads. Includes quantity modification, item removal, tax calculations, and a free premium shipping progress bar.
- **Live Search & Multi-Filters**: Instant search bar and category filtering (Garments, Cosmetics, Perfumes, Jewelry) with sorting capabilities (Newest, Price Low to High, Price High to Low, Highest Rated).
- **Product Details Modal**: Seamless Bootstrap modal showcasing a large image, full description, variant selection (sizes/shades/etc.), dynamic price/stock tracking, and "Add to Cart" functionality.
- **Persistent Wishlist**: Heart icon toggling to save items to a LocalStorage-backed wishlist, reflecting visual changes instantly on product cards and navbar counters.
- **Premium Aesthetics**: Apple-inspired luxury UI featuring glassmorphism elements, CSS variable themes (Dark Mode / Light Mode toggle), soft shadows, scroll progress bar, rounded corners, and keyframe hover animations.
- **Toast Notifications**: Interactive Bootstrap toasts for actions like adding to cart, removing items, toggling wishlist, and checkout.
- **Fully Responsive**: Mobile-first approach scaling perfectly from 320px smartphones up to 1920px+ 4K monitors using Bootstrap 5 grid systems and custom CSS.

## Tech Stack

Strict adherence to core web technologies:
- **HTML5**
- **CSS3** (Custom Properties, Flexbox, Grid, Animations)
- **Vanilla JavaScript** (ES6+)
- **Bootstrap 5** (Layout, Modal, Offcanvas, Toast, Collapse)
- **LocalStorage API**

*(No React, Vue, Angular, or external Backend dependencies)*

## Folder Structure

```
/
├── index.html            # Main application entry point
├── README.md             # Project documentation
└── assets/
    ├── css/
    │   └── style.css     # Custom UI styling and theme variables
    └── js/
        ├── products.js   # Dynamic product array database
        ├── cart.js       # LocalStorage state management logic
        └── app.js        # Core UI interactions and rendering
```

## How to Run

1. Clone or download the repository to your local machine.
2. Open the project folder.
3. Simply double-click `index.html` to open it in your default web browser (Chrome, Safari, Firefox, Edge).
4. No node modules or build processes required!

## Future Improvements

- Implementing a real backend with Node.js/Express and MongoDB for persistent multi-user cart functionality.
- Adding Stripe API for processing real credit card transactions on checkout.
- Expanding the product catalog with a dedicated API endpoint instead of a static JS array.
- Integrating a user authentication system for tracking past orders.

---

*Designed and engineered with passion for a premium user experience.*
