import { useState, useEffect } from "react";
import "./App.css";
import "./index.css";
import "./style.css";

export default function App() {
    const [imageURLs, setImageURLs] = useState([]);
    const [resultURLs, setResultURLs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Setting up app...");

    useEffect(() => {
        setLoading(true);
        let interval = setInterval(async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/alive", {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                });
                if (response.status === 200) {
                    console.log("READY");
                    clearInterval(interval);
                    setLoading(false);
                    setLoadingMessage("Processing...");
                }
            } catch {
                console.log("not alive");
            }
        }, 2000);
    }, []);

    useEffect(() => {
        fetchData();
    }, [imageURLs]);

    async function fetchData() {
        if (imageURLs.length < 1) return;
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fileList: imageURLs,
            }),
        });
        if (!response.status === 201) {
            alert("ERROR");
        }
        let result = await response.json();
        setResultURLs(result.result);
        setLoading(false);
    }

    async function getDir() {
        setImageURLs([]);
        setResultURLs([]);
        let result = await api.openDialog();
        setImageURLs(result);
    }

    return (
        <>
            <div className={loading ? "App loading" : "App"}>
                <h1>DETECTING VEHICLES AND BARRIERS</h1>
                <div className="row">
                    <div className="col-sm-6">
                        <h1>Original</h1>
                        <div>
                            <button id="browse-btn" onClick={getDir}>
                                Browse
                            </button>
                        </div>

                        {imageURLs.map((imageSrc, idx) => (
                            <img key={idx} src={imageSrc} width="500" />
                        ))}
                    </div>
                    <div className="col-sm-6">
                        <h1>Analysed</h1>
                        {resultURLs.map((imageSrc, idx) => (
                            <img key={idx} src={imageSrc} width="500" />
                        ))}
                    </div>
                </div>
            </div>
            <div id="loading" style={{ display: loading ? "block" : "none" }}>
                <div className="lds-ring">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <p id="loading-message">{loadingMessage}</p>
            </div>
        </>
    );
}
