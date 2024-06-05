import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiRequest from "../../utils/api-request";
import { IComponentProps } from "../../utils/interfaces";
import { useMutation } from "@tanstack/react-query";
import { login, reset } from "../../api-requests/auth";
import { z } from "zod";
import { toast } from "react-toastify";
import LoadingButton from "../../components/loading-button";

const LoginForm = (props: IComponentProps) => {
  const { displayErrors } = props;
  const [email, setEmail] = useState("");

  const resetMutation = useMutation({
    mutationFn: reset,
  });

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = z.string().email().safeParse(email);

    if (valid.error) {
      displayErrors("Enter a  valid email");
      return;
    }

    resetMutation.mutate(email, {
      onSuccess: () => toast.success("📩 You've got mail"),
      onError: (error) => {
        const message = ApiRequest.extractApiErrors(error);
        displayErrors(message);
      },
    });
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
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="johndoe@gmail.com"
              />
            </div>

            {resetMutation.isPending ? (
              <LoadingButton className="btn" />
            ) : (
              <button className="btn">Send Reset Instructions</button>
            )}
          </div>
          <div>
            Are you new? <Link to="/auth/signup">Create an Account</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
