# Lynx Apartment Admin Panel

A comprehensive admin panel for managing content on the Lynx Apartment website. This system allows you to add new house rules and instructions without manually editing HTML files.

## Features

- 🔐 **Secure Login**: Protected with username and password authentication
- 🏠 **House Rules Management**: Add new house rules with various types (simple, time-based, guest-based)
- 📋 **Instructions Management**: Add new instructions with images, videos, and detailed steps
- 🎨 **Consistent Styling**: Automatically matches the existing website design
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 💾 **Content Generation**: Provides HTML code for manual insertion or automatic injection

## Setup and Installation

### Option 1: Server-Side Setup (Recommended)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

3. **Access the Admin Panel**
   - Open your browser and go to: `http://localhost:3000/admin.html`
   - Login with:
     - Username: `Zoki`
     - Password: `Zoki2107!`

### Option 2: Client-Side Only

1. **Open the Admin Panel**
   - Open `admin.html` directly in your browser
   - Login with the same credentials

2. **Manual Content Integration**
   - The system will generate HTML code
   - Copy and paste it into the appropriate files manually

## How to Use

### Adding House Rules

1. **Login** to the admin panel
2. **Select "House Rules"** from the page dropdown
3. **Fill out the form**:
   - **Icon**: Choose an emoji (e.g., 🏠, 🚭, 🎉)
   - **Rule Title**: Enter the rule name
   - **Description**: Add a detailed description
   - **Status**: Select "Allowed" or "Not Allowed"
   - **Status Text**: Optional text for the status chip (e.g., "Yes", "No", "3")
   - **Rule Type**: Choose between:
     - **Simple Rule**: Basic rule with icon, title, and description
     - **Time-based Rule**: Includes start and end times
     - **Guest-based Rule**: Includes maximum guest count

4. **Submit** the form
5. **Copy or Download** the generated HTML code

### Adding Instructions

1. **Login** to the admin panel
2. **Select "Instructions"** from the page dropdown
3. **Fill out the form**:
   - **Icon**: Choose an emoji (e.g., 🛠️, 🗑️, 💧)
   - **Title**: Enter the instruction title
   - **Images**: Upload multiple images for the carousel
   - **Video**: Upload an optional video guide
   - **Detailed Instructions**: Write step-by-step instructions

4. **Submit** the form
5. **Copy or Download** the generated HTML code

## Authentication

- **Username**: `Zoki`
- **Password**: `Zoki2107!`

## File Structure

```
├── admin.html                 # Main admin panel interface
├── admin-content-manager.js   # Content management logic
├── admin-server.js           # Server-side API (optional)
├── package.json              # Dependencies
└── README.md                 # This file
```

## Generated Content

### House Rules

The system generates HTML that matches the existing house rules structure:

```html
<article class="rule-section">
  <div class="rule-item">
    <div class="rule-header">
      <span class="rule-icon">🏠</span>
      <span class="rule-label">New Rule</span>
      <span class="status-chip allowed">Yes</span>
    </div>
    <div class="rule-content">
      <p class="rule-desc">Description here</p>
    </div>
  </div>
</article>
```

### Instructions

The system generates HTML that matches the existing instructions structure:

```html
<div class="card">
  <div class="card-title">🛠️ New Instruction</div>
  <div class="carousel">
    <!-- Images carousel -->
  </div>
  <div class="dropdown-container">
    <!-- Expandable detailed instructions -->
  </div>
</div>
```

## Manual Integration

If using the client-side only version:

### For House Rules
1. Open `house-rules.html` in a text editor
2. Find the line: `<details class="additional-rules">`
3. Insert the generated HTML **before** that line
4. Save the file

### For Instructions
1. Open `Instructions.html` in a text editor
2. Find the line: `<div class="disclaimer-section">`
3. Insert the generated HTML **before** that line
4. Save the file

## Server-Side Features

When using the server setup, the system provides:

- **Automatic File Injection**: New content is automatically added to the HTML files
- **File Upload Handling**: Images and videos are processed and stored
- **Real-time Updates**: Changes appear immediately on the website
- **Error Handling**: Better error messages and recovery

## Security

- The admin panel is not linked from the main website
- Access requires authentication
- The panel is designed to be accessed only by authorized users
- File operations are limited to the designated HTML files

## Troubleshooting

### Common Issues

1. **Login Not Working**
   - Check that you're using the correct credentials
   - Ensure JavaScript is enabled in your browser

2. **Content Not Appearing**
   - If using server mode, ensure the server is running
   - Check that the HTML files are writable
   - Verify the injection points exist in the target files

3. **Images Not Displaying**
   - Ensure images are uploaded to the `public/` directory
   - Check file permissions and paths

## Customization

### Adding New Rule Types

To add new rule types, modify the `generateHouseRuleHTML` function in `admin-content-manager.js`.

### Changing Styling

The admin panel uses the same CSS variables as the main website for consistency. Modify the CSS in `admin.html` to change the appearance.

### Adding New Content Types

To add support for other pages:

1. Update the dropdown options in `admin.html`
2. Add new generation functions in `admin-content-manager.js`
3. Add corresponding server endpoints in `admin-server.js`

## Support

For issues or questions about the admin panel, contact the developer or refer to the main website codebase for context on the existing structure and styling.

## License

This admin panel is part of the Lynx Apartment website system and follows the same licensing terms.