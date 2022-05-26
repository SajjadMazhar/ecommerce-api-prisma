const inputValidation = (req, res, next) =>{
    const {name, email, password, confirmPassword, phoneNumber, role='USER'} = req.body;
    if(!(name && email && password && confirmPassword && phoneNumber && role)){
        return res.status(400).json({title:"bad request",msg:"please fill all the required fields"})
    }
    if(password !== confirmPassword){
        return res.status(400).json({title:"bad request",msg:"password don't match"})
    }
    next()
}

module.exports = {
    inputValidation
}