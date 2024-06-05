import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";
import { IComponentProps } from "../../utils/interfaces";
import { signup } from "../../api-requests/auth";
import { SignUpSchema } from "../../utils/validations/auth";
import apiRequest from "../../utils/api-request";
import LoadingButton from "../loading-button";

const SignUpForm = (props: IComponentProps) => {
  const { displayErrors } = props;
  const navigate = useNavigate();

  const [input, setInput] = useState({
    email: "",
    companyName: "",
    password: "",
    passwordConfirmation: "",
  });

  const signupMutaion = useMutation({
    mutationFn: signup,
  });

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      email: input.email,
      password: input.password,
      passwordConfirmation: input.passwordConfirmation,
      username: input.companyName,
    };

    const validation = SignUpSchema.safeParse(data);
    if (validation.error) {
      const { formErrors, fieldErrors } = validation.error.flatten();
      const allErrors = [...formErrors, ...Object.values(fieldErrors).flat()];
      displayErrors(allErrors);
      return;
    }

    signupMutaion.mutate(
      {
        email: validation.data.email,
        password: validation.data.password,
        username: validation.data.username,
      },
      {
        onSuccess: () => navigate("/"),
        onError: (error) => {
          const message = apiRequest.extractApiErrors(error);
          displayErrors(message);
        },
      }
    );
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div>
      <form onSubmit={handleSubmitEvent}>
        <div className="form">
          <div>
            <div className="entry">
              <label className="">Email</label>
              <input
                className="input-control"
                type="text"
                name="email"
                onChange={handleInput}
                value={input.email}
                placeholder="johndoe@gmail.com"
              />
            </div>
            <div className="entry">
              <label className="">
                Company Name(Displayed when sending your quiz)
              </label>
              <input
                className="input-control"
                type="text"
                name="companyName"
                onChange={handleInput}
                value={input.companyName}
                placeholder="Neuron Tech"
              />
            </div>
            <div className="entry">
              <label className="">Password</label>
              <input
                className="input-control"
                type="password"
                name="password"
                onChange={handleInput}
                value={input.password}
                placeholder="***************"
              />
            </div>
            <div className="entry">
              <label className="">Password Confrimation</label>
              <input
                className="input-control"
                type="password"
                name="passwordConfirmation"
                onChange={handleInput}
                value={input.passwordConfirmation}
                placeholder="***************"
              />
            </div>
            {signupMutaion.isPending ? (
              <LoadingButton className="btn disabled" />
            ) : (
              <button className="btn">Sign Up</button>
            )}
          </div>
          <div>
            Have an account? <Link to="/auth/login">Login</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
