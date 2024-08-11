import onlyfansListLocal from "@/config/onlyfans.json";
import unrelatedListLocal from "@/config/unrelated.json";

export default defineContentScript({
    matches: ["*://*.twitter.com/*", "*://*.x.com/*"],
    async main() {

        const lists = await browser.storage.local.get(["onlyfansList", "unrelatedList"]);

        let onlyfansList: string[] = lists.onlyfansList ?? [];
        let unrelatedList: string[] = lists.unrelatedList ?? [];

        if (onlyfansList.length === 0) {
            console.log("onlyfansList is empty, loading from local");
            onlyfansList = onlyfansList.concat(onlyfansListLocal);
        } else {
            console.log("onlyfansList is not empty, loading from storage");
        }

        if (unrelatedList.length === 0) {
            console.log("unrelatedList is empty, loading from local");
            unrelatedList = unrelatedList.concat(unrelatedListLocal);
        } else {
            console.log("unrelatedList is not empty, loading from storage");
        }

        console.log("onlyfansList entries: ", onlyfansList.length);
        console.log("unrelatedList entries: ", unrelatedList.length);

        const userSettings = await browser.storage.local.get(["onlyfansEnabled", "unrelatedEnabled"]);

        const onlyfansEnabled = userSettings.onlyfansEnabled ?? true;
        const unrelatedEnabled = userSettings.unrelatedEnabled ?? true;

        console.log("onlyfansEnabled: ", onlyfansEnabled);
        console.log("unrelatedEnabled: ", unrelatedEnabled);

        function increaseBlockedTweetsCount() {
            browser.storage.local.get(["blockedTweetsCount"]).then((result) => {
                const blockedTweetsCount = result.blockedTweetsCount ?? 0;
                browser.storage.local.set({ blockedTweetsCount: blockedTweetsCount + 1 });
            }).catch((error) => {
                console.log(error);
            });
        }

        const bannedUsernames = new Set([
            ...(onlyfansEnabled ? onlyfansList : []),
            ...(unrelatedEnabled ? unrelatedList : [])
        ]);

        const reactRoot = document.getElementById("react-root");

        if (reactRoot) {
            const observer = new MutationObserver((mutationsList) => {
                const nodesToProcess = new Set<Element>();

                mutationsList.forEach(mutation => {
                    if (mutation.type === "childList") {
                        mutation.addedNodes.forEach(node => {
                            if (node instanceof Element) {
                                if (node.matches("[data-testid='tweet']")) {
                                    nodesToProcess.add(node);
                                } else {
                                    node.querySelectorAll("[data-testid='tweet']").forEach(tweet => nodesToProcess.add(tweet));
                                }
                            }
                        });
                    }
                });

                nodesToProcess.forEach(processTweet);
            });

            observer.observe(reactRoot, { childList: true, subtree: true });

            reactRoot.querySelectorAll("[data-testid='tweet']").forEach(processTweet);
        }

        function processTweet(tweetElement: Element) {
            const userNameElement = tweetElement.querySelector("[data-testid='User-Name']");

            if (!userNameElement || !userNameElement.textContent) return;

            const userNameText = userNameElement.textContent.trim();
            const usernameParts = userNameText.split("@");

            if (usernameParts.length > 1) {
                const findUsername = usernameParts[1].split("·")[0].trim();
                if (bannedUsernames.has(findUsername)) {
                    increaseBlockedTweetsCount();
                    tweetElement.remove();
                }
            }
        }
    },
});
