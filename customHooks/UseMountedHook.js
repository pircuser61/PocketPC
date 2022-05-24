import {useEffect, useRef} from 'react';

const useIsMounted = () => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      console.log('\x1b[1;31m', 'MOUNT OFF!!!!!');
      isMounted.current = false;
    };
  }, []);
  // return useCallback(() => isMounted.current, [])
  return isMounted;
};

export default useIsMounted;
