import express, { Request, Response} from 'express'
import * as jwt from "jsonwebtoken";
import User from '../model/model'
import { genSalt, hash, compare } from "bcrypt";

const isValid = function (value: any) {
  if (typeof (value) === undefined || typeof (value) === null) { return false }
  if (typeof (value) === "string" && (value).trim().length > 0) { return true }
}

const SignUp = async (req: Request, res: Response) => {
  try {

    let data = req.body

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ message: "Please enter some data" })
    }

    const { username, email, password, wallet } = data

    if (!isValid(username)) {
      return res.status(400).send({ message: "Username is required" })
    }

    if(!isValid(email)) {
      return res.status(400).send({message: "Email is required"})
    }

    const Email = email
    const validateEmail = function (Email: string) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(Email);
    }
    if (!validateEmail(Email)) {
      return res.status(400).send({ status: false, message: "Please enter a valid email" })
    }

    if (!isValid(password)) {
      return res.status(400).send({ message: "Password is required" })
    }

    const userAlreadyPresent = await User.findOne({username: username});

    if (userAlreadyPresent) return res.status(400).send({ message: "Username must be Unique" })

    const emailAlreadyPresent = await User.findOne({email: email})

    if(emailAlreadyPresent) return res.status(400).send({message:"Email must be unique"})

    const salt = await genSalt(10);

    data.password = await hash(data.password, salt);

    const createUser = await User.create(data)

    return res.status(201).send({ message: data })


    // const jane = await users.create({id: "123", username: "Jane", password: "Doe" });
    // return res.send({msg: jane})
  }
  catch (Err) {
    console.log(Err);
    res.status(500).send("Server Error");
  }
}

const login = async (req: Request, res: Response) => {
  try {

    const data = req.body;
    if (!data) return;

    if (Object.keys(data).length == 0) {
      return res.status(400).send({ message: "Please enter some data" })
    }

    const {
      email,
      password
    } = data;

    if (!isValid(email)) {
      return res.status(400).send({ message: "email is required" })
    }

    if (!isValid(password)) {
      return res.status(400).send({ message: "Password is required" })
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
      return res.status(404).send({
        message: "not found"
      })
    }

    const Email = email
    const validateEmail = function (Email: string) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(Email);
    }
    if (!validateEmail(Email)) {
      return res.status(400).send({ status: false, message: "Please enter a valid email" })
    }

    const validPassword = userInfo.password
    // const validPassword = await compare(password, userInfo.password);

    if (!(validPassword)) {
      return res.status(400).send({
        message: "password incorrect"
      })
    }

    const token = jwt.sign({
      id: userInfo.id,
      project: "colexion",
      // iat: Math.floor(Date.now() / 1000),
      // exp: Math.floor(Date.now() / 1000) + 1 * 60 * 60

    }, "colexionUserSecretKey")

    // res.send({
    //     id: userInfo.id
    // })

    return res.status(200).send({
      data: token
    })

  }
  catch (Err) {
    console.log(Err);
    res.status(500).send("Server Error");
  }
}

const logout = async (req: Request, res: Response) => {
try{
  res.clearCookie('nToken');
    return res.redirect('/')
}
catch (Err) {
  console.log(Err);
  res.status(500).send("Server Error");
}
}


export default { login, SignUp, logout }