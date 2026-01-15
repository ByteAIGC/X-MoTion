# Lynx - High-Fidelity Identity-Preserving Video Generation

A React-based academic demo page showcasing the Lynx model for high-fidelity identity-preserving video generation from single images.

## Prerequisites

Before running this project, you need to install Node.js and npm on your system.

### Installing Node.js and npm

#### Windows
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS version (recommended for most users)
3. Run the installer and follow the setup wizard
4. Verify installation by opening Command Prompt and running:
   ```cmd
   node --version
   npm --version
   ```

#### macOS
**Option 1: Direct Download**
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS version
3. Run the `.pkg` installer
4. Verify installation in Terminal:
   ```bash
   node --version
   npm --version
   ```

**Option 2: Using Homebrew** (if you have Homebrew installed)
```bash
brew install node
```

#### Linux (Ubuntu/Debian)
```bash
# Update package index
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

#### Linux (CentOS/RHEL/Fedora)
```bash
# For CentOS/RHEL
sudo yum install nodejs npm

# For Fedora
sudo dnf install nodejs npm

# Verify installation
node --version
npm --version
```

## Running the Project

1. **Clone or download this repository** to your computer

2. **Open terminal/command prompt** and navigate to the project folder:
   ```bash
   cd path/to/lynx_page
   ```

3. **Install project dependencies**:
   ```bash
   npm install
   ```
   This will download all required packages (may take a few minutes)

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **View the page**:
   - The terminal will show a URL like `http://localhost:3000`
   - Open this URL in your web browser
   - The page should load with the Lynx demo content

## Troubleshooting

- If you get permission errors on Linux/macOS, you might need to use `sudo` with the npm commands
- If port 3000 is busy, Vite will automatically use the next available port
- Make sure you're in the correct project directory when running commands
- If `npm install` fails, try deleting `node_modules` folder and `package-lock.json`, then run `npm install` again

## Building for Production

To create a production build:
```bash
npm run build
```

The built files will be in the `build/` folder, ready for deployment to any web server.