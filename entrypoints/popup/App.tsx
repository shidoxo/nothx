import githubIcon from "@/assets/github.svg";
import twitterIcon from "@/assets/twitter.svg";

import { useState, useEffect } from "react";

function App() {
    
    const [onlyfansEnabled, setOnlyfansEnabled] = useState(true);
    const [unrelatedEnabled, setUnrelatedEnabled] = useState(true);
    const [blockedTweetsCount, setBlockedTweetsCount] = useState(0);

    useEffect(() => {
        browser.storage.local.get(["onlyfansEnabled", "unrelatedEnabled", "blockedTweetsCount"]).then((result) => {
            if (result.onlyfansEnabled !== undefined) {
                setOnlyfansEnabled(result.onlyfansEnabled);
            }
            if (result.unrelatedEnabled !== undefined) {
                setUnrelatedEnabled(result.unrelatedEnabled);
            }
            if (result.blockedTweetsCount !== undefined) {
                setBlockedTweetsCount(result.blockedTweetsCount);
            }
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    const handleOnlyfansChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOnlyfansEnabled(event.target.checked);
        browser.storage.local.set({ onlyfansEnabled: event.target.checked });
    };

    const handleUnrelatedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUnrelatedEnabled(event.target.checked);
        browser.storage.local.set({ unrelatedEnabled: event.target.checked });
    };

    return (
        <>
            <div className="flex flex-col items-center p-6 w-56 h-72 text-center bg-black text-white">
                <div className="flex flex-col justify-center gap-2 my-auto">
                    <h2 className="text-xl font-bold self-center">Hide</h2>
                    <div className="flex items-center">
                        <input type="checkbox" className="w-4 h-4" checked={onlyfansEnabled} onChange={handleOnlyfansChange} />
                        <span className="ml-2 text-lg">Onlyfans</span>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" className="w-4 h-4" checked={unrelatedEnabled} onChange={handleUnrelatedChange} />
                        <span className="ml-2 text-lg">Unrelated</span>
                    </div>
                </div>
                <div className="flex flex-col items-center mt-auto">
                    <span className="text-lg font-bold">Blocked Tweets</span>
                    <span className="text-lg">{blockedTweetsCount}</span>
                </div>
            </div>
            <div className="flex items-center gap-2 w-full bg-black border-t-2 text-white p-2">
                <span className="font-bold">NOTHX</span>
                <div className="flex items-center gap-2 ml-auto">
                    <a href="https://x.com/shidoxo" target="_blank" rel="noreferrer">
                        <img src={twitterIcon} alt="Twitter" className="w-6 h-6" />
                    </a>
                    <a href="https://github.com/shidoxo/nothx" target="_blank" rel="noreferrer">
                        <img src={githubIcon} alt="GitHub" className="w-6 h-6" />
                    </a>
                </div>
            </div>
        </>
    );
}

export default App;
