import React from "react";

import { Link } from "react-router-dom";
import { useState } from "react";

import x3d from "../images/x3d.png";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		// Use the react useState Hook to create a form that stores user details
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	const handleSubmit = (e) => {
		// The handleSubmit displays the formData details in the console
		e.preventDefault();
		console.log(formData);
	};

	const handleInputChange = (e) => {
		// Listens for an Onchange event in the input and sets what is entered in he value field to become the new value of specified property in the formData object
		const { name, value } = e.target; // Use object destructing to extract the name and value fields of the whats triggering the event
		setFormData((prevformData) => {
			// The setFormData is used to update the value of the specified property in the formData
			return { ...prevformData, [name]: value };
		});
	};

	const isError = false;

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
									name='fullName'
									onChange={handleInputChange}
									value={formData.fullName}
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
							Sign up
						</button>
						{isError && <p className='text-red-500'>Something went wrong</p>}
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
