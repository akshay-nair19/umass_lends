# UMass Amherst Styling Guide

## 🎨 Color Scheme

The app now uses UMass Amherst's official colors:

### Primary Colors
- **Maroon**: `#881c1c` - Primary brand color
- **Maroon Dark**: `#6b1515` - For hover states
- **Maroon Light**: `#a02424` - For lighter accents
- **White**: `#FFFFFF` - Background and text

### Secondary Colors
- **Gray**: `#4a4a4a` - For text
- **Light Gray**: `#f5f5f5` - For backgrounds

## 📋 Tailwind Custom Colors

Custom UMass colors are available in Tailwind:

```jsx
// Maroon backgrounds
className="bg-umass-maroon"
className="bg-umass-maroonDark"
className="bg-umass-maroonLight"

// Text colors
className="text-umass-maroon"
className="text-umass-gray"

// Backgrounds
className="bg-umass-lightGray"
```

## 🎯 Components Updated

### Navbar
- Maroon background (`bg-umass-maroon`)
- White text
- Hover effects with lighter maroon

### Buttons
- Primary buttons: Maroon background
- Secondary buttons: White background with maroon border
- Hover states: Darker maroon

### Cards
- Maroon borders
- Maroon headings
- Light gray backgrounds on hover

### Forms
- Maroon focus borders
- White backgrounds
- Maroon submit buttons

### Links
- Maroon color
- Darker maroon on hover

## 🔧 Configuration

### Tailwind Config
Custom colors are defined in `tailwind.config.js`:

```javascript
colors: {
  umass: {
    maroon: '#881c1c',
    maroonDark: '#6b1515',
    maroonLight: '#a02424',
    white: '#FFFFFF',
    gray: '#4a4a4a',
    lightGray: '#f5f5f5',
  },
}
```

### Global Styles
Updated in `src/index.css`:
- Headings use maroon color
- Links use maroon color
- Body has light gray background
- Focus states use maroon

## 📝 Usage Examples

### Primary Button
```jsx
<button className="bg-umass-maroon text-white px-6 py-3 rounded-lg hover:bg-umass-maroonDark font-semibold transition-colors">
  Click Me
</button>
```

### Secondary Button
```jsx
<button className="border-2 border-umass-maroon text-umass-maroon px-6 py-3 rounded-lg hover:bg-umass-lightGray font-semibold transition-colors">
  Cancel
</button>
```

### Card
```jsx
<div className="border-2 border-umass-maroon rounded-lg p-6 hover:bg-umass-lightGray transition-all">
  <h3 className="text-umass-maroon font-bold">Title</h3>
  <p className="text-umass-gray">Description</p>
</div>
```

### Link
```jsx
<Link to="/page" className="text-umass-maroon hover:text-umass-maroonDark font-semibold transition-colors">
  Link Text
</Link>
```

## ✅ Updated Components

- ✅ Navbar
- ✅ Home Page
- ✅ Item Detail Page
- ✅ Create Item Page
- ✅ My Items Page
- ✅ Borrow Requests Page
- ✅ Dashboard
- ✅ Sign In Page
- ✅ Sign Up Page
- ✅ Item Card
- ✅ API Test Component

## 🎨 Brand Guidelines

### Typography
- Headings: Bold, maroon color
- Body text: Regular, dark gray
- Links: Medium weight, maroon

### Spacing
- Consistent padding and margins
- Rounded corners (8px border-radius)
- Shadows for depth

### Interactive Elements
- Hover states: Darker maroon
- Focus states: Maroon outline
- Transitions: Smooth color changes

## 🚀 Next Steps

The styling is now consistent with UMass Amherst branding. All primary actions use maroon, and the overall design reflects the university's visual identity.

