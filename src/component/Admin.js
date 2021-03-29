import React from 'react'

export default function Admin() {
    return (
        <div className="container admin">
            <h1>Welcome to Admin Panel</h1>
            <div className=" row">
                <div className="col-lg-6 left">
                    <h2>Withdrawable Amount</h2>
                    <span className="withdraw-amnt">00</span>
                    <button type="button" className="btn btn-grad">Withdraw</button>
                </div>

                <div className="col-lg-6 right">
                    <h2>Release Amount Info</h2>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">ID</span>
                        </div>
                        <input type="text" class="form-control" placeholder="Enter ID" aria-label="ID" aria-describedby="basic-addon1" />

                    </div>
                    <span className="withdraw-amnt">00</span>
                    <button type="button" className="btn btn-grad">check release amount</button>
                    <hr />
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon2">ID</span>
                        </div>
                        <input type="text" class="form-control" placeholder="Enter ID" aria-label="ID" aria-describedby="basic-addon2" />

                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon3">TRX</span>
                        </div>
                        <input type="text" class="form-control" placeholder="Enter Amount" aria-label="Amount" aria-describedby="basic-addon3" />

                    </div>
                    <button type="button" className="btn btn-grad">Release Amount</button>
                </div>
            </div>
        </div>
    )
}
