/*jshint esversion: 9 */
import React from 'react';
import Homepage from './SiteParts/Main/Homepage';
import Login from './SiteParts/Signin/Login';
// import { ReactComponent as planeIcon} from './plane.svg';
import './App.css';

const profile = {
  email:"bushcraftparsons@gmail.com",
  getEmail:function(){return "bushcraftparsons@gmail.com";}
};

function App() {
  console.log("React app root:" + process.env.REACT_APP_GO_SERVER);
  if(process.env.NODE_ENV==="development"){
    sessionStorage.setItem(`jwtToken`,`eyJhbGciOiJSUzI1NiIsImtpZCI6IjJiZjg0MThiMjk2M2YzNjZmNWZlZmRkMTI3YjJjZWUwN2M4ODdlNjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiOTQ4MDgyMDUzMDQwLXIxdGVhZDQ4Z2tzdXE5MDJtMWc0Zm80cnNrNXFqMXR1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiOTQ4MDgyMDUzMDQwLXIxdGVhZDQ4Z2tzdXE5MDJtMWc0Zm80cnNrNXFqMXR1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTExMjM4Mzg5MDI1MDgzNDg2ODI3IiwiZW1haWwiOiJidXNoY3JhZnRwYXJzb25zQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoic1FaTkdYZDMyc1ZnR2tSWFVVTjkydyIsIm5hbWUiOiJTdXNhbm5haCBQYXJzb25zIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BQXVFN21CWDc0bFRWcXBnUXh0UDN6MHhpUDhJU052d0ZWOXRwY1BuTVdTVj1zOTYtYyIsImdpdmVuX25hbWUiOiJTdXNhbm5haCIsImZhbWlseV9uYW1lIjoiUGFyc29ucyIsImxvY2FsZSI6ImVuLUdCIiwiaWF0IjoxNTY4NjQ3OTA1LCJleHAiOjE1Njg2NTE1MDUsImp0aSI6IjY3YzQxZGI1MDA5ZWM2NjRhYTZlYzljZjQ0MDRmNmJmNzZiMTUyYjMifQ.FlpfiqecnZnEIUbiYR-kKUQ7K3EPRpE3T9sCW1Zk49pjjyGn1Quwp_20ALrsRaZLWREb4Ts2ouxG-77eiU_LOc16s7ma9NaOzVWRQRMLXdcN5w3qZ9syqWDf-vYj4cSIyup91ytajpTKrVmC0uEq5TFdLZVrHuj5UjowSOCESMydq16VzMVk1jhQnnGWsrk2VrZin1RHQzhpRLLJN2LJjfJXLUp4XSgk1UFaANHhdPtM8t1rT9kUEm4XFSkvE0z-HL84kIt1pDodcv4nADnx7zqzeAKXFvbIy5RIy8kfbU0tsc6vwah88jmyLVf0o5GZgPSpZauL3mnmRo6TcGqD0g`);
    sessionStorage.setItem(`user`,JSON.stringify(profile));
  }
  if(sessionStorage.getItem('jwtToken') !== null){
    let user = JSON.parse(sessionStorage.getItem('user'));
      let obj = {  
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization':sessionStorage.getItem('jwtToken')
        },
        body: JSON.stringify({
          'email': user.email
        })
      }
      fetch(process.env.REACT_APP_GO_SERVER + '/login', obj)
          .then(response => console.log(response))
          .then((data) => {
            console.log(data)
            if (!data.error && data.status) {
              return <Homepage/>
            }
          })
          .catch(error => {
            console.log({ error, isLoading: false });
          });
  }
  sessionStorage.removeItem(`jwtToken`);
  sessionStorage.removeItem(`user`);
  return <Login/>;
}

export default App;
