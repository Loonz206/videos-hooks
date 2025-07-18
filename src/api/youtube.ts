import axios from "axios";
import config from "../config";

export default axios.create({
  baseURL: config.baseUrl,
  params: {
    part: "snippet",
    type: "video",
    maxResults: 5,
    key: config.key,
  },
});
