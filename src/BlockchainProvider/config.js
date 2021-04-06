const contractAddress = 'TAxGWick7Z7vnhhtCBQxw3de8jPma7HFQa';


const utils = {
    tronWeb: false,
    contract: false,
    CONTRACT_ADRESS: contractAddress,
    adminAddress: "TYPGbv47eFGBCDvjrPZNgXs3JfrqPMTWS9",

    async setTronWeb(tronWeb) {
        this.tronWeb = tronWeb;

        console.log("addtrontwqe", window.tronWeb.defaultAddress.base58)
        this.contract = await tronWeb.contract().at(contractAddress);
    }
};

export default utils;