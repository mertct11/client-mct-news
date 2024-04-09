import React, { useState } from "react";
import "./create.css";
const Create = () => {
  const [twitUrl, setTwitUrl] = useState("");
  const [twitText, setTwitText] = useState("");
  const [paraphraseTwitText, setParaphraseTwitText] = useState("");
  const [errorText, setErrorText] = useState();
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const twitUrlValidation = () => {
    const regex = /^(https:\/\/(x\.com|twitter\.com)\/[^\/]+\/status\/[^\/]+)$/;

    if (regex.test(twitUrl)) {
      return true;
    } else {
      return false;
    }
  };

  const handleTextReadingTwitChange = (val) => {
    setErrorText();
    setTwitText(val);
  };
  const handleReadingTwitChange = (val) => {
    setErrorText();
    setTwitUrl(val);
  };

  const handleReadTwit = async () => {
    if (!twitUrlValidation()) {
      setErrorText("twit url si düzgün değil");
    } else {
      console.log(twitUrl);

      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "https://server-mct-news.onrender.com/api/readTweet",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: token,
            },
            body: JSON.stringify({ twitUrl }),
          }
        );
        const data = await response.json();

        console.log({ data });
      } catch (error) {
        console.error("API hatası:", error);
      }
    }
  };

  const handleTextTwitReadingChange = async (val) => {
    setParaphraseTwitText(val);
  };

  const handleTextReadTwit = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://server-mct-news.onrender.com/api/readTextTweet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({ twitText: twitText }),
        }
      );
      const data = await response.json();

      console.log(data);
      if (data) {
        setParaphraseTwitText(data?.twitText);
      } else {
        setTwitText("");
      }
    } catch (error) {
      console.error("API hatası:", error);
    }
  };

  const handleMakeTweet = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://server-mct-news.onrender.com/api/makeTweet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({ tweet: paraphraseTwitText }),
        }
      );
      const data = await response.json();

      if (data?.isSuccess) {
        setErrorText("TWEEET BASARIYLA GONDERILDI");
      } else {
        setErrorText("TWEEET GÖNDERİLEMEDİ");
      }
      setTimeout(() => {
        setErrorText();
      }, 3000);
    } catch (error) {
      console.error("API hatası:", error);
    }
  };

  return (
    <div>
      <header className="create-header">
        <h2 className="brand-text">Create a new TWEET</h2>
        <div
          onClick={() => {
            handleLogout();
          }}
          className="log-out-button"
        >
          Log out
        </div>
      </header>
      <div>
        <h3>Read a tweet</h3>
        <div className="read-tweet">
          <div>
            <h4>with url</h4>
            <input
              disabled={true}
              value={twitUrl}
              onChange={(e) => {
                //handleReadingTwitChange(e.target.value);
              }}
            />
            {errorText && <label className="error-text">{errorText}</label>}
            <button
              onClick={() => {
                handleReadTwit();
              }}
              disabled={!(twitUrl.length > 0)}
            >
              Read a Tweet
            </button>
          </div>
          <div className="with-url">
            <h4>text url</h4>
            <div className="inputs">
              <textarea
                value={twitText}
                onChange={(e) => {
                  handleTextReadingTwitChange(e.target.value);
                }}
              />
              {/* {errorText && <label className="error-text">{errorText}</label>} */}
              <button
                onClick={() => {
                  handleTextReadTwit();
                }}
                disabled={!(twitText.length > 0)}
              >
                write a Tweet for read
              </button>
              <div className="space-line" />
              <textarea
                value={paraphraseTwitText}
                onChange={(e) => {
                  handleTextTwitReadingChange(e.target.value);
                }}
              />
              ///FEATURE ! upload photo
              {/* {errorText && <label className="error-text">{errorText}</label>} */}
              <button
                onClick={() => {
                  handleMakeTweet();
                }}
                disabled={!(paraphraseTwitText.length > 0)}
              >
                send TWEET as paraphrased Text
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
