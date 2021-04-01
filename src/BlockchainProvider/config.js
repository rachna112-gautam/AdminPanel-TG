const contractAddress = 'TVoL7QHP61fURs6d5fKsu9WhpgVeyXNKm2';


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