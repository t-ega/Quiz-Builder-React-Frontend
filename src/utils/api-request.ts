import axios, { AxiosInstance, CancelToken } from "axios";
import { ENDPOINTS } from "./endpoints";
import { z } from "zod";

class ApiRequest {
  private readonly axiosInstance: AxiosInstance;
  private instance: ApiRequest;

  async get(url: string, cancelToken?: CancelToken) {
    return await this.axiosInstance.get(url, { cancelToken }).catch((err) => {
      if (axios.isCancel(err)) {
        console.log("Axios request aborted.");
      } else {
        throw err;
      }
    });
  }

  constructor() {
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    const valid = z.string().url().safeParse(baseUrl);

    if (valid.error)
      throw new Error(
        `Invalid Base URL set!. Expected a URL got ${baseUrl} instead`
      );

    this.axiosInstance = axios.create({
      baseURL: baseUrl,
    });
    this.instance = this;

    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Get the token from cookies
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        // If the token exists, add it to the Authorization header
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (
          response.config.url?.includes(ENDPOINTS.SIGNUP) ||
          response.config.url?.includes(ENDPOINTS.LOGIN)
        ) {
          const { data } = response;

          const token = data.data.token;
          const username = data.data.username;

          // Store the token in cookies
          document.cookie = `token=${token};path=/;`;
          document.cookie = `username=${username};path=/;`;
        }

        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async post(url: string, data: any) {
    const response = await this.axiosInstance.post(url, data);
    return response;
  }

  public getInstance() {
    if (!this.instance) {
      this.instance = new ApiRequest();
      return this.instance;
    }
    return this.instance;
  }

  async put(url: string, data: any) {
    return await this.axiosInstance.put(url, data);
  }

  async delete(url: string) {
    return await this.axiosInstance.delete(url);
  }

  extractApiErrors(error: any) {
    const response = error.response;
    const data = response?.data;

    if (data?.errors) return data.errors;
    if (data?.message) return data.message;

    if (error.message) return error.message;

    return error;
  }
}

export default new ApiRequest().getInstance();
