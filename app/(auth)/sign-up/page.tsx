import { Button } from "@/components/ui/button";

const SignUp = () => {
  return (
    <div>
      <h1>Sign Up</h1>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <Button>Sign Up</Button>
      </form>
    </div>
  );
};

export default SignUp;