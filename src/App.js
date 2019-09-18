/*jshint esversion: 9 */
import React from 'react';
import Main from './SiteParts/Main/Main';
// import { ReactComponent as planeIcon} from './plane.svg';
import './App.css';

const profile = {
  email:"bushcraftparsons@gmail.com",
  getEmail:function(){return "bushcraftparsons@gmail.com";}
};

function App() {
  console.log("React app root:" + process.env.REACT_APP_GO_SERVER);
  if(process.env.NODE_ENV==="development"){
    sessionStorage.setItem(`jwtToken`,`eyJhbGciOiJSUzI1NiIsImtpZCI6IjJiZjg0MThiMjk2M2YzNjZmNWZlZmRkMTI3YjJjZWUwN2M4ODdlNjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiOTQ4MDgyMDUzMDQwLXIxdGVhZDQ4Z2tzdXE5MDJtMWc0Zm80cnNrNXFqMXR1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiOTQ4MDgyMDUzMDQwLXIxdGVhZDQ4Z2tzdXE5MDJtMWc0Zm80cnNrNXFqMXR1LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTExMjM4Mzg5MDI1MDgzNDg2ODI3IiwiZW1haWwiOiJidXNoY3JhZnRwYXJzb25zQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoibWE1UWQ3ZnZyMkppam13OW5QR1o4ZyIsIm5hbWUiOiJTdXNhbm5haCBQYXJzb25zIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BQXVFN21CWDc0bFRWcXBnUXh0UDN6MHhpUDhJU052d0ZWOXRwY1BuTVdTVj1zOTYtYyIsImdpdmVuX25hbWUiOiJTdXNhbm5haCIsImZhbWlseV9uYW1lIjoiUGFyc29ucyIsImxvY2FsZSI6ImVuLUdCIiwiaWF0IjoxNTY4NzgzMTA0LCJleHAiOjE1Njg3ODY3MDQsImp0aSI6IjczNzdlNDA3YzRhODBkNmQ2NDMwNjcxNGZlZDdkNmNkYTRiYmIxMzQifQ.CJSYtmBwgRZ_5dL3T9RQM3C7gKFbcmvW0nb08EbVVpEjoKX1EPBO2cJNFBV--NMbYWJGgSlNYAZAMAr1I73GpDfyULrmjLONynlpFlbpuZusPqNnEU10I68S0xDPmzIhzk07zYJkoAk1uY7S83TxHjky8gyI9KCIXPTa31zVMFBe-MkCBliCP-2qEqmnNMe693DrICoe9TSGzAw7Uwk166y4zDxavZv4yBlfKmDYZWfXMhwChG5pJ43tajBW23RnXvrP9OXsevRapLtxk_DaaXDbrDkP46maN2uwbU5PfqIcjKeemBrCmDgUyF-Fsg0Q_Gl-KSNhLA6FRrpEiCI1xQ`);
    sessionStorage.setItem(`user`,JSON.stringify(profile));
  }
  return (<Main/>);
}

export default App;
