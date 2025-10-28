import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { parseCSVFromURL } from "../utils/csvParser";
import User from "../models/userModel";
import bcrypt from "bcrypt";
// import { generateEmail, generateTempPassword } from "../utils/generatCreds";
import { generateCustomCredentials } from "../utils/generatCreds"
import { sendCredentialsEmail, sendNewPasswordEmail } from "../utils/email";


export const uploadCSV = async (req: Request, res: Response) => {
  try {
    const file = (req as any).files?.file;
    if (!file)
      return res.status(400).json({ message: "CSV file required in 'file' field" });

    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {                    //File Cloudinary par upload
      resource_type: "raw",        //CSV like non-image files allow
      folder: "csv-uploads",        //Cloudinary folder ka naam
      use_filename: true,           //Original filename rakhna
    });

    const rows = await parseCSVFromURL(uploadResult.secure_url);       //CSV ke andar jitni entries hain
    const createdUsers: any[] = [];

    for (const r of rows) {                       //Har user ke liye loop chalega 
      const getVal = (names: string[]) =>
        Object.entries(r).find(([k]) => names.includes(k.toLowerCase()))?.[1];   //Smart mapping function   firstname, first_name, fname

      const firstName: string = getVal(["firstname", "first_name", "fname"]) as string || "NoName";
      const lastName: string = getVal(["lastname", "last_name", "lname"]) as string || "NoName";        //Agar CSV me value missing ho → Default value use
      const zipcode: string = getVal(["zipcode", "zip", "postalcode"]) as string || "";
      const age: string = getVal(["age", "years"]) as string || "00";

      // Generate custom email & password based on user data
      let { email, password } = generateCustomCredentials(firstName, lastName, zipcode, age);          //Backend automatically random & unique email & password banata hai


      //Duplicate emails avoid karne ke liye loop
      // Ensure unique email
      while (await User.findOne({ email })) {          //Duplicate email remove
        const extra = Math.floor(Math.random() * 999);          //Random number add kar ke new email banate hain
        email = email.replace("@", `${extra}@`);
      }

      const user = await User.create({              //MongoDB me new user create
        firstName,
        lastName,
        email,
        password,
        zipcode,
        role: "user",
        mustChangePassword: true,
      });

      await sendCredentialsEmail(user.email, password).catch(() => { });         //Password email user ke inbox me bhej diya

      createdUsers.push({ id: user._id, email, password, firstName, lastName });
    }

    return res.json({
      message: "CSV uploaded successfully",             //Admin ko sab user ka data mil jaata hai
      uploadedTo: uploadResult.secure_url,
      createdCount: createdUsers.length,
      created: createdUsers,
    });

  } catch (err: any) {
    console.error("Error uploadCSV:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


 