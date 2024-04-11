import { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import Login from "../../pages/Login";
const PrivateRoute = ({ component: Component, ...rest }) => {
  const [isLogged, setIsLogged] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTokenOnServer = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "https://server-mct-news.onrender.com/api/checkToken",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );
        const data = await response.json();

        console.log("Token check response:", data); // Add this line to check response
        return data?.isValid ? true : false;
      } catch (error) {
        console.error("API hatası:", error);
        return false;
      } finally {
        setLoading(false);
      }
    };

    checkTokenOnServer().then((isTokenCorrect) => {
      console.log("Is token correct:", isTokenCorrect); // Add this line to check isTokenCorrect value
      if (!isTokenCorrect) {
        localStorage.removeItem("token");
      }
      setIsLogged(isTokenCorrect);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // İsteğin tamamlanmasını beklerken bir yükleme gösterebilirsiniz.
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isLogged ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
