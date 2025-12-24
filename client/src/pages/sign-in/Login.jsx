import { Link } from "react-router-dom";


export default function Login() {
  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h3 className="text-center mb-4">Login</h3>

            <form>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                <Link to="/" className="btn btn-primary text-decoration-none">
  Login
</Link>
              </button>

              <div className="text-center mt-3">
                <small className="text-muted">
                  Don’t have an account? Register
                </small>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}
