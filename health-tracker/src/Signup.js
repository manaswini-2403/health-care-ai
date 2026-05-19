function Signup() {
  return (
    <div className="authBox" style={box}>
      <h2>Signup</h2>
      <input placeholder="Name" /><br /><br />
      <input placeholder="Email" /><br /><br />
      <input placeholder="Password" type="password" /><br /><br />
      <button>Create Account</button>
    </div>
  );
}

const box = {
  textAlign: "center",
  marginTop: "100px"
};

export default Signup;