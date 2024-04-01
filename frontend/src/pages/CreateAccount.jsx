import '../App.css'
import { useEffect } from 'react';
import CreateAccountForm from '../components/CreateAccountForm';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const CreateAccount = () => {

    const navigate = useNavigate();

    useEffect(()=>{
      if(Cookies.get("token")){
        navigate("/home");
      }
    },[])
  return (
    <>
      <div id='loginBody'>
        <CreateAccountForm />
      </div>
    </>
  )
}

export default CreateAccount