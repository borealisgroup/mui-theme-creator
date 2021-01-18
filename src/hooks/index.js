import { useEffect } from 'react';
import { useDispatch } from "react-redux"
import { themeUrl, defaultHeaders } from 'src/utils';

export const useLoadInitialTheme = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    (async () => {
      const responseRaw = await fetch(`${themeUrl}/latest`, {
        headers: {
          ...defaultHeaders
        }
      });
      const response = await responseRaw.json();
      dispatch({
        type: "UPDATE_THEME",
        themeOptions: response,
        initial: true
      })
    })()
  }, [dispatch])
}