# Cross-Tab Collaboration Dashboard

A real-time collaboration dashboard that synchronizes user activity across multiple browser tabs using the `react-broadcast-sync` library. This application demonstrates advanced React patterns, real-time communication, and modern UI design with comprehensive optimizations.

## 🚀 Features

### Core Functionality ✅
- **Cross-Tab Synchronization**: Real-time communication between browser tabs
- **User Presence System**: Live user detection with activity timestamps and status indicators
- **Shared Counter**: Synchronized counter with user attribution and timestamps
- **Real-time Chat**: Message synchronization with typing indicators and expiration
- **Message Management**: Users can delete their own messages
- **Message Expiration**: Messages can be set to expire automatically (1-3600 seconds)
- **State Synchronization**: Existing state is rehydrated on page load

### Advanced Features ✨
- **Optimized Performance**: React.memo, useCallback, and useMemo optimizations
- **Type Safety**: Comprehensive TypeScript with strict type checking and descriptive interface names
- **Error Boundaries**: Graceful error handling with recovery options
- **Responsive Design**: Mobile-friendly layout with Material-UI
- **Activity Tracking**: Real-time user activity with visual status indicators
- **User Avatars**: Generated initials-based avatars
- **Modern UI**: Clean Material-UI components with smooth animations
- **Named Exports**: Components use named exports for better tree-shaking
- **Improved Styling**: Updated counter styling with wheat background and cleaner chat message display

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with React 19
- **Styling**: Material-UI (MUI) v7 with custom theming
- **Cross-tab Communication**: react-broadcast-sync
- **TypeScript**: Full type safety with strict configuration
- **Date Handling**: Day.js with relative time formatting
- **Icons**: Material Icons
- **State Management**: React hooks with optimized patterns

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collaboration-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Open additional tabs/windows to test cross-tab synchronization

### Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run analyze      # Analyze bundle size
```

## 🏗️ Project Structure

```
collaboration-dashboard/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with fonts
│   ├── page.tsx                 # Main page component
│   └── globals.css              # Global styles
├── src/
│   ├── components/              # React components
│   │   ├── Chat.tsx            # Real-time chat component
│   │   ├── Counter.tsx         # CollaborativeCounter component
│   │   ├── Dashboard.tsx       # Main dashboard layout
│   │   ├── UsersList.tsx       # User presence list
│   │   └── ErrorBoundary.tsx   # Error handling component
│   ├── hooks/                   # Custom React hooks
│   │   └── useCollaborativeSession.ts  # Main collaboration logic
│   ├── lib/                     # Utilities and types
│   │   ├── types.ts            # TypeScript definitions with updated interfaces
│   │   └── utils.ts            # Utility functions
│   └── styles/                  # Additional styles
├── public/                      # Static assets
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## 🎯 How to Use

### 1. Opening Multiple Tabs
- Open the application in multiple browser tabs
- Each tab will appear as a separate user in the "Active Users" panel
- Users are automatically assigned unique names (e.g., "User 123")

### 2. Testing Counter Synchronization
- Click the **+** or **-** buttons in any tab
- Watch the counter update in real-time across all tabs
- The "Last updated by" field shows which user made the change
- The timestamp shows when the last update occurred

### 3. Testing Chat Synchronization
- Type a message in the chat input field
- Set an expiration time (optional, in seconds)
- Press **Enter** or click the send button
- Messages appear in all tabs instantly
- Typing indicators show when other users are typing
- Messages with expiration show countdown timers
- Delete your own messages using the delete button

### 4. User Presence Features
- **Green dot**: User active within last 5 seconds
- **Yellow dot**: User active within last minute
- **Gray dot**: User inactive for more than a minute
- **Typing indicator**: Shows when users are typing
- Users automatically disappear when tabs are closed

### 5. Message Expiration
- Set expiration time (1-3600 seconds) before sending
- Expired messages show "Message has expired" with warning icon
- Expiration countdown shows remaining time
- Messages are automatically cleaned up

## 🔧 Configuration

### TypeScript Configuration

The project uses strict TypeScript configuration with:
- `noUnusedLocals` and `noUnusedParameters`
- `exactOptionalPropertyTypes`
- `noImplicitReturns`
- `noUncheckedIndexedAccess`

## 🚀 Production Deployment

### Build Process

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

### Deployment Platforms

**Recommended**: Vercel (optimized for Next.js)
```bash
npm install -g vercel
vercel --prod
```

**Other options**:
- Netlify
- AWS Amplify
- Railway
- Any Node.js hosting service

### Performance Optimizations

The application includes several optimizations:
- **Bundle splitting**: Vendor and MUI chunks separated
- **Tree shaking**: Unused code elimination
- **Console removal**: Production builds remove console statements
- **Memoization**: Components optimized with React.memo
- **Code splitting**: Lazy loading where applicable

## 🧪 Testing Cross-Tab Synchronization

### Test Scenarios

1. **Basic Synchronization**
   - Open 3-4 tabs
   - Verify all users appear in the user list
   - Test counter increments/decrements
   - Send messages from different tabs

2. **User Presence**
   - Close a tab and verify user disappears
   - Open a new tab and verify new user appears
   - Test typing indicators across tabs

3. **Message Features**
   - Test message expiration with different timeouts
   - Verify message deletion works correctly
   - Test typing indicators and their timeout

4. **Error Handling**
   - Test with browser dev tools closed
   - Test with slow network conditions
   - Verify error boundaries work correctly

## 🐛 Troubleshooting

### Common Issues

1. **Cross-tab sync not working**
   - Ensure all tabs are from the same origin (localhost:3000)
   - Check browser console for errors
   - Verify `react-broadcast-sync` is properly installed
   - Try refreshing all tabs

2. **Users not appearing**
   - Check if sessionStorage is enabled in browser
   - Verify the presence ping interval is working
   - Look for JavaScript errors in console
   - Ensure tabs are from the same origin

3. **Messages not syncing**
   - Check broadcast channel connectivity
   - Verify message cleanup intervals are running
   - Look for TypeScript errors in console
   - Test with browser dev tools open

4. **Performance issues**
   - Check for memory leaks in browser dev tools
   - Verify cleanup functions are working
   - Monitor console for excessive re-renders
   - Test with fewer tabs open

### Browser Compatibility

- **Chrome**: Full support ✅
- **Firefox**: Full support ✅
- **Safari**: Full support ✅
- **Edge**: Full support ✅

**Note**: Requires modern browsers with BroadcastChannel API support.

## 📝 Technical Implementation

### Architecture Overview

The application uses a centralized hook pattern (`useCollaborativeSession`) that manages:
- **Broadcast Channel**: Cross-tab communication via `react-broadcast-sync`
- **State Management**: Users, messages, counter, and typing states
- **Event Handling**: User actions, typing indicators, and cleanup
- **Error Handling**: Comprehensive error boundaries and recovery

### Communication Protocol

The application uses structured broadcast messages with TypeScript enums and updated interface names:

### Performance Optimizations

- **React.memo**: All components memoized to prevent unnecessary re-renders
- **useCallback**: Event handlers memoized for stable references
- **useMemo**: Expensive computations cached
- **Bundle optimization**: Webpack configuration for optimal loading
- **Type safety**: Strict TypeScript prevents runtime errors

## 🙏 Acknowledgments

- [react-broadcast-sync](https://www.npmjs.com/package/react-broadcast-sync) for cross-tab communication
- [Material-UI](https://mui.com/) for the component library
- [Next.js](https://nextjs.org/) for the React framework
- [Day.js](https://day.js.org/) for date manipulation
