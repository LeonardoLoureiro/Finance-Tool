import { Button } from "@/components/ui/button";

const SignIn = () => {
  return (
    <div>
      <h1>Sign In</h1>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <Button>Sign In</Button>
      </form>
    </div>
  );
};

export default SignIn;