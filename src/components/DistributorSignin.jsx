import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DistributorSignin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(
        "https://cracker-backend-0iz6.onrender.com/vendor/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: form.email, password: form.password }),
        }
      );

      if (!response.ok) {
        let message = `Signin failed (${response.status})`;
        try {
          const err = await response.json();
          if (err && (err.message || err.error)) {
            message = err.message || err.error;
          }
        } catch {}
        throw new Error(message);
      }

      // API returns token and user; supports JSON { token, user } or raw token
      let token;
      let user = null;
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await response.json();
        if (typeof data === "string") {
          token = data;
        } else {
          token = data.token;
          user = data.user || data.vendor || null;
        }
      } else {
        token = await response.text();
      }

      if (!token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("token", token);
      if (user) {
        try { localStorage.setItem("user", JSON.stringify(user)); } catch {}
      }
      navigate("/products");
    } catch (err) {
      setError(err.message || "Signin failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body p-4">
              <h4 className="mb-3">Distributor Signin</h4>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className="d-grid gap-2">
                  <button className="btn btn-primary" type="submit" disabled={submitting}>
                    {submitting ? "Signing in..." : "Sign in"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorSignin;


