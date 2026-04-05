import { createElement as h, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", city: "" });
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Unable to create account.");
      }

      login(payload.token, payload.user);
      navigate("/profile");
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return h(
    "section",
    { className: "auth-card" },
    h("p", { className: "eyebrow" }, "Create account"),
    h("h1", null, "Join GiftLink"),
    h(
      "form",
      { className: "stack", onSubmit: handleSubmit },
      h("input", { name: "name", onChange: handleChange, placeholder: "Name", required: true, value: form.name }),
      h("input", {
        name: "email",
        onChange: handleChange,
        placeholder: "Email",
        required: true,
        type: "email",
        value: form.email
      }),
      h("input", {
        name: "password",
        onChange: handleChange,
        placeholder: "Password",
        required: true,
        type: "password",
        value: form.password
      }),
      h("input", { name: "city", onChange: handleChange, placeholder: "City", value: form.city }),
      error ? h("p", { className: "error-text" }, error) : null,
      h("button", { className: "primary-button", type: "submit" }, "Register")
    ),
    h(
      "p",
      null,
      "Already have an account? ",
      h(Link, { to: "/login" }, "Login")
    )
  );
}
