export default defineBackground(() => {
    loadData().then(() => {
        console.log("Data loaded");
    });
});

async function loadData() {
    async function fetchOnlyfansList() {
        const response = await fetch(
            "https://raw.githubusercontent.com/michalzarsm/nothx/main/config/onlyfans.json"
        );
        const onlyfansList: string[] = await response.json().catch((error) => {
            console.log(error);
        });
        return onlyfansList;
    }

    async function fetchUnrelatedList() {
        const response = await fetch(
            "https://raw.githubusercontent.com/michalzarsm/nothx/main/config/unrelated.json"
        );
        const unrelatedList: string[] = await response.json().catch((error) => {
            console.log(error);
        });
        return unrelatedList;
    }

    const onlyfansList = await fetchOnlyfansList();
    const unrelatedList = await fetchUnrelatedList();

    if (onlyfansList.length > 0) {
        browser.storage.local.set({ onlyfansList: onlyfansList });
    } else {
        browser.storage.local.set({ onlyfansList: [] });
    }

    if (unrelatedList.length > 0) {
        browser.storage.local.set({ unrelatedList: unrelatedList });
    } else {
        browser.storage.local.set({ unrelatedList: [] });
    }
}
