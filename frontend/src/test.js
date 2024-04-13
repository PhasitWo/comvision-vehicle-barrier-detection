async function test() {
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
                console.log("READY")
                clearInterval(interval)
            }
        } catch {
            console.log("not alive");
        }
    }, 2000);

    // console.log(response.result)
}

test();
