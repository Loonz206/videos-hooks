export default {
  key: import.meta.env.VITE_YT_API_KEY || 'test-key',
  baseUrl:
    import.meta.env.VITE_BASEURL || 'https://www.googleapis.com/youtube/v3',
};
