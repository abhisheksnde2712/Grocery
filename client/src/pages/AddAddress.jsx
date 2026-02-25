import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const InputField = ({ type, placeholder, name, handleChange, address }) => (
  <input
    className="w-full px-2 py-2.5 border border-grey-500/30 rounded outline-none
    text-grey-500 focus:border-primary transition"
    type={type}
    placeholder={placeholder}
    name={name}
    value={address[name]}
    onChange={handleChange}
    required
  />
);

const AddAddress = () => {
  const { axios, user, navigate } = useAppContext();

  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/address/add", { address });
      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!user) navigate("/cart");
  }, [user, navigate]);

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-grey-500">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>

      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <InputField name="firstName" type="text" placeholder="First Name" address={address} handleChange={handleChange} />
              <InputField name="lastName" type="text" placeholder="Last Name" address={address} handleChange={handleChange} />
            </div>

            <InputField name="email" type="email" placeholder="Email" address={address} handleChange={handleChange} />
            <InputField name="street" type="text" placeholder="Street" address={address} handleChange={handleChange} />

            <div className="grid grid-cols-2 gap-4">
              <InputField name="city" type="text" placeholder="City" address={address} handleChange={handleChange} />
              <InputField name="state" type="text" placeholder="State" address={address} handleChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField name="zipcode" type="number" placeholder="Zip Code" address={address} handleChange={handleChange} />
              <InputField name="country" type="text" placeholder="Country" address={address} handleChange={handleChange} />
            </div>

            <InputField name="phone" type="text" placeholder="Phone" address={address} handleChange={handleChange} />

            <button className="w-full mt-6 bg-primary text-white py-3 uppercase hover:bg-primary-dull transition">
              Save Address
            </button>
          </form>
        </div>

        <img
          src={assets.add_address_iamge}
          alt="Add Address"
          className="md:mr-16 mb-16 md:mt-0"
        />
      </div>
    </div>
  );
};

export default AddAddress;
