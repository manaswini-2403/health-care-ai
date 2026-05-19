function Login() {
  return (
    <div className="authBox" style={box}>
      <h2>Login</h2>
      <input placeholder="Email" /><br /><br />
      <input placeholder="Password" type="password" /><br /><br />
      <button>Login</button>
    </div>
  );
}

const box = {
  textAlign: "center",
  marginTop: "100px"
};

export default Login;