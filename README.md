# Videos-Hooks

A modern React course project that demonstrates advanced React concepts using custom hooks, context, and functional components. This app allows users to search for YouTube videos and view details, leveraging the YouTube Data API v3.

![App Screenshot](https://user-images.githubusercontent.com/2746541/141409388-38f8ae9a-cd15-4d40-95ca-88c6e17f4952.png)

## Features

- Search for YouTube videos
- View video details and descriptions
- Custom React hooks for data fetching and caching
- Error boundaries and robust error handling
- Modern React patterns (hooks, context, prop-types)
- 80%+ test coverage with React Testing Library

## Getting Started

### Prerequisites

- Node.js v16 (recommended for compatibility)
- Yarn or npm

### Installation

1. **Clone the repository:**

   ```sh
   git clone <your-repo-url>
   cd videos-hooks
   ```

2. **Install dependencies:**

   ```sh
   yarn install
   # or
   npm install
   ```

### Setup API Keys

This project uses the YouTube Data API v3. You must provide your own API key:

1. [Get a YouTube Data API key](https://console.developers.google.com/apis/library/youtube.googleapis.com)
2. Create a `.env` file in the project root with the following content:

   ```env
   REACT_APP_YT_API_KEY=your_youtube_api_key_here
   REACT_APP_BASEURL=https://www.googleapis.com/youtube/v3
   ```

### Running the App Locally

```sh
# Start the development server
yarn start
# or
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Running Tests

```sh
yarn test --coverage
# or
npm test -- --coverage
```

## License

MIT

## Credits

Modern React Course

[Example App](https://videos-hooks-pearl.vercel.app/)
