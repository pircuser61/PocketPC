import React, {Component, useEffect, useRef, useState} from 'react';
import { checkGtin } from '../functions/checkGtin';
import { toUTF8Array } from '../functions/checkTypes';
import {PocketBarcodInfo} from '../functions/PocketBarcodInfo';

const menuApi = (props) => {
    let mounted = true;
  
    const [shopListTrigger, setShopListTrigger] = useState(false)
    
  

  
    useEffect(() => {
        
        setTimeout(() => {
            mounted&&console.log('TIME');
        }, 1000);
      
      return () => {
        mounted = false
      }
    }, [shopListTrigger])
  
    return {
      setShopListTrigger,
      shopListTrigger
    }
  }
  

  export default menuApi