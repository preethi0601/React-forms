import React from 'react'
import { useRef, useState, useEffect } from "react";
import {faCheck, faTimes, faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, fontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from './api/axios'

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register'

const Signup = () => {
  const userRef = useRef();
  const errorRef = useRef();

  const [user, setUser] = useState('')
  const [validName, setValidName] = useState(false)
  const [userFocus, setUserFocus] = useState(false)

  const [pwd, setpwd] = useState('')
  const [validpwd, setValidPwd] = useState(false)
  const [pwdFocus, setPwdFocus] = useState(false)

  const [matchPwd, setMatchPwd] = useState('')
  const [validMatch, setValidMatch] = useState(false)
  const [matchFocus, setMatchFocus] = useState(false)

  const [errMsg, setErrMsg] = useState('')
  const [success, setSucess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    const input = USER_REGEX.test(user)
    setValidName(input)
  }, [user])

  useEffect(() => {
    const inputPwd = PASSWORD_REGEX.test(pwd)
    setValidPwd(inputPwd);
    const match = inputPwd === matchPwd;
    setValidMatch(match)
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('')
  }, [user, pwd, matchPwd])


  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const response = await axios.post(REGISTER_URL, 
            JSON.stringify({user, pwd}),
            {
                headers: { 'Content-Type': 'application/json'},
                withCredentials: true
            }
        )
        setSucess(true)
    } catch(err) {
        if(!err?.response) {
            setErrMsg('No server response')
        } else if(err.response?.status === 409) {
            setErrMsg('Username already exists!')
        } else {
            setErrMsg('Sign up failed')
        }
        errorRef.current.focus()
    }
}
  return (
    <> {
        success ? (
            <section>
                <h1>Sucess!</h1>
                <a href='#'>Sign In</a>
            </section>
        ) : (
            <section>
                <p ref={errorRef} className={errMsg ? "errMsg" : "offscreen"} aria-live="assertive"> {errMsg} </p>
                <h1>Sign up!</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='username'>
                        User Name: 
                        <span className={validName ? "valid": "hide"} > <FontAwesomeIcon icon={faCheck} /></span>
                        <span className={validName || !user ? "hide": "invalid"} > <FontAwesomeIcon icon={faTimes} /></span>

                    </label>
                    <input type="text" id="username" ref={userRef} autoComplete='off' 
                    onChange={(e) => setUser(e.target.value)} 
                    required
                    aria-invalid={validName ? "false" : "true"}
                    aria-describedby='uidnote'
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    />
                    <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon ={faInfoCircle} />
                        4 - 24 characters <br />
                        Must begin with alphabets <br/>
                        Numbers, hiphens, underscore allowed.
                    </p>

                    <label htmlFor='password'>
                        Enter Password: 
                        <span className={validpwd ? "valid": "hide"} > <FontAwesomeIcon icon={faCheck} /></span>
                        <span className={validpwd || !pwd ? "hide": "invalid"} > <FontAwesomeIcon icon={faTimes} /></span>

                    </label>
                    <input type="password" id="password"
                    onChange={(e) => setpwd(e.target.value)} 
                    required
                    aria-invalid={validpwd ? "false" : "true"}
                    aria-describedby='pwdnote'
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                    />
                    <p id="pwdnote" className={pwdFocus && !validpwd ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon ={faInfoCircle} />
                        8 - 24 characters <br/>
                        Must include a number, uppercase and lowercase letters and a special character <br/>
                        Allowed special char: <span aria-label='exclamation-mark'>!</span><span aria-label='at-symbol'>@</span>
                        <span aria-label='hashtag'>#</span><span aria-label='dollar-sign'>$</span><span aria-label='percentage'>%</span>
                    </p>

                    <label htmlFor='confirmPwd'>
                        Confirm Password: 
                        <span className={validMatch ? "match": "hide"} > <FontAwesomeIcon icon={faCheck} /></span>
                        <span className={validMatch || !matchPwd ? "hide": "invalid"} > <FontAwesomeIcon icon={faTimes} /></span>

                    </label>
                    <input type="password" id="confirmPwd" 
                    onChange={(e) => setMatchPwd(e.target.value)} 
                    required
                    aria-invalid={validpwd ? "false" : "true"}
                    aria-describedby='confirmPwdnote'
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                    />
                    <p id="confirmPwdnote" className={matchFocus && !validpwd ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon ={faInfoCircle} />
                    Must match the first password input
                    </p>

                    <button disabled={!validName || !validpwd || !validMatch ? true : false}>Sign Up</button>
                    

                </form>
            </section>
        )}
    </>
  )
}

export default Signup