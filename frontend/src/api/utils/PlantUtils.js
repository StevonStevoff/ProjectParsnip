import { API } from "../API";

export const PlantUtils = {
    getAuthenticatedUser: async function(){
        let response = await API.getAuthenticatedUser()
        console.log(response.data.message);
        return response.data.message;
    }
}