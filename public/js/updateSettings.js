/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';


const baseUrl = 'http://localhost:3000';
const api = '/api/v1';


export const updateSettings = async (data, type) =>{
    try {
      console.log(data, type)
      const res = await axios(
        {
          method: 'PATCH',
          url: type === 'password' ?  `${baseUrl}${api}/users/updateMyPassword` : `${baseUrl}${api}/users/updateMe`,
          data: data,
        }
      );
      console.log(res)

          if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully!`);
          }
    } catch (error) {
      console.log(error)
        showAlert("error", error.response.data.message)
    }
};