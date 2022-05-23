const inputValidation = (req, res, next) =>{
    const {name, email, password, confirmPassword, phoneNumber, role='USER'} = req.body;
    if(!(name && email && password && confirmPassword && phoneNumber && role)){
        res.status(400).json({msg:"internal server error"})
    }
}