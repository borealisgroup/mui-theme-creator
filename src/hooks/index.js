import { useEffect } from 'react';
import { useDispatch } from "react-redux"
import { defaultThemeId, defaultHeaders } from 'src/utils';

export const useLoadInitialTheme = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    (async () => {
      const responseRaw = await fetch(`https://api.jsonbin.io/b/${defaultThemeId}/latest`, {
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