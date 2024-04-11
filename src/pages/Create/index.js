import React, { useState } from "react";
import "./create.css";
import { Input, Button, Checkbox } from "antd";
const Create = () => {
  const { TextArea } = Input;

  const [isParaphrasingButtonLoading, setIsParaphrasingButtonLoading] =
    useState(false);
  const [isSendingTweetLoading, setIsSendingTweetLoading] = useState(false);
  const [choosenTextId, setChoosenTextId] = useState("");
  const [choosenText, setChoosenText] = useState("");
  const [twitUrl, setTwitUrl] = useState("");
  const [twitText, setTwitText] = useState("");
  const [paraphraseTwitTexts, setParaphraseTwitTexts] = useState("");
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
        const response = await fetch("http://localhost:4000/api/readTweet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
          body: JSON.stringify({ twitUrl }),
        });
        const data = await response.json();

        console.log({ data });
      } catch (error) {
        console.error("API hatası:", error);
      }
    }
  };

  const handleTextTwitReadingChange = async (val, key) => {
    let tmpArr = paraphraseTwitTexts;
    tmpArr[key] = val;
    setParaphraseTwitTexts(tmpArr);
    console.log(tmpArr);
    setChoosenText(val);
  };

  const handleTextReadTwit = async () => {
    setIsParaphrasingButtonLoading(true);
    setParaphraseTwitTexts();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:4000/api/readTextTweet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({ twitText: twitText }),
      });
      const data = await response.json();

      console.log(data);
      if (data && data?.twitTextArr?.length > 0) {
        setParaphraseTwitTexts(data?.twitTextArr);
      } else {
        setTwitText("");
      }
    } catch (error) {
      console.error("API hatası:", error);
    } finally {
      setIsParaphrasingButtonLoading(false);
    }
  };

  const handleMakeTweet = async () => {
    setIsSendingTweetLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:4000/api/makeTweet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify({ tweet: choosenText }),
      });
      const data = await response.json();

      if (data?.isSuccess) {
        setErrorText("TWEEET BASARIYLA GONDERILDI, sayfa yenileniyor");
      } else {
        setErrorText("TWEEET GÖNDERİLEMEDİ");
      }
      setTimeout(() => {
        setErrorText();
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("API hatası:", error);
    } finally {
      setIsSendingTweetLoading(false);
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
        <h3 style={{ textAlign: "center" }}>Read a tweet</h3>
        <div className="read-tweet">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <h4>with url</h4>
            <Input
              disabled={true}
              value={twitUrl}
              onChange={(e) => {
                //handleReadingTwitChange(e.target.value);
              }}
              type="text"
              placeholder="Enter a tweet url"
            />
            <Button
              style={{ alignSelf: "center" }}
              onClick={() => {
                handleReadTwit();
              }}
              disabled={!(twitUrl?.length > 0)}
              type="primary"
            >
              Read a tweet
            </Button>
          </div>
          <div className="with-url">
            <h4>with giving text</h4>
            <div className="inputs">
              <TextArea
                value={twitText}
                onChange={(e) => {
                  handleTextReadingTwitChange(e.target.value);
                }}
              />
              {/* {errorText && <label className="error-text">{errorText}</label>} */}
              <Button
                onClick={() => {
                  handleTextReadTwit();
                }}
                disabled={!(twitText?.length > 0)}
                type="primary"
                loading={isParaphrasingButtonLoading}
              >
                write a Tweet for read
              </Button>
              <div className="space-line" />
              <h4>Result below</h4>
              {paraphraseTwitTexts?.length > 0 &&
                paraphraseTwitTexts?.map((pTwitText, key) => {
                  return (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        marginBottom: 20,
                      }}
                    >
                      <Checkbox
                        checked={choosenTextId === key}
                        onChange={() => {
                          setChoosenTextId(key);
                          setChoosenText(pTwitText);
                        }}
                      >
                        <TextArea
                          disabled={key !== choosenTextId}
                          value={pTwitText}
                          onChange={(e) => {
                            console.log("sd", e.target.value);
                            handleTextTwitReadingChange(e.target.value, key);
                          }}
                        />
                      </Checkbox>
                    </div>
                  );
                })}
              ///FEATURE ! upload photo
              {/* {errorText && <label className="error-text">{errorText}</label>} */}
              <Button
                onClick={() => {
                  handleMakeTweet();
                }}
                disabled={!(choosenText?.length > 0)}
                type="primary"
                loading={isSendingTweetLoading}
              >
                send TWEET as paraphrased Text
              </Button>
              {errorText && <label className="error-text">{errorText}</label>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
