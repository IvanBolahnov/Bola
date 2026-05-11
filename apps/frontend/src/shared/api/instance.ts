import axios from "axios"
import { env } from "@/shared/config/env"

export const apiInstance = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})
