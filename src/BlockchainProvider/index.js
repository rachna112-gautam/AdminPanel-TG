import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  accountUpdate,
  onContractLoaded,
  onPersonalDataLoaded,
  onContractDataLoaded,
} from "./../redux/actions";
import Config from "./config";

const BlockchainProvider = (props) => {
  const [account, setAccount] = useState();
  const [myTronBal, setMyTronBal] = useState();
  const [tronWeb, setTronWeb] = useState();
  const [contract, setContract] = useState();
  const [myData, setMyData] = useState();
  const [contractData, setContractData] = useState();
  const [personalData, setPersonalData] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        console.log("your wallet address", window.tronWeb.defaultAddress.base58);
        setAccount(window.tronWeb.defaultAddress.base58);
        clearInterval(interval)
        setTronWeb(window.tronWeb);
        loadData(window.tronWeb, window.tronWeb.defaultAddress.base58);
        // initPersonalData()
      }
    }, 1000)
  }, []);

  useEffect(() => {

    props.dispatch(accountUpdate({
      address: account,
      myTronBal: myTronBal
    }))
  }, [account])

  useEffect(() => {
    initPersonalData(contract)
    props.dispatch(accountUpdate({
      personalData: personalData
    }))


  }, [account])


  useEffect(() => {
    props.dispatch(accountUpdate({
      address: account,
      myTronBal: myTronBal
    }))
  }, [myTronBal])

  useEffect(() => {
    initContractData(contract)
    props.dispatch(onContractDataLoaded({
      contractData: contractData
    }))


  }, [contractData])


  useEffect(() => {
    initPersonalData(contract)
    props.dispatch(onPersonalDataLoaded({
      personalData: personalData
    }))


  }, [personalData])


  const loadContract = async (_tronWeb, myWallet) => {
    let _contract = await _tronWeb.contract().at(Config.CONTRACT_ADDRESS);
    console.log("nwe", _contract);
    setContract(_contract);

    props.dispatch(onContractLoaded(_contract));

    // console.log("contract",_contract);

    await initContractData(_contract);
    await initPersonalData(_contract);

    setMyData(_contract);
  };

  const loadData = async (_tronWeb, myWallet) => {
    await fetchMyTRXBal(_tronWeb);
    await loadContract(_tronWeb, myWallet);
  };

  const fetchMyTRXBal = async (_tronWeb) => {
    let bal = await _tronWeb.trx.getAccount(_tronWeb.defaultAddress.base58);

    if (bal.balance > 0) {
      bal = (bal.balance / 10 ** 6).toFixed(2);
    } else {
      bal = "00";
    }

    // console.log("baall", bal)
    setMyTronBal(bal);
  };

  const initContractData = async (contract) => {
    if (!contract) {
      return;
    }
    let contractBalance = beautifyNumber(await contract.methods.getContractBalance().call(), true);
    let totalUsers = (await contract.totalUsers().call()).toNumber();
    let admin1Wallet = beautifyNumber(await contract.admin1Wallet().call(), true);
    let admin2Wallet = beautifyNumber(await contract.admin2Wallet().call(), true);

    setContractData({
      contractBalance,
      totalUsers
    });

    console.log("contract balance", contractBalance)
    console.log("total users", totalUsers)
    console.log("admin1", admin1Wallet)
    console.log("admin2", admin2Wallet)
    props.dispatch(onContractDataLoaded(contractData));
    // console.log("contractData",contractData);
  };

  const initPersonalData = async (contract) => {

    if (!contract) {
      return;
    }
    if (contract && account) {
      console.log("xxxx", contract)
      let res = await contract.users(account).call();
      console.log("res", res);
      let id = res.id.toNumber();
      let directReferrals = res.totalReferrals.toNumber();
      let referrerIncome = beautifyNumber(res.referralIncome, true);
      let currPool = res.currPool.toNumber();
      let earnedAmount = beautifyNumber(res.extraEarned, true);
      let cycles = res.cycles.toNumber();
      let isExist = res.isExist;

      let totalMembers = (await contract.totalMembers(account).call()).toNumber();
      // let holdAmount = parseInt(await contract.methods.getHoldAmount(account).call());
      let releasedAmount = beautifyNumber(await contract.releasedAmount(account).call(), true);



      setPersonalData({
        id,
        directReferrals,
        referrerIncome,
        currPool,
        totalMembers,
        releasedAmount,
        earnedAmount,
        cycles,
        isExist
      });

      console.log("data", id,
        directReferrals,
        referrerIncome,
        currPool,
        totalMembers,
        releasedAmount,
        earnedAmount,
        cycles,
        isExist)
      props.dispatch(onPersonalDataLoaded(personalData));


    }

    // console.log("personal data", personalData);
  };

  const beautifyNumber = (input, isFixed) => {
    let num = input / 10 ** 6;

    if (isFixed) {
      return num.toFixed(2);
    } else {
      return num;
    }
  };

  return <></>;
};

const mapStateToProps = function (state) {
  return {};
};

export default connect(mapStateToProps)(BlockchainProvider);