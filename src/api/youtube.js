import axios from "axios";
import { key, baseUrl } from "../config";

export default axios.create({
  baseURL: baseUrl,
  params: {
    part: "snippet",
    type: "video",
    maxResults: 5,
    key: key
  }
});
