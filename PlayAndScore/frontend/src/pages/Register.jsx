import React from "react"

function Register() {
    return (
        <div className = "container">
            <h2>Register Account</h2>
            <form>
                <div>
                    <label for="email">Email</label>
                    <input type="email" name="email" placeholder="Email"></input>
                </div>
                <div>
                    <label for="password">Password</label>
                    <input type="password" name="password" placeholder="Password"></input>
                </div>
                <div>
                    <label for="username">Username</label>
                    <input type="text" name="username" placeholder="Username"></input>
                </div>
            </form>
        </div>
    )
}

export default Register;