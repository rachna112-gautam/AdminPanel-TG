import {
    ACCOUNT_UPDATE,
    CONTRACT_LOADED,
    ON_PERSONAL_DATA_LOADED,
    ON_CONTRACT_DATA_LOADED,
} from "../constants/action-types";

export function accountUpdate(payload) {
    return { type: ACCOUNT_UPDATE, payload };
}

export function onContractLoaded(payload) {
    return { type: CONTRACT_LOADED, payload };
}

export function onPersonalDataLoaded(payload) {
    return { type: ON_PERSONAL_DATA_LOADED, payload };
}

export function onContractDataLoaded(payload) {
    return { type: ON_CONTRACT_DATA_LOADED, payload };
}
