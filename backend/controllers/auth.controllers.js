
// function for the signup endpoint
export const signup = async (req, res) =>{
    res.json({
        message: 'Signup route working',
    });
};


// function for the login endpoint
export const login = async (req, res) => {
    res.json({
        message: 'Login route working',
    });
};


// function for the logout endpoint
export const logout = async (req, res) => {
    res.json({
        message: 'Logout route working',
    });
};