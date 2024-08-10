import React, {useCallback, useState, useEffect} from 'react'
import {Navigate} from "react-router-dom"
import { SiTicktick } from "react-icons/si";


export const ReturnPage = () => {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');
  
    useEffect(() => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const sessionId = urlParams.get('session_id');
  
      fetch(`https://resteraunt-app-server.onrender.com/session-status?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setStatus(data.status);
          setCustomerEmail(data.customer_email);
        });
    }, []);
    if (status === 'open') {
        return (
          <Navigate to="/checkout" />
        )
      }
    
      if (status === 'complete') {
        return (
          <section id="success">
            <div className='flex w-full justify-center h-[99vh] items-center'>
              <div className='flex justify-center items-center flex-col w-[50%] space-y-2'>
                <h1 className='text-3xl font-semibold'>Restaurant</h1>
              <p className='text-center text-xl '>
              We appreciate you patronizing us! A confirmation email will be sent to {customerEmail}.
    
              If you have any questions, please email <a href="mailto:orders@example.com">team-23@gmail.com</a>.
              </p>
              <SiTicktick className='text-5xl text-emerald-600'/>
              </div>
            </div>
          
          </section>
        )
      }
    
      return null;
}
