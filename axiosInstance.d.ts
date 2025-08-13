
import axios, { AxiosInstance } from 'axios';

// Extend the AxiosInstance type to include your custom methods
declare module 'axios' {
  export interface AxiosInstance {
    setDispatch: (dispatch: any) => void; // Define the setDispatch method
  }
}
