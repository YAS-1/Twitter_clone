import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import x3d from "../images/x3d.png";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { toast } from "react-toastify";
// import toast from "react-hot-toast";


const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});

	const { mutate:loginMutation } = useMutation({
		mutationFn: async ({ username, password }) => {
			try{
				// Your login API endpoint
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password }),
				});

				const data = await res.json();
				if (!res.ok) {
					toast.error(data.error || "Something went wrong", {position: "top-center"});}
				if (data.error) throw new Error(data.error); // error is thrown if there is an error
				if (data) {
					toast.success(`Welcome ${data.username}`, {position: "top-center"});}
			}
			catch (error) {
				toast.error(error, {position: "top-center"});
			}
		},
		onSuccess: () => {
			// login successful, redirect to homepage
			queryClient.invalidateQueries({ queryKey: ["authUser"]});
		}
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		loginMutation(formData);
		
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevformData) => {
			return { ...prevformData, [name]: value };
		});
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-1 hidden lg:flex md:justify-center items-center justify-center'>
				<img
					src={x3d}
					alt=''
					className='size-28.5 hover:-translate-y-8 shadow-lg hover:shadow-blue-500/100 hover:ease-in-out duration-1000 md:w-2/3 w-2/3'
				/>
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

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
						Login
					</button>
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>
							Sign up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
