import React, { useEffect, useState } from "react";
import { UidContext } from "./components/AppContext";
import Routes from "./components/Routes";
import axios from "axios";

export const App = () => {
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}jwtid`,
        withCredentials: true,
      })
        .then((res) => {
          setUid(res.data);
        })
        .catch((e) => console.log("no token"));
    };
    fetchToken();
  }, [uid]);

  return (
    <React.StrictMode>
      <UidContext.Provider value={uid}>
        <Routes />
      </UidContext.Provider>
    </React.StrictMode>
  );
};

export default App;
