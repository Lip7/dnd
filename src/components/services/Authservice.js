import axios from "axios";

const baseURL = "http://localhost:8080/"


class Authservice {

    //login the user with its password
    login(user, secret) {
        return axios
            .post(baseURL + "token/", {
                user,
                secret
            })
            .then(response => {
                if(response.data.error==='invalid_client'){
                    console.log("error")
                    throw Error("Username or password is wrong, try again!")
                }else{
                    //when receiving token, save it
                    if (response.data.access_token) {
                        localStorage.setItem('user', JSON.stringify(response.data));
                    }

                    return response.data;
                }
            });
    }

    //logout the user
    logout() {
        localStorage.removeItem("user");
    }


    //signup a new user
    async register(user, secret) {
        let users = {
            user: user,
            secret: secret,
        }

        //add ne user to db
        return await axios
            .post(baseURL + "users/add/", users, {})
            .then(resp=>{
                if(resp.data.error==='User_exists'){
                    console.log("error")
                    throw Error("Username already exists, try another one.")
                }else{
                    return resp;

                }
        })

    }

    //get the current user
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));

    }
}

export default new Authservice();