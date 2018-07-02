//import {router} from '../router/index';
import axios from 'axios';

export default {

  // User object will let us check authentication status
  user: {
    authenticated: false
  },

  // Send a request to the login URL and save the returned JWT
  login(context, creds, redirect) {
      var vm = this;
    axios.post('http://localhost:3000/catalog/login', {"username": creds.username, "password": creds.password})
    .then(function(response) {
        console.log(response.data);
        var token = response.data.token;
        //localStorage.setItem('id_token', data.id_token);
        localStorage.setItem('access_token', token);
  
        vm.user.authenticated = true

        // Redirect to a specified route
        if(redirect) {
            console.log(redirect);
            //context.$router.go(redirect)
            context.$router.push(redirect);       
        }
    })
   .catch(function(error) {
     console.log(error);
   });
  },

  signup(context, creds, redirect) {
    axios.post('http://localhost:3000/catalog/createuser', this.creds)
    .then(function(response) {
        console.log(response.data);
        var token = response.data.token;
        //localStorage.setItem('id_token', data.id_token);
        localStorage.setItem('access_token', token);
  
        this.user.authenticated = true

        // Redirect to a specified route
        if(redirect) {
            this.$router.go(redirect)        
        }
    })
    .catch(function(error) {
     console.log(error);
    });
  },

  // To log out, we just need to remove the token
  logout() {
    //localStorage.removeItem('id_token')
    localStorage.removeItem('access_token')
    this.user.authenticated = false
  },

  checkAuth() {
    var jwt = localStorage.getItem('access_token')
    if(jwt) {
      this.user.authenticated = true
    }
    else {
      this.user.authenticated = false      
    }
  },

  // The object to be passed as a header for authenticated requests
  getToken() {
    var str = localStorage.getItem('access_token');
    return str
  }
}