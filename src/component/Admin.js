import React, { useState } from 'react'

export default function Admin(props) {
    const [checkId, setCheckId] = useState(0)
    const [amount, setAmount] = useState(0)
    const [releaseAmount, setReleaseAmount] = useState(0)
    const [releaseId, setReleaseId] = useState(0);

    return (
        <div className="container admin">
            <h1>Welcome to Admin Panel</h1>
            <div className=" row">
                <div className="col-lg-6 left">
                    <h2>Withdrawable Amount</h2>
                    <span className="withdraw-amnt">{props.withdrawableAmount}</span>
                    <button type="button" className="btn btn-grad" onClick={() => {
                        props.withdraw()
                    }}>Withdraw</button>
                </div>

                <div className="col-lg-6 right">
                    <h2>Release Amount Info</h2>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">ID</span>
                        </div>
                        <input type="text" class="form-control" placeholder="Enter ID" aria-label="ID" aria-describedby="basic-addon1" onChange={(r) => {
                            setCheckId(r.target.value)
                        }} />

                    </div>
                    <span className="withdraw-amnt">{amount}</span>
                    <button type="button" className="btn btn-grad" onClick={() => {
                        (props.getReleaseAmount(checkId))

                        // setAmount(amount)
                    }}>check release amount</button>
                    <hr />
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon2">ID</span>
                        </div>
                        <input type="text" class="form-control" placeholder="Enter ID" aria-label="ID" aria-describedby="basic-addon2" onChange={(r) => {
                            setReleaseId(r.target.value)
                        }} />

                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon3">TRX</span>
                        </div>
                        <input type="text" class="form-control" placeholder="Enter Amount" aria-label="Amount" aria-describedby="basic-addon3" onChange={(r) => {
                            setReleaseAmount(r.target.value)
                        }} />

                    </div>
                    <button type="button" className="btn btn-grad" onClick={() => {
                        props.releaseAmount(releaseId, releaseAmount)
                    }}>Release Amount</button>
                </div>
            </div>
        </div>
    )
}
