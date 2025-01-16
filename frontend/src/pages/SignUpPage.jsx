
import { Link } from "react-router-dom";
import { useState } from "react";

import x3d from "../images/x3d.png";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";



const SignUpPage = () => {
	const [formData, setFormData] = useState({
		// Use the react useState Hook to create a form that stores user details
		email: "",
		username: "",
		fullname: "",
		password: "",
	});

	const { mutate:signMutation, isError, isPending, error} = useMutation({
		mutationFn: async({ email, username, fullname, password}) =>{ // Sends the data to the specified endpoint
			try{
					const res = await fetch("/api/auth/signup", {
						method: "POST", // specifying thats its a post method
						headers: {
							"Content-Type": "application/json", // json type of content
						},
						body: JSON.stringify({email, username, fullname, password}), // Convert the data to string when parsing it to the body
					});
					
					const data = await res.json(); // data stores the json format of the response sent by the api
					if (!res.ok){ toast.error(data.error || "Failed to create Account")}
					if (data.error) throw new Error(data.error); // error is thrown if there is an error
					if (data){
						toast.success("User created",{
							position: "top-right",
						});
					}
					console.log(data);
					return data;
			}
			catch(error){
				console.log(error);
				toast.error(error);
			}
		},
		
	}); //useMutation handles creating, updating and deleting data


	const handleSubmit = (e) => {
		// The handleSubmit displays the formData details in the console
		e.preventDefault(); // Prevents the page from refreshing on submission
		signMutation(formData); // Sends the formData details to the backend via the useMutation 
	};

	const handleInputChange = (e) => {
		// Listens for an Onchange event in the input and sets what is entered in he value field to become the new value of specified property in the formData object
		const { name, value } = e.target; // Use object destructing to extract the name and value fields
		setFormData((prevformData) => {
			// The setFormData is used to update the value of the specified property in the formData
			return { ...prevformData, [name]: value };
		});
	};

	

	return (
		<>
			<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
				<div className='flex-1 hidden lg:flex md:justify-center items-center  justify-center'>
					<img
						src={x3d}
						alt=''
						className='size-28.5 hover:-translate-y-8 shadow-lg hover:shadow-blue-500/100 hover:ease-in-out duration-1000 md:w-2/3 w-2/3'
					/>
				</div>
				<div className='flex-1 flex flex-col justify-center items-center'>
					<form
						className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col'
						onSubmit={handleSubmit}>
						<h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
						<label className='input input-bordered rounded flex items-center gap-2'>
							<MdOutlineMail />
							<input
								type='email'
								className='grow'
								placeholder='Email'
								name='email'
								onChange={handleInputChange}
								value={formData.email}
							/>
						</label>
						<div className='flex gap-4 flex-wrap'>
							<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
								<FaUser />
								<input
									type='text'
									className='grow '
									placeholder='Username'
									name='username'
									onChange={handleInputChange}
									value={formData.username}
								/>
							</label>
							<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
								<MdDriveFileRenameOutline />
								<input
									type='text'
									className='grow'
									placeholder='Full Name'
									name='fullname'
									onChange={handleInputChange}
									value={formData.fullname}
								/>
							</label>
						</div>
						<label className='input input-bordered rounded flex items-center gap-2'>
							<MdPassword />
							<input
								type='password'
								className='grow'
								placeholder='Password'
								name='password'
								onChange={handleInputChange}
								value={formData.password}
							/>
						</label>
						<button className='btn rounded-full btn-primary text-white'>
							{isPending? "Loading...":"Sign Up"}
						</button>
						{isError && <p className='text-red-500'>{error.message}</p>}
					</form>
					<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
						<p className='text-white text-lg'>Already have an account?</p>
						<Link to='/login'>
							<button className='btn rounded-full btn-primary text-white btn-outline w-full'>
								Sign in
							</button>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default SignUpPage;
